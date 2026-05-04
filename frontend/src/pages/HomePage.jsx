import HeroSlider from '../components/ui/carousel/HeroSlider'
import HomeCategories from '../components/home/HomeCategories'

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-creamy">
      {/* Секція №1 - Hero Баннер */}
      <HeroSlider />
      
      {/* Секція №3 - Сетка Категорий */}
      <HomeCategories />
    </div>
  )
}
