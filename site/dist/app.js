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

const sectors = {
  pampulha: { name: 'Pampulha', title: 'Cultura, lazer e mobilidade.', description: 'A lagoa, o patrimônio, os equipamentos esportivos e a Estação Pampulha estruturam diferentes formas de chegar e permanecer. O setor articula a vida cotidiana com a paisagem e o lazer.', pages: '64–68', pdf: 64 },
  ufmg: { name: 'UFMG', title: 'Educação e conexões cotidianas.', description: 'O campus e os bairros do entorno concentram deslocamentos. Grandes glebas e bordas viárias desafiam a continuidade dos percursos a pé e a aproximação entre a universidade e a cidade.', pages: '69–71', pdf: 69 },
  cachoeirinha: { name: 'Cachoeirinha', title: 'Moradia, comércio e serviços.', description: 'O tecido residencial, os equipamentos e as identidades locais convivem com as marcas das transformações viárias. A qualificação dos espaços livres pode fortalecer as conexões e a vida do bairro.', pages: '72–75', pdf: 72 },
  lagoinha: { name: 'Lagoinha', title: 'Patrimônio e acesso ao Centro.', description: 'Moradia, saúde, cultura e comércio encontram as barreiras do complexo viário. A interrupção da prioridade do MOVE e as dificuldades de travessia evidenciam a necessidade de reconectar esse território.', pages: '76–81', pdf: 76 }
};
const maps = {
  implantacao: { image: 'assets/project-2026/mapa-fluxos.webp', label: 'FLUXOS E ÁREAS DE INTERVENÇÃO', kicker: 'CONEXÕES LOCAIS', title: 'Fluxos e áreas de intervenção', description: 'O mapa de fluxos relaciona a entrada da UFMG, o circuito cicloviário, as praças e o Parque Ecológico do Brejinho. As áreas A1, A2 e A3 orientam o detalhamento das intervenções.', alt: 'Mapa de fluxos de pedestres e ciclistas e áreas A1, A2 e A3 da intervenção', source: 'Figura 50 · p. 103 da monografia<br>Letícia Oliveira Santos · Google Earth, sobreposições autorais', extra: '' },
  setores: { image: 'assets/project-2026/mapa-setores.webp', label: 'QUATRO SETORES DE ANÁLISE', kicker: 'DIFERENTES FORMAS DE VIVER', title: 'Setores de análise', description: 'Pampulha, UFMG, Cachoeirinha e Lagoinha: a leitura por setores reconhece as diferenças de uso, paisagem e mobilidade ao longo da avenida. Selecione um território para conhecê-lo.', alt: 'Mapa dos quatro setores: Pampulha em azul, UFMG em vermelho, Cachoeirinha em verde e Lagoinha em amarelo.', source: 'Mapa 5 · p. 63 do trabalho<br>Letícia Oliveira Santos · BH Maps, 2026<br><a href="docs/leticia-oliveira-tcc.pdf#page=63" target="_blank" rel="noopener">Consultar no PDF ↗</a>', extra: 'sectors' },
  potenciais: { image: 'assets/project-2026/mapa-potencial.webp', label: 'ÁREAS COM POTENCIAL DE INTERVENÇÃO', kicker: 'OPORTUNIDADES NO COTIDIANO', title: 'Áreas com potencial de intervenção', description: 'Canteiros, taludes, baixios de viadutos e lotes vagos aparecem como oportunidades de qualificação. O mapa identifica áreas de interesse para intervenções futuras, aproximando natureza, convivência e percursos.', alt: 'Mapa autoral de áreas com potencial de intervenção, incluindo baixios de viaduto, canteiros, lotes vagos, taludes e praças.', source: 'Mapa 10 · p. 83 do trabalho<br>Letícia Oliveira Santos · BH Maps, 2026<br><a href="docs/leticia-oliveira-tcc.pdf#page=83" target="_blank" rel="noopener">Consultar no PDF ↗</a>', extra: 'potential' },
  ciclovias: { image: 'assets/project-2026/mapa-ciclovias.webp', label: 'REDE CICLOVIÁRIA EXISTENTE E PREVISTA', kicker: 'MOBILIDADE ATIVA', title: 'Rede cicloviária existente e prevista', description: 'O levantamento compara a rede existente com a rede prevista pelo Pedala BH. A pesquisa propõe conectar a Pampulha à região central e integrar o pedalar à melhoria dos passeios e ao transporte coletivo.', alt: 'Mapa da rede cicloviária existente e prevista pelo Pedala BH no entorno da Avenida Antônio Carlos.', source: 'Mapa 11 · p. 89 do trabalho<br>Letícia Oliveira Santos · BH Maps, 2026<br><a href="docs/leticia-oliveira-tcc.pdf#page=89" target="_blank" rel="noopener">Consultar no PDF ↗</a>', extra: 'cycling' },
  move: { image: 'assets/project-2026/mapa-move.webp', label: 'PROPOSTA DE EXPANSÃO DO CORREDOR MOVE', kicker: 'TRANSPORTE COLETIVO', title: 'Expansão do corredor MOVE', description: 'A proposta acadêmica sugere dar continuidade aos corredores exclusivos até o Centro, a região hospitalar e a Savassi. A prioridade ao transporte coletivo busca melhorar a integração e a previsibilidade dos percursos.', alt: 'Esquema da proposta acadêmica de expansão do corredor exclusivo MOVE para a área central, região hospitalar e Savassi.', source: 'Mapa 12 · p. 90 do trabalho<br>Letícia Oliveira Santos · BH Maps, 2026<br><a href="docs/leticia-oliveira-tcc.pdf#page=90" target="_blank" rel="noopener">Consultar no PDF ↗</a>', extra: 'move' }
};
const tabs = Array.from(document.querySelectorAll('[data-map]'));
function showSector(key) {
  const sector = sectors[key];
  document.querySelector('#map-kicker').textContent = `SETOR ${sector.name.toUpperCase()}`;
  document.querySelector('#map-title').textContent = sector.title;
  document.querySelector('#map-description').textContent = sector.description;
  document.querySelector('#map-source').innerHTML = `Mapa 5 · p. 63 / Leitura: pp. ${sector.pages}<br>Letícia Oliveira Santos · BH Maps, 2026<br><a href="docs/leticia-oliveira-tcc.pdf#page=${sector.pdf}" target="_blank" rel="noopener">Conhecer o setor no trabalho ↗</a>`;
  document.querySelectorAll('[data-sector-button]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.sectorButton === key)));
}
function selectMap(key) {
  const data = maps[key];
  mapImage.src = data.image;
  mapImage.alt = data.alt;
  document.querySelector('#map-label').textContent = data.label;
  document.querySelector('#map-kicker').textContent = data.kicker;
  document.querySelector('#map-title').textContent = data.title;
  document.querySelector('#map-description').textContent = data.description;
  document.querySelector('#map-source').innerHTML = data.source;
  const extra = document.querySelector('#map-extra');
  extra.replaceChildren();
  if (data.extra === 'sectors') {
    const group = document.createElement('div'); group.className = 'sector-buttons'; group.setAttribute('role', 'group'); group.setAttribute('aria-label', 'Conheça os setores');
    for (const [id, sector] of Object.entries(sectors)) {
      const button = document.createElement('button'); button.type = 'button'; button.dataset.sectorButton = id; button.setAttribute('aria-pressed', 'false');
      const dot = document.createElement('span'); dot.className = `sector-dot ${id}`; dot.setAttribute('aria-hidden', 'true');
      button.append(dot, document.createTextNode(sector.name)); button.addEventListener('click', () => showSector(id)); group.append(button);
    }
    extra.append(group);
  } else if (data.extra === 'potential') {
    extra.innerHTML = '<p class="map-annotation">Áreas identificadas para estudo e desenvolvimento projetual. Amplie o mapa para ler a legenda completa.</p>';
  } else if (data.extra === 'cycling') {
    extra.innerHTML = '<p class="map-annotation">A rede prevista no mapa se refere ao Pedala BH; sua indicação não significa que esteja implantada.</p>';
  } else if (data.extra === 'move') {
    extra.innerHTML = '<p class="map-annotation">Esquema propositivo elaborado na pesquisa. Não representa uma expansão já executada.</p>';
  }
  tabs.forEach(button => { const active = button.dataset.map === key; button.setAttribute('aria-selected', String(active)); button.tabIndex = active ? 0 : -1; });
  document.querySelector('#map-select').value = key;
  document.querySelector('#map-panel').setAttribute('aria-labelledby', `tab-${key}`);
  mapViewer.reset();
}
tabs.forEach((button, index) => {
  button.addEventListener('click', () => selectMap(button.dataset.map));
  button.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); tabs[next].focus(); selectMap(tabs[next].dataset.map); }
  });
});
document.querySelector('#map-select').addEventListener('change', event => selectMap(event.target.value));
document.querySelectorAll('[data-sector]').forEach(link => link.addEventListener('click', () => { selectMap('setores'); showSector(link.dataset.sector); }));

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

selectMap('setores');
