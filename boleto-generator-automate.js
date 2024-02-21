const Boleto = require('node-boleto').Boleto;
const fs = require('fs');
const pdf = require('html-pdf');

// Receba os dados do boleto como argumento da linha de comando
const boletoDataString = process.argv[2];

try {
  // Converta a string JSON para um objeto JavaScript
  const boletoData = JSON.parse(boletoDataString);

  // Adicione valores padrão para as propriedades que podem estar ausentes
  boletoData.nosso_numero = boletoData.nosso_numero || '1234567';
  boletoData.numero_documento = boletoData.numero_documento || '123123';
  boletoData.cedente = boletoData.cedente || 'Pagar.me Pagamentos S/A';
  boletoData.cedente_cnpj = boletoData.cedente_cnpj || '18727053000174';
  boletoData.agencia = boletoData.agencia || '3978';
  boletoData.codigo_cedente = boletoData.codigo_cedente || '6404154';
  boletoData.carteira = boletoData.carteira || '102';

  const boleto = new Boleto(boletoData);

  // Exiba a linha digitável no console para fins de demonstração
  console.log("Linha digitável: " + boleto['linha_digitavel']);

  // Renderize o HTML e salve em um arquivo temporário
  boleto.renderHTML((err, html) => {
    if (err) {
      console.error(`Erro na geração do boleto: ${err.message}`);
    } else {
      const tmpFileName = 'temp-boleto.html';
      fs.writeFileSync(tmpFileName, html);

      // Configurações para o PDF
      const pdfOptions = { format: 'Letter' };

      // Gere o PDF a partir do HTML
      pdf.create(html, pdfOptions).toFile('boleto.pdf', (err, res) => {
        if (err) {
          console.error(`Erro na geração do PDF: ${err.message}`);
        } else {
          // Remova o arquivo temporário
          fs.unlinkSync(tmpFileName);

          console.log('Boleto gerado com sucesso em boleto.pdf');
        }
      });
    }
  });
} catch (error) {
  console.error(`Erro na geração do boleto: ${error.message}`);
}
