
import React, { useEffect, useRef } from 'react';

export const AnimatedBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);
    let animationFrameId: number;

    const config = {
      // Grid properties
      tileWidth: 50,
      tileHeight: 25,
      // Colors and style
      baseColor: 'hsl(260, 100%, 70%)', // Vibrant Purple
      glowColor: 'hsl(180, 100%, 60%)', // Bright Cyan
      glowBlur: 10,
      lineWidth: 1.5,
      // Animation properties
      waveSpeed: 0.003,
      waveAmplitude: 60,
      waveFrequency: 0.04,
      // Mouse interaction
      mouseRadius: 200,
      mouseStrength: 150,
    };

    const mouse = {
      x: -10000,
      y: -10000,
      _x: -10000,
      _y: -10000,
    };

    let time = 0;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (event: MouseEvent) => {
      mouse._x = event.clientX;
      mouse._y = event.clientY;
    };

    const handleMouseLeave = () => {
      mouse._x = -10000;
      mouse._y = -10000;
    };

    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    const project = (x: number, y: number, z: number) => {
        // Simple isometric projection
        const px = (x - y) * config.tileWidth / 2;
        const py = (x + y) * config.tileHeight / 2 - z;
        return { x: px, y: py };
    };

    const draw = () => {
        if (!ctx) return;

        ctx.clearRect(0, 0, width, height);
        ctx.save();
        // Center the grid and push it up slightly
        ctx.translate(width / 2, height / 2 - 100); 
        
        // Glow effect
        ctx.shadowColor = config.glowColor;
        ctx.shadowBlur = config.glowBlur;
        ctx.strokeStyle = config.baseColor;
        ctx.lineWidth = config.lineWidth;

        // Lerp mouse position for a smoother follow effect
        mouse.x += (mouse._x - mouse.x) * 0.08;
        mouse.y += (mouse._y - mouse.y) * 0.08;

        const cols = Math.floor(width / config.tileWidth) + 6;
        const rows = Math.floor(height / config.tileHeight) + 6;

        const points: {x:number, y:number}[][] = [];

        for (let i = 0; i < rows; i++) {
            points[i] = [];
            for (let j = 0; j < cols; j++) {
                const worldX = i - rows / 2;
                const worldY = j - cols / 2;

                // Create a more complex, flowing wave effect
                const wave1 = Math.sin(worldX * config.waveFrequency + time) * config.waveAmplitude;
                const wave2 = Math.cos(worldY * config.waveFrequency * 1.5 + time) * config.waveAmplitude * 0.5;
                const wave = (wave1 + wave2) * 0.7;


                // Project to screen space just to calculate mouse distance accurately
                const projectedForMouse = project(worldX, worldY, 0);
                const screenX = projectedForMouse.x + width / 2;
                const screenY = projectedForMouse.y + height / 2 - 100;
                
                // Calculate mouse interaction
                const mouseDx = screenX - mouse.x;
                const mouseDy = screenY - mouse.y;
                const mouseDist = Math.sqrt(mouseDx * mouseDx + mouseDy * mouseDy);
                const mouseEffect = Math.max(0, 1 - mouseDist / config.mouseRadius);

                // Negative strength creates a "push" or "dent" effect
                const z = wave - Math.pow(mouseEffect, 2) * config.mouseStrength;

                const projected = project(worldX, worldY, z);
                points[i][j] = {x: projected.x, y: projected.y};
            }
        }
        
        // Draw the grid lines
        ctx.globalAlpha = 0.8;
        for (let i = 0; i < rows - 1; i++) {
            for (let j = 0; j < cols - 1; j++) {
                const p1 = points[i][j];
                const p2 = points[i + 1][j];
                const p3 = points[i][j + 1];

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.stroke();

                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p3.x, p3.y);
                ctx.stroke();
            }
        }
        ctx.restore();
    };
    
    const animate = () => {
      draw();
      time += config.waveSpeed;
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full z-0 bg-black" />;
};
