// Images are optional by design. As soon as the named files are uploaded to
// public/assets/, they appear automatically instead of the editorial fallbacks.
document.querySelectorAll('img[data-photo]').forEach((img) => {
  const card = img.closest('.femme-photo');
  const show = () => card?.classList.add('has-image');
  img.addEventListener('load', show);
  img.addEventListener('error', () => card?.classList.remove('has-image'));
  if (img.complete && img.naturalWidth > 0) show();
});

const appSection = document.querySelector('#app-real');
document.querySelectorAll('img[data-mvp-image]').forEach((img) => {
  const figure = img.closest('.app-shot');
  const show = () => {
    if (figure) figure.hidden = false;
    if (appSection) appSection.hidden = false;
  };
  img.addEventListener('load', show);
  img.addEventListener('error', () => { if (figure) figure.hidden = true; });
  if (img.complete && img.naturalWidth > 0) show();
});
