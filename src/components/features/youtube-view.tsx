interface YoutubeViewProps {
  videoLinks: string[];
}

function getYouTubeId(url: string) {
    if(!url) return null;
    try {
        const urlObj = new URL(url);
        if (urlObj.hostname === 'youtu.be') {
            return urlObj.pathname.slice(1);
        }
        if (urlObj.hostname.includes('youtube.com')) {
            if (urlObj.pathname === '/watch') {
                return urlObj.searchParams.get('v');
            }
            if (urlObj.pathname.startsWith('/embed/')) {
                return urlObj.pathname.split('/')[2];
            }
        }
    } catch(e) {
        // Fallback for non-url strings
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    }
    return null;
}

export default function YoutubeView({ videoLinks }: YoutubeViewProps) {

  if (!videoLinks || videoLinks.length === 0) {
    return (
      <div className="text-center text-muted-foreground">
        <p>No relevant YouTube videos were found for this topic.</p>
      </div>
    );
  }

  const validVideos = videoLinks.map(link => ({link, videoId: getYouTubeId(link)})).filter(v => v.videoId);

  if(validVideos.length === 0) {
    return (
        <div className="text-center text-muted-foreground">
          <p>Could not load any of the YouTube videos found.</p>
        </div>
      );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {validVideos.map(({link, videoId}) => {
        return (
          <div key={link} className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}`}
              title={`YouTube video player for ${link}`}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-lg shadow-lg"
            ></iframe>
          </div>
        );
      })}
    </div>
  );
}
