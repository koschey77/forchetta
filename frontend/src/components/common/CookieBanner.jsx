import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// localStorage.removeItem("cookieConsent")
// cookieConsent: true

const CookieBanner = () => {
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setIsRendered(true);
      // Невелика затримка перед появою для кращого UX
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
    setTimeout(() => setIsRendered(false), 500); // Чекаємо завершення анімації
  };

  if (!isRendered) return null;

  return (
    <div className={`fixed bottom-[20px] left-[15px] right-[15px] md:left-[30px] md:right-auto md:max-w-[420px] z-[9999] bg-choco-dark text-creamy rounded-[15px] p-5 shadow-2xl border border-creamy/20 transition-all duration-500 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-[100px] opacity-0'}`}>
      <div className="flex flex-col gap-3">
        <h3 className="font-cormorant font-bold text-xl md:text-2xl">Ми цінуємо вашу приватність 🍪</h3>
        
        <p className="font-montserrat font-light text-sm md:text-[15px] leading-relaxed text-creamy/90">
          Наш сайт використовує файли cookie для збереження товарів у кошику та авторизації. Ми не використовуємо сторонні рекламні трекери.
          <Link to="/cookies" onClick={() => setIsVisible(false)} className="inline-block underline underline-offset-2 ml-1 font-medium hover:text-white transition-colors">
            Дізнатися більше
          </Link>
        </p>

        <div className="flex justify-end mt-2">
          <button 
            onClick={handleAccept}
            className="bg-creamy text-choco-dark px-6 py-2.5 rounded-[30px] font-montserrat font-medium text-sm hover:bg-white hover:scale-105 active:scale-95 transition-all w-full md:w-auto"
          >
            Зрозуміло
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;