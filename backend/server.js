const express = require("express");
const connectToMongo = require("./conexao"); // Importa a função de conexão
const cors = require("cors"); // 🔹 Novo da Reorganização (1) ()

const app = express();
const port = 3000; // Use uma porta diferente da do MongoDB

app.use(cors()); // 🔹 Novo da Reorganização (1)
app.use(express.json());

let db; // Variável para armazenar a conexão com o banco de dados

// Função para iniciar o servidor
async function startServer() {
    // Conecta ao MongoDB antes de iniciar o servidor
    db = await connectToMongo();

    if (!db) {
        console.error('Não foi possível conectar ao banco de dados. O servidor não será iniciado.');
        return;
    }

    // --- Rotas da API ---

    // Rota GET de teste
    app.get("/", (req, res) => {
        res.send("Servidor Express rodando!");
    });

    // Rota POST para adicionar um documento
    app.post("/documentos", async (req, res) => {
        try {
            const collection = db.collection("site");
            const novoDoc = req.body;
            const result = await collection.insertOne(novoDoc);
            res.status(201).json({ 
                mensagem: "Documento adicionado!", 
                documento: result.insertedId // Retorna o documento inserido
            });
        } catch (error) {
            res.status(500).json({ mensagem: "Erro ao adicionar documento.", erro: error.message });
        }
    });

    // Rota GET para buscar todos os documentos
    app.get("/documentos", async (req, res) => {
        try {
            const collection = db.collection("site");
            const documentos = await collection.find({}).toArray();
            res.status(200).json(documentos);
        } catch (error) {
            res.status(500).json({ mensagem: "Erro ao buscar documentos.", erro: error.message });
        }
    });

    // Inicia o servidor Express na porta 3000
    app.listen(port, () => {
        console.log(`Servidor rodando em http://localhost:${port}`);
    });
}

// Chama a função para iniciar o servidor
startServer();