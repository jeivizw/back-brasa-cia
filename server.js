const express = require('express');
const cors = require('cors');
const logger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');
const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/', (req, res) => {
    res.json({ mensagem: '🍖 Bem-vindo à API do Brasa & Cia!' });
});

// Importação das rotas
const rotasCategorias = require('./routes/categorias');
const rotasProdutos = require('./routes/produtos');
const rotasPedidos = require('./routes/pedidos'); // ✨ Nova rota adicionada

app.use('/api/categorias', rotasCategorias);
app.use('/api/produtos', rotasProdutos);
app.use('/api/pedidos', rotasPedidos); // ✨ Ativando a rota de pedidos

// Tratamento de rotas não encontradas
app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada na API do Brasa & Cia.`
    });
});

app.use(errorHandler);

const PORTA = process.env.PORT || 3000;
app.listen(PORTA, () => {
    console.log(`🚀 Servidor rodando na porta local: ${PORTA}`);
});

module.exports = app;

