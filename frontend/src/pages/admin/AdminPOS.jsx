import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { adminUserAPI, productsAPI, orderAPI } from '../../services/api';
import useFilterDebounce from '../../hooks/useFilterDebounce';
import toast from 'react-hot-toast';
import { SearchIcon, CrossIcon } from '../../components/icons';

const formatPrice = (price) => Number(price).toLocaleString('uk-UA');

const AdminPOS = () => {
  // КОРИСТУВАЧ
  const [userQuery, setUserQuery] = useState('');
  const debouncedUserQuery = useFilterDebounce(userQuery, 400, 3);
  const [selectedUser, setSelectedUser] = useState(null);

  // ФОРМА НОВОГО ЮЗЕРА
  const [showNewUserForm, setShowNewUserForm] = useState(false);
  const [newUserData, setNewUserData] = useState({ name: '', phone: '', email: '' });
  const [createdUserPassword, setCreatedUserPassword] = useState(null);

  // ТОВАРИ
  const [productQuery, setProductQuery] = useState('');
  const debouncedProductQuery = useFilterDebounce(productQuery, 400, 2);
  const [cart, setCart] = useState([]);
  
  // ПАКУВАННЯ
  const [packagingCounts, setPackagingCounts] = useState({ 1: 0, 2: 0 }); // 1: Паперовий (10 грн), 2: Подарунковий (15 грн)
  
  // БОНУСИ
  const [bonusInput, setBonusInput] = useState('');
  const [appliedBonuses, setAppliedBonuses] = useState(0);

  // ОПЛАТА
  const [paymentMethod, setPaymentMethod] = useState('cash');

  // АДРЕСА
  const [shippingAddress, setShippingAddress] = useState({
    region: 'Київська',
    city: 'Київ',
    street: '',
    house: '',
    apartment: '',
    postalCode: ''
  });

  // ПОШУК ЮЗЕРІВ
  const { data: usersData, isFetching: isSearchingUsers } = useQuery({
    queryKey: ['pos_user_search', debouncedUserQuery],
    queryFn: () => adminUserAPI.getAll({ search: debouncedUserQuery, limit: 5 }),
    enabled: debouncedUserQuery.length >= 3 && !selectedUser,
  });
  const foundUsers = usersData?.users || [];

  // ПОШУК ТОВАРІВ
  const { data: productsData, isFetching: isSearchingProducts } = useQuery({
    queryKey: ['pos_product_search', debouncedProductQuery],
    queryFn: () => productsAPI.getMany({ search: debouncedProductQuery, limit: 5 }),
    enabled: debouncedProductQuery.length >= 2,
  });
  const foundProducts = Array.isArray(productsData) ? productsData : (productsData?.products || []);

  // МУТАЦІЇ
  const createUserMutation = useMutation({
    mutationFn: (data) => adminUserAPI.create(data),
    onSuccess: (newUser) => {
      setSelectedUser(newUser);
      setShowNewUserForm(false);
      setNewUserData({ name: '', phone: '', email: '' });
      toast.success('Нового клієнта створено!');
      setUserQuery('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Помилка створення клієнта')
  });

  const createOrderMutation = useMutation({
    mutationFn: (data) => orderAPI.create(data),
    onSuccess: (data) => {
      if (paymentMethod === 'card') {
         toast.success('Замовлення створено! Посилання на оплату відправлено клієнту на Email', { duration: 5000 });
         // Якщо треба скопіювати лінк адміну вручну:
         // navigator.clipboard.writeText(data.url);
      } else {
         toast.success('Замовлення успішно створено (Готівка)!');
      }
      
      // Очистка форми
      setSelectedUser(null);
      setCart([]);
      setShippingAddress({ region: 'Київська', city: 'Київ', street: '', house: '', apartment: '', postalCode: '' });
      setPackagingCounts({ 1: 0, 2: 0 });
      setBonusInput('');
      setAppliedBonuses(0);
      setPaymentMethod('cash');
      setUserQuery('');
      setProductQuery('');
    },
    onError: (err) => toast.error(err.response?.data?.message || 'Помилка створення замовлення')
  });

  // ХЕНДЛЕРИ ДЛЯ КОШИКА
  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(i => i.product._id === product._id);
      if (existing) {
        return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setProductQuery(''); // Закриваємо пошук
  };

  const updateQuantity = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.product._id === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }));
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(i => i.product._id !== id));
  };

  // ФОРМА
  const handleCreateOrder = () => {
    if (!selectedUser) return toast.error('Оберіть або створіть клієнта');
    if (cart.length === 0) return toast.error('Кошик порожній');
    if (!shippingAddress.street) return toast.error('Введіть вулицю'); // Будинок тепер не обов'язковий (часто пишуть разом з вулицею)

    const packagingNotes = [];
    if (packagingCounts[1] > 0) packagingNotes.push(`Паперовий пакет (${packagingCounts[1]} од.)`);
    if (packagingCounts[2] > 0) packagingNotes.push(`Подарунковий пакет (${packagingCounts[2]} од.)`);
    
    let finalNotes = 'Оформлено менеджером по телефону';
    if (packagingNotes.length > 0) {
      finalNotes += `\nДодатково: ${packagingNotes.join(', ')}`;
    }

    const orderData = {
      userId: selectedUser._id,
      contactPhone: selectedUser.phone || '0000000000',
      shippingAddress: {
        ...shippingAddress,
        postalCode: shippingAddress.postalCode || '00000'
      },
      paymentMethod,
      packagingPrice: Number(packagingPrice),
      appliedBonuses,
      items: cart.map(i => ({ product: i.product._id, quantity: i.quantity })),
      userNotes: finalNotes,
      generatedPassword: createdUserPassword
    };

    createOrderMutation.mutate(orderData);
  };

  // КАЛЬКУЛЯЦІЯ
  const productsSubtotal = cart.reduce((acc, i) => acc + (i.product.discountPrice || i.product.price) * i.quantity, 0);
  const packagingPrice = (packagingCounts[1] * 10) + (packagingCounts[2] * 15);
  const subtotal = productsSubtotal + packagingPrice;
  const total = subtotal - appliedBonuses;
  
  const userBonuses = selectedUser?.bonusPoints || 0;

  const handleApplyBonus = () => {
    const requestedPoints = Number(bonusInput) || 0;
    const allowedPoints = Math.min(requestedPoints, userBonuses, subtotal);
    setAppliedBonuses(allowedPoints);
  };

  return (
    <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-8 items-start mb-10 pt-4">
      
      {/* ЛІВА КОЛОНКА - КЛІЄНТ ТА АДРЕСА */}
      <div className="flex flex-col gap-6">
        <div className="bg-creamy rounded-[20px] p-6 shadow-sm border border-light-creamy">
          <h2 className="font-cormorant font-bold text-[24px] text-choco-dark mb-4 border-b border-light-creamy pb-2">1. Дані Клієнта</h2>
          
          {!selectedUser ? (
            showNewUserForm ? (
               <div className="space-y-3 bg-light-creamy p-4 rounded-[12px] border border-choco-light/20 shadow-sm relative">
                 <h3 className="font-montserrat font-bold text-[15px] text-choco-dark">Новий клієнт</h3>
                 <input type="text" placeholder="ПІБ (напр. Іван Франко)*" value={newUserData.name} onChange={e => setNewUserData({...newUserData, name: e.target.value})} className="w-full px-3 py-2 bg-transparent border border-choco-light/30 rounded-[8px] font-montserrat text-[14px] focus:outline-none focus:border-wine-red text-choco-dark" />
                 <input type="text" placeholder="Телефон (напр. 0991234567)*" value={newUserData.phone} onChange={e => setNewUserData({...newUserData, phone: e.target.value})} className="w-full px-3 py-2 bg-transparent border border-choco-light/30 rounded-[8px] font-montserrat text-[14px] focus:outline-none focus:border-wine-red text-choco-dark" />
                 <input type="email" placeholder="Email (для відправки лінку на оплату)" value={newUserData.email} onChange={e => setNewUserData({...newUserData, email: e.target.value})} className="w-full px-3 py-2 bg-transparent border border-choco-light/30 rounded-[8px] font-montserrat text-[14px] focus:outline-none focus:border-wine-red text-choco-dark" />
                 
                 <div className="flex gap-2 pt-1">
                   <button onClick={() => setShowNewUserForm(false)} className="px-4 py-2 border border-choco-light/30 rounded-[8px] font-montserrat text-[13px] font-bold text-choco-dark hover:bg-choco-light/10 transition-colors">Скасувати</button>
                   <button onClick={() => {
                       if (!newUserData.name || !newUserData.phone) return toast.error('Заповніть обов\'язкові поля (ПІБ та Телефон)');
                       // Генерируем надежный случайный пароль
                       const randomPassword = Math.random().toString(36).substring(2, 10) + 'A1!';
                       setCreatedUserPassword(randomPassword);
                       createUserMutation.mutate({ 
                         name: newUserData.name, 
                         phone: newUserData.phone, 
                         email: newUserData.email || `test_${Date.now()}@forchetta.com`, 
                         password: randomPassword 
                       });
                     }} 
                     disabled={createUserMutation.isPending}
                     className="flex-1 py-2 bg-wine-red text-light-creamy rounded-[8px] font-montserrat text-[13px] font-bold hover:bg-[#5a1b24] transition-colors disabled:opacity-50"
                   >
                     {createUserMutation.isPending ? 'Створення...' : 'Зареєструвати клієнта'}
                   </button>
                 </div>
               </div>
            ) : (
            <div className="space-y-4">
              <div className="relative z-30">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="w-[18px] h-[18px] text-choco-light opacity-50" strokeWidth="2" />
                </div>
                <input
                  type="text"
                  placeholder="Пошук клієнта за ПІБ або телефоном..."
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-[12px] border border-choco-light/30 focus:border-wine-red focus:outline-none bg-transparent font-montserrat text-[14px] text-choco-dark"
                />
                
                {userQuery.length >= 3 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-creamy border border-choco-light/20 rounded-[12px] shadow-xl max-h-[300px] overflow-y-auto">
                    {isSearchingUsers ? (
                      <div className="p-4 text-center text-choco-light font-montserrat text-sm">Пошук...</div>
                    ) : foundUsers.length > 0 ? (
                      <div>
                        {foundUsers.map(u => (
                          <div 
                            key={u._id} 
                            onMouseDown={() => { setSelectedUser(u); setUserQuery(''); }}
                            className="p-3 hover:bg-light-creamy cursor-pointer border-b border-choco-light/10 last:border-0 transition-colors"
                          >
                            <div className="font-montserrat font-bold text-choco-dark">{u.name}</div>
                            <div className="font-montserrat text-sm text-choco-light">{u.phone} • {u.email}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 space-y-3 bg-creamy">
                        <p className="font-montserrat text-sm text-choco-light text-center">Клієнта не знайдено.</p>
                        <button 
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setShowNewUserForm(true);
                            setUserQuery('');
                          }}
                          className="w-full py-2 bg-wine-red text-light-creamy rounded-[30px] font-montserrat text-sm hover:bg-[#5a1b24] transition-colors"
                        >
                          Швидко зареєструвати
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
              <div className="flex justify-end mt-1">
                <button 
                  onClick={() => setShowNewUserForm(true)}
                  className="font-montserrat text-[13px] text-wine-red hover:underline font-medium"
                >
                  + Створити нового клієнта
                </button>
              </div>
            </div>
            )
          ) : (
            <div className="bg-light-creamy p-4 rounded-[12px] relative flex flex-col gap-1 border border-choco-light/10">
              <button 
                onClick={() => setSelectedUser(null)} 
                className="absolute top-4 right-4 text-choco-light hover:text-wine-red transition-colors"
                title="Очистити клієнта"
              >
                <CrossIcon width="16" height="16" />
              </button>
              <span className="font-montserrat font-bold text-[18px] text-choco-dark">{selectedUser.name}</span>
              <span className="font-montserrat text-[14px] text-choco-light font-medium">{selectedUser.phone}</span>
              <span className="font-montserrat text-[14px] text-choco-light">{selectedUser.email}</span>
              <span className="font-montserrat text-[14px] text-choco-dark font-semibold mt-1">
                Бонусів: <span className="text-wine-red">{selectedUser.bonusPoints || 0}</span>
              </span>
            </div>
          )}
        </div>

        <div className="bg-creamy rounded-[20px] p-6 shadow-sm border border-light-creamy transition-opacity duration-300">
          <div className="flex justify-between items-center mb-4 border-b border-light-creamy pb-2">
             <h2 className="font-cormorant font-bold text-[24px] text-choco-dark">2. Доставка</h2>
          </div>
          
          <div className={`space-y-4 ${!selectedUser ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
             {selectedUser?.addresses?.length > 0 && (
               <div className="mb-4">
                 <p className="font-montserrat font-medium text-[13px] text-choco-light mb-2">Збережені адреси клієнта (натисніть щоб обрати):</p>
                 <div className="flex flex-wrap gap-2">
                   {selectedUser.addresses.map((addr, idx) => (
                     <button
                       key={idx}
                       onClick={() => setShippingAddress({ region: addr.region || 'Київська', city: addr.city, street: addr.street, house: addr.house, apartment: addr.apartment || '', postalCode: addr.postalCode || '' })}
                       className="px-3 py-2 bg-light-creamy border border-choco-light/20 rounded-[8px] font-montserrat text-[13px] text-choco-dark hover:border-wine-red transition-all text-left shadow-sm"
                     >
                       <span className="font-bold">м. {addr.city}</span>, вул. {addr.street}, б. {addr.house} {addr.apartment && `, кв. ${addr.apartment}`}
                     </button>
                   ))}
                 </div>
               </div>
             )}

             <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Місто / населений пункт*" value={shippingAddress.city} onChange={e => setShippingAddress({...shippingAddress, city: e.target.value})} className="col-span-2 px-4 py-3 bg-transparent border border-choco-light/30 rounded-[12px] font-montserrat text-[14px] text-choco-dark focus:outline-none focus:border-wine-red placeholder-choco-light/50" />
                <input type="text" placeholder="Вулиця*" value={shippingAddress.street} onChange={e => setShippingAddress({...shippingAddress, street: e.target.value})} className="px-4 py-3 bg-transparent border border-choco-light/30 rounded-[12px] font-montserrat text-[14px] text-choco-dark focus:outline-none focus:border-wine-red placeholder-choco-light/50" />
                <div className="flex gap-2">
                  <input type="text" placeholder="Буд. (необов.)" value={shippingAddress.house} onChange={e => setShippingAddress({...shippingAddress, house: e.target.value})} className="w-1/2 px-4 py-3 bg-transparent border border-choco-light/30 rounded-[12px] font-montserrat text-[14px] text-choco-dark focus:outline-none focus:border-wine-red placeholder-choco-light/50" />
                  <input type="text" placeholder="Кв." value={shippingAddress.apartment} onChange={e => setShippingAddress({...shippingAddress, apartment: e.target.value})} className="w-1/2 px-4 py-3 bg-transparent border border-choco-light/30 rounded-[12px] font-montserrat text-[14px] text-choco-dark focus:outline-none focus:border-wine-red placeholder-choco-light/50" />
                </div>
             </div>
             
             {/* Вибір методу оплати */}
             <div className="mt-6 border-t border-choco-light/10 pt-4">
               <h3 className="font-montserrat font-bold text-[14px] text-choco-dark uppercase mb-3">Спосіб оплати</h3>
               <div className="flex gap-3">
                 <button
                   onClick={() => setPaymentMethod('cash')}
                   className={`flex-1 py-3 px-4 rounded-[12px] font-montserrat text-[13px] font-bold border transition-all ${paymentMethod === 'cash' ? 'bg-wine-red text-light-creamy border-wine-red shadow-md' : 'bg-transparent text-choco-dark border-choco-light/30 hover:border-wine-red/50'}`}
                 >
                   Готівка (Кур'єру)
                 </button>
                 <button
                   onClick={() => setPaymentMethod('card')}
                   className={`flex-1 py-3 px-4 rounded-[12px] font-montserrat text-[13px] font-bold border transition-all ${paymentMethod === 'card' ? 'bg-wine-red text-light-creamy border-wine-red shadow-md' : 'bg-transparent text-choco-dark border-choco-light/30 hover:border-wine-red/50'}`}
                 >
                   Картка (Відправити лінк)
                 </button>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* ПРАВА КОЛОНКА - ТОВАРИ ТА ЧЕКАУТ */}
      <div className="bg-creamy rounded-[20px] p-6 shadow-sm border border-light-creamy flex flex-col h-full min-h-[500px]">
        <h2 className="font-cormorant font-bold text-[24px] text-choco-dark mb-4 border-b border-light-creamy pb-2">3. Товари та Підсумок</h2>
        
        <div className={`relative mb-6 z-20 ${!selectedUser ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="w-[18px] h-[18px] text-choco-light opacity-50" strokeWidth="2" />
          </div>
          <input
            type="text"
            placeholder="Введіть назву десерту..."
            value={productQuery}
            onChange={(e) => setProductQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-[12px] border border-choco-light/30 focus:border-wine-red focus:outline-none bg-transparent font-montserrat text-[14px] text-choco-dark placeholder-choco-light/50"
          />
          
          {productQuery.length >= 2 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-creamy border border-choco-light/20 rounded-[12px] shadow-xl max-h-[300px] overflow-y-auto">
              {isSearchingProducts ? (
                <div className="p-4 text-center text-choco-light font-montserrat text-sm">Пошук...</div>
              ) : foundProducts.length > 0 ? (
                <div>
                  {foundProducts.map(prod => (
                     <div 
                       key={prod._id} 
                       onMouseDown={() => addToCart(prod)}
                       className="p-3 hover:bg-light-creamy cursor-pointer border-b border-choco-light/10 last:border-0 transition-colors flex justify-between items-center"
                     >
                       <div className="flex items-center gap-3">
                         {prod.images?.[0] ? <img src={prod.images[0].url} alt="" className="w-[40px] h-[40px] rounded-md object-cover" /> : <div className="w-[40px] h-[40px] bg-choco-light/10 rounded-md"></div>}
                         <div className="font-montserrat font-bold text-choco-dark text-sm">{prod.name}</div>
                       </div>
                       <div className="font-montserrat font-bold text-wine-red text-sm whitespace-nowrap hidden sm:block">{prod.discountPrice || prod.price} ₴</div>
                     </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-choco-light font-montserrat text-sm">Нічого не знайдено</div>
              )}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 mb-6 space-y-3 max-h-[350px]">
           {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 font-montserrat text-choco-light opacity-50 text-center gap-2">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                <span>Менеджер ще не додав товари</span>
              </div>
           ) : (
              cart.map(item => (
                 <div key={item.product._id} className="flex justify-between items-center bg-transparent p-3 rounded-[12px] border border-choco-light/10 shadow-sm">
                    <div className="flex items-center gap-3">
                       {item.product.images?.[0] ? <img src={item.product.images[0].url} alt="" className="w-[40px] h-[40px] rounded-md object-cover flex-shrink-0" /> : <div className="w-[40px] h-[40px] bg-choco-light/10 rounded-md flex-shrink-0"></div>}
                       <div className="flex flex-col">
                          <span className="font-montserrat font-bold text-[14px] text-choco-dark truncate w-[130px] sm:w-[150px]" title={item.product.name}>{item.product.name}</span>
                          <span className="font-montserrat font-medium text-[13px] text-wine-red">{item.product.discountPrice || item.product.price} ₴</span>
                       </div>
                    </div>
                    <div className="flex items-center gap-3 sm:gap-4">
                       <div className="flex items-center border border-choco-light/30 rounded-[30px] overflow-hidden bg-creamy">
                          <button onClick={() => updateQuantity(item.product._id, -1)} className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] flex items-center justify-center text-choco-dark hover:bg-choco-light/10 font-bold">−</button>
                          <span className="w-[20px] sm:w-[26px] text-center font-montserrat font-medium text-choco-dark text-[14px]">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.product._id, 1)} className="w-[26px] h-[26px] sm:w-[30px] sm:h-[30px] flex items-center justify-center text-choco-dark hover:bg-choco-light/10 font-bold">+</button>
                       </div>
                       <button onClick={() => removeFromCart(item.product._id)} className="text-choco-light hover:text-wine-red p-1"><CrossIcon width="14" height="14" /></button>
                    </div>
                 </div>
              ))
           )}
        </div>

        <div className={`border-t border-light-creamy pt-5 ${cart.length === 0 ? 'opacity-30 pointer-events-none' : 'opacity-100'}`}>
          
          {/* Секція Пакування */}
          <div className="flex flex-col gap-3 mb-5 border-b border-light-creamy pb-5">
            <h3 className="font-montserrat font-bold text-[14px] text-choco-dark uppercase">Додаткове пакування</h3>
            
            {/* Пакет 1 */}
            <div className="flex justify-between items-center bg-transparent p-2 rounded-[12px] border border-choco-light/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-[40px] h-[40px] bg-[#EBEBEB] rounded-md flex-shrink-0" style={{backgroundImage: "url(/packet02.png)", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                  <div className="flex flex-col">
                      <span className="font-montserrat font-bold text-[13px] text-choco-dark">Паперовий пакет</span>
                      <span className="font-montserrat font-medium text-[12px] text-wine-red">10 ₴</span>
                  </div>
                </div>
                <div className="flex items-center border border-choco-light/30 rounded-[30px] overflow-hidden bg-creamy">
                  <button onClick={() => setPackagingCounts(prev => ({...prev, 1: Math.max(0, prev[1] - 1)}))} className="w-[26px] h-[26px] flex items-center justify-center text-choco-dark hover:bg-choco-light/10 font-bold">−</button>
                  <span className="w-[20px] text-center font-montserrat font-medium text-choco-dark text-[13px]">{packagingCounts[1]}</span>
                  <button onClick={() => setPackagingCounts(prev => ({...prev, 1: prev[1] + 1}))} className="w-[26px] h-[26px] flex items-center justify-center text-choco-dark hover:bg-choco-light/10 font-bold">+</button>
                </div>
            </div>

            {/* Пакет 2 */}
            <div className="flex justify-between items-center bg-transparent p-2 rounded-[12px] border border-choco-light/10 shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-[40px] h-[40px] bg-[#3B2929] rounded-md flex-shrink-0" style={{backgroundImage: "url(/packet01.png)", backgroundSize: "cover", backgroundPosition: "center"}}></div>
                  <div className="flex flex-col">
                      <span className="font-montserrat font-bold text-[13px] text-choco-dark">Подарунковий пакет</span>
                      <span className="font-montserrat font-medium text-[12px] text-wine-red">15 ₴</span>
                  </div>
                </div>
                <div className="flex items-center border border-choco-light/30 rounded-[30px] overflow-hidden bg-creamy">
                  <button onClick={() => setPackagingCounts(prev => ({...prev, 2: Math.max(0, prev[2] - 1)}))} className="w-[26px] h-[26px] flex items-center justify-center text-choco-dark hover:bg-choco-light/10 font-bold">−</button>
                  <span className="w-[20px] text-center font-montserrat font-medium text-choco-dark text-[13px]">{packagingCounts[2]}</span>
                  <button onClick={() => setPackagingCounts(prev => ({...prev, 2: prev[2] + 1}))} className="w-[26px] h-[26px] flex items-center justify-center text-choco-dark hover:bg-choco-light/10 font-bold">+</button>
                </div>
            </div>
          </div>

          {/* Секція Бонусів */}
          <div className={`flex flex-col mb-6 ${!selectedUser || userBonuses <= 0 ? 'hidden' : ''}`}>
            <div className="flex justify-between items-center mb-2">
              <span className="font-montserrat font-medium text-[14px] text-choco-dark">Списати бонуси:</span>
              <span className="font-montserrat font-medium text-[12px] text-wine-red">Доступно: {userBonuses}</span>
            </div>
            <div className="flex h-[40px] items-center rounded-[8px] overflow-hidden border border-choco-light/30 bg-transparent focus-within:border-wine-red transition-colors">
              <input 
                type="number"
                placeholder="Скільки балів списати"
                value={bonusInput}
                onChange={(e) => setBonusInput(e.target.value)}
                max={userBonuses}
                min={0}
                className="flex-grow h-full bg-transparent px-[15px] focus:outline-none text-[14px] text-choco-dark"
              />
              <button 
                type="button" 
                onClick={handleApplyBonus}
                className="h-full px-[20px] bg-choco-light text-light-creamy text-[13px] font-medium transition-colors hover:bg-choco-dark"
              >
                Застосувати
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4">
            <div className="flex justify-between items-center opacity-60">
              <span className="font-montserrat text-[14px] text-choco-dark">Сума товарів:</span>
              <span className="font-montserrat text-[14px] text-choco-dark">{productsSubtotal} ₴</span>
            </div>
            {packagingPrice > 0 && (
               <div className="flex justify-between items-center opacity-60">
                 <span className="font-montserrat text-[14px] text-choco-dark">Пакування:</span>
                 <span className="font-montserrat text-[14px] text-choco-dark">{packagingPrice} ₴</span>
               </div>
            )}
            {appliedBonuses > 0 && (
              <div className="flex justify-between items-center text-wine-red">
                <span className="font-montserrat text-[14px] font-medium">Бонусна знижка:</span>
                <span className="font-montserrat text-[14px] font-bold">-{appliedBonuses} ₴</span>
              </div>
            )}
            
            <div className="flex justify-between items-center mt-2 border-t border-choco-light/10 pt-2">
              <span className="font-cormorant font-bold text-[24px] text-choco-dark">До сплати:</span>
              <span className="font-montserrat font-bold text-[28px] text-wine-red">{formatPrice(total)} ₴</span>
            </div>
          </div>
          
          <button 
             onClick={handleCreateOrder}
             disabled={createOrderMutation.isPending}
             className="w-full py-4 bg-[#705A5A] text-[#FFFBF2] rounded-[30px] font-montserrat font-bold text-[16px] tracking-wide hover:bg-[#5a4848] transition-colors disabled:opacity-50 shadow-md"
          >
             {createOrderMutation.isPending ? 'Секундочку...' : 'Підтвердити замовлення'}
          </button>
        </div>

      </div>

    </div>
  );
};

export default AdminPOS;