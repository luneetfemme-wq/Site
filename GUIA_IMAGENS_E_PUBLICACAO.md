# Lune — publicar o novo site sem pagar Emergent

Este repositório contém uma versão estática da landing page para a Lune Beta.
A nova proposta está na branch `redesign-lune-beta-gratuito-2026`, criada para **não alterar o site atual sem validação**.

## Alojamento gratuito: Cloudflare Pages

1. Entrar em https://dash.cloudflare.com/ e escolher o plano Free.
2. Ir a **Workers & Pages** → **Create application** → **Pages** → **Connect to Git**.
3. Autorizar a conta GitHub e escolher apenas `luneetfemme-wq/Site`.
4. Definir:
   - Framework: **None** / sem framework.
   - Production branch: **main** (depois da revisão e merge da proposta).
   - Build command: **vazio**.
   - Build output directory: **public**.
   - Root directory: **/**.
5. Publicar primeiro no endereço temporário `*.pages.dev`.
6. **Antes de ligar lune.pt**, testar a homepage em telemóvel, a Política de Privacidade e uma inscrição de teste. Verificar que o pedido chega realmente ao Supabase, sem criar duplicados indevidos.
7. Só depois configurar os Custom domains `lune.pt` e `www.lune.pt` no Cloudflare Pages. Para o domínio principal, o Cloudflare pode exigir mudar os nameservers do domínio para os do Cloudflare. Guardar todos os registos DNS antes, sobretudo MX, SPF, DKIM, DMARC e outros registos de email; não alterar registos às cegas.
8. Até a migração estar validada, deixar o domínio público apontado para o alojamento anterior. Não é necessário pagar o Emergent para fazer esta migração, mas o registo/renovação do domínio continua a ser responsabilidade do titular.

Documentação oficial:
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/configuration/custom-domains/

## Fotografias: podes colocá-las tu, quando quiseres

O novo site está preparado para usar estes ficheiros, guardados em `public/assets/`:

| Ficheiro exato | Onde aparece |
| --- | --- |
| `femme-campanha.jpg` | Cartaz/campanha «Já conheces as tuas mamas?» |
| `femme-malhas.jpg` | Foto das malhas coloridas |
| `femme-look.jpg` | Look zebra + cachecol rosa |
| `femme-stand.jpg` | Fotografia real do stand da Lune et Femme |

As fotografias são opcionais durante os testes. **A galeria só é apresentada quando existir pelo menos uma imagem real.** Quando colocares os quatro JPG na pasta indicada, a composição fotográfica substitui a antiga maquete tipográfica automaticamente. Para melhor resultado, carrega os quatro ficheiros numa só alteração.

Para adicionar imagens no GitHub:
1. Abre https://github.com/luneetfemme-wq/Site .
2. Abre a pasta `public/assets`. Se a proposta ainda não estiver na branch principal, escolhe a branch de testes para veres as alterações; depois da publicação, usa a branch `main`.
3. Usa **Add file → Upload files**.
4. Escolhe os JPG (não carregues o ZIP fechado), sem mudar os nomes.
5. Confirma em **Commit changes**. Se GitHub estiver ligado ao Cloudflare Pages, a atualização será publicada automaticamente quando for feita na branch de produção.

Podes voltar a carregar um ficheiro mantendo o mesmo nome para substituí-lo.

## Capturas reais do MVP (quando estiverem prontas)

Mais tarde, coloca estes três ficheiros na mesma pasta:

- `mvp-home.jpg` — página inicial personalizada.
- `mvp-conteudos.jpg` — biblioteca de conteúdos.
- `mvp-perfil.jpg` — perfil.

**A secção “Por dentro da Lune” fica completamente oculta até existir pelo menos uma dessas capturas.** Não precisamos de inventar mockups.

Um vídeo de navegação pode ser acrescentado depois, com recurso a gravação real do MVP; não existe atualmente um vídeo automático publicado.

## Formulário de candidatura

- O ficheiro `public/app.js` foi **mantido ligado à função Supabase já configurada**, sem trocar o endpoint.
- Mantém o campo de fase e consentimento explícito para a informação sobre o percurso de saúde.
- Foi acrescentada validação dos campos obrigatórios antes de submeter.
- **Importante:** a integração e a Política de Privacidade precisam de ser verificadas em ambiente de teste antes da publicação. A existência da ligação no código não prova que a função está operacional no novo domínio.

## Ficheiros e futuro trabalho

- `public/index.html`: estrutura e textos da homepage.
- `public/redesign.css`: aspeto desktop e mobile.
- `public/media.js`: mostra imagens e capturas reais quando existirem.
- `public/app.js`: envio do formulário (mantém Supabase).
- `public/privacidade.html`: política de privacidade existente.
- `public/obrigada.html`: página de confirmação existente.

Não alterar configurações de DNS nem fazer merge/publicação sem validação da versão de testes.
