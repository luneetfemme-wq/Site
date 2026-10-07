# Lune Beta — site

Landing page pública da Lune para apresentação da aplicação e candidaturas ao beta.

## Arquitetura

- Site estático em `public/` (HTML, CSS e JavaScript)
- Alojamento previsto: Cloudflare Pages
- Formulário: Supabase Edge Function `beta-application`
- Base de dados: projeto Supabase **Lune Beta**
- Domínio final: `lune.pt` e `www.lune.pt`

## Deploy no Cloudflare Pages

- Build command: deixar vazio
- Build output directory: `public`
- Root directory: `/`

## Antes do lançamento público

- Confirmar o email/contacto de privacidade a apresentar na Política de Privacidade.
- Rever juridicamente a Política de Privacidade e o consentimento relativo à informação sobre a fase do percurso.
- Depois de ligar o domínio, testar uma candidatura real de ponta a ponta.
- Ativar proteção anti-bot adicional se o volume de spam justificar (ex.: Turnstile).

O repositório não contém chaves privadas do Supabase.
