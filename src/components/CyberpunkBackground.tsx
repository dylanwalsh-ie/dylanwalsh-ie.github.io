/**
 * @file Renders a dynamic, interactive particle background using the HTML Canvas API.
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description Creates a "plexus" effect with particles that move and connect
 * to each other and the user's mouse cursor.
 */
import React, { useRef, useEffect } from 'react';

export const CyberpunkBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Main hook to setup and run the animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const mouse = { x: -1000, y: -1000, radius: 150 };

    // Sets canvas to fit the entire window
    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Represents a single particle
    class Particle {
      x: number;
      y: number;
      size: number;
      vx: number;
      vy: number;
      color: string;

      constructor(x: number, y: number, vx: number, vy: number) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 1.5 + 1;
        this.vx = vx;
        this.vy = vy;
        this.color = 'rgba(59, 130, 246, 0.7)';
      }

      // Updates particle's position in each frame
      update() {
        // Wrap around edges for a seamless effect
        if (this.x > canvas.width + 5) this.x = -5;
        else if (this.x < -5) this.x = canvas.width + 5;
        if (this.y > canvas.height + 5) this.y = -5;
        else if (this.y < -5) this.y = canvas.height + 5;
        
        this.x += this.vx;
        this.y += this.vy;
      }

      draw() {
        ctx!.fillStyle = this.color;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    // Initialises the particle array
    const init = () => {
      particles = [];
      // Adjust particle density based on screen size
      const numberOfParticles = (canvas.width * canvas.height) / 12000;
      for (let i = 0; i < numberOfParticles; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const vx = Math.random() * 0.4 - 0.2;
        const vy = Math.random() * 0.4 - 0.2;
        particles.push(new Particle(x, y, vx, vy));
      }
    };

    // Connects lines between nearby particles and cursor
    const connect = () => {
      let opacityValue = 1;
      // Particle connections
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          const dx = particles[a].x - particles[b].x;
          const dy = particles[a].y - particles[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 120) { // Connection distance
            opacityValue = 1 - distance / 120;
            ctx!.strokeStyle = `rgba(59, 130, 246, ${opacityValue})`;
            ctx!.lineWidth = 0.5;
            ctx!.beginPath();
            ctx!.moveTo(particles[a].x, particles[a].y);
            ctx!.lineTo(particles[b].x, particles[b].y);
            ctx!.stroke();
          }
        }
      }
      
      // Mouse connections
      for (let i = 0; i < particles.length; i++) {
        const dx = particles[i].x - mouse.x;
        const dy = particles[i].y - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < mouse.radius) {
            opacityValue = 1 - distance / mouse.radius;
            ctx!.strokeStyle = `rgba(165, 214, 255, ${opacityValue * 0.5})`;
            ctx!.lineWidth = 1;
            ctx!.beginPath();
            ctx!.moveTo(particles[i].x, particles[i].y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.stroke();
        }
      }
    };

    // Main animation loop called on each frame
    const animate = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      connect();
      animationFrameId = requestAnimationFrame(animate);
    };

    // Event handler for window resize to keep canvas responsive
    const handleResize = () => {
      setupCanvas();
      init();
    };

    // Event handler for tracking cursor position
    const handleMouseMove = (event: MouseEvent) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
    };
    
    setupCanvas();
    init();
    animate();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full"
    />
  );
};