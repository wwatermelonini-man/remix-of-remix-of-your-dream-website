import { useVideos, Video } from "@/hooks/useVideos";
import { useSiteContent } from "@/hooks/useSiteContent";

const getEmbedUrl = (video: Video) => {
  if (video.video_type === "youtube") {
    // Extract video ID from various YouTube URL formats
    const match = video.video_url.match(
      /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/
    );
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}`;
    }
    return video.video_url;
  } else if (video.video_type === "tiktok") {
    // TikTok embed URL
    return video.video_url;
  }
  return video.video_url;
};

const VideoSection = () => {
  const { videos, loading } = useVideos();
  const { content } = useSiteContent();

  const youtubeVideos = videos.filter((v) => v.video_type === "youtube" && v.is_active);
  // Shorts section includes both TikTok and YouTube Shorts
  const shortsVideos = videos.filter((v) => (v.video_type === "tiktok" || v.video_type === "youtube_shorts") && v.is_active);

  if (loading) {
    return (
      <>
        <section id="videos" className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">טוען סרטונים...</p>
          </div>
        </section>
        <section id="shorts" className="py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <p className="text-muted-foreground">טוען שורטס...</p>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      {/* YouTube Videos Section - Always render with ID for navigation */}
      <section id="videos" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="section-title mb-10"
            style={{ fontFamily: `'${content.fontFamily}', sans-serif` }}
          >
            {content.videosTitle}
          </h2>
          {youtubeVideos.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {youtubeVideos.map((video) => (
                <div key={video.id} className="minecraft-card overflow-hidden">
                  <div className="aspect-video">
                    <iframe
                      src={getEmbedUrl(video)}
                      title={video.title}
                      className="w-full h-full rounded-lg"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                  <h3 className="mt-4 font-semibold text-foreground">{video.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="minecraft-card text-center py-12">
              <p className="text-muted-foreground">אין סרטונים עדיין. הוסף סרטונים דרך פאנל הניהול!</p>
            </div>
          )}
        </div>
      </section>

      {/* TikTok/Shorts Section - Always render with ID for navigation */}
      <section id="shorts" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 
            className="section-title mb-10"
            style={{ fontFamily: `'${content.fontFamily}', sans-serif` }}
          >
            {content.shortsTitle}
          </h2>
          {shortsVideos.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {shortsVideos.map((video) => (
                <div key={video.id} className="minecraft-card overflow-hidden">
                  {video.video_type === "youtube_shorts" ? (
                    // YouTube Shorts embed
                    <div className="aspect-[9/16]">
                      <iframe
                        src={getEmbedUrl(video)}
                        title={video.title}
                        className="w-full h-full rounded-lg"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  ) : (
                    // TikTok link
                    <div className="aspect-[9/16] bg-muted rounded-lg flex items-center justify-center">
                      <a
                        href={video.video_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:text-accent transition-colors text-center p-4"
                      >
                        <div className="text-4xl mb-2">📱</div>
                        <span className="text-sm">צפה בטיקטוק</span>
                      </a>
                    </div>
                  )}
                  <h3 className="mt-3 font-medium text-foreground text-sm">{video.title}</h3>
                </div>
              ))}
            </div>
          ) : (
            <div className="minecraft-card text-center py-12">
              <p className="text-muted-foreground">אין שורטס עדיין. הוסף סרטוני YouTube Shorts או TikTok דרך פאנל הניהול!</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default VideoSection;
