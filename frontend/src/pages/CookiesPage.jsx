import React from 'react';

const CookiesPage = () => {
  return (
    <div className="mx-auto max-w-[1440px] bg-creamy px-[15px] py-[30px] md:px-[30px] lg:px-[60px] w-full">
      <h1 className="text-3xl font-cormorant font-bold text-choco-dark mb-4 md:mb-6">Політика використання файлів cookie</h1>
      
      <div className="text-[16px] md:text-[18px] font-montserrat font-normal text-choco-dark mb-[30px]">
        
        <p className="mb-4 leading-relaxed">
          Ця Політика використання файлів cookie пояснює, що таке файли cookie і як ми їх використовуємо на сайті <strong>Forchetta</strong>.
          Будь ласка, прочитайте цю політику, щоб зрозуміти, які типи файлів cookie ми використовуємо, яку інформацію ми збираємо та як ця інформація використовується.
        </p>

        <h2 className="text-2xl font-cormorant font-bold text-choco-dark mt-8 mb-4">1. Що таке файли cookie?</h2>
        <p className="mb-4 leading-relaxed">
          Файли cookie — це невеликі текстові файли, які зберігаються у вашому браузері або на жорсткому диску вашого комп'ютера чи мобільного пристрою, коли ви відвідуєте веб-сторінку або додаток. Файли cookie роблять перегляд веб-сайтів зручнішим, запам'ятовуючи ваші налаштування.
        </p>

        <h2 className="text-2xl font-cormorant font-bold text-choco-dark mt-8 mb-4">2. Як ми використовуємо файли cookie?</h2>
        <p className="mb-4 leading-relaxed">
          Ми використовуємо файли cookie для різних цілей, щоб покращити ваш досвід користування нашим інтернет-магазином:
        </p>
        <ul className="list-disc pl-6 mb-4 leading-relaxed space-y-2">
          <li><strong>Суворо необхідні (Strictly Necessary):</strong> Ці файли cookie необхідні для роботи веб-сайту. Вони включають, наприклад, файли cookie, які дозволяють вам входити в захищені зони нашого сайту, використовувати кошик для покупок або користуватися послугами електронного виставлення рахунків.</li>
          <li><strong>Аналітичні або експлуатаційні (Analytics/Performance):</strong> Вони дозволяють нам розпізнавати та підраховувати кількість відвідувачів, а також бачити, як відвідувачі переміщуються нашим сайтом. Це допомагає нам покращити роботу сайту.</li>
          <li><strong>Функціональні (Functional):</strong> Використовуються для того, щоб впізнати вас, коли ви повертаєтесь на наш сайт. Це дозволяє нам персоналізувати контент для вас (наприклад, вибір мови).</li>
          <li><strong>Цільові або рекламні (Targeting):</strong> Ці файли фіксують ваш візит на наш сайт, сторінки, які ви відвідали, та посилання, за якими ви перейшли, для того, щоб зробити рекламу більш релевантною для вас.</li>
        </ul>

        <h2 className="text-2xl font-cormorant font-bold text-choco-dark mt-8 mb-4">3. Зберігання сесій та кошика (Тимчасові дані)</h2>
        <p className="mb-4 leading-relaxed">
          Крім традиційних файлів cookie, ми використовуємо технології локального зберігання (localStorage) та кешування на рівні сервера (Redis), щоб зберегти товари у вашому кошику або список переглянутих товарів між вашими сесіями.
        </p>

        <h2 className="text-2xl font-cormorant font-bold text-choco-dark mt-8 mb-4">4. Як ви можете керувати файлами cookie?</h2>
        <p className="mb-4 leading-relaxed">
          Більшість веб-браузерів дозволяють контролювати файли cookie через налаштування браузера. Ви можете налаштувати свій браузер таким чином, щоб він:
        </p>
        <ul className="list-disc pl-6 mb-4 leading-relaxed space-y-2">
          <li>Відхиляв усі файли cookie;</li>
          <li>Повідомляв вам про надсилання файлу cookie;</li>
          <li>Дозволяв вам видаляти файли cookie.</li>
        </ul>
        <p className="mb-4 leading-relaxed">
          Зверніть увагу: якщо ви використовуєте налаштування свого браузера для блокування всіх файлів cookie (в тому числі суворо необхідних), ви, можливо, не зможете отримати доступ до всіх або окремих частин нашого сайту (наприклад, кошик може не працювати).
        </p>

        <h2 className="text-2xl font-cormorant font-bold text-choco-dark mt-8 mb-4">5. Оновлення політики</h2>
        <p className="mb-4 leading-relaxed">
          Ми можемо час від часу оновлювати цю Політику використання файлів cookie. Ми рекомендуємо вам регулярно перевіряти цю сторінку для отримання найновішої інформації щодо нашої практики використання файлів cookie.
        </p>

        <h2 className="text-2xl font-cormorant font-bold text-choco-dark mt-8 mb-4">6. Зв'язок з нами</h2>
        <p className="mb-4 leading-relaxed">
          Якщо у вас є запитання щодо нашої політики, ви можете зв'язатися з нами в будь-який час через сторінку Контакти або написати нам на email: <strong>forchetta@gmail.com</strong>.
        </p>

      </div>
    </div>
  );
};

export default CookiesPage;