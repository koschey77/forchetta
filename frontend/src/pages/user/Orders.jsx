import { Link } from 'react-router-dom';

const Orders = () => {
  // Наразі виводимо порожній стан (можна додати логіку отримання списку замовлень в майбутньому)
  const orders = [];

  if (orders.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center px-[15px] lg:px-[30px] pt-[20px] sm:pt-5 pb-16 gap-0 sm:gap-[10px] w-full min-h-[400px] sm:min-h-[607px] rounded-[10px]">
        <img 
          src="/image36.png" 
          alt="Немає замовлень" 
          className="w-[285px] h-[233px] sm:w-[570px] sm:h-[466px] object-contain"
        />
        <div className="flex flex-col items-center justify-center p-0 gap-[15px] sm:gap-[20px] w-full max-w-[638px]">
          <h2 className="font-montserrat font-semibold text-[20px] sm:text-[32px] leading-[26px] sm:leading-[39px] text-choco-light text-center w-full">
            У вас ще немає жодного замовлення
          </h2>
          <p className="font-montserrat font-medium text-[14px] sm:text-[18px] leading-[18px] sm:leading-[22px] text-choco-light text-center w-full">
            Не знаєте, з чого почати? Перегляньте наші бестселери!
          </p>
          <Link 
            to="/catalog"
            className="flex flex-row justify-center items-center px-[30px] py-[16px] gap-[10px] w-[235px] h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90 mt-[5px]"
          >
            <span className="font-montserrat font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-creamy text-center">
              Перейти до каталогу
            </span>
          </Link>
        </div>
      </div>
    );
  }

  // Місце для майбутнього відображення списку замовлень
  return (
    <div>
      Список замовлень
    </div>
  );
};

export default Orders;
