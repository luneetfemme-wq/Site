import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.0/+esm';

const client = createClient('https://mpnctyzvjkybtsskbibw.supabase.co', "sb_publishable_0jmJSuo9DkYCDwS3dYK-Gw_NJKUJHeo", {
  auth: { autoRefreshToken: true, persistSession: true, detectSessionInUrl: true },
});
const byId = (id) => document.getElementById(id);
const login = byId('login');
const dashboard = byId('dashboard');
const notice = byId('notice');
const signInForm = byId('password-form');
const signInBtn = signInForm.querySelector('button[type=submit]');
const magicBtn = byId('magic');
const logoutBtn = byId('logout');
const searchInput = byId('search');
const filterStatus = byId('filter-status');
const filterPhase = byId('filter-phase');
const stateLabels = { pendente: 'Pendente', convidada: 'Convidada', ativa: 'Ativa', concluida: 'Concluída', recusada: 'Recusada' };
let rows = [];
let isAdmin = false;
let loading = false;

function announce(message, type = '') {
  notice.textContent = message;
  notice.className = 'notice' + (type ? ' ' + type : '');
  notice.hidden = !message;
}
function busy(isBusy) {
  signInBtn.disabled = isBusy;
  magicBtn.disabled = isBusy;
}
function formatDate(value) {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '—' : new Intl.DateTimeFormat('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}
function element(tag, cls, value) {
  const el = document.createElement(tag);
  if (cls) el.className = cls;
  if (value !== undefined && value !== null) el.textContent = String(value);
  return el;
}
function setAccess(allowed, email = '') {
  isAdmin = allowed;
  login.hidden = allowed;
  dashboard.hidden = !allowed;
  logoutBtn.hidden = !email;
  if (allowed) byId('identity').textContent = email;
  if (!allowed) { rows = []; byId('rows').replaceChildren(); }
}
async function load() {
  if (!isAdmin || loading) return;
  loading = true;
  byId('reload').disabled = true;
  announce('');
  try {
    const { data, error } = await client.from('beta_applications')
      .select('id,created_at,nome,email,fase,estado,consentimento_melhoria,consentimento_marketing,rever_conservacao_em')
      .order('created_at', { ascending: false })
      .range(0, 999);
    if (error) throw error;
    rows = data || [];
    const phaseValue = filterPhase.value;
    filterPhase.replaceChildren(new Option('Todas as fases', ''));
    [...new Set(rows.map(r => r.fase).filter(Boolean))].sort((a,b)=>a.localeCompare(b,'pt'))
      .forEach(phase => filterPhase.add(new Option(phase, phase)));
    filterPhase.value = phaseValue;
    updateView();
    if (rows.length >= 1000) announce('Apenas as primeiras 1000 candidaturas estão visíveis. É necessário acrescentar paginação antes de gerir mais inscrições.');
  } catch (error) {
    console.error('Erro de acesso à área reservada:', error.code || error.name);
    announce('Não foi possível obter as candidaturas. Confirma a sessão e tenta novamente.', 'error');
  } finally {
    loading = false;
    byId('reload').disabled = false;
  }
}
function updateView() {
  if (!isAdmin) return;
  const text = searchInput.value.trim().toLocaleLowerCase('pt-PT');
  const state = filterStatus.value;
  const phase = filterPhase.value;
  const shown = rows.filter(r =>
    (!state || r.estado === state) &&
    (!phase || r.fase === phase) &&
    (!text || (r.nome || '').toLocaleLowerCase('pt-PT').includes(text) || (r.email || '').toLocaleLowerCase('pt-PT').includes(text))
  );
  byId('m-total').textContent = String(rows.length);
  for (const key of ['pendente','convidada','ativa']) {
    byId('m-' + key).textContent = String(rows.filter(r => r.estado === key).length);
  }
  byId('filtered-count').textContent = shown.length + ' de ' + rows.length + ' candidaturas';
  byId('empty').hidden = shown.length !== 0;
  const container = byId('rows');
  const fragment = document.createDocumentFragment();
  for (const r of shown) {
    const tr = document.createElement('tr');
    const person = element('td','email');
    person.append(element('strong', '', r.nome || 'Sem nome'));
    person.append(element('small', '', r.email || ''));
    const phaseCell = element('td','');
    phaseCell.append(element('span','chip', r.fase || '—'));
    const dateCell = element('td','', formatDate(r.created_at));
    const review = element('td','', formatDate(r.rever_conservacao_em));
    const stateCell = element('td','');
    const sel = element('select','status-control');
    sel.setAttribute('aria-label', 'Estado de ' + (r.nome || 'candidatura'));
    for (const [key, title] of Object.entries(stateLabels)) sel.add(new Option(title, key));
    sel.value = r.estado;
    sel.addEventListener('change', async () => {
      const previous = r.estado;
      const next = sel.value;
      if (previous === next) return;
      sel.disabled = true;
      announce('');
      try {
        // A RLS do Postgres e os grants de coluna validam toda a operação.
        const { data, error } = await client.from('beta_applications')
          .update({ estado: next })
          .eq('id', r.id)
          .select('id,estado,rever_conservacao_em')
          .single();
        if (error || !data) throw error || Error('A atualização não foi aceite.');
        r.estado = data.estado;
        r.rever_conservacao_em = data.rever_conservacao_em;
        announce('Estado atualizado. Esta ação não envia qualquer email.', 'success');
        updateView();
      } catch (error) {
        console.error('Falha ao atualizar estado:', error.code || error.name);
        sel.value = previous;
        announce('Não foi possível guardar a alteração. Os dados não foram modificados.', 'error');
      } finally {
        sel.disabled = false;
      }
    });
    stateCell.append(sel);
    tr.append(person,phaseCell,dateCell,stateCell,review);
    fragment.append(tr);
  }
  container.replaceChildren(fragment);
}
async function checkAccess() {
  const { data: userData, error: authError } = await client.auth.getUser();
  if (authError || !userData?.user) {
    setAccess(false);
    return;
  }
  const user = userData.user;
  const { data, error } = await client.from('beta_admins')
    .select('user_id').eq('user_id', user.id).maybeSingle();
  if (error || !data) {
    setAccess(false, user.email || '');
    announce('Esta conta não está autorizada a gerir as candidaturas da Lune Beta.', 'error');
    return;
  }
  setAccess(true, user.email || '');
  await load();
}
signInForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const email = byId('email').value.trim();
  const password = byId('password').value;
  if (!email || !password) return;
  busy(true);
  announce('');
  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) throw error;
    byId('password').value = '';
    await checkAccess();
  } catch (error) {
    announce('Não foi possível iniciar sessão. Confirma o email e a palavra-passe, ou usa a ligação por email.', 'error');
  } finally { busy(false); }
});
magicBtn.addEventListener('click', async () => {
  const email = byId('email').value.trim();
  if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    announce('Introduz primeiro um endereço de email válido.', 'error'); return;
  }
  busy(true);
  announce('');
  try {
    const { error } = await client.auth.signInWithOtp({
      email, options: { shouldCreateUser: false, emailRedirectTo: window.location.origin + '/gestao-beta.html' },
    });
    if (error) throw error;
    announce('Se existir uma conta com este email, receberás uma ligação de acesso. Consulta a caixa de entrada e o spam.', 'success');
  } catch (error) {
    announce('Não foi possível enviar a ligação de acesso. Confirma o email e tenta novamente.', 'error');
  } finally { busy(false); }
});
logoutBtn.addEventListener('click', async () => {
  await client.auth.signOut();
  setAccess(false);
  announce('Sessão terminada.', 'success');
});
byId('reload').addEventListener('click', load);
searchInput.addEventListener('input', updateView);
filterStatus.addEventListener('change', updateView);
filterPhase.addEventListener('change', updateView);

// Após abrir uma ligação por email, o cliente Supabase recupera a sessão.
async function initialize() {
  try { await checkAccess(); }
  catch (error) {
    setAccess(false);
    announce('Não foi possível iniciar o painel. Verifica a ligação e atualiza a página.', 'error');
  }
}
initialize();
