import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import ProductSectionSlider from '../components/ui/carousel/ProductSectionSlider'
import api from '../services/api'

export default function ShopsPage() {

  // Завантажуємо Ексклюзиви (Featured)
  const { data: featuredData, isLoading: isFeaturedLoading } = useQuery({
    queryKey: ['featuredProducts'],
    queryFn: async () => {
      const response = await api.products.getFeatured();
      const featuredArray = Array.isArray(response) ? response : (response.products || []);
      
      try {
        const [latestProducts, topSellers] = await Promise.all([
          api.products.getMany({ limit: 6, sortBy: 'createdAt', sortOrder: 'desc' }),
          api.products.getMany({ limit: 6, sortBy: 'salesCount', sortOrder: 'desc' })
        ]);
        
        const latestIds = Array.isArray(latestProducts) ? latestProducts.map(p=>p._id) : (latestProducts?.products || []).map(p => p._id);
        const topSellerIds = Array.isArray(topSellers) ? topSellers.map(p=>p._id) : (topSellers?.products || []).map(p => p._id);
        
        return featuredArray.map(p => ({
          ...p,
          isNewProduct: latestIds.includes(p._id),
          isTopSeller: topSellerIds.includes(p._id)
        }));
      } catch (e) {
        console.error("Не вдалося завантажити бейджі статусу для новинок", e);
        return featuredArray;
      }
    }
  });

  const displayFeaturedProducts = useMemo(() => {
    if (!featuredData) return [];
    return Array.isArray(featuredData) ? featuredData : (featuredData.products || []);
  }, [featuredData]);

  return (
    <div className="flex flex-col bg-creamy min-h-screen pb-[30px] lg:pb-[32px]">
      <div className="w-full max-w-[1440px] mx-auto px-[15px] md:px-[30px] lg:px-[60px]">
        <h1 className="font-cormorant font-bold text-[32px] md:text-[40px] lg:text-[48px] text-choco-light mb-6 md:mb-8 lg:mb-10 text-center">
          Наші магазини
        </h1>
        
        <div className="w-full flex flex-col md:flex-row items-center md:items-start justify-between gap-[10px] md:gap-[20px] lg:gap-[10px]">
          {/* Left Column: Main Shop Image */}
          <div className="flex-1 w-full min-w-0 flex justify-center lg:justify-start overflow-hidden">
            {/* Mobile Image */}
            <img 
              src="/assets/shops/Mobile_Shop.png" 
              alt="Наші магазини" 
              className="w-full h-auto block md:hidden object-cover object-center"
            />
            {/* Tablet Image */}
            <img 
              src="/assets/shops/Tablets_Shop.png" 
              alt="Наші магазини" 
              className="w-full h-auto md:h-[700px] hidden md:block lg:hidden object-cover object-center"
            />
            {/* Desktop Image */}
            <img 
              src="/assets/shops/Desktop_Shop.png" 
              alt="Наші магазини" 
              className="w-full h-auto lg:w-[600px] lg:h-[740px] hidden lg:block object-cover object-center" 
            />
          </div>

          {/* Right Column: Address List Container */}
          <div className="flex-none w-full md:w-[420px] lg:w-[450px] xl:w-[564px] flex flex-col items-stretch md:items-start bg-creamy rounded-[15px] p-0 gap-[10px] md:gap-5">
            {/* "Київ" Header */}
            <div className="flex flex-row items-center gap-[15px] w-full px-0 md:px-[11px]">
              <svg width="35" height="35" viewBox="0 0 35 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.5 2C11.7 2 7 6.7 7 12.5C7 20.375 17.5 33 17.5 33C17.5 33 28 20.375 28 12.5C28 6.7 23.3 2 17.5 2Z" stroke="#705A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17.5 16.5C19.7091 16.5 21.5 14.7091 21.5 12.5C21.5 10.2909 19.7091 8.5 17.5 8.5C15.2909 8.5 13.5 10.2909 13.5 12.5C13.5 14.7091 15.2909 16.5 17.5 16.5Z" stroke="#705A5A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className="font-montserrat font-medium text-[18px] lg:text-[24px] leading-[22px] lg:leading-[29px] text-choco-light">Київ</span>
            </div>

            {/* Cards List */}
            <div className="flex flex-col items-stretch md:items-start w-full gap-[10px] lg:gap-5">
              {[
                { id: 1, address: 'Вул. Старовокзальна, 21' },
                { id: 2, address: 'Вул. Верхній Вал, 16/4' },
                { id: 3, address: 'Вул. Вадима Гетьмана, 8' },
                { id: 4, address: 'Вул. Гната Юри, 6г' },
                { id: 5, address: 'Вул. Васильківська, 34' }
              ].map((shop) => (
                <div 
                  key={shop.id} 
                  className="flex flex-row justify-between items-start w-full border border-choco-light rounded-[15px] bg-creamy md:bg-transparent p-[10px_25px_12px] md:p-[10px_25px] gap-[10px] h-[87px] md:h-[120px] transition-colors hover:bg-light-creamy"
                >
                  {/* Mobile image (displays first in flex-row for mobile) */}
                  <img 
                    src={`/assets/shops/${shop.id}-mobile.png`} 
                    alt={shop.address}
                    className="w-[100px] h-[60px] rounded-[5px] object-cover block md:hidden flex-none self-center"
                  />

                  {/* Text Container */}
                  <div className="flex flex-col items-start gap-[10px] w-[151px] flex-none md:flex-1 xl:flex-none xl:w-[273px]">
                    <h3 className="font-montserrat font-light md:font-medium text-[12px] md:text-[18px] lg:text-[20px] leading-[15px] md:leading-[22px] lg:leading-[24px] text-choco-dark m-0">
                      {shop.address}
                    </h3>
                    <div className="flex flex-col items-start gap-[5px]">
                      <p className="font-montserrat font-light md:font-normal text-[10px] md:text-[16px] leading-[12px] md:leading-[20px] text-choco-dark m-0">
                        +38 (067) 422 09 30
                      </p>
                      <p className="font-montserrat font-light md:font-normal text-[10px] md:text-[16px] leading-[12px] md:leading-[20px] text-choco-dark m-0 whitespace-nowrap">
                        Пн-Пт, 08:00 - 20:00<br className="xl:hidden" /> Сб-Нд, 09:00 - 20:00
                      </p>
                    </div>
                  </div>

                  {/* Desktop/Tablet image (displays last in flex-row for desktop) */}
                  <img 
                    src={`/assets/shops/${shop.id}.png`} 
                    alt={shop.address}
                    className="w-[101px] h-[100px] rounded-[10px] object-cover hidden md:block flex-none"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ProductSectionSlider 
        title="Наші ексклюзиви"
        linkUrl="/catalog?isFeatured=true"
        products={displayFeaturedProducts}
        isLoading={isFeaturedLoading}
      />
    </div>
  )
}
