const express = require('express');
const router = express.Router();
const supabase = require('../data/supabase');

// 1. BUSCAR TODOS OS PEDIDOS DO BANCO (Para o Painel exibir)
router.get('/', async (req, res, next) => {
    try {
        const { data, error } = await supabase
            .from('pedidos')
            .select('*')
            .order('id', { ascending: false });

        if (error) throw error;

        // Molda os dados do Supabase para o formato que seu Front-end já usa!
        const pedidosFormatados = data.map(p => ({
            id: String(p.id),
            cliente: p.cliente,
            telefone: p.telefone,
            hora: p.hora,
            total: Number(p.total),
            status: p.status,
            retirada: p.retirada,
            cliente_endereco: p.cliente_endereco,
            // (lat e lon foram removidos daqui, pois apagamos do banco)
            
            // Garante que os itens em formato JSON (texto) sejam lidos como lista novamente
            itens: typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens
        }));

        res.json(pedidosFormatados);
    } catch (err) {
        next(err);
    }
});

// ✨ 2. NOVO: CRIAR UM PEDIDO (Recebe os dados do site/carrinho e salva no banco)
router.post('/', async (req, res, next) => {
    try {
        // Puxa exatamente as informações que configuramos no site
        const { cliente, telefone, hora, total, status, retirada, cliente_endereco, itens } = req.body;

        const { data, error } = await supabase
            .from('pedidos')
            .insert([
                {
                    cliente,
                    telefone,
                    hora,
                    total,
                    status: status || 'pendente',
                    retirada,
                    cliente_endereco,
                    itens // O site já manda como string de texto graças ao JSON.stringify
                }
            ]);

        if (error) throw error;

        // Responde ao site com o status 201 (Criado com Sucesso!)
        res.status(201).json({ sucesso: true, mensagem: 'Pedido criado com sucesso!' });
    } catch (err) {
        console.error("Erro no Back-end ao inserir pedido:", err);
        // Se der erro, manda o erro de volta para o site (para aparecer naquele alerta do F12)
        res.status(500).json({ erro: err.message || "Erro interno do servidor" });
    }
});

// 3. ATUALIZAR STATUS DO PEDIDO (Quando clicar em "PREPARAR" ou "SAIU ENTREGA")
router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const { error } = await supabase
            .from('pedidos')
            .update({ status })
            .eq('id', id);

        if (error) throw error;

        res.json({ sucesso: true, mensagem: `Status do pedido ${id} atualizado para ${status}` });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
