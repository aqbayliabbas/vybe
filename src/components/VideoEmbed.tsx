"use client";

import { useState, useEffect } from 'react';
import { parseVideoUrl, VideoEmbedInfo } from '@/lib/video-embed';
import { Play, ExternalLink, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoEmbedProps {
  url: string;
  className?: string;
  autoplay?: boolean;
  showLink?: boolean;
}

export function VideoEmbed({ url, className = '', autoplay = false, showLink = true }: VideoEmbedProps) {
  const [embedInfo, setEmbedInfo] = useState<VideoEmbedInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlayer, setShowPlayer] = useState(autoplay);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url) {
      setError('No video URL provided');
      setIsLoading(false);
      return;
    }

    try {
      const info = parseVideoUrl(url);
      setEmbedInfo(info);
      
      if (info.platform === 'unknown' || !info.embedUrl) {
        setError('Unsupported video platform. Please use TikTok, Instagram, or YouTube links.');
      }
    } catch (e) {
      setError('Failed to parse video URL');
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  if (isLoading) {
    return (
      <div className={`flex items-center justify-center bg-muted/30 rounded-2xl ${className}`}>
        <div className="text-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-vybe mx-auto mb-2"></div>
          <p className="text-xs text-muted-foreground">Loading video...</p>
        </div>
      </div>
    );
  }

  if (error || !embedInfo || !embedInfo.embedUrl) {
    return (
      <div className={`flex flex-col items-center justify-center bg-destructive/5 border border-destructive/20 rounded-2xl p-8 ${className}`}>
        <AlertCircle className="h-10 w-10 text-destructive/60 mb-3" />
        <p className="text-sm font-medium text-destructive mb-2">Unable to load video</p>
        <p className="text-xs text-muted-foreground text-center max-w-[280px] mb-4">
          {error || 'The video URL format is not supported.'}
        </p>
        {showLink && url && (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-2"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
            Open Original Link
          </Button>
        )}
      </div>
    );
  }

  const renderEmbed = () => {
    switch (embedInfo.platform) {
      case 'tiktok':
        return (
          <div className="relative w-full h-full">
            <iframe
              src={embedInfo.embedUrl || undefined}
              className="absolute inset-0 w-full h-full rounded-2xl"
              allowFullScreen
              allow="encrypted-media;"
              scrolling="no"
              style={{ border: 'none' }}
            />
          </div>
        );

      case 'instagram':
        return (
          <div className="relative w-full h-full flex items-center justify-center bg-black">
            <iframe
              src={`${embedInfo.embedUrl}/captioned`}
              className="w-full h-full rounded-2xl"
              allowFullScreen
              allow="encrypted-media;"
              scrolling="no"
              style={{ border: 'none', maxWidth: '540px' }}
            />
          </div>
        );

      case 'youtube':
        // Add parameters to hide YouTube controls and branding
        const youtubeParams = new URLSearchParams({
          autoplay: autoplay ? '1' : '0',
          modestbranding: '1',
          rel: '0',
          showinfo: '0',
          controls: '1',
          fs: '1',
          playsinline: '1'
        });
        return (
          <iframe
            src={`${embedInfo.embedUrl}?${youtubeParams.toString()}`}
            className="absolute inset-0 w-full h-full rounded-2xl"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            style={{ border: 'none' }}
          />
        );

      default:
        return null;
    }
  };

  if (!showPlayer) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-black/70 rounded-2xl cursor-pointer group"
          onClick={() => setShowPlayer(true)}
        >
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-vybe to-vybe-glow text-white shadow-lg transition-transform duration-300 group-hover:scale-110">
            <Play className="ml-1 h-7 w-7 fill-white" />
          </div>
          <h4 className="font-heading text-lg font-bold text-white">Watch Video</h4>
          <p className="mt-2 text-xs text-zinc-300 max-w-[280px] text-center">
            Click to load {embedInfo.platform} video
          </p>
        </div>
        {showLink && (
          <div className="absolute bottom-4 left-4 right-4 flex justify-center">
            <Button
              variant="outline"
              size="sm"
              className="rounded-full text-xs gap-2 bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60"
              onClick={(e) => {
                e.stopPropagation();
                window.open(url, '_blank');
              }}
            >
              <ExternalLink className="h-3 w-3" />
              Open Original
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {renderEmbed()}
      {showLink && (
        <div className="absolute top-4 right-4 z-10">
          <Button
            variant="outline"
            size="sm"
            className="rounded-full text-xs gap-2 bg-black/40 backdrop-blur-md border-white/20 text-white hover:bg-black/60"
            onClick={() => window.open(url, '_blank')}
          >
            <ExternalLink className="h-3 w-3" />
            Original
          </Button>
        </div>
      )}
    </div>
  );
}
