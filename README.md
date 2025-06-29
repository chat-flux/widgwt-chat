# AI Agent Platform

Plataforma completa para desenvolvimento, treinamento e deploy de agentes de IA.

## 🚀 Configuração Inicial

### 1. Pré-requisitos

- Node.js 18+ 
- PostgreSQL 14+
- Redis 6+
- Conta OpenAI com API Key

### 2. Instalação

\`\`\`bash
# Clone o repositório
git clone <seu-repositorio>
cd ai-agent-platform

# Instale as dependências
npm install

# Copie o arquivo de exemplo das variáveis de ambiente
cp .env.example .env
\`\`\`

### 3. Configuração das Variáveis de Ambiente

Edite o arquivo \`.env\` com suas configurações:

#### OpenAI API
1. Acesse [OpenAI Platform](https://platform.openai.com)
2. Crie uma API Key
3. Adicione no \`.env\`:
\`\`\`
OPENAI_API_KEY=sk-sua-chave-aqui
\`\`\`

#### PostgreSQL
\`\`\`bash
# Instalar PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Criar banco de dados
sudo -u postgres createdb ai_agent_platform
sudo -u postgres createuser --interactive

# Adicionar no .env
DATABASE_URL=postgresql://username:password@localhost:5432/ai_agent_platform
\`\`\`

#### Redis
\`\`\`bash
# Instalar Redis (Ubuntu/Debian)
sudo apt install redis-server

# Iniciar Redis
sudo systemctl start redis-server

# Adicionar no .env
REDIS_URL=redis://localhost:6379/0
CELERY_BROKER_URL=redis://localhost:6379/0
\`\`\`

### 4. Executar a Aplicação

\`\`\`bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
\`\`\`

## 📋 Roadmap de Desenvolvimento

### Sprint 1 (✅ Concluído)
- [x] Tela de Login & Onboarding
- [x] Dashboard de Agentes
- [x] CRUD básico de agentes
- [x] Validação de variáveis de ambiente

### Sprint 2 (🔄 Em desenvolvimento)
- [ ] Sistema de Chat em tempo real
- [ ] Persistência de histórico (localStorage)
- [ ] Integração básica com OpenAI API

### Sprint 3 (📋 Planejado)
- [ ] Upload e processamento de documentos
- [ ] Sistema de treinamento com Celery
- [ ] Transcrição de áudio

### Sprint 4 (📋 Planejado)
- [ ] Widget Builder com preview
- [ ] Geração de snippets HTML/JS
- [ ] Deploy com Docker

## 🛠️ Tecnologias

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Backend**: Python Flask/FastAPI (próximo sprint)
- **Banco de Dados**: PostgreSQL
- **Cache/Queue**: Redis + Celery
- **IA**: OpenAI GPT API
- **Deploy**: Docker + Docker Compose

## 📁 Estrutura do Projeto

\`\`\`
ai-agent-platform/
├── app/                    # Next.js App Router
│   ├── login/             # Página de login
│   ├── onboarding/        # Configuração inicial
│   ├── agents/            # Dashboard de agentes
│   └── layout.tsx         # Layout principal
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── .env.example          # Exemplo de variáveis de ambiente
└── README.md             # Este arquivo
\`\`\`

## 🔧 Comandos Úteis

\`\`\`bash
# Verificar status das variáveis de ambiente
npm run check-env

# Executar testes
npm test

# Lint e formatação
npm run lint
npm run format

# Build para produção
npm run build
\`\`\`

## 🐳 Docker (Sprint 4)

\`\`\`bash
# Executar com Docker Compose
docker-compose up -d

# Logs
docker-compose logs -f

# Parar serviços
docker-compose down
\`\`\`

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se todas as variáveis de ambiente estão configuradas
2. Confirme se PostgreSQL e Redis estão rodando
3. Consulte os logs da aplicação

## 📄 Licença

Este projeto está sob a licença MIT.
\`\`\`
\`\`\`

Agora vou criar um script para verificar as configurações:
