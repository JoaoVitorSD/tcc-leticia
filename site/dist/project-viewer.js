'use strict';

// Standalone project images supplied by the author on 20 November 2026.
(() => {
  const asset = name => `assets/project-2026/${name}.webp`;
  const areas = {
    a1: {name:'A1 / Viaduto José Alencar', views:[
      ['galeria-a1-praca','Praça suspensa','Travessia da avenida: implantação de infraestrutura de mobilidade ativa',''],
      ['galeria-a1-travessia','Vista da avenida','Travessia da avenida: implantação de infraestrutura de mobilidade ativa',''],
      ['galeria-a1-rampa','Rampa de acesso','Travessia da avenida: implantação de infraestrutura de mobilidade ativa',''],
    ]},
    a2: {name:'A2 / Rua Aimee Semple McPherson', views:[
      ['galeria-a2-circuito','Circuito cicloviário','Ampliação e melhoria do circuito cicloviário local',''],
      ['galeria-a2-praca','Praça permeável','Implantação de praças permeáveis',''],
      ['galeria-a2-percurso-dia','Percurso diurno','Ampliação e melhoria do circuito cicloviário local',''],
      ['galeria-a2-percurso-noite','Percurso noturno','Ampliação e melhoria do circuito cicloviário local',''],
    ]},
    a3: {name:'A3 / Parque Ecológico do Brejinho', views:[
      ['galeria-a3-entrada','Entrada do parque','Melhorias do Parque Ecológico do Brejinho',''],
      ['galeria-a3-acesso-c','Acesso C','Melhorias do Parque Ecológico do Brejinho',''],
    ]},
  };
  const image = document.querySelector('#perspective-image');
  const stage = document.querySelector('.perspective-stage');
  const areaTabs = [...document.querySelectorAll('[data-area]')];
  const thumbs = document.querySelector('#perspective-thumbs');
  let area = 'a1', index = 0, request = 0;

  function current() { return areas[area].views[index]; }
  function caption() {
    const view=current();
    return `${view[2]}. ${areas[area].name}. ${view[1]}. Imagem do projeto fornecida por Letícia Oliveira Santos em 20/11/2026.`;
  }
  function selectView(next) {
    const views=areas[area].views;
    index=(next+views.length)%views.length;
    const view=current(),ticket=++request;
    stage.setAttribute('aria-busy','true');
    document.querySelector('#perspective-error').hidden=true;
    image.src=asset(view[0]); image.alt=`${view[2]}: ${view[1]}`;
    document.querySelector('#perspective-area').textContent=areas[area].name;
    document.querySelector('#perspective-title').textContent=view[2];
    document.querySelector('#perspective-description').textContent=view[3];
    document.querySelector('#perspective-position').textContent=`Vista ${index+1} de ${views.length}`;
    document.querySelector('#perspective-source').textContent='Imagem do projeto fornecida pela autora em 20/11/2026.';
    thumbs.querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-pressed',String(i===index)));
    image.decode().then(()=>{if(ticket===request)stage.setAttribute('aria-busy','false');}).catch(()=>{
      if(ticket!==request)return;
      stage.setAttribute('aria-busy','false');document.querySelector('#perspective-error').hidden=false;
    });
  }
  function selectArea(key) {
    area=key;
    areaTabs.forEach(b=>{const active=b.dataset.area===key;b.setAttribute('aria-selected',String(active));b.tabIndex=active?0:-1;});
    document.querySelector('#perspective-panel').setAttribute('aria-labelledby',`area-${key}`);
    thumbs.replaceChildren();
    areas[area].views.forEach((v,i)=>{
      const b=document.createElement('button');b.type='button';b.setAttribute('aria-label',`Ver ${v[1]}`);b.setAttribute('aria-pressed',String(i===0));
      const img=document.createElement('img');img.src=asset(v[0]+'-thumb');img.alt='';img.loading='lazy';
      const text=document.createElement('span');text.textContent=v[1];
      b.append(img,text);b.addEventListener('click',()=>selectView(i));thumbs.append(b);
    });
    selectView(0);
  }
  areaTabs.forEach((b,i)=>{
    b.addEventListener('click',()=>selectArea(b.dataset.area));
    b.addEventListener('keydown',e=>{
      const keys={ArrowRight:(i+1)%areaTabs.length,ArrowLeft:(i-1+areaTabs.length)%areaTabs.length,Home:0,End:areaTabs.length-1};
      if(!(e.key in keys))return;e.preventDefault();const next=areaTabs[keys[e.key]];next.focus();selectArea(next.dataset.area);
    });
  });
  document.querySelectorAll('[data-area-link]').forEach(a=>a.addEventListener('click',()=>selectArea(a.dataset.areaLink)));
  document.querySelector('#perspective-prev').addEventListener('click',()=>selectView(index-1));
  document.querySelector('#perspective-next').addEventListener('click',()=>selectView(index+1));
  document.querySelector('#perspective-expand').addEventListener('click',()=>openProjectImage(asset(current()[0]),caption()));
  selectArea('a1');

  document.querySelectorAll('.comparison-range').forEach(input=>{
    input.addEventListener('input',()=>{
      input.closest('.comparison-image').style.setProperty('--reveal',input.value+'%');
      input.setAttribute('aria-valuetext',`${input.value}% da proposta visível`);
    });
  });

  const scenarios=Object.fromEntries(thesisContent.scenarios.map(item => [item.id,[
    item.image,item.text,
    `Figura ${item.figure} / ${item.title}. Monografia, p. ${item.figurePage}.`,
  ]]));
  let scenario='move';
  document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{
    scenario=b.dataset.scenario;const data=scenarios[scenario];
    document.querySelectorAll('[data-scenario]').forEach(item=>item.setAttribute('aria-pressed',String(item===b)));
    const img=document.querySelector('#transit-image');img.src=asset(data[0]);img.alt=b.textContent.trim();
    document.querySelector('#scenario-description').textContent=data[1];
    document.querySelector('#transit-caption').textContent=data[2];
  }));
  document.querySelector('#transit-expand').addEventListener('click',()=>openProjectImage(asset(scenarios[scenario][0]),scenarios[scenario][2]));
})();
