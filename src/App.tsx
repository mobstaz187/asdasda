import React from 'react';
import VideoPlayer from './components/VideoPlayer';
import ChickenOverlay from './components/ChickenOverlay';
import DvdTextOverlay from './components/DvdTextOverlay';

function App() {
  // Using the local video file
  const videoUrl = "/src/J.Geco - Chicken Song.mp4";
  
  return (
    <div className="w-full h-screen overflow-hidden">
      <VideoPlayer videoSrc={videoUrl} />
      <ChickenOverlay />
      <DvdTextOverlay />
    </div>
  );
}

export default App;