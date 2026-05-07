import { useRef, useState } from 'react';

const VideoPlayer = ({ videoUrl, posterUrl, className = '' }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`relative w-full aspect-video rounded-[10px] overflow-hidden bg-choco-light/10 group ${className}`}>
      <video
        ref={videoRef}
        src={videoUrl}
        poster={posterUrl}
        controls={isPlaying} // Показуємо нативні контролли коли грає
        className="w-full h-full object-cover"
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        preload="metadata"
      />
      
      {/* Custom Play Button Overlay (Visible only when paused) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer transition-colors hover:bg-black/30"
          onClick={togglePlay}
        >
          <div className="w-[60px] h-[60px] md:w-[80px] md:h-[80px] rounded-full bg-creamy/90 flex items-center justify-center transition-transform transform group-hover:scale-110">
            <svg 
              width="24" height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="text-choco-light ml-2 w-8 h-8 md:w-10 md:h-10"
            >
              <path d="M5 3L19 12L5 21V3Z" fill="currentColor"/>
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;