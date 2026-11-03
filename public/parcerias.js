const API_URL = "https://mpnctyzvjkybtsskbibw.supabase.co/functions/v1/partner-application";
const form = document.getElementById("partner-form");
const status = document.getElementById("form-status");
const submit = document.getElementById("submit");
const success = document.getElementById("success");
const originalLabel = submit.textContent;
let isSubmitting = false;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (isSubmitting) return;
  status.textContent = "";
  status.className = "form-status";
  if (!form.checkValidity()) {
    form.reportValidity();
    status.textContent = "Verifica os campos obrigatórios e a informação de privacidade.";
    return;
  }
  const data = new FormData(form);
  const payload = {
    nome: String(data.get("nome") || "").trim(),
    email: String(data.get("email") || "").trim(),
    area_profissional: String(data.get("area_profissional") || "").trim(),
    organizacao: String(data.get("organizacao") || "").trim(),
    perfil_url: String(data.get("perfil_url") || "").trim(),
    tipo_parceria: String(data.get("tipo_parceria") || "").trim(),
    temas: String(data.get("temas") || "").trim(),
    proposta: String(data.get("proposta") || "").trim(),
    informacao_privacidade_lida: data.get("informacao_privacidade_lida") === "on",
    website_confirmacao: String(data.get("website_confirmacao") || ""),
  };
  isSubmitting = true;
  submit.disabled = true;
  submit.textContent = "A enviar a proposta…";
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    let response = {};
    try { response = await res.json(); } catch (_) {}
    if (!res.ok || response.ok !== true) {
      throw new Error(response.message || "Não foi possível enviar a proposta.");
    }
    form.hidden = true;
    success.hidden = false;
    success.focus();
  } catch (error) {
    const networkError = error instanceof TypeError;
    status.textContent = networkError
      ? "Não foi possível contactar o servidor. Verifica a tua ligação e tenta novamente. Se o problema persistir, escreve para luneetfemme@gmail.com."
      : (error.message || "Ocorreu um erro ao enviar a proposta. Tenta novamente.");
    submit.disabled = false;
    submit.textContent = originalLabel;
    isSubmitting = false;
  }
});
