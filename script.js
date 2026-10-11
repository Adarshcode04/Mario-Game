/**
 * Super Mario Runner - Enhanced Game Engine
 * Features:
 * - Full physics with momentum, variable height jumping & gravity
 * - Multi-platform standing (jump & stand on pipes and mystery blocks)
 * - Goomba stomp mechanics with squash animation & bounce boost
 * - Mystery '?' blocks: bump from below to pop spinning coins
 * - Floating air coins with sparkle particle explosions
 * - Piranha plants peeking from pipes
 * - Procedural dynamic obstacle spawning & difficulty curve
 * - Web Audio API synthesized 8-bit sound effects (jump, coin, stomp, hurt, game over, fanfare)
 * - Parallax animated clouds, scenery, and scrolling ground texture
 * - HUD with lives, real-time score, coin counter & persistent high score
 * - Start screen, pause menu, game over screen & mobile touch controls
 */

// ==========================================
// 1. SOUND SYSTEM (Web Audio API)
// ==========================================
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('mario_runner_muted') === 'true';
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('mario_runner_muted', this.muted);
    return this.muted;
  }

  playJump() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(560, now + 0.16);
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.16);
    } catch (e) {
      console.warn(e);
    }
  }

  playCoin() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      // Classic B5 -> E6 chime
      osc.frequency.setValueAtTime(988, now);
      osc.frequency.setValueAtTime(1319, now + 0.08);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn(e);
    }
  }

  playStomp() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.14);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch (e) {
      console.warn(e);
    }
  }

  playBlockHit() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.setValueAtTime(110, now + 0.06);
      gain.gain.setValueAtTime(0.22, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn(e);
    }
  }

  playHurt() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(190, now);
      osc.frequency.linearRampToValueAtTime(65, now + 0.22);
      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.22);
    } catch (e) {
      console.warn(e);
    }
  }

  playGameOver() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [494, 440, 392, 330]; // B4, A4, G4, E4
      const offsets = [0, 0.16, 0.32, 0.52];
      const durations = [0.14, 0.14, 0.14, 0.45];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + offsets[idx];
        const dur = durations[idx];
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.2, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + dur);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    } catch (e) {
      console.warn(e);
    }
  }

  playNewRecord() {
    if (this.muted || !this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const notes = [261.6, 329.6, 392, 523.25]; // C4, E4, G4, C5
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = now + idx * 0.12;
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.26, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.24);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(start);
        osc.stop(start + 0.24);
      });
    } catch (e) {
      console.warn(e);
    }
  }
}

// ==========================================
// 2. PARALLAX SCENERY MANAGER
// ==========================================
class SceneryManager {
  constructor(skyContainer, hillsContainer, platformEl) {
    this.skyContainer = skyContainer;
    this.hillsContainer = hillsContainer;
    this.platformEl = platformEl;
    this.clouds = [];
    this.groundOffset = 0;

    this.initClouds();
    this.initHills();
  }

  initClouds() {
    this.skyContainer.innerHTML = '';
    const cloudCount = 6;
    for (let i = 0; i < cloudCount; i++) {
      const cloud = document.createElement('div');
      cloud.className = 'cloud';
      const width = Math.floor(70 + Math.random() * 80);
      const height = Math.floor(width * 0.5);
      cloud.style.width = width + 'px';
      cloud.style.height = height + 'px';

      const img = document.createElement('img');
      img.src = 'assets/cloud.svg';
      img.style.width = '100%';
      img.style.height = '100%';
      cloud.appendChild(img);

      const x = Math.random() * window.innerWidth;
      const y = Math.floor(30 + Math.random() * 180);
      const speed = 0.3 + Math.random() * 0.5;

      cloud.style.left = x + 'px';
      cloud.style.top = y + 'px';

      this.skyContainer.appendChild(cloud);
      this.clouds.push({ el: cloud, x, y, speed, width });
    }
  }

  initHills() {
    this.hillsContainer.innerHTML = '';
    const screenW = window.innerWidth;
    const count = Math.ceil(screenW / 240) + 2;
    for (let i = 0; i < count; i++) {
      const bush = document.createElement('div');
      bush.className = 'scenery-item';
      const width = 110 + Math.random() * 60;
      bush.style.width = width + 'px';
      bush.style.height = width * 0.45 + 'px';
      bush.style.left = i * 230 + Math.random() * 60 + 'px';

      const img = document.createElement('img');
      img.src = 'assets/bush.svg';
      img.style.width = '100%';
      img.style.height = '100%';
      bush.appendChild(img);

      this.hillsContainer.appendChild(bush);
    }
  }

  update(gameSpeed, isRunning) {
    // Drifting clouds
    const w = window.innerWidth;
    this.clouds.forEach(c => {
      c.x -= c.speed + (isRunning ? gameSpeed * 0.08 : 0);
      if (c.x < -c.width) {
        c.x = w + Math.random() * 100;
        c.y = Math.floor(30 + Math.random() * 180);
      }
      c.el.style.left = c.x + 'px';
    });

    // Scrolling ground
    if (isRunning) {
      this.groundOffset = (this.groundOffset + gameSpeed) % 285;
      this.platformEl.style.backgroundPosition = `-${this.groundOffset}px 0`;
    }
  }
}

// ==========================================
// 3. PARTICLE & VISUAL FX
// ==========================================
class FXManager {
  constructor(container) {
    this.container = container;
  }

  spawnDust(x, y) {
    const dust = document.createElement('div');
    dust.className = 'particle dust-particle';
    const size = 10 + Math.random() * 10;
    dust.style.width = size + 'px';
    dust.style.height = size + 'px';
    dust.style.left = x + (Math.random() * 14 - 7) + 'px';
    dust.style.bottom = 95 + y + (Math.random() * 6) + 'px';
    this.container.appendChild(dust);
    setTimeout(() => dust.remove(), 400);
  }

  spawnSparkles(x, y, count = 6) {
    for (let i = 0; i < count; i++) {
      const sp = document.createElement('div');
      sp.className = 'particle sparkle-particle';
      const size = 6 + Math.random() * 6;
      sp.style.width = size + 'px';
      sp.style.height = size + 'px';
      sp.style.left = x + 'px';
      sp.style.bottom = 95 + y + 'px';

      const angle = (Math.PI * 2 * i) / count;
      const dist = 25 + Math.random() * 20;
      sp.style.setProperty('--dx', `${Math.cos(angle) * dist}px`);
      sp.style.setProperty('--dy', `${Math.sin(angle) * dist}px`);

      this.container.appendChild(sp);
      setTimeout(() => sp.remove(), 500);
    }
  }

  showScorePopup(x, y, text) {
    const popup = document.createElement('div');
    popup.className = 'score-popup';
    popup.textContent = text;
    popup.style.left = x + 'px';
    popup.style.bottom = 95 + y + 'px';
    this.container.appendChild(popup);
    setTimeout(() => popup.remove(), 800);
  }

  triggerScreenShake() {
    this.container.classList.remove('screen-shake');
    void this.container.offsetWidth; // trigger reflow
    this.container.classList.add('screen-shake');
    setTimeout(() => {
      this.container.classList.remove('screen-shake');
    }, 350);
  }
}

// ==========================================
// 4. MARIO PLAYER
// ==========================================
class Player {
  constructor(element, fx, sound) {
    this.el = element;
    this.img = element.querySelector('img');
    this.fx = fx;
    this.sound = sound;

    this.width = 78;
    this.height = 96;

    // Movement & Physics
    this.x = 80;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.facingLeft = false;

    this.accel = 1.1;
    this.friction = 0.82;
    this.maxSpeed = 8.2;
    this.gravity = 0.86;
    this.jumpForce = 16.8;

    this.isGrounded = true;
    this.jumpHoldTimer = 0;
    this.currentPlatform = null;

    // Health & Status
    this.maxLives = 3;
    this.lives = 3;
    this.invulnerableTimer = 0;
    this.isDead = false;

    this.dustTimer = 0;
  }

  reset() {
    this.x = 80;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
    this.facingLeft = false;
    this.isGrounded = true;
    this.currentPlatform = null;
    this.lives = this.maxLives;
    this.invulnerableTimer = 0;
    this.isDead = false;
    this.jumpHoldTimer = 0;

    this.el.classList.remove('invulnerable', 'dead', 'flipped', 'running', 'jumping');
    this.updateRender();
  }

  jump() {
    if (this.isDead) return;
    if (this.isGrounded || this.currentPlatform) {
      this.vy = this.jumpForce;
      this.isGrounded = false;
      this.currentPlatform = null;
      this.jumpHoldTimer = 9; // allow holding jump for higher boost
      this.sound.playJump();
      this.fx.spawnDust(this.x + 30, this.y);
    }
  }

  takeDamage() {
    if (this.invulnerableTimer > 0 || this.isDead) return false;

    this.lives--;
    this.sound.playHurt();
    this.fx.triggerScreenShake();

    if (this.lives <= 0) {
      this.isDead = true;
      this.el.classList.add('dead');
      this.sound.playGameOver();
      return true; // Fatal damage
    }

    // Invulnerability frames
    this.invulnerableTimer = 110; // ~1.8 seconds at 60fps
    this.el.classList.add('invulnerable');
    return false;
  }

  getHitbox() {
    // Inset hitbox for forgiving, fair collision
    return {
      left: this.x + 14,
      right: this.x + this.width - 14,
      bottom: this.y,
      top: this.y + this.height - 8
    };
  }

  update(keys, platforms, boundsWidth) {
    if (this.isDead) return;

    // 1. Horizontal Input & Acceleration
    if (keys.left) {
      this.vx -= this.accel;
      this.facingLeft = true;
    } else if (keys.right) {
      this.vx += this.accel;
      this.facingLeft = false;
    } else {
      this.vx *= this.friction;
      if (Math.abs(this.vx) < 0.1) this.vx = 0;
    }

    // Speed clamping
    this.vx = Math.max(-this.maxSpeed, Math.min(this.maxSpeed, this.vx));
    this.x += this.vx;

    // Boundaries
    const minX = 10;
    const maxX = boundsWidth - this.width - 15;
    if (this.x < minX) {
      this.x = minX;
      this.vx = 0;
    } else if (this.x > maxX) {
      this.x = maxX;
      this.vx = 0;
    }

    // 2. Vertical Jump Hold Boost
    if (keys.jump && this.jumpHoldTimer > 0) {
      this.vy += 0.5;
      this.jumpHoldTimer--;
    } else {
      this.jumpHoldTimer = 0;
    }

    // 3. Gravity & Vertical Movement
    this.vy -= this.gravity;
    this.y += this.vy;

    // 4. Platform Landing & Ground Check
    const prevPlatform = this.currentPlatform;
    const wasGrounded = this.isGrounded;
    this.currentPlatform = null;
    let groundHeight = 0;

    // Check if Mario is over any platform/pipe
    const hb = this.getHitbox();

    for (const plat of platforms) {
      if (hb.right > plat.x + 8 && hb.left < plat.x + plat.width - 8) {
        // Falling onto the platform top
        if (this.vy <= 0 && this.y >= plat.height - 18 && this.y <= plat.height + 15) {
          groundHeight = Math.max(groundHeight, plat.height);
          this.currentPlatform = plat;
        }
      }
    }

    if (this.y <= groundHeight) {
      this.y = groundHeight;
      this.vy = 0;
      this.isGrounded = true;

      // Dust effect on landing
      if (!wasGrounded) {
        this.fx.spawnDust(this.x + 30, this.y);
      }
    } else {
      this.isGrounded = false;
    }

    // Dust effect while running
    if (this.isGrounded && Math.abs(this.vx) > 2) {
      this.dustTimer++;
      if (this.dustTimer % 8 === 0) {
        this.fx.spawnDust(this.facingLeft ? this.x + 55 : this.x + 10, this.y);
      }
    }

    // Invulnerability timer countdown
    if (this.invulnerableTimer > 0) {
      this.invulnerableTimer--;
      if (this.invulnerableTimer === 0) {
        this.el.classList.remove('invulnerable');
      }
    }

    this.updateRender();
  }

  updateRender() {
    this.el.style.transform = `translate3d(${this.x}px, ${-this.y}px, 0)`;

    if (this.facingLeft) {
      this.el.classList.add('flipped');
    } else {
      this.el.classList.remove('flipped');
    }

    if (this.isGrounded) {
      this.el.classList.remove('jumping');
      if (Math.abs(this.vx) > 0.8) {
        this.el.classList.add('running');
      } else {
        this.el.classList.remove('running');
      }
    } else {
      this.el.classList.remove('running');
      this.el.classList.add('jumping');
    }
  }
}

// ==========================================
// 5. OBSTACLE & ENTITY MANAGER
// ==========================================
class EntityManager {
  constructor(container, fx, sound) {
    this.container = container;
    this.fx = fx;
    this.sound = sound;

    this.pipes = [];
    this.goombas = [];
    this.blocks = [];
    this.coins = [];

    this.spawnTimer = 0;
    this.spawnInterval = 110; // frames
  }

  reset() {
    this.pipes.forEach(p => p.el.remove());
    this.goombas.forEach(g => g.el.remove());
    this.blocks.forEach(b => b.el.remove());
    this.coins.forEach(c => c.el.remove());

    this.pipes = [];
    this.goombas = [];
    this.blocks = [];
    this.coins = [];
    this.spawnTimer = 40;
  }

  getSolidPlatforms() {
    // Collect all surfaces Mario can land on
    const platforms = [];
    this.pipes.forEach(p => {
      platforms.push({ x: p.x, width: p.width, height: p.height });
    });
    this.blocks.forEach(b => {
      platforms.push({ x: b.x, width: b.width, height: b.y + b.height });
    });
    return platforms;
  }

  spawnPattern(gameSpeed, containerWidth) {
    const spawnX = containerWidth + 60;
    const patternType = Math.floor(Math.random() * 5);

    if (patternType === 0) {
      // Single Pipe (variable height)
      this.createPipe(spawnX);
    } else if (patternType === 1) {
      // Pipe with Goomba in front
      this.createGoomba(spawnX);
      this.createPipe(spawnX + 160);
    } else if (patternType === 2) {
      // Mystery Block with coin trail
      const blockX = spawnX + 80;
      this.createBlock(blockX, 160);
      this.createCoin(blockX - 50, 60);
      this.createCoin(blockX + 80, 60);
    } else if (patternType === 3) {
      // Pipe with Piranha plant & arc of coins
      this.createPipe(spawnX, true);
      this.createCoin(spawnX - 40, 110);
      this.createCoin(spawnX + 45, 175);
      this.createCoin(spawnX + 130, 110);
    } else {
      // Goomba pair or Goomba + Mystery block
      this.createGoomba(spawnX);
      this.createBlock(spawnX + 110, 155);
      this.createCoin(spawnX + 110, 220);
    }
  }

  createPipe(x, hasPiranha = false) {
    const pipe = document.createElement('div');
    pipe.className = 'obstacle-pipe';

    const width = 96;
    const height = Math.floor(105 + Math.random() * 45); // 105 - 150px
    pipe.style.width = width + 'px';
    pipe.style.height = height + 'px';

    const img = document.createElement('img');
    img.src = '23.png';
    pipe.appendChild(img);

    let piranhaObj = null;
    if (hasPiranha) {
      const piranha = document.createElement('div');
      piranha.className = 'piranha-plant';
      piranha.style.width = '64px';
      piranha.style.height = '85px';
      piranha.style.left = '16px';
      piranha.style.bottom = `${height - 18}px`;

      const pImg = document.createElement('img');
      pImg.src = 'assets/piranha.svg';
      piranha.appendChild(pImg);
      pipe.appendChild(piranha);

      piranhaObj = { el: piranha, timer: 0, extended: true };
    }

    this.container.appendChild(pipe);
    this.pipes.push({
      el: pipe,
      x,
      y: 0,
      width,
      height,
      piranha: piranhaObj,
      passed: false
    });
  }

  createGoomba(x) {
    const goomba = document.createElement('div');
    goomba.className = 'goomba-entity';
    const img = document.createElement('img');
    img.src = 'assets/goomba.svg';
    goomba.appendChild(img);

    this.container.appendChild(goomba);
    this.goombas.push({
      el: goomba,
      x,
      y: 0,
      width: 48,
      height: 48,
      speed: 1.6,
      squashed: false,
      deadTimer: 0
    });
  }

  createBlock(x, y) {
    const block = document.createElement('div');
    block.className = 'game-block';
    block.style.bottom = 95 + y + 'px';

    const img = document.createElement('img');
    img.src = 'assets/question-block.svg';
    block.appendChild(img);

    this.container.appendChild(block);
    this.blocks.push({
      el: block,
      img,
      x,
      y,
      width: 48,
      height: 48,
      hit: false
    });
  }

  createCoin(x, y) {
    const coin = document.createElement('div');
    coin.className = 'coin-entity';
    coin.style.bottom = 95 + y + 'px';

    const img = document.createElement('img');
    img.src = 'assets/coin.svg';
    coin.appendChild(img);

    this.container.appendChild(coin);
    this.coins.push({
      el: coin,
      x,
      y,
      width: 32,
      height: 32,
      collected: false
    });
  }

  update(gameSpeed, player, containerWidth, onScoreAdd, onCoinAdd) {
    // 1. Spawning logic
    this.spawnTimer--;
    if (this.spawnTimer <= 0) {
      this.spawnPattern(gameSpeed, containerWidth);
      // Interval tightens slightly as game speed increases
      this.spawnInterval = Math.max(75, 120 - Math.floor(gameSpeed * 4));
      this.spawnTimer = this.spawnInterval;
    }

    const hb = player.getHitbox();

    // 2. Pipes Update & Collision
    for (let i = this.pipes.length - 1; i >= 0; i--) {
      const p = this.pipes[i];
      p.x -= gameSpeed;
      p.el.style.left = p.x + 'px';

      // Piranha plant animation cycle
      if (p.piranha) {
        p.piranha.timer++;
        const cycle = p.piranha.timer % 160;
        if (cycle < 80) {
          p.piranha.extended = true;
          p.piranha.el.style.transform = 'translateY(0)';
        } else {
          p.piranha.extended = false;
          p.piranha.el.style.transform = 'translateY(65px)';
        }

        // Piranha collision if extended
        if (p.piranha.extended) {
          const plantLeft = p.x + 18;
          const plantRight = p.x + 78;
          const plantTop = p.height + 70;
          const plantBottom = p.height - 10;

          if (
            hb.right > plantLeft &&
            hb.left < plantRight &&
            hb.bottom < plantTop &&
            hb.top > plantBottom
          ) {
            player.takeDamage();
          }
        }
      }

      // Check pipe side collision
      // Inset pipe hitbox slightly
      const pipeLeft = p.x + 8;
      const pipeRight = p.x + p.width - 8;
      const pipeTop = p.height;

      // Score for leaping over pipe
      if (!p.passed && p.x + p.width < player.x) {
        p.passed = true;
        onScoreAdd(50);
      }

      if (hb.right > pipeLeft && hb.left < pipeRight) {
        // If Mario is lower than pipe surface, side collision!
        if (hb.bottom < pipeTop - 12 && hb.top > 4) {
          player.takeDamage();
          if (player.x + player.width / 2 < p.x + p.width / 2) {
            player.x = pipeLeft - player.width + 12;
            player.vx = -2;
          }
        }
      }

      // Despawn off-screen
      if (p.x < -180) {
        p.el.remove();
        this.pipes.splice(i, 1);
      }
    }

    // 3. Goombas Update & Stomp Logic
    for (let i = this.goombas.length - 1; i >= 0; i--) {
      const g = this.goombas[i];

      if (g.squashed) {
        g.deadTimer++;
        if (g.deadTimer > 25) {
          g.el.remove();
          this.goombas.splice(i, 1);
        }
        continue;
      }

      g.x -= gameSpeed + g.speed;
      g.el.style.left = g.x + 'px';

      const gLeft = g.x + 6;
      const gRight = g.x + g.width - 6;
      const gTop = g.height;

      if (hb.right > gLeft && hb.left < gRight && hb.bottom < gTop && hb.top > 0) {
        // Stomp condition: Mario falling down and feet hit upper half of Goomba
        if (player.vy < 0 && hb.bottom >= gTop * 0.45) {
          // Stomped!
          g.squashed = true;
          g.el.classList.add('squashed');
          player.vy = 12.5; // Bounce boost!
          this.sound.playStomp();
          this.fx.spawnSparkles(g.x + 24, 20, 8);
          this.fx.showScorePopup(g.x + 10, 35, '+200');
          onScoreAdd(200);
        } else {
          // Player hit by Goomba
          player.takeDamage();
        }
      }

      // Despawn off-screen
      if (g.x < -120) {
        g.el.remove();
        this.goombas.splice(i, 1);
      }
    }

    // 4. Mystery Blocks Update & Head Bump
    for (let i = this.blocks.length - 1; i >= 0; i--) {
      const b = this.blocks[i];
      b.x -= gameSpeed;
      b.el.style.left = b.x + 'px';

      // Check head bump from below
      if (
        !b.hit &&
        player.vy > 0 &&
        hb.right > b.x + 6 &&
        hb.left < b.x + b.width - 6 &&
        hb.top >= b.y - 12 &&
        hb.top <= b.y + 18
      ) {
        // Hit block!
        b.hit = true;
        b.img.src = 'assets/empty-block.svg';
        b.el.classList.add('bumped');
        setTimeout(() => b.el.classList.remove('bumped'), 130);

        player.vy = -1.5; // push Mario down
        this.sound.playBlockHit();
        this.sound.playCoin();

        // Pop out coin animation
        this.spawnPoppingCoin(b.x + 8, b.y + b.height);
        this.fx.showScorePopup(b.x + 6, b.y + 60, '+100');
        onCoinAdd();
        onScoreAdd(100);
      }

      // Despawn off-screen
      if (b.x < -120) {
        b.el.remove();
        this.blocks.splice(i, 1);
      }
    }

    // 5. Collectible Coins
    for (let i = this.coins.length - 1; i >= 0; i--) {
      const c = this.coins[i];
      c.x -= gameSpeed;
      c.el.style.left = c.x + 'px';

      if (
        !c.collected &&
        hb.right > c.x &&
        hb.left < c.x + c.width &&
        hb.top > c.y &&
        hb.bottom < c.y + c.height
      ) {
        c.collected = true;
        this.sound.playCoin();
        this.fx.spawnSparkles(c.x + 16, c.y + 16, 8);
        this.fx.showScorePopup(c.x, c.y + 25, '+50');
        onCoinAdd();
        onScoreAdd(50);
        c.el.remove();
        this.coins.splice(i, 1);
        continue;
      }

      if (c.x < -80) {
        c.el.remove();
        this.coins.splice(i, 1);
      }
    }
  }

  spawnPoppingCoin(x, y) {
    const pCoin = document.createElement('div');
    pCoin.className = 'popping-coin';
    pCoin.style.left = x + 'px';
    pCoin.style.bottom = 95 + y + 'px';

    const img = document.createElement('img');
    img.src = 'assets/coin.svg';
    pCoin.appendChild(img);

    this.container.appendChild(pCoin);
    setTimeout(() => pCoin.remove(), 550);
  }
}

// ==========================================
// 6. MAIN GAME ENGINE
// ==========================================
class MarioGame {
  constructor() {
    // DOM Elements
    this.container = document.getElementById('gameContainer');
    this.skyLayer = document.getElementById('skyLayer');
    this.hillsLayer = document.getElementById('hillsLayer');
    this.entitiesLayer = document.getElementById('entitiesLayer');
    this.platformEl = document.getElementById('platform');
    this.marioEl = document.getElementById('mario');

    // HUD Elements
    this.scoreDisplay = document.getElementById('scoreDisplay');
    this.coinsDisplay = document.getElementById('coinsDisplay');
    this.highScoreDisplay = document.getElementById('highScoreDisplay');
    this.livesContainer = document.getElementById('livesContainer');
    this.soundBtn = document.getElementById('soundBtn');
    this.pauseBtn = document.getElementById('pauseBtn');
    this.fullscreenBtn = document.getElementById('fullscreenBtn');

    // Modals
    this.startScreen = document.getElementById('startScreen');
    this.pauseScreen = document.getElementById('pauseScreen');
    this.gameOverScreen = document.getElementById('gameOverScreen');
    this.startBtn = document.getElementById('startBtn');
    this.resumeBtn = document.getElementById('resumeBtn');
    this.restartFromPauseBtn = document.getElementById('restartFromPauseBtn');
    this.restartBtn = document.getElementById('restartBtn');

    this.finalScoreVal = document.getElementById('finalScoreVal');
    this.finalCoinsVal = document.getElementById('finalCoinsVal');
    this.finalBestVal = document.getElementById('finalBestVal');
    this.newRecordBanner = document.getElementById('newRecordBanner');

    // Mobile touch controls
    this.touchLeft = document.getElementById('touchLeft');
    this.touchRight = document.getElementById('touchRight');
    this.touchJump = document.getElementById('touchJump');

    // Subsystems
    this.sound = new SoundSystem();
    this.fx = new FXManager(this.container);
    this.scenery = new SceneryManager(this.skyLayer, this.hillsLayer, this.platformEl);
    this.player = new Player(this.marioEl, this.fx, this.sound);
    this.entities = new EntityManager(this.entitiesLayer, this.fx, this.sound);

    // Game States: 'START', 'PLAYING', 'PAUSED', 'GAMEOVER'
    this.state = 'START';

    this.score = 0;
    this.coins = 0;
    this.highScore = parseInt(localStorage.getItem('mario_runner_highscore') || '0', 10);
    this.baseSpeed = 5.2;
    this.gameSpeed = this.baseSpeed;

    this.keys = { left: false, right: false, jump: false };
    this.lastFrameTime = performance.now();

    this.initEventListeners();
    this.updateHUD();
    this.updateSoundBtn();
  }

  initEventListeners() {
    // Keyboard inputs
    window.addEventListener('keydown', e => {
      this.sound.init(); // enable AudioContext

      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = true;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = true;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        if (!this.keys.jump) {
          if (this.state === 'PLAYING') {
            this.player.jump();
          } else if (this.state === 'START') {
            this.startGame();
          } else if (this.state === 'GAMEOVER') {
            this.startGame();
          }
        }
        this.keys.jump = true;
        e.preventDefault();
      }

      if (e.code === 'KeyP' || e.code === 'Escape') {
        this.togglePause();
      }
      if (e.code === 'KeyM') {
        this.toggleSound();
      }
      if (e.code === 'KeyF') {
        this.toggleFullscreen();
      }
      if (e.code === 'Enter') {
        if (this.state === 'START' || this.state === 'GAMEOVER') {
          this.startGame();
        }
      }
    });

    window.addEventListener('keyup', e => {
      if (e.code === 'ArrowLeft' || e.code === 'KeyA') {
        this.keys.left = false;
      }
      if (e.code === 'ArrowRight' || e.code === 'KeyD') {
        this.keys.right = false;
      }
      if (e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW') {
        this.keys.jump = false;
      }
    });

    // Touch / Mobile Controls
    const addTouch = (el, onStart, onEnd) => {
      el.addEventListener('touchstart', e => {
        e.preventDefault();
        this.sound.init();
        onStart();
      });
      el.addEventListener('touchend', e => {
        e.preventDefault();
        onEnd();
      });
      el.addEventListener('mousedown', e => {
        e.preventDefault();
        this.sound.init();
        onStart();
      });
      el.addEventListener('mouseup', e => {
        e.preventDefault();
        onEnd();
      });
      el.addEventListener('mouseleave', () => onEnd());
    };

    addTouch(
      this.touchLeft,
      () => { this.keys.left = true; },
      () => { this.keys.left = false; }
    );
    addTouch(
      this.touchRight,
      () => { this.keys.right = true; },
      () => { this.keys.right = false; }
    );
    addTouch(
      this.touchJump,
      () => {
        this.keys.jump = true;
        if (this.state === 'PLAYING') this.player.jump();
      },
      () => { this.keys.jump = false; }
    );

    // Modal buttons
    this.startBtn.addEventListener('click', () => {
      this.sound.init();
      this.startGame();
    });
    this.resumeBtn.addEventListener('click', () => this.togglePause());
    this.restartFromPauseBtn.addEventListener('click', () => this.startGame());
    this.restartBtn.addEventListener('click', () => {
      this.sound.init();
      this.startGame();
    });

    this.soundBtn.addEventListener('click', () => this.toggleSound());
    this.pauseBtn.addEventListener('click', () => this.togglePause());
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }

    // Window resize
    window.addEventListener('resize', () => {
      this.scenery.initClouds();
      this.scenery.initHills();
    });

    // Start requestAnimationFrame loop
    requestAnimationFrame(time => this.gameLoop(time));
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }

  toggleSound() {
    this.sound.init();
    const isMuted = this.sound.toggleMute();
    this.updateSoundBtn();
  }

  updateSoundBtn() {
    this.soundBtn.textContent = this.sound.muted ? '🔇' : '🔊';
  }

  togglePause() {
    if (this.state === 'PLAYING') {
      this.state = 'PAUSED';
      this.pauseScreen.classList.remove('hidden');
    } else if (this.state === 'PAUSED') {
      this.state = 'PLAYING';
      this.pauseScreen.classList.add('hidden');
      this.lastFrameTime = performance.now();
    }
  }

  startGame() {
    this.state = 'PLAYING';
    this.score = 0;
    this.coins = 0;
    this.gameSpeed = this.baseSpeed;

    this.startScreen.classList.add('hidden');
    this.pauseScreen.classList.add('hidden');
    this.gameOverScreen.classList.add('hidden');
    this.newRecordBanner.classList.add('hidden');

    this.player.reset();
    this.entities.reset();
    this.updateHUD();
    this.lastFrameTime = performance.now();
  }

  gameOver() {
    this.state = 'GAMEOVER';

    const isNewHigh = this.score > this.highScore;
    if (isNewHigh) {
      this.highScore = this.score;
      localStorage.setItem('mario_runner_highscore', this.highScore);
      this.sound.playNewRecord();
    }

    setTimeout(() => {
      this.finalScoreVal.textContent = this.score;
      this.finalCoinsVal.textContent = this.coins;
      this.finalBestVal.textContent = this.highScore;

      if (isNewHigh && this.score > 0) {
        this.newRecordBanner.classList.remove('hidden');
      } else {
        this.newRecordBanner.classList.add('hidden');
      }

      this.gameOverScreen.classList.remove('hidden');
    }, 1200);
  }

  updateHUD() {
    this.scoreDisplay.textContent = String(this.score).padStart(6, '0');
    this.coinsDisplay.textContent = `x${String(this.coins).padStart(2, '0')}`;
    this.highScoreDisplay.textContent = String(this.highScore).padStart(6, '0');

    // Update hearts display
    const hearts = this.livesContainer.querySelectorAll('.life-heart');
    hearts.forEach((h, index) => {
      if (index < this.player.lives) {
        h.classList.remove('lost');
      } else {
        h.classList.add('lost');
      }
    });
  }

  gameLoop(currentTime) {
    requestAnimationFrame(time => this.gameLoop(time));

    const deltaTime = Math.min((currentTime - this.lastFrameTime) / 1000, 0.1);
    this.lastFrameTime = currentTime;

    const isPlaying = this.state === 'PLAYING';

    // 1. Update background & scenery
    this.scenery.update(this.gameSpeed, isPlaying);

    if (isPlaying) {
      // 2. Score progression & difficulty scaling
      this.score += 1;
      if (this.score % 400 === 0 && this.gameSpeed < 10.5) {
        this.gameSpeed += 0.35;
      }

      // 3. Update Player Physics
      const platforms = this.entities.getSolidPlatforms();
      this.player.update(this.keys, platforms, window.innerWidth);

      // 4. Update Entities (Pipes, Goombas, Blocks, Coins)
      this.entities.update(
        this.gameSpeed,
        this.player,
        window.innerWidth,
        addedScore => {
          this.score += addedScore;
          this.updateHUD();
        },
        () => {
          this.coins++;
          this.updateHUD();
        }
      );

      // Check if player died
      if (this.player.isDead) {
        this.gameOver();
      }

      this.updateHUD();
    }
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.marioGame = new MarioGame();
});
