
class FairyDust {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isActive = false;

        this.resize();
        window.addEventListener('resize', () => this.resize());
        
        this.animate = this.animate.bind(this);
        requestAnimationFrame(this.animate);
    }

    resize() {
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }

    createParticle(x, y) {
        return {
            x,
            y,
            vx: (Math.random() - 0.5) * 3,
            vy: (Math.random() - 0.5) * 3 - 2,
            size: Math.random() * 3 + 1,
            alpha: 1,
            color: '#E2CB9F'
        };
    }

    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha *= 0.95;

            if (p.alpha < 0.01) {
                this.particles.splice(i, 1);
            }
        }

        if (this.isActive) {
            for (let i = 0; i < 2; i++) {
                this.particles.push(this.createParticle(
                    this.mouse.x,
                    this.mouse.y
                ));
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(226, 203, 159, ${p.alpha})`;
            this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
    }

    animate() {
        this.updateParticles();
        this.draw();
        requestAnimationFrame(this.animate);
    }

    updateMousePosition(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
    }

    setActive(active) {
        this.isActive = active;
    }
}

// Initialize the effect
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('fairyCanvas');
    const section = document.getElementById('fairySection');
    const fairyDust = new FairyDust(canvas);

    section.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        fairyDust.updateMousePosition(
            e.clientX - rect.left,
            e.clientY - rect.top
        );
    });

    section.addEventListener('mouseenter', () => {
        fairyDust.setActive(true);
    });

    section.addEventListener('mouseleave', () => {
        fairyDust.setActive(false);
    });
});