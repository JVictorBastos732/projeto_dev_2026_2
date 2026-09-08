<img src="logo.png" alt="Mupi Systems Logo" width="200"/>

# Desenvolvedor(a) Júnior Full Stack

# Portal de Submissão Acadêmica

Portal para submissão de trabalhos acadêmicos (artigos científicos, resumos
expandidos, pôsteres) em um evento científico. Autores enviam suas
submissões pela página pública e acompanham o status por um protocolo
gerado automaticamente, sem precisar de login. A organização do evento
gerencia tudo por um painel administrativo: revisa submissões, aprova ou
reprova, e mantém as categorias abertas para envio.

Projeto desenvolvido para o desafio técnico de Desenvolvedor(a) Júnior Full
Stack da Mupi Systems.

## Stack

- **Backend**: Laravel 13 (API REST)
- **Autenticação**: Laravel Sanctum, modo SPA (sessão via cookie)
- **Banco de dados**: SQLite
- **Frontend**: React + Vite, React Router, Axios
- **Estilo**: Tailwind CSS (via CDN)
- **Testes**: PHPUnit (Feature tests), banco SQLite em memória

O raciocínio por trás dessas escolhas está em [`DECISOES.md`](./DECISOES.md).

## Estrutura do projeto

projeto_dev_2026_2/
├── backend/ # API Laravel
├── frontend/ # SPA React
├── README.md
└── DECISOES.md

## Pré-requisitos

- PHP >= 8.3
- Composer
- Node.js >= 22.11
- npm

## Rodando o backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
touch database/database.sqlite
php artisan migrate --seed
php artisan serve
```

A API sobe em `http://localhost:8000`.

### Usuário administrador

Criado automaticamente pelo seed (`AdminUserSeeder`):

- **Email**: `admin@portal.com`
- **Senha**: `password123`

### Rodando os testes do backend

```bash
php artisan test
```

Cobre os três fluxos centrais exigidos (criação de submissão válida/inválida,
bloqueio do painel sem autenticação, mudança de status), além de casos
extras de erro (categoria inativa, credenciais inválidas, status fora do
enum).

## Rodando o frontend

Em outro terminal:

```bash
cd frontend
npm install
npm run dev
```

O frontend sobe em `http://localhost:5173`.

## Fluxo de uso

| Página | URL |
|---|---|
| Início / categorias abertas | `http://localhost:5173/` |
| Submeter trabalho | `http://localhost:5173/submeter` |
| Consultar status por protocolo | `http://localhost:5173/consultar` |
| Login administrativo | `http://localhost:5173/admin/login` |
| Painel — submissões | `http://localhost:5173/admin` |
| Painel — categorias | `http://localhost:5173/admin/categories` |

## Variáveis de ambiente

Ver `backend/.env.example` para a lista completa. As mais relevantes para
rodar localmente (já vêm preenchidas no exemplo):

```env
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
SESSION_DRIVER=database
SESSION_DOMAIN=localhost
SANCTUM_STATEFUL_DOMAINS=localhost:5173
DB_CONNECTION=sqlite
FILESYSTEM_DISK=public
```

O frontend não usa `.env` — a URL da API está configurada diretamente em
`frontend/src/services/api.js`.

## Upload de arquivos

Submissões aceitam anexo de PDF (opcional). Os arquivos ficam em
`backend/storage/app/public/submissions`. Após o primeiro
`php artisan migrate --seed`, rode também:

```bash
php artisan storage:link
```

para o link simbólico de acesso público funcionar.