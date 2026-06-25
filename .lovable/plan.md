# 🔐 Sistema de Perfis de Estúdios com Autenticação

## Objetivo
Cada estúdio terá uma conta (email + senha) para editar suas informações, jogos, fotos e atualizar dados em tempo real no site.

---

## 🛠️ Infraestrutura (Lovable Cloud)
Vou ativar o **Lovable Cloud** para fornecer:
- Autenticação (email/senha)
- Base de dados PostgreSQL (estúdios + jogos)
- Storage para upload de imagens (logos e capas)

---

## 🗄️ Estrutura de Dados

### Tabela `studios`
- `id`, `slug`, `name`, `tagline`, `description`, `location`, `founded`, `website`, `logo_url`, `owner_id` (→ auth.users)

### Tabela `games`
- `id`, `studio_id`, `title`, `description`, `status` (released/in-dev), `platforms[]`, `cover_url`, `links` (jsonb), `order`

### Tabela `user_roles`
- Para distinguir admin/studio_owner (boa prática de segurança)

### Storage Bucket `studio-assets`
- Logos de estúdios e capas de jogos (público para leitura, autenticado para escrita pelo dono)

---

## 🔑 Contas Criadas Automaticamente
Vou criar uma conta para cada um dos 9 estúdios existentes, com senhas geradas, e mostrar a lista no chat:

```
mac-studio@cgda.ao        | senha-gerada
bantu-games@cgda.ao       | senha-gerada
hydra-games@cgda.ao       | senha-gerada
... (todos os 9)
```

Cada estúdio poderá depois alterar email e senha no painel.

---

## 🖥️ Páginas e Componentes Novos

1. **Botão "Login"** no Header (canto superior direito)
2. **`/auth`** — página de login (email + senha)
3. **`/dashboard`** — painel do estúdio autenticado:
   - Editar dados do estúdio (nome, descrição, logo, website…)
   - Listar/criar/editar/eliminar jogos
   - Upload de imagens (logo e capas)
4. **`/account`** — alterar email e senha
5. Páginas públicas (`/studios/:slug`) passam a ler da base de dados em vez do ficheiro estático

---

## 🔒 Segurança
- RLS ativado em todas as tabelas
- Cada estúdio só pode editar o seu próprio registo e os seus jogos
- Leitura pública (qualquer visitante vê os perfis)
- Storage com políticas por `owner_id`

---

## 📋 Etapas
1. Ativar Lovable Cloud
2. Criar schema (tabelas + RLS + bucket + grants)
3. Migrar os dados estáticos atuais para a base de dados
4. Criar as 9 contas e associar cada uma ao seu estúdio
5. Implementar `/auth`, `/dashboard`, `/account` + botão Login
6. Ligar páginas públicas à base de dados
7. Entregar a lista de credenciais no chat
