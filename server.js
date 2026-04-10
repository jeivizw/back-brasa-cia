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

const rotasCategorias = require('./routes/categorias');
const rotasProdutos = require('./routes/produtos');

app.use('/api/categorias', rotasCategorias);
app.use('/api/produtos', rotasProdutos);
app.use((req, res, next) => {
    res.status(404).json({
        sucesso: false,
        mensagem: `Rota '${req.url}' não encontrada na API do Brasa & Cia.`
    });
});

app.use(errorHandler);

const PORTA = process.env.PORT || 3000;

app.listen(PORTA, () => {
    console.log('');
    console.log('🚀 ================================');
    console.log(`🚀 Servidor rodando!`);
    console.log(`🚀 Porta local: ${PORTA}`);
    console.log('🚀 ================================');
    console.log('');
    console.log('📋 Rotas disponíveis:');
    console.log(`   GET    /api/categorias`);
    console.log(`   POST   /api/categorias`);
    console.log(`   GET    /api/produtos`);
    console.log(`   GET    /api/produtos/:id`);
    console.log(`   POST   /api/produtos`);
    console.log(`   PUT    /api/produtos/:id`);
    console.log(`   DELETE /api/produtos/:id`);
    console.log('');
    console.log('💣 Rota de teste de erro:');
    console.log(`   GET    /api/produtos/erro-teste`);
    console.log('');
});

module.exports = app;

