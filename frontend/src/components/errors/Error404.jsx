import { useNavigate } from 'react-router-dom';

const Error404 = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center w-full py-[60px] px-[15px]">
      
      {/* Изображение ошибки 404 */}
      <img 
        src="https://res.cloudinary.com/dmdlogqqf/image/upload/v1775856089/404_hcyjnd.png" 
        alt="Сторінку не знайдено" 
        className="max-w-full object-contain mb-[60px]"
      />

      <div className="flex flex-col items-center w-full max-w-[493px]">
        {/* Текстовый блок (Frame 1707481540) */}
        <div className="flex flex-col items-center mb-[40px]">
          <h1 className="font-montserrat font-normal text-[80px] sm:text-[100px] leading-[100px] sm:leading-[122px] text-choco-light m-0 text-center">
            404
          </h1>
          <p className="font-montserrat font-light text-[16px] sm:text-[18px] leading-[22px] text-choco-dark m-0 mt-[10px] text-center w-full sm:w-[450px]">
            Упс... Схоже, що сторінка, яку ви шукали, не існує
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

export default Error404;
