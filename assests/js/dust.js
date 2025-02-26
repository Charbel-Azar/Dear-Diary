class FairyDust {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.isActive = false;
        this.trailPositions = []; // Store previous mouse positions
        this.maxTrailLength = 5; // Number of positions to track

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
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2 - 1, // Slightly upward bias
            size: Math.random() * 5 + 1,
            alpha: 1,
            color: '#E2CB9F'
        };
    }

    updateParticles() {
        // Update existing particles
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.alpha *= 0.96; // Slightly slower fade
            p.size *= 0.99; // Gradual size reduction

            if (p.alpha < 0.01) {
                this.particles.splice(i, 1);
            }
        }

        // Create new particles
        if (this.isActive && this.trailPositions.length > 0) {
            // Create particles along the trail, not just at current position
            for (let i = 0; i < this.trailPositions.length; i++) {
                const pos = this.trailPositions[i];
                // Create fewer particles for older positions
                const particleCount = Math.max(1, Math.floor((i + 1) / this.trailPositions.length * 2));
                
                for (let j = 0; j < particleCount; j++) {
                    // Add some randomness to position to create a more natural trail
                    const offsetX = (Math.random() - 0.5) * 5;
                    const offsetY = (Math.random() - 0.5) * 5;
                    this.particles.push(this.createParticle(
                        pos.x + offsetX,
                        pos.y + offsetY
                    ));
                }
            }
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(p => {
            this.ctx.beginPath();
            this.ctx.shadowColor = p.color;
            this.ctx.shadowBlur = 10;
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
        // Store current position in the trail
        this.trailPositions.unshift({ x, y });
        
        // Limit the trail length
        if (this.trailPositions.length > this.maxTrailLength) {
            this.trailPositions.pop();
        }
        
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