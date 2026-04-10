import { useNavigate } from 'react-router-dom';

const Error500 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full py-[60px] px-[15px]">
      
      {/* Изображение ошибки 500 */}
      <img 
        src="https://res.cloudinary.com/dmdlogqqf/image/upload/v1775856090/500_fa4fmx.png" 
        alt="Помилка 500" 
        className="max-w-full object-contain mb-[60px]"
      />

      <div className="flex flex-col items-center w-full max-w-[493px]">
        {/* Текстовый блок (Frame 1707481540) */}
        <div className="flex flex-col items-center mb-[40px]">
          <h1 className="font-montserrat font-normal text-[100px] leading-[122px] text-choco-light m-0 text-center">
            500
          </h1>
          <p className="font-montserrat font-light text-[18px] leading-[22px] text-choco-dark m-0 mt-[10px] text-center">
            Упс...Щось пішло не так
          </p>
        </div>

        {/* Блок кнопок (Frame 1707481539) */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-[20px] sm:gap-[55px] w-full">
          
          {/* Primary Button */}
          <button 
            onClick={() => navigate('/')}
            className="flex flex-row justify-center items-center px-[30px] py-[16px] w-[219px] h-[52px] bg-wine-red rounded-[50px] transition-all hover:opacity-90 active:scale-95"
          >
            <span className="font-montserrat font-normal text-[16px] leading-[20px] text-creamy">
              До головної
            </span>
          </button>

          {/* Secondary Button */}
          <button 
            onClick={() => navigate(-1)}
            className="box-border flex flex-row justify-center items-center px-[30px] py-[16px] w-[219px] h-[52px] bg-creamy border border-choco-dark rounded-[31px] transition-all hover:opacity-90 active:scale-95"
          >
            <span className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light">
              Повернутися назад
            </span>
          </button>

        </div>
      </div>
    </div>
  );
};

export default Error500;
