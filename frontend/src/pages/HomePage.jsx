import { videoService } from '../services/videoService'

export default function HomePage() {
  // Исходная ссылка (Cloudinary)
  const heroVideoUrl = "https://res.cloudinary.com/dmdlogqqf/video/upload/v1775980887/video_2026-04-12_08-59-41_wojipw.mp4"

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-creamy py-[40px]">
      {/* Контейнер для видео размером 350x350 (мобилка) и 500x500 (десктоп) */}
      <div className="relative w-[350px] h-[300px] sm:w-[500px] sm:h-[400px] overflow-hidden rounded-[20px] shadow-md bg-choco-light/10">
        <video 
          className="absolute inset-0 w-full h-full object-cover [&:fullscreen]:object-contain [&:-webkit-full-screen]:object-contain"
          src={videoService.getOptimizedVideoUrl(heroVideoUrl, { q_auto: true, f_auto: true })}
          controls
          loop 
          playsInline
        />
      </div>
    </div>
  )
}
