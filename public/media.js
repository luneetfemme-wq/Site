// Lune media: photos are optional, and prototype previews only appear if real files exist.
document.querySelectorAll('img[data-photo]').forEach((img) => {
  const card = img.closest('.femme-photo');
  const show = () => card?.classList.add('has-image');
  img.addEventListener('load', show);
  img.addEventListener('error', () => card?.classList.remove('has-image'));
  if (img.complete && img.naturalWidth > 0) show();
});

// Transparent preview of the genuine development MVP.
const preview = document.querySelector('#app-real');
if (preview) {
  const heading = preview.querySelector('#app-real-title');
  const eyebrow = preview.querySelector('.eyebrow');
  const intro = preview.querySelector('.section-sub');
  if (heading) heading.textContent = 'Um primeiro olhar sobre a Lune.';
  if (eyebrow) eyebrow.textContent = 'A APLICAÇÃO ESTÁ A GANHAR FORMA';
  if (intro) intro.textContent = 'Estes são ecrãs reais do protótipo em desenvolvimento. A experiência e algumas funcionalidades podem mudar durante a fase Beta.';

  const gallery = preview.querySelector('.app-shots');
  const items = [
    { file: 'mvp-home.jpg', category: '01 · INÍCIO', title: 'Um próximo passo, sem pressa', copy: 'Sugestões simples e recursos que respeitam o teu momento.' },
    { file: 'mvp-conteudos.jpg', category: '02 · EXPLORAR', title: 'Encontra temas que te ajudam', copy: 'Explora informação e recursos organizados por temas, ao teu ritmo.' },
    { file: 'mvp-passos.jpg', category: '03 · PASSOS PRÁTICOS', title: 'Ideias para o dia a dia', copy: 'Pequenos gestos que podes escolher, sem obrigação de fazer tudo.' },
    { file: 'mvp-perfil.jpg', category: '04 · PERFIL', title: 'Uma experiência mais tua', copy: 'Indica as tuas preferências e a fase em que estás, para uma experiência ajustada a ti.' }
  ];

  if (gallery) {
    // Reuse the three screenshot figures already in HTML.
    const originals = Array.from(gallery.querySelectorAll('.app-shot'));
    const indexed = new Map(originals.map(fig => [fig.querySelector('img')?.getAttribute('src')?.split('/').pop(), fig]));
    gallery.textContent = '';

    for (const item of items) {
      let figure = indexed.get(item.file);
      if (!figure) {
        figure = document.createElement('figure');
        figure.className = 'app-shot';
      }
      figure.hidden = true;
      figure.setAttribute('aria-label', item.title);

      let img = figure.querySelector('img');
      if (!img) {
        img = document.createElement('img');
        img.setAttribute('src', 'assets/' + item.file);
        figure.prepend(img);
      }
      img.setAttribute('data-mvp-image', '');
      img.setAttribute('loading', 'lazy');
      img.alt = 'Captura do protótipo da Lune — ' + item.title;

      let caption = figure.querySelector('figcaption');
      if (!caption) {
        caption = document.createElement('figcaption');
        figure.append(caption);
      }
      caption.textContent = '';
      for (const [cls, value] of [['shot-category', item.category], ['shot-heading', item.title], ['shot-description', item.copy]]) {
        const line = document.createElement('span');
        line.className = cls;
        line.textContent = value;
        caption.append(line);
      }
      gallery.append(figure);

      const reveal = () => {
        if (img.naturalWidth > 0) {
          figure.hidden = false;
          preview.hidden = false;
        }
      };
      img.addEventListener('load', reveal, { once: true });
      img.addEventListener('error', () => { figure.hidden = true; }, { once: true });
      if (img.complete) reveal();
    }
  }

  const fineprint = document.createElement('p');
  fineprint.className = 'app-preview-note';
  fineprint.textContent = 'Imagens do MVP atual, não da versão final. Algumas áreas de navegação e funcionalidades mostradas poderão ainda não estar ativas. A comunidade está prevista para versões futuras.';
  preview.querySelector('.wrap')?.append(fineprint);
}
