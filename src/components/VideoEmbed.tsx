
import { Play } from "lucide-react";
import { useState } from "react";

interface Props {
  url: string;
  poster?: string;
}

export default function VideoEmbed({ url, poster }: Props) {
  const [showIframe, setShowIframe] = useState(false);

  // Helper para extrair ID do YouTube
  const getYoutubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Helper para extrair ID do Vimeo
  const getVimeoId = (url: string) => {
    const regExp = /vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^\/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:$|\/|\?)/;
    const match = url.match(regExp);
    return match ? match[1] : null;
  };

  const youtubeId = getYoutubeId(url);
  const vimeoId = getVimeoId(url);

  if (youtubeId) {
    const embedUrl = `https://www.youtube.com/embed/${youtubeId}?autoplay=1&rel=0`;
    
    if (!showIframe) {
      return (
        <div 
          className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
          onClick={() => setShowIframe(true)}
        >
          <img 
            src={poster || `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg`} 
            alt="Trailer thumbnail" 
            className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-80"
          />
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-transform hover:scale-110">
              <Play className="h-8 w-8 translate-x-0.5 fill-current" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video player"
        />
      </div>
    );
  }

  if (vimeoId) {
    const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1`;
    
    if (!showIframe) {
      return (
        <div 
          className="group relative aspect-video w-full cursor-pointer overflow-hidden bg-black"
          onClick={() => setShowIframe(true)}
        >
          {poster && (
            <img 
              src={poster} 
              alt="Trailer thumbnail" 
              className="h-full w-full object-cover opacity-60 transition-transform duration-500 group-hover:scale-105 group-hover:opacity-80"
            />
          )}
          <div className="absolute inset-0 grid place-items-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_hsl(var(--primary)/0.6)] transition-transform hover:scale-110">
              <Play className="h-8 w-8 translate-x-0.5 fill-current" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="aspect-video w-full overflow-hidden bg-black">
        <iframe
          src={embedUrl}
          className="h-full w-full"
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          title="Vimeo video player"
        />
      </div>
    );
  }

  // Fallback para links directos (usando o VideoPlayer existente se for possível)
  return (
    <div className="aspect-video w-full overflow-hidden bg-black">
      <video src={url} controls className="h-full w-full" poster={poster} />
    </div>
  );
}
