// 花火エフェクトの描画関数
function drawFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    
    // キャンバスをリセット
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    canvas.classList.add('active');
    
    const ctx = canvas.getContext('2d', { alpha: true });
    ctx.globalCompositeOperation = 'lighter'; // 加算合成モードで明るく
    
    // 花火とパーティクル用の配列
    const fireworks = [];
    const particles = [];
    const startTime = Date.now();
    
    // 花火クラス
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height * (0.7 + Math.random() * 0.3); // 画面下部から
            this.sx = this.x;
            this.sy = this.y;
            this.tx = Math.random() * canvas.width;
            this.ty = Math.random() * canvas.height * 0.6; // 上部に向かって
            this.speed = 3 + Math.random() * 3;
            this.angle = Math.atan2(this.ty - this.sy, this.tx - this.sx);
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            this.brightness = Math.random() * 50 + 50;
            this.color = `hsl(${Math.random() * 360}, 100%, 60%)`;
            // 花火のサイズをランダム化
            this.explosionSize = 0.5 + Math.random() * 2; // サイズ倍率の多様化
            // 小、中、大のタイプをつける
            if (this.explosionSize < 1) {
                this.type = 'small';
            } else if (this.explosionSize < 1.7) {
                this.type = 'medium';
            } else {
                this.type = 'large';
            }
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // 目標に近づいたら爆発
            const distance = Math.sqrt((this.x - this.tx) ** 2 + (this.y - this.ty) ** 2);
            if (distance < 5) {
                this.explode();
                return true; // 削除マーク
            }
            return false;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        
        explode() {
            // パーティクル生成 (花火の大きさに応じて調整)
            let particleCount;
            
            // 花火のタイプによって粒子数を調整
            if (this.type === 'small') {
                particleCount = 50 + Math.floor(Math.random() * 20);
            } else if (this.type === 'medium') {
                particleCount = 80 + Math.floor(Math.random() * 30);
            } else { // large
                particleCount = 100 + Math.floor(Math.random() * 40);
            }
            
            for (let i = 0; i < particleCount; i++) {
                const hue = parseInt(this.color.split('(')[1]) + Math.random() * 30 - 15;
                const color = `hsl(${hue}, 100%, 60%)`;
                // 花火のサイズをパーティクルに反映
                particles.push(new Particle(this.x, this.y, color, this.explosionSize));
            }
        }
    }
    
    // パーティクルクラス
    class Particle {
        constructor(x, y, color, sizeMultiplier = 1) {
            this.x = x;
            this.y = y;
            this.color = color;
            // 花火のサイズに応じて速度や飛辭を調整
            const baseSpeed = Math.random() * 8 + 3; // ベーススピードを少し下げて多様化
            this.speed = baseSpeed * sizeMultiplier;
            this.angle = Math.random() * Math.PI * 2;
            this.vx = Math.cos(this.angle) * this.speed;
            this.vy = Math.sin(this.angle) * this.speed;
            
            // サイズごとに物理特性を調整
            if (sizeMultiplier < 1) { // 小さい花火
                this.friction = 0.97;
                this.gravity = 0.1;
                this.size = Math.random() * 2 + 1; // 小さめのパーティクル
                this.decay = 0.015 + Math.random() * 0.01; // 早めに消える
            } else if (sizeMultiplier < 1.7) { // 中くらいの花火
                this.friction = 0.96;
                this.gravity = 0.15;
                this.size = Math.random() * 3 + 1.5;
                this.decay = 0.01 + Math.random() * 0.01;
            } else { // 大きい花火
                this.friction = 0.95;
                this.gravity = 0.2;
                this.size = Math.random() * 4 + 2; // 大きめのパーティクル
                this.decay = 0.008 + Math.random() * 0.008; // 長く残る
            }
            
            // さらにサイズにランダム性を持たせる
            this.size *= (0.8 + Math.random() * 0.4);
            
            this.alpha = 1;
        }
        
        update() {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.friction;
            this.vy *= this.friction;
            this.vy += this.gravity;
            this.alpha -= this.decay;
            
            if (this.alpha <= this.decay) {
                return true; // 削除マーク
            }
            return false;
        }
        
        draw() {
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // 画面全体に花火を初期配置 (グリッドサイズを小さくして数を減らす)
    const gridSize = 4;
    for (let gx = 0; gx < gridSize; gx++) {
        for (let gy = 0; gy < gridSize; gy++) {
            // すべてのグリッドポイントではなく、ランダムに配置を間引く
            if (Math.random() < 0.7) { // 70%の確率で花火を配置
                const x = (canvas.width / gridSize) * (gx + 0.2 + Math.random() * 0.6);
                const y = (canvas.height / gridSize) * (gy + 0.2 + Math.random() * 0.6);
                const color = `hsl(${Math.random() * 360}, 100%, 60%)`;
                
                // パーティクル数とサイズを多様化
                const particleCount = 50 + Math.floor(Math.random() * 50);
                // この花火のサイズをランダムに設定
                const explosionSize = 0.5 + Math.random() * 2;
                for (let j = 0; j < particleCount; j++) {
                    particles.push(new Particle(x, y, color, explosionSize));
                }
            }
        }
    }
    
    // 追加の花火も打ち上げる (数を減らす)
    for (let i = 0; i < 5; i++) {
        const firework = new Firework();
        firework.y = canvas.height * 0.3; // 既に上空にある花火
        fireworks.push(firework);
    }
    
    // アニメーションループ
    let animationId;
    const animate = () => {
        animationId = requestAnimationFrame(animate);
        
        // 背景の半透明塗りつぶし
        ctx.globalCompositeOperation = 'source-over';
        ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'lighter';
        
        // 追加の花火の発射 (確率を下げ、上限も下げる)
        if (Math.random() < 0.2 && fireworks.length < 5) {
            fireworks.push(new Firework());
        }
        
        // 花火の更新と描画
        for (let i = fireworks.length - 1; i >= 0; i--) {
            if (fireworks[i].update()) {
                fireworks.splice(i, 1);
            } else {
                fireworks[i].draw();
            }
        }
        
        // パーティクルの更新と描画
        for (let i = particles.length - 1; i >= 0; i--) {
            if (particles[i].update()) {
                particles.splice(i, 1);
            } else {
                particles[i].draw();
            }
        }
    };
    
    // アニメーション開始
    animate();
    
    // 1秒で終了
    setTimeout(() => {
        cancelAnimationFrame(animationId);
        canvas.classList.remove('active');
    }, 1000);
}
