<!DOCTYPE html>
<html lang="uk">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Admin Add Product</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400&family=Inter:wght@400&family=Montserrat:wght@300;400;500;600&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; }
    body { margin: 0; font-family: 'Montserrat', sans-serif; background: #F5EEE0; }
    .font-cormorant { font-family: 'Cormorant Garamond', serif; }
    .input-pill {
      background: #FFFBF2;
      border: 1px solid #705A5A;
      border-radius: 31px;
      height: 43px;
      padding: 8px 20px;
      font-size: 16px;
      color: #888888;
      width: 100%;
      outline: none;
    }
    .input-pill::placeholder { color: #888888; }
    .textarea-box {
      background: #FFFBF2;
      border: 1px solid #705A5A;
      border-radius: 10px;
      padding: 20px 30px;
      font-size: 14px;
      color: #888888;
      width: 100%;
      outline: none;
      resize: none;
    }
    .textarea-box::placeholder { color: #888888; }
    .dropdown-box {
      background: #FFFBF2;
      border: 1px solid #705A5A;
      border-radius: 31px;
      padding: 12px 20px;
      font-size: 16px;
      color: #637381;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      height: 46px;
    }
    .btn-primary {
      background: #893E3E;
      color: #F5EEE0;
      border-radius: 31px;
      height: 50px;
      font-size: 14px;
      font-weight: 500;
      width: 100%;
    }
    .btn-outline {
      border: 1px solid #893E3E;
      color: #893E3E;
      border-radius: 31px;
      height: 50px;
      font-size: 13px;
      width: 100%;
      background: transparent;
    }
  </style>
</head>
<body>
  <div id="root"></div>

  <script src="https://cdn.jsdelivr.net/npm/react@18.0.0/umd/react.development.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/react-dom@18.0.0/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>

  <script type="text/babel">
    const Plus = ({ size = 24, line = 2 }) => (
      <div className="relative" style={{ width: size, height: size }}>
        <span className="absolute left-0 right-0 top-1/2" style={{ height: line, background: 'rgba(112,90,90,0.5)', transform: 'translateY(-50%)' }}></span>
        <span className="absolute top-0 bottom-0 left-1/2" style={{ width: line, background: 'rgba(112,90,90,0.5)', transform: 'translateX(-50%)' }}></span>
      </div>
    );

    const ArrowDown = ({ className = "" }) => (
      <svg className={className} viewBox="0 0 20 20" fill="none" stroke="#637381" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8l4 4 4-4" />
      </svg>
    );

    const CancelArrow = () => (
      <svg className="w-[9px] h-[6px] rotate-90" viewBox="0 0 9 6" fill="none">
        <path d="M1 1l3.5 4L8 1" stroke="#893E3E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );

    const CheckboxRow = ({ label }) => (
      <div className="flex items-center gap-[10px] text-[16px] text-[#705A5A] font-light">
        <div className="w-[22px] h-[22px] border border-[#705A5A] rounded-[5px]"></div>
        <span>{label}</span>
      </div>
    );

    const RadioRow = ({ label, active }) => (
      <div className="flex items-center gap-[15px]">
        <div className={`w-[20px] h-[20px] rounded-full flex items-center justify-center ${active ? 'border-2 border-[#705A5A]' : 'border border-[rgba(112,90,90,0.5)]'}`}>
          {active && <div className="w-[10px] h-[10px] bg-[#705A5A] rounded-full"></div>}
        </div>
        <span className="text-[16px] text-[#888888]">{label}</span>
      </div>
    );

    const App = () => (
      <div className="bg-[#F5EEE0] min-h-screen">
        <div className="mx-auto w-full max-w-[375px] sm:max-w-[1024px] px-[15px] sm:px-[30px] pt-[10px] sm:pt-[20px] pb-[30px] sm:pb-[40px]">
          <div className="space-y-10 sm:space-y-[40px]">
            <header className="space-y-[20px] sm:space-y-[24px]">
              <div className="font-cormorant text-[24px] leading-[29px] sm:text-[30px] sm:leading-[36px] text-[#2B1A12]">Сторінка адміна</div>
              <div className="flex items-center justify-between gap-[20px] bg-[#E3D6BF] rounded-[30px] px-[15px] py-[10px] sm:py-0 sm:h-[44px] w-full sm:w-[349px]">
                <div className="text-[12px] sm:text-[18px] font-medium sm:font-semibold text-[#705A5A]">Оформлення нового товару</div>
                <svg className="w-[19px] h-[16px] rotate-180" viewBox="0 0 19 16" fill="none"><path d="M4 6l5.5 5L15 6" stroke="#705A5A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
            </header>

            <section className="space-y-[24px] sm:space-y-[24px]">
              <div className="font-cormorant text-[30px] leading-[36px] text-[#2B1A12]">Назва та опис</div>
              <div className="flex flex-col sm:flex-row gap-[20px]">
                <div className="w-full sm:w-[349px] space-y-[20px] sm:space-y-[16px]">
                  <div className="space-y-[6px] sm:space-y-[4px]">
                    <div className="text-[16px] text-[#888888]">Назва товару</div>
                    <input className="input-pill" />
                  </div>
                  <div className="space-y-[6px] sm:space-y-[4px]">
                    <div className="text-[16px] text-[#888888]">Опис товару</div>
                    <textarea className="textarea-box h-[200px] sm:h-[200px]" placeholder="Введіть опис продукту..."></textarea>
                  </div>
                </div>

                <div className="w-full sm:w-[477px] space-y-[12px] sm:space-y-[8px]">
                  <div className="text-[16px] text-[#888888]">Додайте фото продукту</div>
                  <div className="flex flex-col sm:flex-row gap-[11px] sm:gap-[25px]">
                    <div className="w-full sm:w-[226px] h-[280px] sm:h-[283px] border-2 border-[rgba(112,90,90,0.5)] sm:border-dashed rounded-[5px] sm:rounded-[48px] bg-[#FFFBF2] flex flex-col items-center justify-center gap-[28px]">
                      <div className="w-[109px] h-[109px] rounded-full border border-[#E3D6BF] sm:border-[rgba(112,90,90,0.5)] flex items-center justify-center">
                        <Plus size={54} line={2} />
                      </div>
                      <div className="text-center text-[13px] leading-[16px] text-[#888888] w-[186px]">Перетяніть фото сюди або натисніть щоб завантажити</div>
                    </div>
                    <div className="grid grid-cols-4 sm:flex sm:flex-wrap gap-[11px] sm:gap-x-[20px] sm:gap-y-[11px] sm:w-[226px]">
                      {[0,1,2,3].map((i) => (
                        <div key={i} className="w-full sm:w-[103px] h-[80px] sm:h-[135px] border-2 border-[rgba(112,90,90,0.5)] border-dashed rounded-[5px] sm:rounded-[24px] bg-[#FFFBF2] flex items-center justify-center">
                          <div className="w-[50px] h-[50px] sm:w-[40px] sm:h-[40px] rounded-full border border-[rgba(112,90,90,0.5)] flex items-center justify-center">
                            <Plus size={18} line={2} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-[24px]">
              <div className="font-cormorant text-[30px] leading-[36px] text-[#2B1A12]">Склад та категорія</div>
              <div className="flex flex-col sm:flex-row gap-[20px]">
                <div className="w-full sm:w-[343px] space-y-[4px]">
                  <div className="text-[16px] text-[#888888]">Склад</div>
                  <textarea className="textarea-box h-[91px]" placeholder="Зазначте склад продукту"></textarea>
                </div>
                <div className="w-full sm:w-[226px] space-y-[10px]">
                  <div className="text-[16px] text-[#888888]">Категорія</div>
                  <div className="dropdown-box">
                    <span>Оберіть категорію</span>
                    <ArrowDown className="w-[16px] h-[16px]" />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-[24px]">
              <div className="font-cormorant text-[30px] leading-[36px] text-[#2B1A12]">Ціна продукту</div>
              <div className="flex flex-col sm:flex-row gap-[20px] sm:gap-[104px]">
                <div className="w-full sm:w-[235px] space-y-[4px]">
                  <div className="text-[16px] text-[#888888]">Ціна товару</div>
                  <input className="input-pill" placeholder="Введіть ціну продукту" />
                </div>
                <div className="w-full sm:w-[261px] space-y-[4px]">
                  <div className="text-[16px] text-[#888888]">Акційна ціна</div>
                  <input className="input-pill" placeholder="Введіть зіну зі знижкою" />
                </div>
              </div>
            </section>

            <section className="space-y-[24px]">
              <div className="font-cormorant text-[30px] leading-[36px] text-[#2B1A12]">Вага та кількість в наявності</div>
              <div className="flex flex-col sm:flex-row gap-[20px]">
                <div className="w-full sm:w-[268px] space-y-[4px]">
                  <div className="text-[16px] text-[#888888]">Вага</div>
                  <input className="input-pill" placeholder="Введіть вагу (гр.) продукту" />
                </div>
                <div className="w-full sm:w-[335px] space-y-[4px]">
                  <div className="text-[16px] text-[#888888]">Кількість одиниць</div>
                  <input className="input-pill" placeholder="Введіть к-сть продукту в наявності" />
                </div>
              </div>
            </section>

            <section className="space-y-[24px]">
              <div className="font-cormorant text-[30px] leading-[36px] text-[#2B1A12]">Умови зберігання та інші варіанти</div>
              <div className="flex flex-col sm:flex-row gap-[29px]">
                <div className="w-full sm:w-[300px] space-y-[15px]">
                  <div className="text-[16px] text-[#888888]">Умови зберігання</div>
                  <RadioRow label="до +20°C" />
                  <RadioRow label="при +2°C... +6°C." active />
                </div>
                <div className="w-full sm:w-[183px] space-y-[15px]">
                  <div className="text-[16px] text-[#705A5A] font-light">Склад</div>
                  <div className="space-y-[15px]">
                    <CheckboxRow label="З горіхами" />
                    <CheckboxRow label="Без горіхів" />
                    <CheckboxRow label="Без пальмоваї олії" />
                    <CheckboxRow label="Без лактози" />
                    <CheckboxRow label="Без глютену" />
                  </div>
                </div>
              </div>

              <div className="w-full sm:w-[273px] space-y-[10px]">
                <div className="text-[16px] text-[#888888]">Термін зберігання</div>
                <div className="dropdown-box">
                  <span>Вкажіть термін зберігання</span>
                  <ArrowDown className="w-[16px] h-[16px]" />
                </div>
              </div>
            </section>

            <section>
              <div className="w-full sm:w-[349px] space-y-[12px]">
                <button className="btn-primary">Додати товар</button>
                <button className="btn-outline flex items-center justify-center gap-[10px]">
                  <CancelArrow />
                  <span>Скасувати</span>
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    );

    ReactDOM.createRoot(document.getElementById('root')).render(<App />);
  </script>
</body>
</html>