require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Função para obter conexão com o banco
async function getConnection() {
  if (process.env.MYSQL_URL) {
    return await mysql.createConnection(process.env.MYSQL_URL);
  }
  return await mysql.createConnection({
    host: process.env.MYSQLHOST || 'localhost',
    port: process.env.MYSQLPORT || 3306,
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || '',
    database: process.env.MYSQLDATABASE || 'railway'
  });
}

// Rota de teste
app.get('/api/status', async (req, res) => {
  try {
    const conn = await getConnection();
    await conn.execute('SELECT 1');
    await conn.end();
    res.json({ status: 'ok', message: 'Conectado ao MySQL com sucesso!' });
  } catch (error) {
    console.error('Erro de conexão:', error);
    res.status(500).json({ status: 'error', message: 'Falha ao conectar no banco de dados', error: error.message });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(\`Servidor rodando na porta \${port}\`);
});
