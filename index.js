import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function lerArquivoInteligente(pasta, nomeArquivo) {
  const caminhoArquivo = path.join(__dirname, pasta, nomeArquivo);

  setTimeout(() => {
    console.log(chalk.blue(`Iniciando a leitura do arquivo "${nomeArquivo}"...`));
  }, 1000);

    fs.readFile(caminhoArquivo, 'utf-8')
        .then(conteudo => {
            setTimeout(() => {
                console.log(chalk.grey(`Conteúdo do arquivo "${nomeArquivo}":\n${conteudo}`));
            }, 1000);
        })
        .catch(error => {
            console.error(chalk.red(`Erro ao ler o arquivo: ${error.message}`));
        });
}

async function escreverArquivoInteligente(pasta, nomeArquivo, conteudo) {
  const caminhoPasta = path.join(__dirname, pasta);
  const caminhoArquivo = path.join(caminhoPasta, nomeArquivo);

  setTimeout(() => {
    console.log(chalk.cyan(`Iniciando a criação do arquivo "${nomeArquivo}"...`));
  }, 1000);

    try {
        await fs.mkdir(caminhoPasta, { recursive: true });
        await fs.writeFile(caminhoArquivo, conteudo);

        setTimeout(() => {
            console.log(chalk.green(`Arquivo "${nomeArquivo}" criado com sucesso em "${pasta}".`));
        }, 1000);
        lerArquivoInteligente(pasta, nomeArquivo);
    } catch (error) {
        console.error(chalk.red(`Erro ao criar o arquivo: ${error.message}`));
    }
}

escreverArquivoInteligente('storage', 'aula05.txt', 'Aula 05 - Manipulação de arquivos com Node.js. \n\nArquivo criado com sucesso durante a atividade final.');
