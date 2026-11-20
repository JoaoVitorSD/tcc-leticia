'use strict';

(() => {
  const thumbs = [...document.querySelectorAll('[data-board]')];
  const image = document.querySelector('#board-image');
  const stage = document.querySelector('.board-stage');
  let selected = 0, request = 0;
  function caption() {
    return `Prancha ${selected + 1} de ${thumbs.length} / ${thumbs[selected].querySelector('span').textContent.slice(5)}`;
  }
  function selectBoard(index) {
    selected = (index + thumbs.length) % thumbs.length;
    const currentRequest = ++request;
    const src = `assets/project-2026/prancha-${selected + 1}.webp`;
    const title = caption();
    stage.setAttribute('aria-busy','true');
    image.src = src; image.alt = title;
    image.decode().catch(() => {}).finally(() => {
      if (currentRequest === request) stage.setAttribute('aria-busy','false');
    });
    document.querySelector('#board-caption').textContent = title;
    thumbs.forEach((button,i) => button.setAttribute('aria-pressed',String(i === selected)));
  }
  thumbs.forEach((button,index) => {
    button.addEventListener('click',() => selectBoard(index));
    button.addEventListener('keydown',event => {
      let next;
      if (event.key === 'ArrowRight') next = (index+1)%thumbs.length;
      if (event.key === 'ArrowLeft') next = (index-1+thumbs.length)%thumbs.length;
      if (event.key === 'Home') next = 0;
      if (event.key === 'End') next = thumbs.length-1;
      if (next !== undefined) { event.preventDefault();thumbs[next].focus();selectBoard(next); }
    });
  });
  document.querySelector('#board-prev').addEventListener('click',() => selectBoard(selected-1));
  document.querySelector('#board-next').addEventListener('click',() => selectBoard(selected+1));
  for (const id of ['board-expand','board-open']) document.getElementById(id).addEventListener('click',() => openProjectImage(image.src,caption()));
})();
