class NeuralLightning {
  constructor() {
    setTimeout(() => {
      this.initialize();
    }, 100);
  }

  initialize() {
    this.canvas = document.getElementById('neural-lightning');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.nodes = [];
    this.lastTime = 0;
    this.fps = 30;
    this.fpsInterval = 1000 / this.fps;
    this.colors = {
      node: '#64b5f6',
      connection: '#3498db',
      glow: '#2980b9'
    };

    this.resize();
    window.addEventListener('resize', this.debounce(() => this.resize(), 250));

    this.init();
    this.animate(0);
  }

  debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  resize() {
    if (!this.canvas) return;
    
    const hero = document.getElementById('hero');
    const dpr = window.devicePixelRatio || 1;
    
    this.canvas.style.width = hero.offsetWidth + "px";
    this.canvas.style.height = hero.offsetHeight + "px";
    
    this.canvas.width = hero.offsetWidth * dpr;
    this.canvas.height = hero.offsetHeight * dpr;
    
    this.ctx.scale(dpr, dpr);
    
    this.init();
  }

  init() {
    this.nodes = [];
    const area = (this.canvas.width * this.canvas.height) / (window.devicePixelRatio || 1);
    const numNodes = Math.min(20, Math.floor(area / 20000));
    
    for (let i = 0; i < numNodes; i++) {
      this.nodes.push({
        x: Math.random() * (this.canvas.width / (window.devicePixelRatio || 1)),
        y: Math.random() * (this.canvas.height / (window.devicePixelRatio || 1)),
        vx: (Math.random() - 0.5) * 1.2,
        vy: (Math.random() - 0.5) * 1.2,
        radius: Math.random() * 2 + 3,
        pulsePhase: Math.random() * Math.PI * 2
      });
    }
  }

  drawLightning(start, end, brightness) {
    if (!this.ctx) return;

    const points = [start];
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const segments = Math.floor(distance / 25);

    for (let i = 1; i < segments; i++) {
      const t = i / segments;
      const x = start.x + dx * t + (Math.random() - 0.5) * 25;
      const y = start.y + dy * t + (Math.random() - 0.5) * 25;
      points.push({ x, y });
    }
    points.push(end);

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.strokeStyle = `rgba(100, 181, 246, ${brightness * 0.8})`;
    this.ctx.lineWidth = 3;
    this.ctx.shadowColor = 'rgba(100, 181, 246, 0.8)';
    this.ctx.shadowBlur = 20;
    this.ctx.stroke();

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
      this.ctx.lineTo(points[i].x, points[i].y);
    }

    this.ctx.strokeStyle = `rgba(255, 255, 255, ${brightness * 0.7})`;
    this.ctx.lineWidth = 1;
    this.ctx.shadowBlur = 0;
    this.ctx.stroke();
  }

  animate(currentTime) {
    if (!this.ctx || !this.canvas) return;

    const elapsed = currentTime - this.lastTime;

    if (elapsed > this.fpsInterval) {
      this.lastTime = currentTime - (elapsed % this.fpsInterval);

      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this.nodes.forEach(node => {
        node.x += node.vx;
        node.y += node.vy;
        node.pulsePhase += 0.05;

        if (node.x < 0 || node.x > this.canvas.width / (window.devicePixelRatio || 1)) node.vx *= -1;
        if (node.y < 0 || node.y > this.canvas.height / (window.devicePixelRatio || 1)) node.vy *= -1;
      });

      for (let i = 0; i < this.nodes.length; i++) {
        const node = this.nodes[i];
        for (let j = i + 1; j < this.nodes.length; j++) {
          const otherNode = this.nodes[j];
          const dx = node.x - otherNode.x;
          const dy = node.y - otherNode.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 200) {
            const brightness = (1 - distance / 200);
            this.drawLightning(node, otherNode, brightness);
          }
        }
      }

      this.nodes.forEach(node => {
        const pulseSize = Math.sin(node.pulsePhase) * 0.5 + 1;
        const radius = node.radius * pulseSize;

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius + 4, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(100, 181, 246, 0.4)';
        this.ctx.shadowColor = 'rgba(100, 181, 246, 0.8)';
        this.ctx.shadowBlur = 15;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        this.ctx.shadowBlur = 10;
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.arc(node.x, node.y, radius * 0.5, 0, Math.PI * 2);
        this.ctx.fillStyle = '#64b5f6';
        this.ctx.shadowBlur = 0;
        this.ctx.fill();
      });
    }

    requestAnimationFrame((time) => this.animate(time));
  }

  destroy() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new NeuralLightning();
});
