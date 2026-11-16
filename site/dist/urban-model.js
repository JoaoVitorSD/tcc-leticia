'use strict';

// Lightweight orthographic 3D renderer. The geometry is an explanatory study,
// not an imported or dimensionally accurate model of the author's project.
(() => {
  const canvas = document.querySelector('#urban-model');
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.outerHTML = '<p class="model-hint">A visualização 3D não está disponível neste navegador. Os cenários e as pranchas de projeto continuam disponíveis nesta página.</p>';
    return;
  }
  let yaw = -.62, pitch = .72, zoom = 1, scenario = 'move', bridge = true;
  let width = 1, height = 1, frame = 0, faces = [], drag = null;
  const descriptions = {
    move: 'O MOVE permanece como eixo estruturador do transporte coletivo. O diagnóstico aponta a necessidade de qualificar acessos e ampliar as alternativas de deslocamento.',
    vlt: 'O estudo avalia VLT nas faixas laterais como complemento ao MOVE. A implantação exige trilhos, alimentação elétrica e avaliação da topografia, dos cruzamentos e da demanda.',
    vlp: 'O estudo avalia VLP nas faixas laterais como complemento ao MOVE. O desempenho depende de segregação, prioridade nos cruzamentos, pavimentação e configuração dos veículos.'
  };
  function tint(hex, factor) {
    const n = parseInt(hex.slice(1), 16);
    return `rgb(${Math.min(255, Math.round((n >> 16) * factor))},${Math.min(255, Math.round(((n >> 8) & 255) * factor))},${Math.min(255, Math.round((n & 255) * factor))})`;
  }
  function face(points, color, outline = false) { faces.push({ points, color, outline }); }
  function box(x,y,z,w,h,d,color) {
    const a=[x-w/2,y,z-d/2],b=[x+w/2,y,z-d/2],c=[x+w/2,y,z+d/2],e=[x-w/2,y,z+d/2];
    const A=[a[0],y+h,a[2]],B=[b[0],y+h,b[2]],C=[c[0],y+h,c[2]],E=[e[0],y+h,e[2]];
    face([A,B,C,E],tint(color,1.05));
    face([a,b,B,A],tint(color,.83));face([b,c,C,B],tint(color,.72));
    face([c,e,E,C],tint(color,.76));face([e,a,A,E],tint(color,.92));
  }
  function strip(points,w,y,color) {
    for(let i=1;i<points.length;i++){
      const [x,z]=points[i-1],[X,Z]=points[i],len=Math.hypot(X-x,Z-z);
      const dx=-(Z-z)/len*w/2,dz=(X-x)/len*w/2;
      const yi=typeof y==='function'?y(i-1):y,Y=typeof y==='function'?y(i):y;
      face([[x+dx,yi,z+dz],[X+dx,Y,Z+dz],[X-dx,Y,Z-dz],[x-dx,yi,z-dz]],color);
      face([[x+dx,yi-.5,z+dz],[X+dx,Y-.5,Z+dz],[X+dx,Y,Z+dz],[x+dx,yi,z+dz]],tint(color,.76));
    }
  }
  function tree(x,z,size=1) {
    box(x,.4,z,.5,4*size,.5,'#9a9b85');
    // Faceted crown, with deterministic variation instead of random redraws.
    const cy=6*size, r=3*size, rings=5,sides=7;
    const point=(i,j)=>{
      const lat=-Math.PI/2+i/rings*Math.PI, lon=j/sides*Math.PI*2;
      return [x+Math.cos(lat)*Math.cos(lon)*r,cy+Math.sin(lat)*r*1.15,z+Math.cos(lat)*Math.sin(lon)*r];
    };
    for(let i=0;i<rings;i++)for(let j=0;j<sides;j++)
      face([point(i,j),point(i+1,j),point(i+1,j+1),point(i,j+1)],tint('#638b76',.8+.22*(j%3)/2+.12*i/rings));
  }
  function vehicle(x,z,color,length=6) {
    box(x,.3,z,2.25,1.25,length,color);
    box(x,.9,z-.2,2.05,1.3,length*.72,'#d7e1e2');
    box(x,1.3,z-.3,2.08,.65,length*.69,'#3a5765');
    box(x,2,z-.2,2.12,.2,length*.72,color);
  }
  function build() {
    faces=[];
    box(0,-2,0,88,2,152,'#b3c7c7');
    box(0,0,0,44,.18,144,'#a4b2b7');
    for(const x of [-25,25])box(x,.1,0,5,.3,144,'#d8d6ca');
    box(0,.2,0,1.3,.35,144,'#cbd1c8');
    // Central collective transport corridor, retained in all scenarios.
    for(const x of [-4,4])box(x,.2,0,5.5,.1,144,'#668e9f');
    for(const x of [-21,-16,-11,11,16,21])for(let z=-66;z<69;z+=8)
      box(x,.34,z,.12,.015,3.5,'#e6eeee');
    for(const x of [-7.5,7.5])box(x,.24,0,.4,.35,143,'#d7daca');
    // Context volumes are intentionally abstract and not cadastral footprints.
    for(let side of [-1,1])for(let i=0;i<5;i++){
      const z=-55+i*27, x=side*(35+(i%2)*2),h=6+(i%3)*4;
      box(x,.1,z,10,h,16,'#c6ced0');
      box(x,h+.1,z,8,.45,14,'#e4e9e7');
      for(let floor=3;floor<h;floor+=3)box(x-side*5.02,floor,z,.06,.75,12,'#a5b6bc');
    }
    vehicle(-4,-38,'#427b95',12);vehicle(4,30,'#427b95',12);
    for(const [x,z]of [[-13,42],[-18,-23],[13,-40],[18,49],[-18,12],[18,5]])vehicle(x,z,'#eff1ed');
    if(scenario!=='move'){
      for(const x of [-12.5,12.5]){
        box(x,.36,0,4.7,.05,142,scenario==='vlt'?'#bccdca':'#8eafb7');
        if(scenario==='vlt')for(const dx of [-.7,.7])box(x+dx,.44,0,.1,.06,142,'#65797c');
        vehicle(x,x<0?24:-26,scenario==='vlt'?'#39765f':'#2b718b',scenario==='vlt'?18:14);
      }
    }
    if(bridge){
      for(const x of [-29,29])for(let i=0;i<8;i++)tree(x,-63+i*18,.72+(i%3)*.12);
      // Raised crossing and curved approach ramps: illustrative only.
      const path=[];
      for(let i=0;i<=30;i++){
        const t=i/30;path.push([-26+52*t, Math.sin(t*Math.PI*2)*3]);
      }
      strip(path,5,10,'#d6bb89');
      for(const x of [-19,-6,7,20])box(x,.35,Math.sin((x+26)/52*Math.PI*2)*3,1,9.7,1,'#95a7aa');
      for(const side of [-1,1]){
        const ramp=[];
        for(let i=0;i<=24;i++){const t=i/24;ramp.push([side*(26+Math.sin(t*Math.PI)*6),side*(t*42)]);}
        strip(ramp,4,i=>10-i/24*9.6,'#d6bb89');
        for(const z of [-51,51])box(side*28,.45,z,6,.2,12,'#b3c7ab');
      }
      // Edge lines on the crossing, and planted landings.
      strip(path.map(([x,z])=>[x,z+2.45]),.18,11,'#71898c');
      strip(path.map(([x,z])=>[x,z-2.45]),.18,11,'#71898c');
      for(const x of [-31,31])for(const z of [-8,8])tree(x,z,.85);
    }
    requestDraw();
  }
  let cameraScale = 1, centerX = 0, centerY = 0;
  function rawProject(point){
    const [x,y,z]=point,c=Math.cos(yaw),s=Math.sin(yaw),rx=c*x-s*z,rz=s*x+c*z;
    return [rx,rz*Math.sin(pitch)-y*Math.cos(pitch),-rz*Math.cos(pitch)+y*Math.sin(pitch)];
  }
  function project(point){
    const p=rawProject(point);
    return [width/2+(p[0]-centerX)*cameraScale,height*.5+(p[1]-centerY)*cameraScale,p[2]];
  }
  function draw(){
    frame=0;
    ctx.clearRect(0,0,width,height);
    ctx.fillStyle='#dae5e7';ctx.fillRect(0,0,width,height);
    const bounds=faces.flatMap(f=>f.points.map(rawProject));
    const xs=bounds.map(p=>p[0]),ys=bounds.map(p=>p[1]);
    const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
    centerX=(minX+maxX)/2;centerY=(minY+maxY)/2;
    cameraScale=Math.min((width-70)/(maxX-minX),(height-120)/Math.max(25,maxY-minY))*zoom;
    // Ground guide, for spatial orientation rather than decorative animation.
    ctx.strokeStyle='#c8d8dc';ctx.lineWidth=.5;
    for(let i=-80;i<=80;i+=10){
      for(const ends of [[[i,-2,-85],[i,-2,85]],[[-65,-2,i],[65,-2,i]]]){
        const a=project(ends[0]),b=project(ends[1]);ctx.beginPath();ctx.moveTo(a[0],a[1]);ctx.lineTo(b[0],b[1]);ctx.stroke();
      }
    }
    const sorted=faces.map(f=>{const p=f.points.map(project);return {...f,p,depth:p.reduce((n,v)=>n+v[2],0)/p.length};}).sort((a,b)=>a.depth-b.depth);
    sorted.forEach(f=>{
      ctx.beginPath();f.p.forEach((p,i)=>i?ctx.lineTo(p[0],p[1]):ctx.moveTo(p[0],p[1]));ctx.closePath();ctx.fillStyle=f.color;ctx.fill();
      ctx.strokeStyle=f.color;ctx.lineWidth=.5;ctx.stroke();
    });
  }
  function requestDraw(){if(!frame)frame=requestAnimationFrame(draw);}
  const size=()=>{
    const rect=canvas.getBoundingClientRect(),dpr=Math.min(devicePixelRatio||1,2);
    width=rect.width;height=rect.height;canvas.width=Math.round(width*dpr);canvas.height=Math.round(height*dpr);ctx.setTransform(dpr,0,0,dpr,0,0);requestDraw();
  };
  new ResizeObserver(size).observe(canvas);
  const views={perspective:[-.62,.72],top:[0,Math.PI/2],section:[0,.1]};
  function selectView(key){[yaw,pitch]=views[key];zoom=1;document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.view===key)));requestDraw();}
  document.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>selectView(b.dataset.view)));
  document.querySelectorAll('[data-scenario]').forEach(b=>b.addEventListener('click',()=>{
    scenario=b.dataset.scenario;document.querySelectorAll('[data-scenario]').forEach(other=>other.setAttribute('aria-pressed',String(other===b)));
    document.querySelector('#scenario-description').textContent=descriptions[scenario];build();
  }));
  document.querySelector('#model-bridge').addEventListener('change',e=>{bridge=e.target.checked;build();});
  document.querySelector('#model-plus').addEventListener('click',()=>{zoom=Math.min(1.8,zoom+.15);requestDraw();});
  document.querySelector('#model-minus').addEventListener('click',()=>{zoom=Math.max(.55,zoom-.15);requestDraw();});
  document.querySelector('#model-reset').addEventListener('click',()=>selectView('perspective'));
  canvas.addEventListener('pointerdown',e=>{
    if(e.button>0)return;drag={id:e.pointerId,x:e.clientX,yaw};canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener('pointermove',e=>{
    if(!drag||drag.id!==e.pointerId)return;yaw=drag.yaw+(e.clientX-drag.x)*.008;
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));requestDraw();
  });
  for(const event of ['pointerup','pointercancel','lostpointercapture'])canvas.addEventListener(event,()=>{drag=null;});
  canvas.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','-','0'].includes(e.key))return;
    e.preventDefault();
    if(e.key==='0'){selectView('perspective');return;}
    if(e.key==='ArrowLeft')yaw-=.12;if(e.key==='ArrowRight')yaw+=.12;
    if(e.key==='ArrowUp')pitch=Math.min(Math.PI/2,pitch+.08);if(e.key==='ArrowDown')pitch=Math.max(.1,pitch-.08);
    if(e.key==='+')zoom=Math.min(1.8,zoom+.15);if(e.key==='-')zoom=Math.max(.55,zoom-.15);
    document.querySelectorAll('[data-view]').forEach(b=>b.setAttribute('aria-pressed','false'));requestDraw();
  });
  build();size();
})();
