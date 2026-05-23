const canvas= document.getElementById("canvas");
const ctx = canvas.getContext('2d');
const scorecard=document.getElementById("score");
let score=0;
const rows=5;
const cols=10;
const cwidth=canvas.clientWidth;
const cheight=canvas.clientHeight;
canvas.width = cwidth;
canvas.height = cheight;
const squaresize = Math.min(cwidth / cols, cheight / rows) * 0.75;
const padX = (cwidth - (cols * squaresize)) / 2;
const padY = (cheight - (rows * squaresize)) / 2;
const gapX = padX/(cols-1.25)+0.25*squaresize * 0.075;
const gapY = padY/(rows-1.25)+0.25*squaresize * 0.075;
const radius = squaresize * 0.075;
const dw = squaresize * 0.25;
const dh = 6;
let px=10;
let py=10;
const bullets = []; //[x,y,vx,vy,player bullet?,bounces]
const map = []; //[x, y, ex, ey, e, dpx, dpy, 100, 0,is he counted for scoring?]
let pause=0;
let gameover=0;
let phealth = 100;
const healthText = document.getElementById("healthcount");
let crn = -1; //hallway
// const squaresize = (cwidth/cols) * 0.7;//(cwidth-cheight)/(cols-rows);
// const padx=(cwidth - (squaresize * cols)) / (cols + 1); //Math.abs((cheight*cols-cwidth*rows)/((cols-rows)*(cols+1)))
// const pady=(cheight - (squaresize * rows)) / (rows + 1);

function start(){
    for(i=0;i<rows;i++){
        for(j=0;j<cols;j++){

            const x = 4*gapX + j * (squaresize+gapX);
            const y = 2*gapY + i * (squaresize+gapY);

            ctx.fillStyle = '#00ff00'; 
            ctx.fillRect(x, y, squaresize, squaresize);
            ctx.lineWidth = 3;
            ctx.strokeStyle = 'black';
            ctx.strokeRect(x, y, squaresize, squaresize);

            const e = Math.floor(Math.random() * 4); 
            ctx.fillStyle = '#f2ff00';
            let dpx;
            let dpy;                 
            if (e === 0) {
                dpx=x + squaresize/2 - dw/2;
                dpy= y;
                ctx.fillRect(x + squaresize/2 - dw/2, y, dw, dh);
            } // Top
            else if (e === 1) {
                dpx=x + squaresize - dh;
                dpy=y + squaresize/2 - dw/2;
                ctx.fillRect(x + squaresize - dh, y + squaresize/2 - dw/2, dh, dw);
            } // Right
            else if (e === 2) {
                dpx=x + squaresize/2 - dw/2;
                dpy= y + squaresize - dh;
                ctx.fillRect(x + squaresize/2 - dw/2, y + squaresize - dh, dw, dh);

            } // Bottom
            else {
                dpx=x;
                dpy= y + squaresize/2 - dw/2;
                ctx.fillRect(x, y + squaresize/2 - dw/2, dh, dw);
            } // Left

            const ex = x + (squaresize / 2) + (Math.random() * 20 - 10)+Math.random()*100 % 20;
            const ey = y + (squaresize / 2) + (Math.random() * 20 - 10)+Math.random()*100 % 20;
            


            ctx.beginPath();
            ctx.arc(ex, ey, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();

            map.push([x,y,ex,ey,e,dpx,dpy,100,0,0]);

        }
    }
}

start();
function chkrect(fx, fy, rx, ry, rw, rh) {

    if(fx + radius > rx && fx - radius < rx + rw && fy + radius > ry && fy - radius < ry + rh) return 1;
    else return 0;
}

function chkcoli(fx, fy) {
    const wt = dh;

    for (let i = 0; i < map.length; i++) {
        const x = map[i][0];
        const y = map[i][1];
        const e = map[i][4];
        const dpx = map[i][5];
        const dpy = map[i][6];

        // if (fx + radius < x || fx - radius > x + squaresize ||
        //     fy + radius < y || fy - radius > y + squaresize) {
        //     continue; 
        // }

        if (e === 0) {
            if (chkrect(fx, fy, x, y, dpx - x, wt)) return true;
            if (chkrect(fx, fy, dpx + dw, y, (x + squaresize) - (dpx + dw), wt)) return true;
        } else {
            if (chkrect(fx, fy, x, y, squaresize, wt)) return true;
        }

        if (e === 2) {
            if (chkrect(fx, fy, x, y + squaresize - wt, dpx - x, wt)) return true;
            if (chkrect(fx, fy, dpx + dw, y + squaresize - wt, (x + squaresize) - (dpx + dw), wt)) return true;
        } else {
            if (chkrect(fx, fy, x, y + squaresize - wt, squaresize, wt)) return true;
        }

        if (e === 3) {
            if (chkrect(fx, fy, x, y, wt, dpy - y)) return true;
            if (chkrect(fx, fy, x, dpy + dw, wt, (y + squaresize) - (dpy + dw))) return true;
        } else {
            if (chkrect(fx, fy, x, y, wt, squaresize)) return true;
        }

        if (e === 1) {
            if (chkrect(fx, fy, x + squaresize - wt, y, wt, dpy - y)) return true;
            if (chkrect(fx, fy, x + squaresize - wt, dpy + dw, wt, (y + squaresize) - (dpy + dw))) return true;
        } else {
            if (chkrect(fx, fy, x + squaresize - wt, y, wt, squaresize)) return true;
        }
    }
    
    return false;
}

// function chkcoli(fx, fy) {
//     for (let i = 0; i < map.length; i++) {
//         let roomx = map[i][0];
//         let roomy = map[i][1];

//         if (fx + radius > roomx && 
//             fx - radius < roomx + squaresize && 
//             fy + radius > roomy && 
//             fy - radius < roomy + squaresize) {
//             return true;
//         }
//     }
//     return false;
// }

function healthbar(cx, cy, currentHealth, maxHealth) {
    const barw = radius * 5;
    const barh = 5;
    const floatp = radius + 10;
    ctx.fillStyle = 'red';
    ctx.fillRect(cx - barw / 2, cy - floatp, barw, barh);
    const healthRatio = currentHealth<0?0:currentHealth / maxHealth;
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(cx - barw / 2, cy - floatp, barw * healthRatio, barh);
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.strokeRect(cx - barw / 2, cy - floatp, barw, barh);
}

let mouseX = cwidth / 2;
let mouseY = cheight / 2;

window.addEventListener('mousemove', function(event) {
    const rect = canvas.getBoundingClientRect();
    mouseX = event.clientX - rect.left;
    mouseY = event.clientY - rect.top;
});

function playermove(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let n = map.length;
    if (px < radius) px = radius;
    if (px > cwidth - radius) px = cwidth - radius;
    if (py < radius) py = radius;
    if (py > cheight - radius) py = cheight - radius;


    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //cookie cutter.
    ctx.save();
    const angle = Math.atan2(mouseY - py, mouseX - px);
    const fov = Math.PI / 3;
    ctx.beginPath();
    ctx.moveTo(px, py);
    ctx.arc(px, py, squaresize*1.2, angle - (fov / 2), angle + (fov / 2));
    ctx.lineTo(px, py);
    ctx.clip();
    //end
    ctx.fillStyle = '#ff00e1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for(i=0;i<n;i++){
        
        const x = map[i][0];
        const y = map[i][1];

        ctx.fillStyle = '#00ff00'; 
        ctx.fillRect(x, y, squaresize, squaresize);
        ctx.lineWidth = 3;
        ctx.strokeStyle = 'black';
        ctx.strokeRect(x, y, squaresize, squaresize);

        const e = map[i][4];
        ctx.fillStyle = '#f2ff00';
        let dpx;
        let dpy;                 
        if (e === 0) {
            dpx=x + squaresize/2 - dw/2;
            dpy= y;
            ctx.fillRect(x + squaresize/2 - dw/2, y, dw, dh);
        } //top
        else if (e === 1) {
            dpx=x + squaresize - dh;
            dpy=y + squaresize/2 - dw/2;
            ctx.fillRect(x + squaresize - dh, y + squaresize/2 - dw/2, dh, dw);
        } //right
        else if (e === 2) {
            dpx=x + squaresize/2 - dw/2;
            dpy= y + squaresize - dh;
            ctx.fillRect(x + squaresize/2 - dw/2, y + squaresize - dh, dw, dh);

        } //bottom
        else {
            dpx=x;
            dpy= y + squaresize/2 - dw/2;
            ctx.fillRect(x, y + squaresize/2 - dw/2, dh, dw);
        } //left

        const ex = map[i][2];
        const ey = map[i][3];
        ehealth = map[i][7];

        if (ehealth!==0){
            ctx.beginPath();
            ctx.arc(ex, ey, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#FF0000';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = 'black';
            ctx.stroke();
        }
        if (ehealth > 0) {
            healthbar(ex, ey, ehealth, 100);
        }
    }

    for (let i = 0; i < bullets.length; i++) {
        let b = bullets[i];
        ctx.beginPath();
        ctx.arc(b[0], b[1], 4, 0, Math.PI * 2);
        ctx.fillStyle = "#ffa200";
        ctx.fill();
        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        ctx.stroke();
    }

    ctx.beginPath();
    ctx.arc(px,py,radius,0,Math.PI*2);
    ctx.fillStyle = '#00fff7';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'black';
    ctx.stroke();
    healthbar(px, py, phealth, 100);
    if (healthText>=0) healthText.innerText = phealth;

    // if((px>5 || px<cwidth-5) && (py>5 || py<cheight-5)){
    //     ctx.beginPath();
    //     ctx.arc(px,py,radius,0,Math.PI*2);
    //     ctx.fillStyle = '#00fff7';
    //     ctx.fill();
    //     ctx.lineWidth = 2;
    //     ctx.strokeStyle = 'black';
    //     ctx.stroke();
    // }
    // else if(px<5) px++;
    // else if(px>cwidth-5) px--;
    // else if(py<5) py++;
    // else if(py>cheight-5) py--;
    ctx.restore();
    if (pause) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("PAUSED", canvas.width / 2, canvas.height / 2);
    }
        
    if(phealth<=0){
        gameover=1;
        new Audio("GAMEOVER.mp3").play();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.fillText("You Lost!", canvas.width / 2, canvas.height / 2+41);
        ctx.fillText("press R to restart!", canvas.width / 2, canvas.height / 2+82);
    }
    else if(score>=100){
        gameover=1;
        new Audio("GAMEWIN.mp3").play();
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)"; 
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "white";
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("GAME OVER", canvas.width / 2, canvas.height / 2);
        ctx.fillText(`You Win! : SCORE=${score}`, canvas.width / 2, canvas.height / 2+41);
        ctx.fillText("press R to restart!", canvas.width / 2, canvas.height / 2+82);
    }
}

playermove();

let time=0;
const timer = document.getElementById("timer");
setInterval(()=>{
    if(!pause && !gameover) time++;
    let m=Math.floor(time/60);
    let s=time - m*60;
    if(String(m).length==1 && String(s).length!=1) timer.innerText= `0${m}:${s}`;
    else if(String(m).length!=1 && String(s).length==1) timer.innerText= `${m}:0${s}`;
    else if(String(m).length==1 && String(s).length==1) timer.innerText= `0${m}:0${s}`;
    else if(String(m).length!=1 && String(s).length!=1) timer.innerText= `${m}:${s}`;

},1000);

const pspeed = 5;
const keys = {w: false,a: false,s: false,d: false};
window.addEventListener('keydown', function(event) {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = true;
    if(key.toLowerCase() === 'p'){
        pause = !pause;
    }
    if(key.toLowerCase()==='r'){
        gameover=0;
        pause=0;
        score=0;
        phealth=100;
        time=0;
        healthText.innerText='100';
        px=10;py=10;
        map.length=0;
        bullets.length=0;
        start();
    }
});
window.addEventListener('keyup', function(event) {
    const key = event.key.toLowerCase();
    if (keys.hasOwnProperty(key)) keys[key] = false;
});
window.addEventListener('mousedown', function(event) {
    if (pause || gameover) return;
    const angle = Math.atan2(mouseY - py, mouseX - px);
    const bSpeed = 3;
    bullets.push([px + Math.cos(angle) * radius,py + Math.sin(angle) * radius,Math.cos(angle) * bSpeed,Math.sin(angle) * bSpeed,true,0]);
    new Audio("playershot.mp3").play();
});
function gameLoop() {
    if(!pause && !gameover){
        let nextX = px;
        let nextY = py;

        if (keys.w) nextY -= pspeed;
        if (keys.s) nextY += pspeed;
        if (keys.a) nextX -= pspeed;
        if (keys.d) nextX += pspeed;

        if (nextX < radius) nextX = radius;
        if (nextX > cwidth - radius) nextX = cwidth - radius;
        if (nextY < radius) nextY = radius;
        if (nextY > cheight - radius) nextY = cheight - radius;

        if (!chkcoli(nextX, py)) {
            px = nextX; 
        } else {
            const dirX = Math.sign(nextX - px);
            while (!chkcoli(px + dirX, py)) {
                px += dirX;
            }
        }

        if (!chkcoli(px, nextY)) {
            py = nextY;
        } else {
            const dirY = Math.sign(nextY - py);
            while (!chkcoli(px, py + dirY)) {
                py += dirY;
            }
        }
    }

    if(!pause && !gameover){
        let frn = -1;
        for (i = 0; i < map.length; i++) {
            let roomX = map[i][0];
            let roomY = map[i][1];
        
            if (px > roomX && px < roomX + squaresize && py > roomY && py < roomY + squaresize) {
                frn = i;
                break;
            }
        }
        if (frn !== crn) {
            new Audio("transition.mp3").play();
            crn = frn; 
        }
    }
    
    if(!pause && !gameover){
        const currentTime = Date.now();
        for (i = 0; i < map.length; i++) {
            let roomX = map[i][0];
            let roomY = map[i][1];
            let enemyX = map[i][2];
            let enemyY = map[i][3];
            let enemyhealth = map[i][7];
            let lastShot = map[i][8];
            if (enemyhealth <= 0) continue;
            let pinrum = (px > roomX-10 && px < roomX + squaresize +10 && py > roomY-10 && py < roomY + squaresize+10);
            let dtop = Math.hypot(px - enemyX, py - enemyY);
            if (pinrum && dtop < squaresize * 2.5) {
                if (currentTime - lastShot > 1000) {
                    const angle = Math.atan2(py - enemyY, px - enemyX);
                    const bSpeed = 2.5;
                    new Audio("enemyshot.mp3").play();
                    bullets.push([enemyX + Math.cos(angle) * radius,enemyY + Math.sin(angle) * radius,Math.cos(angle) * bSpeed, Math.sin(angle) * bSpeed,false,0]);
                    map[i][8] = currentTime;
                }
            }
        }
        for (i = bullets.length - 1; i >= 0; i--) {
            let b = bullets[i];
            let hit = false;
            b[0] += b[2];
            if (chkcoli(b[0], b[1])) {
                b[0] -= b[2]; 
                b[2] *= -1;  
                b[5]++; 
            }

            b[1] += b[3];
            if (chkcoli(b[0], b[1])) {
                b[1] -= b[3]; 
                b[3] *= -1;  
                b[5]++; 
            }
            if (b[5] >= 5) {
                bullets.splice(i, 1);
                continue;
            }
            if (b[0] < 0 || b[0] > cwidth || b[1] < 0 || b[1] > cheight) {
                bullets.splice(i, 1);
                continue;
            }
            if (b[4]) {
                for (j = 0; j < map.length; j++) {
                    if (map[j][7] <= 0) continue;
                    
                    let dist = Math.hypot(b[0] - map[j][2], b[1] - map[j][3]);
                    if (dist < radius + 5) {
                        map[j][7] -= 5;
                        hit = true;
                        break;
                    }
                }
            } else {
                let dist = Math.sqrt((b[0] - px)*(b[0] - px)+(b[1] - py)*(b[1] - py));
                if (dist < radius + 5) {
                    phealth -= 5;
                    new Audio("damage.mp3").play();
                    if (healthText) healthText.innerText = phealth;
                    hit = true;
                }
            }

            if (hit) {
                bullets.splice(i, 1);
            }
        }
    }

    for(i=0;i<map.length;i++){
        if(map[i][9]==0){
            ehealth=map[i][7];
            if(ehealth<=0){
                score+=10;
                map[i][9]=1;
            }
        }
    }

    scorecard.innerText=score;

    playermove();

    requestAnimationFrame(gameLoop);
}

gameLoop();