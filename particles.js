const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

window.addEventListener("resize", ()=>{
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// Particle settings
const particles = [];
const particleCount = 120;

for(let i=0;i<particleCount;i++){
  particles.push({
    x: Math.random()*w,
    y: Math.random()*h,
    vx: (Math.random()-0.5)*0.5,
    vy: (Math.random()-0.5)*0.5,
    size: Math.random()*3 + 1,
    color: `rgba(0,255,255,0.6)`
  });
}

const mouse = { x: null, y: null, radius: 100 };

// Mouse move
window.addEventListener("mousemove", e=>{
  mouse.x = e.x;
  mouse.y = e.y;
});

function draw(){
  ctx.clearRect(0,0,w,h);
  for(let i=0;i<particles.length;i++){
    let p = particles[i];

    // Move particle
    p.x += p.vx;
    p.y += p.vy;

    // Bounce off edges
    if(p.x<0 || p.x>w) p.vx*=-1;
    if(p.y<0 || p.y>h) p.vy*=-1;

    // Interaction with mouse
    if(mouse.x && mouse.y){
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist < mouse.radius){
        // Repel particle
        const angle = Math.atan2(dy, dx);
        const force = (mouse.radius - dist)/mouse.radius;
        p.vx -= Math.cos(angle)*force*0.5;
        p.vy -= Math.sin(angle)*force*0.5;
      }
    }

    // Draw particle
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.size,0,Math.PI*2);
    ctx.fillStyle = p.color;
    ctx.fill();
  }

  // Connect close particles
  for(let i=0;i<particles.length;i++){
    for(let j=i+1;j<particles.length;j++){
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx*dx + dy*dy);
      if(dist<120){
        ctx.beginPath();
        ctx.strokeStyle = `rgba(0,255,255,${1-dist/120})`;
        ctx.lineWidth=1;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

draw();
