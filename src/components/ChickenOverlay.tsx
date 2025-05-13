import React, { useState, useEffect } from 'react';

interface ChickenProps {
  position: { x: number; y: number };
}

const Chicken: React.FC<ChickenProps> = ({ position }) => {
  return (
    <img 
      src="./assets/Dancing-chicken.gif" 
      alt="Dancing Chicken"
      className="absolute w-24 h-24 pointer-events-none"
      style={{ 
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)'
      }}
    />
  );
};

const ChickenOverlay: React.FC = () => {
  const [chickens, setChickens] = useState<Array<{ id: number; x: number; y: number }>>([]);
  
  useEffect(() => {
    const createChicken = () => {
      const newChicken = {
        id: Date.now() + Math.random(), // Ensure unique IDs even when created in the same millisecond
        x: Math.random() * 100,
        y: Math.random() * 100
      };
      
      setChickens(prev => [...prev, newChicken]);
      
      // Remove chicken after animation
      setTimeout(() => {
        setChickens(prev => prev.filter(chicken => chicken.id !== newChicken.id));
      }, 5000);
    };
    
    // Create new chickens more frequently (every 500ms)
    const interval = setInterval(createChicken, 500);
    
    // Create more initial chickens (20)
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createChicken(), i * 100); // Stagger initial creation
    }
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {chickens.map(chicken => (
        <Chicken key={chicken.id} position={{ x: chicken.x, y: chicken.y }} />
      ))}
    </div>
  );
};

export default ChickenOverlay;