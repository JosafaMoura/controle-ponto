const { MongoClient } = require('mongodb');

// URL e nome do banco de dados
const url = 'mongodb://localhost:27017';
const dbname = 'estudo';

const client = new MongoClient(url);

// Conectando e exportando o objeto de banco de dados
async function connectToMongo() {
    try {
        await client.connect();
        console.log('Conectado ao MongoDB com sucesso!');
        // Retorna o objeto do banco de dados
        return client.db(dbname); 
    } catch (err) {
        console.error('Erro na conexão com o MongoDB:', err);
        // Encerra o processo se a conexão falhar
        process.exit(1); 
    }
}

// Exporta a função para que server.js possa usá-la
module.exports = connectToMongo;