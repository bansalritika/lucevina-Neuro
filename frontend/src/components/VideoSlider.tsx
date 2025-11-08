import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

const VideoSlider = () => {
  const videos = [
    {
      id: 1,
      title: "Night Renewal Process",
      thumbnail: "/api/placeholder/800/450",
      duration: "2:30"
    },
    {
      id: 2, 
      title: "Science Behind Beauty",
      thumbnail: "/api/placeholder/800/450",
      duration: "3:15"
    },
    {
      id: 3,
      title: "Customer Transformations",
      thumbnail: "/api/placeholder/800/450", 
      duration: "1:45"
    }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto mb-12">
      <Carousel className="w-full">
        <CarouselContent>
          {videos.map((video) => (
            <CarouselItem key={video.id}>
              <div className="p-1">
                <Card className="glass-morphism border-border/50 overflow-hidden">
                  <CardContent className="relative p-0 aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full h-full object-cover"
                    />
                    
                    {/* Video overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    
                    {/* Play button */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <button className="group flex items-center justify-center w-16 h-16 bg-primary/20 hover:bg-primary/30 rounded-full backdrop-blur-sm border border-primary/30 transition-all duration-300 hover:scale-110">
                        <Play className="w-6 h-6 text-primary ml-1 group-hover:text-white transition-colors" />
                      </button>
                    </div>
                    
                    {/* Video info */}
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-lg font-luxury font-semibold text-white mb-1">
                        {video.title}
                      </h3>
                      <p className="text-sm text-white/70">
                        Duration: {video.duration}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="glass-morphism border-primary/30 hover:bg-primary/20" />
        <CarouselNext className="glass-morphism border-primary/30 hover:bg-primary/20" />
      </Carousel>
    </div>
  );
};

export default VideoSlider;