import imagePath from './NoConnection.png';

const NoConnection = ({ 
  imageSrc = imagePath,
  onRetry = () => window.location.reload()
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-[60px] px-[15px]">
      
      {/* Изображение сверху */}
      <img 
        src={imageSrc} 
        alt="Немає підключення" 
        className="max-w-full object-contain mb-[45px] sm:mb-[60px]"
      />

      {/* Frame 1707482390 - Auto layout container для текста и кнопки с gap 45px */}
      <div className="flex flex-col items-center gap-[45px] w-full max-w-[661px]">
        
        {/* Frame 1707482389 - Текстовый блок с gap 10px */}
        <div className="flex flex-col items-center gap-[10px] w-full">
          <h2 className="font-montserrat font-semibold text-[24px] sm:text-[32px] sm:leading-[39px] text-center text-choco-dark m-0">
            Немає підключення до Інтернету
          </h2>
          
          <p className="font-montserrat font-light text-[18px] sm:text-[24px] sm:leading-[29px] text-center text-choco-dark m-0">
            Перевірте з&apos;єднання з Інтернетом і спробуйте ще раз
          </p>
        </div>

        {/* Frame 1707482388 - Кнопка Перезавантажити */}
        <button 
          onClick={onRetry}
          className="flex flex-row justify-center items-center px-[40px] sm:px-[88px] py-[23px] gap-[10px] w-full sm:w-[400px] h-[75px] bg-wine-red rounded-[50px] transition-all hover:opacity-90 active:scale-95"
        >
          <span className="font-montserrat font-semibold text-[20px] sm:text-[24px] leading-[29px] text-center text-creamy whitespace-nowrap m-0">
            Перезавантажити
          </span>
        </button>

      </div>
    </div>
  );
};

export default NoConnection;
