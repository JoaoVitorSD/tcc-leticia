'use strict';

// All views are images extracted from the author's supplied documents.
// This gallery deliberately does not simulate unprovided 3D geometry.
(() => {
  const asset = name => `assets/project-2026/${name}.webp`;
  const areas = {
    a1: {
      name: 'A1 / Viaduto José Alencar',
      views: [
        ['passarela-aerea','Vista aérea','Travessia e permanência','A passarela associa a transposição da avenida a uma praça suspensa, áreas de descanso e percursos integrados à vegetação.',7],
        ['passarela-rua','Vista da avenida','Infraestrutura de mobilidade ativa','A estrutura da passarela permite observar a relação entre o percurso elevado e o sistema viário existente.',2],
        ['passarela-noite','Vista noturna','Iluminação ao longo do percurso','A perspectiva noturna evidencia os pórticos em madeira, os guarda-corpos e a iluminação proposta para orientar a circulação.',8],
        ['passarela-permanencia','Praça suspensa','Pausa e convivência na travessia','Bancos e jardineiras ocupam os alargamentos do percurso, articulando permanência e circulação.',2],
      ],
    },
    a2: {
      name: 'A2 / Rua Aimee Semple McPherson',
      views: [
        ['circuito-dia','Percurso diurno','Continuidade para caminhar e pedalar','O circuito articula a Avenida Presidente Antônio Carlos ao Parque do Brejinho, com percursos para pedestres e ciclistas e áreas verdes junto ao córrego.',3],
        ['circuito-noite','Percurso noturno','Uso do espaço para além do dia','A iluminação dos percursos e dos espaços de permanência integra a proposta de qualificação das áreas livres.',9],
        ['prancha-4','Praças e drenagem','Espaços permeáveis no entorno','Percursos elevados e jardins de chuva associam conexão, permanência e manejo de águas pluviais. Amplie a prancha para consultar os cortes e as premissas.',4],
      ],
    },
    a3: {
      name: 'A3 / Parque Ecológico do Brejinho',
      views: [
        ['parque-entardecer','Vista do parque','Aproximação e entrada no parque','A perspectiva apresenta um dos acessos propostos, relacionando a entrada aos percursos de caminhada e bicicleta.',10],
        ['acesso-c','Acesso C','Continuidade do percurso de entrada','O acesso C complementa as conexões propostas para aproximar o parque da vida cotidiana dos bairros do entorno.',6],
        ['prancha-6','Implantação e corte','Acessos e topografia','Consulte a localização dos acessos A, B e C e o corte D-D na prancha de desenvolvimento projetual.',6],
      ],
    },
  };
  const image = document.querySelector('#perspective-image');
  const stage = document.querySelector('.perspective-stage');
  const areaTabs = [...document.querySelectorAll('[data-area]')];
  const thumbs = document.querySelector('#perspective-thumbs');
  let area = 'a1', index = 0, request = 0;

  function current() { return areas[area].views[index]; }
  function caption() {
    const view=current();
    return `${view[2]}. ${areas[area].name}. Perspectiva ou desenho do estudo preliminar fornecido por Letícia Oliveira Santos. Pranchas de projeto, página ${view[4]}.`;
  }
  function selectView(next) {
    const views=areas[area].views;
    index=(next+views.length)%views.length;
    const view=current(),ticket=++request;
    stage.setAttribute('aria-busy','true');
    document.querySelector('#perspective-error').hidden=true;
    image.src=asset(view[0]); image.alt=`${view[2]}: ${view[3]}`;
    document.querySelector('#perspective-area').textContent=areas[area].name;
    document.querySelector('#perspective-title').textContent=view[2];
    document.querySelector('#perspective-description').textContent=view[3];
    document.querySelector('#perspective-position').textContent=`Vista ${index+1} de ${views.length}`;
    document.querySelector('#perspective-source').textContent=`Pranchas de projeto, página ${view[4]}. Imagem do estudo preliminar fornecido pela autora em 20/11/2026.`;
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

  const scenarios={
    move:['transporte-atual','O MOVE é mantido como eixo estruturador. O cenário de referência apresenta a configuração utilizada na comparação desenvolvida pela autora.','Figura 45 / Monografia, página 100. Diagrama ilustrativo; não representa uma solução executiva.'],
    vlt:['transporte-vlt','O estudo considera um VLT nas faixas laterais como complemento ao MOVE. A alternativa depende da avaliação de demanda, topografia, cruzamentos e implantação de infraestrutura ferroviária.','Figura 46 / Monografia, página 101. Cenário acadêmico com complementação por VLT.'],
    vlp:['transporte-vlp','O estudo considera um VLP nas faixas laterais como complemento ao MOVE. O desempenho depende da segregação, da pavimentação e da prioridade de circulação.','Figura 47 / Monografia, página 101. Cenário acadêmico com complementação por VLP.'],
  };
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
