import HeroSlider from '../components/ui/carousel/HeroSlider'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-creamy">
      {/* Секція №1 - Hero Баннер */}
      <HeroSlider />
      
      {/* Сюди пізніше будуть додаватись інші секції */}
    </div>
  )
}
