'use strict';

function createMapViewer(viewport, image, controls, output) {
  let scale = 1, x = 0, y = 0, drag = null;
  const min = 1, max = 4;
  const render = () => {
    const width = viewport.clientWidth, height = viewport.clientHeight;
    const naturalWidth = image.naturalWidth || width || 1;
    const naturalHeight = image.naturalHeight || height || 1;
    const fit = Math.min(width / naturalWidth, height / naturalHeight);
    const limitX = Math.max(0, (naturalWidth * fit * scale - width) / 2);
    const limitY = Math.max(0, (naturalHeight * fit * scale - height) / 2);
    x = Math.max(-limitX, Math.min(limitX, x));
    y = Math.max(-limitY, Math.min(limitY, y));
    image.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
    viewport.classList.toggle('is-zoomed', scale > 1);
    output.textContent = `${Math.round(scale * 100)}%`;
    controls.forEach(button => {
      const action = button.dataset.zoom || button.dataset.dialogZoom;
      button.disabled = action === 'in' ? scale >= max : action === 'out' ? scale <= min : false;
    });
  };
  const zoom = action => {
    if (action === 'reset') { scale = 1; x = y = 0; }
    else scale = Math.max(min, Math.min(max, scale + (action === 'in' ? .5 : -.5)));
    render();
  };
  controls.forEach(button => button.addEventListener('click', () => zoom(button.dataset.zoom || button.dataset.dialogZoom)));
  viewport.addEventListener('pointerdown', event => {
    if (scale <= 1 || event.button > 0) return;
    drag = { id: event.pointerId, x: event.clientX - x, y: event.clientY - y };
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('dragging');
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag || event.pointerId !== drag.id) return;
    x = event.clientX - drag.x; y = event.clientY - drag.y; render();
  });
  const stop = () => { drag = null; viewport.classList.remove('dragging'); };
  viewport.addEventListener('pointerup', stop);
  viewport.addEventListener('pointercancel', stop);
  viewport.addEventListener('lostpointercapture', stop);
  viewport.addEventListener('keydown', event => {
    if (['+', '=', '-', '0', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      if (event.key === '+' || event.key === '=') zoom('in');
      else if (event.key === '-') zoom('out');
      else if (event.key === '0') zoom('reset');
      else { x += event.key === 'ArrowLeft' ? 40 : event.key === 'ArrowRight' ? -40 : 0; y += event.key === 'ArrowUp' ? 40 : event.key === 'ArrowDown' ? -40 : 0; render(); }
    }
  });
  new ResizeObserver(render).observe(viewport);
  image.addEventListener('load', render);
  render();
  return { reset: () => zoom('reset') };
}
const mapImage = document.querySelector('#map-image');
const mapViewer = createMapViewer(document.querySelector('#map-viewport'), mapImage, document.querySelectorAll('[data-zoom]'), document.querySelector('#zoom-level'));
const dialog = document.querySelector('#map-dialog');
const dialogImage = document.querySelector('#dialog-image');
const dialogViewer = createMapViewer(document.querySelector('#dialog-viewport'), dialogImage, document.querySelectorAll('[data-dialog-zoom]'), document.querySelector('#dialog-zoom-level'));
document.querySelector('#expand-map').addEventListener('click', () => {
  dialogImage.src = mapImage.src; dialogImage.alt = mapImage.alt;
  document.querySelector('#dialog-title').textContent = document.querySelector('#map-label').textContent;
  document.querySelector('#dialog-caption').textContent = document.querySelector('#map-source').innerText.replace(/\s*\n\s*/g, ' · ');
  dialog.showModal(); dialogViewer.reset();
});
document.querySelector('#close-map').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) { const rect = dialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close(); }});

const tabs = [...document.querySelectorAll('[data-map]')];
let activeChapter = 'historico', activeEntry = 0;
const mapPanel = document.querySelector('#map-panel');
const mapCanvas = mapPanel.querySelector('.map-canvas');
const urbanizationMaps = document.createElement('div');
urbanizationMaps.className = 'urbanization-maps';
urbanizationMaps.hidden = true;
mapCanvas.after(urbanizationMaps);
function showEntry(index) {
  const chapter = thesisContent.chapters[activeChapter];
  activeEntry = (index + chapter.items.length) % chapter.items.length;
  const item = chapter.items[activeEntry];
  const grouped = Boolean(item.images);
  mapCanvas.hidden = !item.image;
  urbanizationMaps.hidden = !grouped;
  mapPanel.classList.toggle('is-text-only', !item.image && !grouped);
  mapPanel.classList.toggle('is-map-group', grouped);
  urbanizationMaps.replaceChildren();
  if (item.image) mapImage.src = item.image;
  else mapImage.removeAttribute('src');
  for (const figure of item.images || []) {
    const card = document.createElement('figure');
    const button = document.createElement('button');
    button.type = 'button';
    button.setAttribute('aria-label',`Ampliar mapa: ${figure.title}`);
    const image = document.createElement('img');
    image.src = figure.image; image.alt = figure.title; image.loading = 'lazy';
    button.append(image);
    button.addEventListener('click',() => openProjectImage(figure.image, `${figure.title}. ${figure.figure}. Letícia Oliveira Santos.`));
    const caption = document.createElement('figcaption');
    caption.textContent = `${figure.title} / ${figure.figure}`;
    card.append(button,caption); urbanizationMaps.append(card);
  }
  mapImage.alt = item.title;
  document.querySelector('#map-label').textContent = item.figure || chapter.name;
  document.querySelector('#map-kicker').textContent = item.section || chapter.chapter;
  document.querySelector('#map-title').textContent = item.title;
  document.querySelector('#map-description').textContent = item.text;
  const source = document.querySelector('#map-source');
  source.replaceChildren();
  for (const page of item.pages || [item.page]) {
    const link = document.createElement('a');
    link.href = `docs/leticia-oliveira-tcc.pdf#page=${page}`;
    link.target = '_blank'; link.rel = 'noopener';
    link.textContent = `Monografia, p. ${page} / ${chapter.chapter}`;
    source.append(link);
  }
  document.querySelectorAll('[data-entry]').forEach(button => button.setAttribute('aria-pressed',String(Number(button.dataset.entry) === activeEntry)));
  mapViewer.reset();
}
function selectMap(key) {
  if (!Object.hasOwn(thesisContent.chapters,key)) return;
  activeChapter = key;
  const chapter = thesisContent.chapters[key];
  const extra = document.querySelector('#map-extra');
  if (key === 'atual') mapPanel.prepend(extra);
  else mapPanel.querySelector('.map-story').append(extra);
  extra.replaceChildren();
  if (chapter.items.length > 1) {
    const group = document.createElement('div');
    group.className = 'chapter-items'; group.setAttribute('role','group');
    group.setAttribute('aria-label',chapter.name);
    chapter.items.forEach((item,index) => {
      const button = document.createElement('button');
      button.type = 'button'; button.dataset.entry = index;
      button.textContent = item.title;
      button.addEventListener('click',() => showEntry(index));
      button.addEventListener('keydown',event => {
        let next;
        if (event.key === 'ArrowRight') next = (index+1)%chapter.items.length;
        if (event.key === 'ArrowLeft') next = (index-1+chapter.items.length)%chapter.items.length;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = chapter.items.length-1;
        if (next !== undefined) { event.preventDefault(); group.children[next].focus(); showEntry(next); }
      });
      group.append(button);
    });
    extra.append(group);
  }
  tabs.forEach(button => { const active = button.dataset.map === key; button.setAttribute('aria-selected',String(active));button.tabIndex = active ? 0 : -1; });
  document.querySelector('#map-select').value = key;
  document.querySelector('#map-panel').setAttribute('aria-labelledby',`tab-${key}`);
  showEntry(0);
}
tabs.forEach((button,index) => {
  button.addEventListener('click',() => selectMap(button.dataset.map));
  button.addEventListener('keydown',event => {
    let next;
    if (event.key === 'ArrowRight') next = (index+1)%tabs.length;
    if (event.key === 'ArrowLeft') next = (index-1+tabs.length)%tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length-1;
    if (next !== undefined) { event.preventDefault();tabs[next].focus();selectMap(tabs[next].dataset.map); }
  });
});
document.querySelector('#map-select').addEventListener('change',event => selectMap(event.target.value));

const projectDialog = document.querySelector('#project-dialog');
let projectZoom = 1;
const projectScroll = document.querySelector('.project-dialog-scroll');
projectDialog.querySelector('.dialog-header').insertAdjacentHTML('afterend',
  '<div class="project-dialog-tools" role="group" aria-label="Ampliação da imagem"><button id="project-zoom-out" aria-label="Reduzir imagem">−</button><output id="project-zoom-level" aria-live="polite">100%</output><button id="project-zoom-in" aria-label="Ampliar imagem">+</button><button id="project-zoom-reset" aria-label="Ajustar imagem à largura">⟲</button></div>');
function renderProjectZoom() {
  const image=document.querySelector('#project-dialog-image');
  image.style.width=(projectZoom*100)+'%';
  document.querySelector('#project-zoom-level').textContent=Math.round(projectZoom*100)+'%';
  document.querySelector('#project-zoom-in').disabled=projectZoom>=3;
  document.querySelector('#project-zoom-out').disabled=projectZoom<=1;
}
function openProjectImage(src, caption) {
  const image=document.querySelector('#project-dialog-image');
  image.src=src; image.alt=caption;
  document.querySelector('#project-dialog-caption').textContent=caption;
  projectZoom=1;renderProjectZoom();
  projectDialog.showModal();projectScroll.scrollTo(0,0);
}
document.querySelector('#project-zoom-in').addEventListener('click',()=>{projectZoom=Math.min(3,projectZoom+.5);renderProjectZoom();});
document.querySelector('#project-zoom-out').addEventListener('click',()=>{projectZoom=Math.max(1,projectZoom-.5);renderProjectZoom();});
document.querySelector('#project-zoom-reset').addEventListener('click',()=>{projectZoom=1;renderProjectZoom();projectScroll.scrollTo(0,0);});
document.querySelectorAll('[data-image]').forEach(button=>button.addEventListener('click',()=>openProjectImage(button.dataset.image,button.dataset.caption)));
document.querySelector('#close-project').addEventListener('click', () => projectDialog.close());
projectDialog.addEventListener('click', event => { if (event.target === projectDialog) { const rect = projectDialog.getBoundingClientRect(); if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) projectDialog.close(); } });
const navLinks = [...document.querySelectorAll('.header nav a')];
const navObserver = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { navLinks.forEach(link => { if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }); } }), {rootMargin:'-10% 0px -55% 0px'});
navLinks.forEach(link => { const target = document.querySelector(link.hash); if(target) navObserver.observe(target); });

selectMap('historico');
