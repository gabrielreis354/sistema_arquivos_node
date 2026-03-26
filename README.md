# Sistema de Arquivos com Node.js

## 🎓 Entendendo este projeto

Este projeto demonstra como trabalhar com **manipulação de arquivos** em Node.js - uma coisa que é bem diferente do JavaScript de navegador que você provavelmente já conhece. Vamos aprender passo a passo!

---

## 📚 Conceitos Principais

### 1. **O que é Node.js?**

Node.js é um **ambiente de execução de JavaScript fora do navegador**. No navegador, você tem acesso ao DOM, `window`, etc. No Node.js, você tem acesso ao **sistema de arquivos, rede, processos do sistema**, entre outras coisas.

Pense assim:
- **JavaScript no navegador**: controla o que o usuário vê na página
- **Node.js**: controla o servidor, banco de dados, arquivos do sistema

---

### 2. **Imports e Módulos (ES Modules)**

No topo do arquivo, vemos:

```javascript
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';
```

**O que está acontecendo aqui?**

- **`import ... from`**: É a sintaxe moderna de JavaScript para importar módulos (em vez de `require()`)
- **`fs/promises`**: Um módulo **nativo** do Node.js que permite ler e escrever arquivos usando **Promises** (você já conhece Promises!)
- **`path`**: Outro módulo nativo que ajuda a trabalhar com caminhos de arquivos de forma que funcione tanto no Windows quanto no Linux/Mac
- **`fileURLToPath` de `'url'`**: Uma função especial para converter URLs em caminhos reais
- **`chalk`**: Uma biblioteca externa (instalada via `npm`) para colorir textos no terminal

**Mas por que usamos `import`?** Porque no `package.json` há `"type": "module"`, que diz ao Node.js para usar **ES Modules** em vez do antigo `require()`.

---

### 3. **Entendendo `__dirname` e `__filename`**

```javascript
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
```

**Por que precisamos disso?**

No navegador, fazer um caminho relativo é fácil porque tudo está baseado no URL da página. Mas no Node.js, precisamos saber em qual pasta nosso arquivo está localizado.

- **`import.meta.url`**: Dá a você a URL completa do arquivo atual (algo como `file:///home/usuario/projeto/index.js`)
- **`fileURLToPath()`**: Converte essa URL para um caminho normal (`/home/usuario/projeto/index.js`)
- **`__dirname`**: O caminho da pasta onde este arquivo está

É como se você perguntasse ao Node.js: *"Ei, em que pasta estou mesmo?"*

---

### 4. **A Função `lerArquivoInteligente()`**

```javascript
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
```

**Quebra por quebra:**

1. **`path.join(__dirname, pasta, nomeArquivo)`**: Combina caminhos de forma segura
   - Se você estiver em `/home/usuario/projeto/` e passar `storage` e `aula05.txt`
   - Resultado: `/home/usuario/projeto/storage/aula05.txt`

2. **`setTimeout(() => { ... }, 1000)`**: Aguarda 1 segundo antes de executar o código
   - Isso cria um efeito visual - a mensagem aparece com um atraso

3. **`fs.readFile(caminhoArquivo, 'utf-8')`**: Lê o arquivo
   - Retorna uma **Promise** que resolve com o conteúdo do arquivo
   - `'utf-8'` significa ler como texto (não como bytes binários)

4. **`.then(conteudo => { ... })`**: Quando o arquivo é lido com sucesso
   - `conteudo` contém o texto do arquivo
   - `chalk.grey()` deixa o texto cinza no terminal

5. **`.catch(error => { ... })`**: Se algo der errado (arquivo não existe, sem permissão, etc.)
   - `chalk.red()` deixa a mensagem de erro vermelha

---

### 5. **A Função `escreverArquivoInteligente()` - Async/Await**

```javascript
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
```

**O que é diferente aqui?**

Esta função usa **async/await** em vez de `.then().catch()`. É uma forma mais legível de trabalhar com Promises!

1. **`async function`**: Marca que esta função trabalha com operações assíncronas
2. **`await fs.mkdir(...)`**: Aguarda a pasta ser criada
   - `{ recursive: true }` significa: "Se a pasta pai não existir, crie também"
3. **`await fs.writeFile(...)`**: Aguarda o arquivo ser escrito
4. **`try/catch`**: Em vez de `.catch()`, usa o padrão tradicional de tratamento de erros
   - Se algo der errado, o código no `catch` executa

**Qual usar: `.then()` ou `async/await`?**
- `async/await` é mais moderno e legível (use isso!)
- `.then()` ainda funciona, mas é um pouco mais verboso

---

### 6. **Executando a Função**

```javascript
escreverArquivoInteligente('storage', 'aula05.txt', 
  'Aula 05 - Manipulação de arquivos com Node.js. \n\nArquivo criado com sucesso durante a atividade final.');
```

Isso:
1. Cria a pasta `storage` (se não existir)
2. Cria o arquivo `aula05.txt` dentro dela
3. Escreve o conteúdo no arquivo
4. Automaticamente chama `lerArquivoInteligente()` para ler o arquivo que acabou de criar

---

## 🎨 Começando com Chalk (Cores no Terminal)

A biblioteca `chalk` deixa o terminal mais bonito:

```javascript
chalk.blue('texto azul')     // 🔵 Azul
chalk.red('texto vermelho')  // 🔴 Vermelho
chalk.green('texto verde')   // 🟢 Verde
chalk.cyan('texto ciano')    // 🔷 Ciano (azul claro)
chalk.grey('texto cinza')    // ⚪ Cinza
```

---

## 🚀 Rodando o Projeto

```bash
npm install  # Instala as dependências (chalk)
npm start    # Executa o index.js
```

**O que você verá:**
1. Uma mensagem em cyan dizendo que começou a criar o arquivo
2. Uma pausa de 1 segundo
3. Uma mensagem em verde dizendo que foi criado
4. Uma mensagem em azul que começou a ler
5. Uma pausa de 1 segundo  
6. Uma mensagem em cinza mostrando o conteúdo do arquivo

---

## 📖 Resumo dos Conceitos-Chave

| Conceito | Explicação |
|----------|-----------|
| **fs.readFile()** | Lê um arquivo do disco e retorna uma Promise |
| **fs.writeFile()** | Escreve conteúdo em um arquivo e retorna uma Promise |
| **fs.mkdir()** | Cria uma pasta e retorna uma Promise |
| **path.join()** | Combina caminhos de forma segura |
| **await** | Aguarda uma Promise resolver |
| **async** | Marca que a função trabalha com Promises |
| **try/catch** | Trata erros de operações assíncronas |
| **.then()/.catch()** | Forma alternativa de trabalhar com Promises |
| **.mkdirSync()** | Versão síncrona (bloqueia o código até terminar) |

---

## 🤔 Próximos Passos para Aprender

1. **Tente modificar o código**: Mude para `fs.readFileSync()` - qual é a diferença?
2. **Tente ler um arquivo que não existe**: O que acontece?
3. **Tente escrever em uma pasta sem permissão**: O `try/catch` funciona?
4. **Tente remover um arquivo**: Use `fs.unlink()`
5. **Tente listar arquivos de uma pasta**: Use `fs.readdir()`

---

**Resumindo:** Este projeto mostra as ferramentas básicas para trabalhar com arquivos no Node.js. Você está usando Promises (ou async/await), módulos nativos do Node, e organizando caminhos de forma segura. Parabéns por estar aprendendo Node.js! 🎉
