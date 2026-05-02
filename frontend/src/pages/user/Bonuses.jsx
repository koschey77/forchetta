import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useUserStore } from '../../stores/useUserStore';
import { orderAPI } from '../../services/api';

const Bonuses = () => {
  const { user } = useUserStore();
  // Отримуємо кількість бонусів користувача, або 0
  const bonusPoints = user?.bonusPoints || 0;

  const { data: myOrders, isLoading } = useQuery({
    queryKey: ['my-orders'],
    queryFn: orderAPI.getMyOrders,
    staleTime: 60 * 1000,
  });

  const formatDate = (dateString) => new Date(dateString).toLocaleDateString('uk-UA', { 
    day: '2-digit', 
    month: '2-digit', 
    year: 'numeric' 
  });

  const bonusHistory = myOrders?.reduce((acc, order) => {
    const date = formatDate(order.createdAt);
    
    // Створення об'єкта для списаних бонусів
    if (order.appliedBonuses && order.appliedBonuses > 0) {
      acc.push({
        id: `${order._id}-applied`,
        date,
        action: 'Списання (оплата замовлення)',
        orderStr: `№${order.orderNumber || order._id.slice(-6)}`,
        amount: `- ${order.appliedBonuses} балів`,
        type: 'minus',
        timestamp: new Date(order.createdAt).getTime()
      });
    }
    
    // Створення об'єкта для нарахованих бонусів (кешбек)
    if (order.earnedBonuses && order.earnedBonuses > 0) {
      acc.push({
        id: `${order._id}-earned`,
        date,
        action: 'Кешбек за замовлення',
        orderStr: `№${order.orderNumber || order._id.slice(-6)}`,
        amount: `+ ${order.earnedBonuses} балів`,
        type: 'plus',
        // Додаємо 1мс, щоб нарахування показувалось вище (пізніше) за списання в межах одного замовлення
        timestamp: new Date(order.createdAt).getTime() + 1 
      });
    }
    
    return acc;
  }, []).sort((a, b) => b.timestamp - a.timestamp) || [];

  return (
    <div className="flex flex-col items-center px-[15px] sm:px-[30px] pt-[20px] pb-[60px] w-full gap-[30px] sm:gap-[45px] max-w-[1440px] mx-auto">
      
      {/* Кешбек за замовлення */}
      <div className="flex flex-col items-center gap-[20px] w-full max-w-[644px]">
        <h3 className="font-montserrat font-light text-[20px] sm:text-[24px] leading-[24px] sm:leading-[29px] text-choco-dark text-center">
          Кешбек за замовлення
        </h3>
        <div className="flex flex-row justify-center items-start w-full py-[20px] sm:py-[25px] px-[10px] gap-[20px] sm:gap-[52px] border border-choco-light/50 rounded-[15px] h-auto sm:min-h-[175px]">
          <div className="flex flex-col items-center gap-[15px] sm:gap-[25px]">
            <span className="font-montserrat font-normal text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center mb-1">
              Сума замовлення
            </span>
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center">
              від 500 грн
            </span>
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center">
              від 1000 грн
            </span>
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center">
              від 1500 грн
            </span>
          </div>
          
          <div className="flex flex-col items-center gap-[15px] sm:gap-[25px]">
            <span className="font-montserrat font-normal text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center mb-1">
              % кешбеку балами
            </span>
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center">
              5 %
            </span>
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center">
              10 %
            </span>
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[20px] text-choco-light text-center">
              15 %
            </span>
          </div>
        </div>
      </div>

      {/* Додаткові бонуси */}
      <div className="flex flex-col items-center gap-[20px] w-full max-w-[644px]">
        <h3 className="font-montserrat font-light text-[20px] sm:text-[24px] leading-[24px] sm:leading-[29px] text-choco-dark text-center">
          Додаткові бонуси
        </h3>
        <div className="flex flex-col items-center justify-center gap-[20px] sm:gap-[30px] w-full py-[30px] px-[15px] border border-choco-light/50 rounded-[15px] h-auto sm:min-h-[175px]">
          <div className="flex flex-row items-center gap-[15px] sm:gap-[24px] w-full max-w-[420px]">
            <img src="/cake.png" alt="День Народження" className="w-[50px] h-[50px] sm:w-[74px] sm:h-[74px] object-contain flex-shrink-0" />
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-choco-light">
              Бонус на День Народження<br className="hidden sm:block"/> (нараховується автоматично)
            </span>
          </div>
          
          <div className="flex flex-row items-center gap-[15px] sm:gap-[24px] w-full max-w-[420px]">
            <img src="/sales.png" alt="Сезонні акції" className="w-[50px] h-[50px] sm:w-[74px] sm:h-[74px] object-contain flex-shrink-0" />
            <span className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-choco-light">
              Сезонні акції та промокоди<br className="hidden sm:block"/> (деталі на сторінці “Акції”)
            </span>
          </div>
        </div>
      </div>

      {/* Заголовок та Банер */}
      <div className="flex flex-col items-center gap-[20px] w-full max-w-[1320px] mt-[10px] sm:mt-[20px]">
        <h2 className="font-montserrat font-semibold text-[24px] sm:text-[32px] leading-[29px] sm:leading-[39px] text-choco-light text-center">
          Наразі у вас <span className="text-wine-red">{bonusPoints} бонусів</span>
        </h2>

        <div className="flex flex-row items-center justify-center p-[20px] sm:px-[30px] sm:py-[20px] gap-[15px] sm:gap-[20px] w-full bg-dark-creamy rounded-[15px] min-h-[100px]">
          <div className="flex-shrink-0 hidden sm:flex items-center justify-center">
            {/* Іконка Оклику як у макеті */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="14" cy="14" r="13" stroke="#705A5A" strokeWidth="2"/>
              <path d="M14 8V16" stroke="#705A5A" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="14" cy="20" r="1.5" fill="#705A5A"/>
            </svg>
          </div>
          <div className="flex flex-col items-center gap-[5px]">
            <p className="font-montserrat font-medium text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-choco-light text-center">
              Використовуйте для оплати до 30% вартості майбутніх замовлень.
            </p>
            <p className="font-montserrat font-semibold text-[14px] sm:text-[16px] leading-[18px] sm:leading-[20px] text-choco-light text-center">
              1 бал = 1 грн. Бонуси накопичуються автоматично з кожного замовлення.
            </p>
          </div>
        </div>
      </div>

      {/* Історія бонусів */}
      <div className="flex flex-col items-center py-[20px] px-[15px] md:px-[6px] gap-[20px] w-full max-w-[375px] md:max-w-[964px] min-h-[510px] md:min-h-[545px] rounded-[10px] mt-[10px] md:mt-[20px]">
        {isLoading ? (
           <div className="flex justify-center py-10 font-montserrat text-choco-light">Завантаження історії...</div>
        ) : bonusHistory.length > 0 ? (
          bonusHistory.map((item) => (
            <div 
              key={item.id} 
              className="flex flex-row justify-between items-start px-[12px] py-[10px] gap-[5px] md:gap-[52px] w-full max-w-[345px] md:max-w-[644px] min-h-[85px] border border-choco-light/50 rounded-[15px] box-border"
            >
              {/* Дата */}
              <div className="flex flex-col items-start gap-[5px] flex-shrink-0 w-[49px] md:w-[83px]">
                <span className="font-montserrat font-medium md:font-normal text-[12px] md:text-[16px] leading-[15px] md:leading-[20px] text-choco-light h-[15px] md:h-[20px]">Дата</span>
                <span className="font-montserrat font-light md:font-semibold text-[10px] md:text-[16px] leading-[12px] md:leading-[20px] text-choco-light flex items-center h-auto md:h-[40px] mt-[2px] md:mt-0">
                  {item.date}
                </span>
              </div>

              {/* Опис */}
              <div className="flex flex-col items-start gap-[5px] flex-shrink-0 w-[100px] md:w-[293px]">
                <span className="font-montserrat font-medium md:font-normal text-[12px] md:text-[16px] leading-[15px] md:leading-[20px] text-choco-light h-[15px] md:h-[20px]">Опис</span>
                <div className="font-montserrat font-light md:font-semibold text-[12px] md:text-[16px] leading-[15px] md:leading-[20px] text-choco-light flex flex-col justify-center h-auto md:h-[40px] mt-[2px] md:mt-0">
                  <span>{item.action}</span>
                  <span className="opacity-80 text-[10px] md:text-[14px] leading-tight">{item.orderStr}</span>
                </div>
              </div>

              {/* Сума */}
              <div className="flex flex-col items-start md:items-center gap-[5px] flex-shrink-0 w-[115px] md:w-[144px]">
                <div className="flex flex-row items-center md:pl-[10px] h-[15px] md:h-[20px]">
                  <span className="font-montserrat font-medium md:font-normal text-[12px] md:text-[16px] leading-[15px] md:leading-[20px] text-choco-light">Сума</span>
                </div>
                <div className={`flex flex-row justify-center items-center px-[10px] md:px-[30px] w-[115px] md:w-[144px] h-[40px] rounded-[31px] ${item.type === 'minus' ? 'bg-[#767676]' : 'bg-wine-red'}`}>
                  <span className="font-montserrat font-medium md:font-semibold text-[14px] md:text-[16px] leading-[17px] md:leading-[20px] text-creamy whitespace-nowrap truncate text-center">
                    {item.amount}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-center py-10 font-montserrat text-choco-light text-center">
            Історія бонусів порожня. Робіть замовлення та отримуйте кешбек!
          </div>
        )}
      </div>

      {/* Кнопка "До каталогу" */}
      <Link 
        to="/catalog"
        className="flex flex-row justify-center items-center px-[30px] py-[16px] gap-[10px] w-[235px] sm:w-[266px] h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90 mt-[10px]"
      >
        <span className="font-montserrat font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-creamy text-center">
          До каталогу
        </span>
      </Link>
      
    </div>
  );
};

export default Bonuses;
