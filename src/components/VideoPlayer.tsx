import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX, Maximize, Minimize } from 'lucide-react';

interface VideoPlayerProps {
  videoSrc: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoSrc }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isControlsVisible, setIsControlsVisible] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    const resetTimeout = () => {
      clearTimeout(timeout);
      setIsControlsVisible(true);
      
      timeout = setTimeout(() => {
        if (isPlaying) {
          setIsControlsVisible(false);
        }
      }, 3000);
    };
    
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', resetTimeout);
      container.addEventListener('touchstart', resetTimeout);
    }
    
    resetTimeout();
    
    return () => {
      clearTimeout(timeout);
      if (container) {
        container.removeEventListener('mousemove', resetTimeout);
        container.removeEventListener('touchstart', resetTimeout);
      }
    };
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (video && isLoaded) {
      video.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Autoplay failed:", error);
          setIsPlaying(false);
        });
    }
  }, [isLoaded]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        await container.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Fullscreen toggle failed:", error);
    }
  };

  const handleVideoLoaded = () => {
    setIsLoaded(true);
  };

  return (
    <div 
      ref={containerRef}
      className="relative w-full h-screen overflow-hidden bg-black"
    >
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        src={videoSrc}
        playsInline
        autoPlay
        loop
        muted={isMuted}
        onPlay={() => setIsPlaying(true)}
        onPause={() => {
          // Force play when paused
          const video = videoRef.current;
          if (video) {
            video.play();
          }
        }}
        onLoadedMetadata={handleVideoLoaded}
        onLoadedData={handleVideoLoaded}
      />
      
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 ${
          isControlsVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between max-w-screen-lg mx-auto">
          <button 
            onClick={toggleMute}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
          </button>
          
          <button 
            onClick={toggleFullscreen}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={24} /> : <Maximize size={24} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;