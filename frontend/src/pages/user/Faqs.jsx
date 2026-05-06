import { useState } from 'react';

const faqData = [
  {
    question: "Як дізнатись статус замовлення?",
    answer: "За статусом та терміном виконання замовлення можна слідкувати у кабінеті користувача. Також статус замовлення автоматично приходить на електронну пошту."
  },
  {
    question: "Які терміни виконання замовлення?",
    answer: "Термін виконання замовлення від 1 до 3 робочих днів. Замовлення, здійснене до 12:00 год, формується та відправляється протягом робочого дня, замовлення, здійснене після 15:00 год, – на наступний день."
  },
  {
    question: "Які є способи оплати?",
    answer: "Оплата при оформленні замовлення (онлайн)\n1. Безготівкова оплата банківською карткою через LiqPay: після підтвердження замовлення слід натиснути у персональному кабінеті кнопку \"Оплатити\". Платіжна система LiqPay відкриє вікно \"Картка\", що дозволить здійснити оплату і сформувати рахунок.\n\nОплата при отриманні замовлення\n1. Оплата у відділенні Нової Пошти: отримувач повинен оплатити повну вартість замовлення з доставкою та вартість послуги перенаправлення коштів згідно з тарифами Нової Пошти (20 грн +2% від суми переказу)."
  },
  {
    question: "Які є способи доставки?",
    answer: "Доставка по Україні:\n1. У відділення Нової Пошти (оплата та доставка згідно з тарифами та умовами перевізника).\n2. Кур'єром Нової Пошти за вказаною адресою (оплата та доставка згідно з тарифами та умовами перевізника)."
  },
  {
    question: "Чи здійснюється доставка за кордон?",
    answer: "Зараз доставка продукції з інтернет-крамниці «Forchetta» за кордон не здійснюється."
  },
  {
    question: "Звідки відправляються замовлення та які терміни доставки?",
    answer: "Усі замовлення відправляються із Києва. Відслідкувати замовлення, можна за номером експрес-накладної (ЕН), яке автоматично приходить на електронну пошту. Термін доставки від 1 до 3 днів в залежності від регіону доставки та умов роботи служби доставки."
  },
  {
    question: "Який графік роботи інтернет-крамниці?",
    answer: "Оформлення замовлень: цілодобово. Формування та відправлення замовлень: понеділок - п'ятниця, 09:30 - 18:00 год. Покупки, здійснені після 18:00 год та у святкові дні, обробляються менеджером в наступні робочі дні."
  },
  {
    question: "Чи відрізняються ціни в інтернет-крамниці від цін в крамниці по мережі?",
    answer: "Ціни на продукцію в інтернет-крамниці та в інших крамницях мережі «Forchetta» не відрізняються."
  },
  {
    question: "Чи можна зробити замовлення по телефону?",
    answer: "Так, звичайно, замовлення можна зробити за телефоном 0 800 000. Менеджер інтернет-крамниці залюбки допоможе оформити замовлення та зробити покупку."
  }
];

const FaqAccordionItem = ({ question, answer, isOpen, onClick }) => {
  return (
    <div 
      className="flex flex-col items-start px-[15px] pt-[20px] pb-[20px] md:px-[20px] md:pt-[26px] md:pb-[28px] w-full max-w-[994px] bg-light-creamy border border-wine-red rounded-[14px] cursor-pointer transition-all duration-300"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex flex-row justify-between items-center w-full min-h-[29px] gap-[15px]">
        <h3 className="font-montserrat font-light text-[18px] md:text-[24px] leading-tight md:leading-[29px] text-choco-dark flex-1">
          {question}
        </h3>
        {/* Іконка + або Х */}
        <div className="w-[20px] h-[20px] flex-shrink-0 flex items-center justify-center">
          <svg 
            width="21" height="21" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" 
            className={`transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}
          >
            <path d="M12 2V22" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round"/>
            <path d="M2 12H22" stroke="#2B1A12" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
      </div>
      
      {/* Body */}
      <div className={`overflow-hidden transition-all duration-300 w-full ${isOpen ? 'max-h-[500px] mt-[15px] md:mt-[24px] opacity-100' : 'max-h-0 mt-0 opacity-0'}`}>
        <p className="font-montserrat font-normal text-[14px] md:text-[16px] leading-[18px] md:leading-[20px] text-choco-dark md:w-[903px] whitespace-pre-line">
          {answer}
        </p>
      </div>
    </div>
  );
};

const Faqs = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col items-center pb-[60px] pt-4 w-full gap-[24px] max-w-[1440px] mx-auto">
      <div className="flex flex-col items-center gap-[24px] w-full max-w-[994px]">
        {faqData.map((faq, index) => (
          <FaqAccordionItem 
            key={index} 
            question={faq.question} 
            answer={faq.answer} 
            isOpen={openIndex === index}
            onClick={() => toggleAccordion(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Faqs;
