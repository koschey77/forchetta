import React from 'react';

const PrivacyPolicyPage = () => {
  return (
    <div className="bg-creamy px-[15px] py-[30px] md:px-[30px] lg:px-[60px] w-full flex flex-col items-center">
      <div className="w-full flex justify-start mb-[24px]">
        <h1 className="font-montserrat font-semibold text-[18px] leading-[22px] md:text-[24px] md:leading-[29px] text-choco-dark">
          Політика конфіденційності
        </h1>
      </div>

      <div className="w-full flex flex-col gap-4 font-montserrat font-normal text-[12px] leading-[15px] md:text-[18px] md:leading-[22px] text-choco-light bg-transparent rounded-lg">
        
        <div>
          <p className="mb-2"><strong>Політика конфіденційності інтернет-магазину Forchetta</strong></p>
        </div>

        <div>
          <p className="mb-2"><strong>1. Загальні положення</strong></p>
          <p>1.1. Ця Політика конфіденційності визначає порядок збору, використання та захисту персональних даних користувачів сайту інтернет-магазину Forchetta.</p>
          <p>1.2. Користуючись сайтом, користувач погоджується з умовами цієї політики.</p>
        </div>

        <div>
          <p className="mb-2"><strong>2. Які дані ми збираємо</strong></p>
          <p>Ми можемо збирати наступні персональні дані:</p>
          <ul className="list-disc pl-[18px] mt-1 space-y-1 marker:text-choco-light">
            <li>ім&apos;я та прізвище</li>
            <li>номер телефону</li>
            <li>електронну пошту</li>
            <li>адресу доставки</li>
            <li>інформацію про замовлення</li>
          </ul>
        </div>

        <div>
          <p className="mb-2"><strong>3. Мета збору даних</strong></p>
          <p>Персональні дані використовуються для:</p>
          <ul className="list-disc pl-[18px] mt-1 space-y-1 marker:text-choco-light">
            <li>оформлення та виконання замовлень</li>
            <li>зв&apos;язку з клієнтом</li>
            <li>покращення роботи сайту</li>
            <li>інформування про новини та акції</li>
          </ul>
        </div>

        <div>
          <p className="mb-2"><strong>4. Захист інформації</strong></p>
          <p>Ми вживаємо необхідних організаційних та технічних заходів для захисту персональних даних користувачів від несанкціонованого доступу.</p>
        </div>

        <div>
          <p className="mb-2"><strong>5. Передача даних третім особам</strong></p>
          <p>Персональні дані можуть передаватися третім особам лише у випадках:</p>
          <ul className="list-disc pl-[18px] mt-1 space-y-1 marker:text-choco-light">
            <li>для здійснення доставки</li>
            <li>у випадках, передбачених законодавством України</li>
          </ul>
        </div>

        <div>
          <p className="mb-2"><strong>6. Файли cookie</strong></p>
          <p>Сайт може використовувати файли cookie для покращення роботи та зручності користувачів.</p>
        </div>

        <div>
          <p className="mb-2"><strong>7. Права користувача</strong></p>
          <p>Користувач має право:</p>
          <ul className="list-disc pl-[18px] mt-1 space-y-1 marker:text-choco-light">
            <li>отримати інформацію про свої персональні дані</li>
            <li>вимагати їх зміну або видалення</li>
            <li>відкликати згоду на обробку даних</li>
          </ul>
        </div>

        <div>
          <p className="mb-2"><strong>8. Зміни політики</strong></p>
          <p>Адміністрація сайту має право змінювати цю політику конфіденційності без попереднього повідомлення.</p>
        </div>

      </div>
    </div>
  );
};

export default PrivacyPolicyPage;
