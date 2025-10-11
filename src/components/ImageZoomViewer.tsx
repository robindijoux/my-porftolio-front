import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';

interface ImageZoomViewerProps {
  src: string;
  alt: string;
  onClose: () => void;
  onPrevious?: () => void;
  onNext?: () => void;
  hasMultiple?: boolean;
  currentIndex?: number;
  totalImages?: number;
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

const ImageZoomViewer = ({
  src,
  alt,
  onClose,
  onPrevious,
  onNext,
  hasMultiple = false,
  currentIndex = 1,
  totalImages = 1
}: ImageZoomViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // État pour les gestes tactiles
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Constantes
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.3;

  // Réinitialiser lors du changement d'image
  useEffect(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
    setIsLoading(true);
  }, [src]);

  // Fonction pour obtenir les limites de déplacement
  const getBounds = useCallback((scale: number) => {
    if (!containerRef.current || !imageRef.current) return { maxX: 0, maxY: 0 };
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const imageRect = imageRef.current.getBoundingClientRect();
    
    const scaledWidth = imageRect.width * scale;
    const scaledHeight = imageRect.height * scale;
    
    const maxX = Math.max(0, (scaledWidth - containerRect.width) / 2 / scale);
    const maxY = Math.max(0, (scaledHeight - containerRect.height) / 2 / scale);
    
    return { maxX, maxY };
  }, []);

  // Fonction pour contraindre la translation
  const constrainTransform = useCallback((newTransform: Transform) => {
    const { maxX, maxY } = getBounds(newTransform.scale);
    
    return {
      ...newTransform,
      translateX: Math.max(-maxX, Math.min(maxX, newTransform.translateX)),
      translateY: Math.max(-maxY, Math.min(maxY, newTransform.translateY))
    };
  }, [getBounds]);

  // Zoom vers un point spécifique
  const zoomToPoint = useCallback((newScale: number, centerX: number, centerY: number) => {
    if (!containerRef.current || !imageRef.current) return;
    
    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    const scaleDiff = clampedScale / transform.scale;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const pointX = centerX - containerRect.left - containerRect.width / 2;
    const pointY = centerY - containerRect.top - containerRect.height / 2;
    
    const newTranslateX = transform.translateX - (pointX / transform.scale) * (scaleDiff - 1);
    const newTranslateY = transform.translateY - (pointY / transform.scale) * (scaleDiff - 1);
    
    const newTransform = constrainTransform({
      scale: clampedScale,
      translateX: newTranslateX,
      translateY: newTranslateY
    });
    
    setTransform(newTransform);
  }, [transform, constrainTransform]);

  // Gestion de la molette de la souris
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newScale = transform.scale + delta;
    
    zoomToPoint(newScale, e.clientX, e.clientY);
  }, [transform.scale, zoomToPoint]);

  // Gestion des événements souris
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return; // Seulement le clic gauche
    
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !lastPanPoint) return;
    
    const deltaX = (e.clientX - lastPanPoint.x) / transform.scale;
    const deltaY = (e.clientY - lastPanPoint.y) / transform.scale;
    
    const newTransform = constrainTransform({
      ...transform,
      translateX: transform.translateX + deltaX,
      translateY: transform.translateY + deltaY
    });
    
    setTransform(newTransform);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPanPoint, transform, constrainTransform]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setLastPanPoint(null);
  }, []);

  // Calcul de la distance entre deux touches
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return Math.sqrt(
      Math.pow(touch2.clientX - touch1.clientX, 2) + 
      Math.pow(touch2.clientY - touch1.clientY, 2)
    );
  };

  // Calcul du centre entre deux touches
  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  };

  // Gestion des événements tactiles
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1) {
      // Simple touch - démarrer le pan ou détecter le double tap
      const touch = e.touches[0];
      const currentTime = Date.now();
      
      if (currentTime - lastTapTime < 300) {
        // Double tap - zoom
        const newScale = transform.scale === 1 ? 2.5 : 1;
        zoomToPoint(newScale, touch.clientX, touch.clientY);
        setLastTapTime(0);
      } else {
        setLastTapTime(currentTime);
        setLastPanPoint({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
      }
    } else if (e.touches.length === 2) {
      // Pinch - démarrer le zoom
      setIsDragging(false);
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    }
  }, [lastTapTime, transform.scale, zoomToPoint]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    
    if (e.touches.length === 1 && isDragging && lastPanPoint) {
      // Pan avec un doigt
      const touch = e.touches[0];
      const deltaX = (touch.clientX - lastPanPoint.x) / transform.scale;
      const deltaY = (touch.clientY - lastPanPoint.y) / transform.scale;
      
      const newTransform = constrainTransform({
        ...transform,
        translateX: transform.translateX + deltaX,
        translateY: transform.translateY + deltaY
      });
      
      setTransform(newTransform);
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
      // Pinch zoom avec deux doigts
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      
      if (distance && center) {
        const scaleFactor = distance / lastTouchDistance;
        const newScale = transform.scale * scaleFactor;
        
        zoomToPoint(newScale, center.x, center.y);
        
        setLastTouchDistance(distance);
        setLastTouchCenter(center);
      }
    }
  }, [isDragging, lastPanPoint, lastTouchDistance, lastTouchCenter, transform, constrainTransform, zoomToPoint]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastPanPoint(null);
    setLastTouchDistance(null);
    setLastTouchCenter(null);
  }, []);

  // Gestionnaires des boutons de zoom
  const handleZoomIn = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    zoomToPoint(transform.scale + ZOOM_STEP, centerX, centerY);
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    zoomToPoint(transform.scale - ZOOM_STEP, centerX, centerY);
  };

  const handleReset = () => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
  };

  // Event listeners et gestion du body
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
    
    container.addEventListener('wheel', handleWheel, { passive: false });
    
    return () => {
      document.body.style.overflow = '';
      container.removeEventListener('wheel', handleWheel);
    };
  }, [handleWheel]);

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
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          handleReset();
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
          <button
            onClick={handleZoomOut}
            disabled={transform.scale <= MIN_SCALE}
            className="bg-black/50 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors"
          >
            <ZoomOut className="h-5 w-5" />
          </button>
          <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">
            {Math.round(transform.scale * 100)}%
          </span>
          <button
            onClick={handleZoomIn}
            disabled={transform.scale >= MAX_SCALE}
            className="bg-black/50 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2 transition-colors"
          >
            <ZoomIn className="h-5 w-5" />
          </button>
          <button
            onClick={handleReset}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
        
        <div className="flex items-center gap-2">
          {hasMultiple && (
            <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {currentIndex} / {totalImages}
            </div>
          )}
          <button
            onClick={onClose}
            className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
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

      {/* Conteneur de l'image */}
      <div
        ref={containerRef}
        className="absolute inset-0 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ touchAction: 'none' }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          </div>
        )}
        
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="block select-none transition-transform duration-200 ease-out"
          style={{
            transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`,
            transformOrigin: 'center center',
            maxWidth: 'none',
            maxHeight: 'none'
          }}
          onLoad={() => setIsLoading(false)}
          onError={() => setIsLoading(false)}
          draggable={false}
        />
      </div>

      {/* Instructions (affichées brièvement) */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full opacity-80 pointer-events-none">
        <div className="text-center">
          <div>Desktop: Molette pour zoomer • Clic + glisser pour déplacer</div>
          <div>Mobile: Pinch pour zoomer • Double-tap pour zoom rapide</div>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomViewer;