const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

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
            localizacao: {
                lat: p.lat ? Number(p.lat) : null,
                lon: p.lon ? Number(p.lon) : null
            },
            // Garante que os itens em formato JSON sejam lidos corretamente
            itens: typeof p.itens === 'string' ? JSON.parse(p.itens) : p.itens
        }));

        res.json(pedidosFormatados);
    } catch (err) {
        next(err);
    }
});

// 2. ATUALIZAR STATUS DO PEDIDO (Quando clicar em "PREPARAR" ou "SAIU ENTREGA")
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