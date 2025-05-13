import React, { useState, useEffect, useRef } from 'react';

interface Position {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface TextInstance {
  id: number;
  position: Position;
}

const DvdTextOverlay: React.FC = () => {
  const [textInstances, setTextInstances] = useState<TextInstance[]>([
    { id: 0, position: { x: 50, y: 50, dx: 2, dy: 2 } }
  ]);
  
  const addNewInstance = (clickX: number, clickY: number) => {
    const newInstance: TextInstance = {
      id: Date.now(),
      position: {
        x: clickX,
        y: clickY,
        dx: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1),
        dy: (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 2 + 1)
      }
    };
    setTextInstances(prevInstances => [...prevInstances, newInstance]);
  };

  useEffect(() => {
    let animationFrameId: number;
    
    const animate = () => {
      setTextInstances(prev => prev.map(instance => {
        const newPosition = { ...instance.position };
        
        newPosition.x += newPosition.dx;
        newPosition.y += newPosition.dy;
        
        // Bounce off edges
        if (newPosition.x + 200 > window.innerWidth || newPosition.x < 0) {
          newPosition.dx = -newPosition.dx;
        }
        if (newPosition.y + 50 > window.innerHeight || newPosition.y < 0) {
          newPosition.dy = -newPosition.dy;
        }
        
        return {
          ...instance,
          position: newPosition
        };
      }));
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-20">
      {textInstances.map(instance => (
        <div 
          key={instance.id}
          className="absolute cursor-pointer pointer-events-auto"
          style={{ 
            left: `${instance.position.x}px`,
            top: `${instance.position.y}px`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            addNewInstance(e.clientX - rect.width / 2, e.clientY - rect.height / 2);
          }}
        >
          <div 
            className="techno-text text-2xl md:text-4xl"
            style={{
              color: `hsl(${(instance.position.x + instance.position.y) % 360}, 100%, 50%)`
            }}
          >
            $chickndance
          </div>
          <div className="text-xs text-white/70 text-center animate-bounce mt-1">
            click me!
          </div>
        </div>
      ))}
    </div>
  );
};

export default DvdTextOverlay;