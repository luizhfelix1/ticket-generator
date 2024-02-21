const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

app.post('/gerar-boleto', (req, res) => {
  const boletoData = req.body;

  // Execute o script do boleto-generator.js com os dados fornecidos
  const scriptPath = path.join(__dirname, 'boleto-generator.js');
  exec(`node "${scriptPath}" "${JSON.stringify(boletoData)}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Erro na execução: ${error.message}`);
      return res.status(500).send('Erro na geração do boleto');
    }

    // Envie o resultado de volta para o navegador
    res.send(stdout);
  });
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});