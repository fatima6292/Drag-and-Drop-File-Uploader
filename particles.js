//Canvas Setup
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d"); //ctx drawing context hai — is se circles, lines draw hotay

let w = canvas.width = window.innerWidth;
let h = canvas.height = window.innerHeight;

// window Resize
window.addEventListener("resize", ()=>{
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
});

// Particle array 
const particles = [];
const particleCount = 120;

//create particle with random position aur speed:
for(let i=0;i<particleCount;i++){
  particles.push({
    x: Math.random()*w, // horizental position of partical 
    y: Math.random()*h, // vertical position of partical
    vx: (Math.random()-0.5)*0.5, //in x direction partical speed, direction(if xv -ve left/ if +ve then  right)
    vy: (Math.random()-0.5)*0.5, // in y direction partical speed,direction (if -ve up/ if +ve down)
    size: Math.random()*3 + 1, // size of partical
    color: `rgba(0,255,255,0.6)`
  });
}

//Mouse Interaction
const mouse = { x: null, y: null, radius: 100 };

// repel effect of particals on Mouse move 
window.addEventListener("mousemove", e=>{
  mouse.x = e.x;
  mouse.y = e.y;
});

// animation draw function
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
      const dx = mouse.x - p.x; // in x direction distance between mouse position and partical
      const dy = mouse.y - p.y; // in y direction distance between mouse position and partical
      const dist = Math.sqrt(dx*dx + dy*dy);// total distance (Pythagoras formula)

        // Repel particle 
      if(dist < mouse.radius){
        const angle = Math.atan2(dy, dx); //particle mouse se kis direction me hai
        const force = (mouse.radius - dist)/mouse.radius; // Mouse ke bilkul paas → strong push, Door → weak push
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
      //Lines Between Close Particles 
      // if particals distance < 120  --> draw line
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
