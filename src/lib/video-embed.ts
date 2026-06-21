export interface VideoEmbedInfo {
  platform: 'tiktok' | 'instagram' | 'youtube' | 'unknown';
  embedUrl: string | null;
  videoId: string | null;
  originalUrl: string;
}

export function parseVideoUrl(url: string): VideoEmbedInfo {
  const result: VideoEmbedInfo = {
    platform: 'unknown',
    embedUrl: null,
    videoId: null,
    originalUrl: url
  };

  try {
    const urlObj = new URL(url);
    const hostname = urlObj.hostname.toLowerCase();

    // TikTok
    if (hostname.includes('tiktok.com')) {
      result.platform = 'tiktok';
      
      // Extract video ID from various TikTok URL formats
      // Format: https://www.tiktok.com/@username/video/1234567890
      // Format: https://vm.tiktok.com/XXXXXX/
      const videoMatch = url.match(/\/video\/(\d+)/);
      if (videoMatch) {
        result.videoId = videoMatch[1];
        // Use embed with minimal UI
        result.embedUrl = `https://www.tiktok.com/embed/v2/${result.videoId}?lang=en-US`;
      } else {
        // For short URLs, we'll use the full URL as embed
        result.embedUrl = url;
      }
    }
    
    // Instagram
    else if (hostname.includes('instagram.com')) {
      result.platform = 'instagram';
      
      // Format: https://www.instagram.com/p/XXXXXX/
      // Format: https://www.instagram.com/reel/XXXXXX/
      const postMatch = url.match(/\/(p|reel|tv)\/([A-Za-z0-9_-]+)/);
      if (postMatch) {
        result.videoId = postMatch[2];
        result.embedUrl = `https://www.instagram.com/p/${result.videoId}/embed`;
      }
    }
    
    // YouTube
    else if (hostname.includes('youtube.com') || hostname.includes('youtu.be')) {
      result.platform = 'youtube';
      
      // Format: https://www.youtube.com/watch?v=XXXXXX
      // Format: https://youtu.be/XXXXXX
      // Format: https://www.youtube.com/shorts/XXXXXX
      let videoId = null;
      
      if (hostname.includes('youtu.be')) {
        videoId = urlObj.pathname.slice(1).split('?')[0];
      } else if (url.includes('/shorts/')) {
        const shortsMatch = url.match(/\/shorts\/([A-Za-z0-9_-]+)/);
        if (shortsMatch) videoId = shortsMatch[1];
      } else {
        videoId = urlObj.searchParams.get('v');
      }
      
      if (videoId) {
        result.videoId = videoId;
        result.embedUrl = `https://www.youtube.com/embed/${videoId}`;
      }
    }
  } catch (e) {
    console.error('Failed to parse video URL:', e);
  }

  return result;
}

export function getVideoThumbnail(embedInfo: VideoEmbedInfo): string | null {
  if (embedInfo.platform === 'youtube' && embedInfo.videoId) {
    return `https://img.youtube.com/vi/${embedInfo.videoId}/maxresdefault.jpg`;
  }
  return null;
}
