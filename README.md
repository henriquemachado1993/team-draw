# Sorteador de Times

Uma aplicação web para gerenciar jogadores e sortear times equilibrados baseados no nível dos jogadores.

## Funcionalidades

- Cadastro de jogadores com nickname e nível
- Edição e exclusão de jogadores
- Sorteio de times equilibrados
- Visualização do nível médio de cada time
- Persistência dos dados no localStorage

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (ORM)
- PostgreSQL

## Pré-requisitos

- Node.js 18 ou superior
- PostgreSQL

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd team-draw
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
- Crie um banco de dados PostgreSQL
- Copie o arquivo `.env.example` para `.env`
- Atualize a URL do banco de dados no arquivo `.env`

4. Execute as migrações do Prisma:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

## Uso

1. Acesse a aplicação em `http://localhost:3000`
2. Adicione jogadores usando o formulário
3. Selecione o número de times desejado
4. Clique em "Sortear Times" para gerar os times equilibrados

## Estrutura do Projeto

- `/src/components` - Componentes React
- `/src/app` - Páginas da aplicação
- `/prisma` - Configuração e migrações do Prisma

## Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
