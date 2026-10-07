const API_URL = "https://mpnctyzvjkybtsskbibw.supabase.co/functions/v1/beta-application";

document.querySelectorAll('[data-scroll]').forEach((el) => {
  el.addEventListener('click', (event) => {
    const target = document.querySelector(el.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

const form = document.querySelector('#beta-form');

if (form) {
  const status = form.querySelector('.form-status');
  const submit = form.querySelector('button[type="submit"]');
  const originalLabel = submit ? submit.textContent : '';

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!submit) return;

    status.textContent = '';
    submit.disabled = true;
    submit.textContent = 'A enviar…';

    const data = new FormData(form);
    const payload = {
      nome: String(data.get('nome') || '').trim(),
      email: String(data.get('email') || '').trim(),
      fase: String(data.get('fase') || '').trim(),
      consentimento_dados_saude: data.get('consentimento_dados_saude') === 'on',
      consentimento_marketing: data.get('consentimento_marketing') === 'on',
      website: String(data.get('website') || '').trim()
    };

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      let body = {};
      try { body = await response.json(); } catch (_) {}

      if (!response.ok || body.ok !== true) {
        throw new Error(body.message || 'Não foi possível concluir a inscrição. Tenta novamente.');
      }

      window.location.href = 'obrigada.html';
    } catch (error) {
      status.textContent = error.message || 'Não foi possível concluir a inscrição. Tenta novamente.';
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  });
}
