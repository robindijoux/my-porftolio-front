import { useState, useRef, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { isImage, isVideo } from '@/utils/media';

interface MediaItem {
  id: string;
  url: string;
  type: string;
  alt?: string;
}

interface MixedMediaViewerProps {
  media: MediaItem[];
  currentIndex: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  autoplayFirst?: boolean; // if true and initial index is a video, autoplay it
}

interface Transform {
  scale: number;
  translateX: number;
  translateY: number;
}

const MixedMediaViewer = ({ media, currentIndex, onClose, onIndexChange, autoplayFirst = false }: MixedMediaViewerProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const initialIndexRef = useRef<number>(currentIndex);

  const [index, setIndex] = useState<number>(currentIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Image transform state
  const [transform, setTransform] = useState<Transform>({ scale: 1, translateX: 0, translateY: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState<{ x: number; y: number } | null>(null);
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  const [lastTapTime, setLastTapTime] = useState(0);

  // Constants
  const MIN_SCALE = 0.5;
  const MAX_SCALE = 5;
  const ZOOM_STEP = 0.3;

  // Sync external currentIndex
  useEffect(() => {
    setIndex(currentIndex);
  }, [currentIndex]);

  // Reset when index changes
  useEffect(() => {
    setTransform({ scale: 1, translateX: 0, translateY: 0 });
    setIsLoading(true);

    // autoplay logic: if this is the first media (index 0) and it's a video and autoplayFirst, autoplay it
    if (isVideo(media[index]?.type) && autoplayFirst && index === 0 && isInitialLoad) {
      setIsInitialLoad(false);
      // try to play when videoRef ready
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  }, [index, media, autoplayFirst, isInitialLoad]);

  // Fit image to container on load
  const handleImageLoad = () => {
    if (!imageRef.current || !containerRef.current) {
      setIsLoading(false);
      return;
    }

    const containerWidth = containerRef.current.clientWidth;
    const containerHeight = containerRef.current.clientHeight;
    const imgNativeWidth = imageRef.current.naturalWidth;
    const imgNativeHeight = imageRef.current.naturalHeight;

    // Calculate scale to fit image entirely in container (with small margin)
    const margin = 20; // pixels margin around image
    const availableWidth = containerWidth - margin * 2;
    const availableHeight = containerHeight - margin * 2;
    
    const scaleX = availableWidth / imgNativeWidth;
    const scaleY = availableHeight / imgNativeHeight;
    const scale = Math.min(scaleX, scaleY);

    setTransform({ scale: Math.max(scale, MIN_SCALE), translateX: 0, translateY: 0 });
    setIsLoading(false);
  };

  // Body overflow
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

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

  const constrainTransform = useCallback((newTransform: Transform) => {
    const { maxX, maxY } = getBounds(newTransform.scale);
    return {
      ...newTransform,
      translateX: Math.max(-maxX, Math.min(maxX, newTransform.translateX)),
      translateY: Math.max(-maxY, Math.min(maxY, newTransform.translateY))
    };
  }, [getBounds]);

  const zoomToPoint = useCallback((newScale: number, centerX: number, centerY: number) => {
    if (!containerRef.current || !imageRef.current) return;

    const clampedScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, newScale));
    const scaleDiff = clampedScale / transform.scale;

    const containerRect = containerRef.current.getBoundingClientRect();
    const pointX = centerX - containerRect.left - containerRect.width / 2;
    const pointY = centerY - containerRect.top - containerRect.height / 2;

    const newTranslateX = transform.translateX - (pointX / transform.scale) * (scaleDiff - 1);
    const newTranslateY = transform.translateY - (pointY / transform.scale) * (scaleDiff - 1);

    const newTransform = constrainTransform({ scale: clampedScale, translateX: newTranslateX, translateY: newTranslateY });
    setTransform(newTransform);
  }, [transform, constrainTransform]);

  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    // Only zoom images
    if (!isImage(media[index]?.type)) return;
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    const newScale = transform.scale + delta;
    zoomToPoint(newScale, e.clientX, e.clientY);
  }, [transform.scale, zoomToPoint, media, index]);

  // Mouse handlers (only for images)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!isImage(media[index]?.type)) return;
    if (e.button !== 0) return;
    setIsDragging(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [media, index]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isImage(media[index]?.type)) return;
    if (!isDragging || !lastPanPoint) return;
    const deltaX = (e.clientX - lastPanPoint.x) / transform.scale;
    const deltaY = (e.clientY - lastPanPoint.y) / transform.scale;
    const newTransform = constrainTransform({ ...transform, translateX: transform.translateX + deltaX, translateY: transform.translateY + deltaY });
    setTransform(newTransform);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  }, [isDragging, lastPanPoint, transform, constrainTransform, media, index]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    setLastPanPoint(null);
  }, []);

  // Touch handlers simplified (only for images)
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const t1 = touches[0];
    const t2 = touches[1];
    return Math.sqrt((t2.clientX - t1.clientX) ** 2 + (t2.clientY - t1.clientY) ** 2);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return null;
    const t1 = touches[0];
    const t2 = touches[1];
    return { x: (t1.clientX + t2.clientX) / 2, y: (t1.clientY + t2.clientY) / 2 };
  };

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (!isImage(media[index]?.type)) return;
    e.preventDefault();
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      const currentTime = Date.now();
      if (currentTime - lastTapTime < 300) {
        const newScale = transform.scale === 1 ? 2.5 : 1;
        zoomToPoint(newScale, touch.clientX, touch.clientY);
        setLastTapTime(0);
      } else {
        setLastTapTime(currentTime);
        setLastPanPoint({ x: touch.clientX, y: touch.clientY });
        setIsDragging(true);
      }
    } else if (e.touches.length === 2) {
      setIsDragging(false);
      const distance = getTouchDistance(e.touches);
      const center = getTouchCenter(e.touches);
      setLastTouchDistance(distance);
      setLastTouchCenter(center);
    }
  }, [lastTapTime, transform.scale, zoomToPoint, media, index]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isImage(media[index]?.type)) return;
    e.preventDefault();
    if (e.touches.length === 1 && isDragging && lastPanPoint) {
      const touch = e.touches[0];
      const deltaX = (touch.clientX - lastPanPoint.x) / transform.scale;
      const deltaY = (touch.clientY - lastPanPoint.y) / transform.scale;
      const newTransform = constrainTransform({ ...transform, translateX: transform.translateX + deltaX, translateY: transform.translateY + deltaY });
      setTransform(newTransform);
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
    } else if (e.touches.length === 2 && lastTouchDistance && lastTouchCenter) {
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
  }, [isDragging, lastPanPoint, lastTouchDistance, lastTouchCenter, transform, constrainTransform, media, index]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
    setLastPanPoint(null);
    setLastTouchDistance(null);
    setLastTouchCenter(null);
  }, []);

  // Zoom controls (only for images)
  const handleZoomIn = () => {
    if (!containerRef.current) return;
    if (!isImage(media[index]?.type)) return;
    const rect = containerRef.current.getBoundingClientRect();
    zoomToPoint(transform.scale + ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleZoomOut = () => {
    if (!containerRef.current) return;
    if (!isImage(media[index]?.type)) return;
    const rect = containerRef.current.getBoundingClientRect();
    zoomToPoint(transform.scale - ZOOM_STEP, rect.left + rect.width / 2, rect.top + rect.height / 2);
  };

  const handleReset = () => setTransform({ scale: 1, translateX: 0, translateY: 0 });

  // Keyboard & wheel listeners
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowLeft':
          prev();
          break;
        case 'ArrowRight':
          next();
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
    return () => {
      container.removeEventListener('wheel', handleWheel);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleWheel]);

  const next = useCallback(() => {
    const nextIndex = (index + 1) % media.length;
    setIndex(nextIndex);
    if (onIndexChange) onIndexChange(nextIndex);
  }, [index, media.length, onIndexChange]);

  const prev = useCallback(() => {
    const prevIndex = index === 0 ? media.length - 1 : index - 1;
    setIndex(prevIndex);
    if (onIndexChange) onIndexChange(prevIndex);
  }, [index, media.length, onIndexChange]);

  // autoplay when open if needed
  useEffect(() => {
    if (isVideo(media[index]?.type) && autoplayFirst && index === 0 && isInitialLoad) {
      setIsInitialLoad(false);
      setTimeout(() => {
        videoRef.current?.play().catch(() => {});
      }, 100);
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black" style={{ margin: 0, padding: 0 }}>
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          {isImage(media[index]?.type) && (
            <>
              <button onClick={handleZoomOut} className="bg-black/50 hover:bg-black/70 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-full p-2">
                <ZoomOut className="h-5 w-5" />
              </button>
              <span className="bg-black/50 text-white px-3 py-1 rounded-full text-sm font-mono">{Math.round(transform.scale * 100)}%</span>
              <button onClick={handleZoomIn} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2">
                <ZoomIn className="h-5 w-5" />
              </button>
              <button onClick={handleReset} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2">
                <RotateCcw className="h-5 w-5" />
              </button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-black/50 text-white px-3 py-1 rounded-full text-sm">{index + 1} / {media.length}</div>
          <button onClick={onClose} className="bg-black/50 hover:bg-black/70 text-white rounded-full p-2"><X className="h-6 w-6" /></button>
        </div>
      </div>

      {/* Navigation arrows */}
      {media.length > 1 && (
        <>
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 z-10"><ChevronLeft className="h-6 w-6" /></button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-3 z-10"><ChevronRight className="h-6 w-6" /></button>
        </>
      )}

      <div ref={containerRef} className="absolute inset-0 flex items-center justify-center overflow-hidden cursor-grab active:cursor-grabbing" onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd} style={{ touchAction: 'none' }}>
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black"><div className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" /></div>
        )}

        {isImage(media[index]?.type) ? (
          <img ref={imageRef} src={media[index]?.url} alt={media[index]?.alt || ''} className="block select-none transition-transform duration-200 ease-out" style={{ transform: `scale(${transform.scale}) translate(${transform.translateX}px, ${transform.translateY}px)`, transformOrigin: 'center center', maxWidth: 'none', maxHeight: 'none' }} onLoad={handleImageLoad} onError={() => setIsLoading(false)} draggable={false} />
        ) : isVideo(media[index]?.type) ? (
          <video ref={videoRef} src={media[index]?.url} className="max-w-full max-h-full" controls onLoadedData={() => setIsLoading(false)} autoPlay={autoplayFirst && index === initialIndexRef.current} />
        ) : (
          <div className="text-white">Unsupported media</div>
        )}
      </div>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/70 text-white text-xs px-4 py-2 rounded-full opacity-80 pointer-events-none">
        <div className="text-center">
          <div>Desktop: Molette pour zoomer • Clic + glisser pour déplacer</div>
          <div>Mobile: Pinch pour zoomer • Double-tap pour zoom rapide</div>
        </div>
      </div>
    </div>
  );
};

export default MixedMediaViewer;
