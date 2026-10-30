# Lune Beta — procedimento interno de conservação e revisão de dados
Atualização: 30/10/2026. Documento operacional; não substitui a validação jurídica.

## Prazos aprovados
- Candidaturas à lista de interesse: máximo de 12 meses após a última interação relevante, ou antes se a finalidade terminar ou existir pedido de apagamento aplicável.
- Participantes da Beta: durante a participação e até 12 meses após o seu termo individual.
- Resultados efetivamente anónimos: podem ser conservados a longo prazo para análise e melhoria do projeto, desde que não permitam reidentificar pessoas.
- Comunicações opcionais: a revogação da autorização deve ser respeitada; não manter dados individuais de saúde apenas para newsletters.

## Implementação existente
Tabela `public.beta_applications`:
- `ultima_interacao_em`: data da última interação relevante registada;
- `beta_terminou_em`: data em que uma participação efetiva terminou;
- `rever_conservacao_em`: data de revisão, recalculada quando mudam os campos anteriores;
- `versao_privacidade`: identifica a informação mostrada na recolha (versão atual: `beta-2026-10-30-v2`).
A trigger `beta_rever_conservacao` determina a data de revisão. **Não existe eliminação automática.**

## Procedimento administrativo mensal
1. Com acesso administrativo, identificar registos cuja data de revisão venceu:
```sql
select id, estado, ultima_interacao_em, beta_terminou_em, rever_conservacao_em
from public.beta_applications
where rever_conservacao_em <= now()
order by rever_conservacao_em;
```
2. Rever a finalidade atual, a situação da candidatura, a eventual participação em curso e os pedidos da titular.
3. Se a participação ainda estiver ativa, registar adequadamente esse estado e as interações relevantes antes de redefinir a data de revisão.
4. Quando os dados já não forem necessários e não houver fundamento legal para os conservar, apagá-los com confirmação administrativa ou aplicar anonimização efetiva. Não confundir pseudonimização com anonimização.
5. Registar a decisão de revisão/eliminação num controlo interno que não exponha dados de saúde.

## Quando existe uma nova interação relevante
O gestor autorizado deve atualizar `ultima_interacao_em`. Se a participante concluir a Beta, atualizar `estado='concluida'` e `beta_terminou_em` com a data efetiva. O cálculo da revisão atualiza-se automaticamente.

## Pedidos das titulares e segurança
- Contacto: luneetfemme@gmail.com
- Verificar cuidadosamente a identidade antes de divulgar dados, com a mínima recolha adicional necessária.
- Pedidos de retirada do consentimento, acesso, retificação e apagamento devem ser analisados atempadamente conforme o RGPD e as exceções aplicáveis.
- A tabela mantém RLS ativado e não deve conceder leitura direta aos papéis públicos.
- Antes da campanha Beta: validação jurídica do texto, teste integral do formulário e mitigação de spam e abuso da Edge Function.

**Não usar esta documentação como autorização para ceder dados identificáveis a parceiros.**
