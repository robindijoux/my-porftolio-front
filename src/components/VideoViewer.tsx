import { useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface VideoViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasMultiple?: boolean;
  currentIndex?: number;
  totalVideos?: number;
}

const VideoViewer = ({
  src,
  alt,
  onClose,
  onPrevious,
  onNext,
  hasMultiple = false,
  currentIndex = 1,
  totalVideos = 1
}: VideoViewerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Gestion du body overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // Navigation au clavier
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          if (hasMultiple && onPrevious) onPrevious();
          break;
        case 'ArrowRight':
          if (hasMultiple && onNext) onNext();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onPrevious, onNext, hasMultiple]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black"
      style={{ 
        margin: 0,
        padding: 0
      }}
    >
      {/* Barre d'outils */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {hasMultiple && (
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex} / {totalVideos}
            </div>
          )}
        </div>
        
        <button
          onClick={onClose}
          className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
        >
          <X className="h-6 w-6" />
        </button>
      </div>

      {/* Navigation */}
      {hasMultiple && (
        <>
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-10"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 transition-colors z-10"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Conteneur de la vidéo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <video
          ref={videoRef}
          src={src}
          className="max-w-full max-h-full"
          controls
          autoPlay
          onError={(e) => {
            console.error('Erreur de chargement vidéo:', e);
          }}
        />
      </div>
    </div>
  );
};

export default VideoViewer;
