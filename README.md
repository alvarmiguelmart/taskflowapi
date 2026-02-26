# TaskFlow - API de Gerenciamento de Tarefas

## Sobre o Projeto

API completa para gerenciamento de tarefas com autenticação, projetos, comentários e tags. Desenvolvida para demonstrar boas práticas de desenvolvimento backend.

## Tecnologias

- Node.js + Express
- PostgreSQL
- Prisma ORM
- JWT
- Redis (cache)
- Docker
- Jest (testes)

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- PostgreSQL (ou usar Docker)

## Instalação

1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/taskflow.git
cd taskflow
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env
# Edite .env com suas configurações
```

4. Execute com Docker

```bash
docker-compose up -d
```

5. Execute as migrations

```bash
npx prisma migrate dev
```

6. Popule o banco (opcional)

```bash
node prisma/seed.js
```

7. Inicie o servidor

```bash
npm run dev
```

## 🧪 Testes

```bash
# Testes unitários
npm test

# Testes com cobertura
npm run test:coverage

# Testes de integração
npm run test:integration
```

## Features Implementadas

✅ Autenticação JWT  
✅ CRUD de usuários  
✅ CRUD de projetos  
✅ CRUD de tarefas  
✅ Sistema de comentários  
✅ Tags para tarefas  
✅ Filtros e busca  
✅ Validações  
✅ Tratamento de erros  
✅ Logs estruturados  
✅ Testes automatizados  
✅ Docker  
✅ Documentação  

## Próximos Passos

- Implementar WebSockets para atualizações em tempo real  
- Adicionar notificações por email  
- Criar dashboard com métricas  
- Implementar rate limiting avançado  
- Adicionar cache com Redis  

## Melhorias de DevOps

- Pipeline CI/CD com GitHub Actions  
- Deploy na AWS (ECS ou Elastic Beanstalk)  
- Monitoramento com Prometheus + Grafana  
- Logs centralizados com ELK Stack  
- Infraestrutura como código com Terraform  

## Licença

Este projeto está sob a licença MIT.

