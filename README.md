# DailyIU

Aplicativo web para acompanhamento de Incontinência Urinária, desenvolvido com Next.js 15.

## 📋 Sobre o Projeto

O DailyIU é uma plataforma completa que oferece ferramentas para o acompanhamento e gerenciamento da incontinência urinária, incluindo:

- 📝 **Diário/Calendário**: Registro e acompanhamento de eventos
- 💪 **Exercícios e Planos de Treino**: Exercícios personalizados e planos de treinamento
- 📚 **Conteúdos Educativos**: Posts, artigos e materiais informativos
- 👤 **Perfil do Usuário**: Gerenciamento de dados pessoais
- 🎯 **Onboarding**: Questionário inicial para personalização
- ♿ **Acessibilidade**: Recursos de acessibilidade integrados
- 🔐 **Autenticação**: Sistema completo de login, registro e recuperação de senha
- 👨‍💼 **Painel Administrativo**: Gerenciamento de usuários, conteúdos e denúncias

## 🛠️ Tecnologias

- **Next.js 15.3.3** - Framework React com App Router
- **React 19** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Tailwind CSS 4** - Estilização
- **React Query (TanStack Query)** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Zod** - Validação de schemas
- **Axios** - Cliente HTTP
- **Phosphor Icons** - Ícones

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **Yarn** (versão 1.22 ou superior)

Para verificar se estão instalados:

```bash
node --version
yarn --version
```

## 🚀 Instalação e Configuração

### 1. Clone o repositório

```bash
git clone <url-do-repositório>
cd tcc-tads-front
```

### 2. Instale as dependências

```bash
yarn install
```

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:

```env
NEXT_PUBLIC_BASE_URL=https://sua-api-url.com
```

**Importante**: Substitua `https://sua-api-url.com` pela URL base da sua API backend.

### 4. Execute o projeto em modo de desenvolvimento

```bash
yarn dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000).

## 📜 Scripts Disponíveis

### Desenvolvimento

```bash
yarn dev
```

Inicia o servidor de desenvolvimento com Turbopack na porta 3000.

### Build de Produção

```bash
yarn build
```

Cria uma versão otimizada do aplicativo para produção.

### Iniciar Servidor de Produção

```bash
yarn start
```

Inicia o servidor de produção (requer build prévio com `yarn build`).

### Linting

```bash
yarn lint
```

Executa o ESLint para verificar problemas no código.

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
│   ├── about/             # Página sobre o projeto
│   ├── administration/    # Painel administrativo
│   ├── authentication/    # Autenticação (login, registro, recuperação)
│   ├── components/        # Componentes reutilizáveis
│   ├── contents/          # Gerenciamento de conteúdos
│   ├── contexts/          # Contextos React (Auth, Diary, etc.)
│   ├── diary/             # Diário/Calendário
│   ├── exercises/         # Exercícios e treinos
│   ├── onboarding/        # Fluxo de onboarding
│   ├── profile/           # Perfil do usuário
│   ├── support/           # Suporte e acessibilidade
│   ├── services/          # Serviços de API
│   ├── types/             # Tipos TypeScript
│   └── utils/             # Utilitários
├── middleware.ts          # Middleware do Next.js
└── ...
```

## 🔧 Configurações Importantes

### Variáveis de Ambiente

- `NEXT_PUBLIC_BASE_URL`: URL base da API backend (obrigatória)

### Imagens Remotas

O projeto está configurado para aceitar imagens dos seguintes domínios:

- `images.unsplash.com`
- `ui-avatars.com`
- `dailyiuwebmediastorage.blob.core.windows.net`

## 🎨 Recursos Principais

### Autenticação

- Login e registro de usuários
- Recuperação de senha
- Proteção de rotas

### Diário

- Calendário interativo
- Registro de eventos
- Relatórios

### Exercícios

- Listagem de exercícios
- Planos de treino personalizados
- Acompanhamento de progresso

### Conteúdos

- Posts e artigos
- Sistema de likes e comentários
- Categorização
- Upload de mídia

### Administração

- Gerenciamento de usuários
- Moderação de conteúdos
- Dashboard de denúncias

## 🤝 Contribuindo

1. Crie uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
2. Commit suas mudanças (`git commit -m 'Adiciona MinhaFeature'`)
3. Push para a branch (`git push origin feature/MinhaFeature`)
4. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença especificada no arquivo `LICENSE`.

## 📞 Suporte

Para suporte, entre em contato através da seção "Fale Conosco" no aplicativo ou abra uma issue no repositório.

---

Desenvolvido com ❤️ para o TCC do curso TADS
