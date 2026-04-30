import { useState } from "react";
import { useUserStore } from "../../stores/useUserStore";
import { userAPI } from "../../services/api";
import toast from "react-hot-toast";
import { EditIcon, BasketIcon } from "../../components/icons";

const Addresses = () => {
  const { user } = useUserStore();
  const addresses = user?.addresses || [];
  
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    region: "",
    city: "",
    street: "",
    house: "",
    apartment: "",
    postalCode: "",
    isDefault: false
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleOpenAddForm = () => {
    setIsAdding(true);
    setEditingId(null);
    setFormData({
      region: "", city: "", street: "", house: "", apartment: "", postalCode: "", isDefault: addresses.length === 0
    });
  };

  const handleOpenEditForm = (addr) => {
    setIsAdding(false);
    setEditingId(addr._id);
    setFormData({
      region: addr.region || "",
      city: addr.city || "",
      street: addr.street || "",
      house: addr.house || "",
      apartment: addr.apartment || "",
      postalCode: addr.postalCode || "",
      isDefault: addr.isDefault || false
    });
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let updatedAddresses;
      if (isAdding) {
        updatedAddresses = await userAPI.addAddress(formData);
        toast.success("Адресу успішно додано!");
      } else if (editingId) {
        updatedAddresses = await userAPI.updateAddress(editingId, formData);
        toast.success("Адресу успішно оновлено!");
      }
      
      useUserStore.setState((state) => ({
        user: { ...state.user, addresses: updatedAddresses }
      }));
      
      handleCancel();
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка при збереженні адреси");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ви впевнені, що хочете видалити цю адресу?")) return;
    try {
      const updatedAddresses = await userAPI.deleteAddress(id);
      useUserStore.setState((state) => ({
        user: { ...state.user, addresses: updatedAddresses }
      }));
      toast.success("Адресу видалено!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Помилка при видаленні");
    }
  };

  const handleSetDefault = async (id) => {
    try {
      const updatedAddresses = await userAPI.setDefaultAddress(id);
      useUserStore.setState((state) => ({
        user: { ...state.user, addresses: updatedAddresses }
      }));
      toast.success("Основну адресу оновлено!");
    } catch (error) {
      toast.error("Помилка при оновленні основної адреси");
    }
  };

  if (!isAdding && !editingId && addresses.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center px-[15px] sm:px-[60px] pt-[30px] sm:pt-5 pb-16 gap-[35px] w-full min-h-[321px] sm:min-h-[530px] rounded-[10px]">
        <div className="flex flex-col items-center gap-[35px] w-full max-w-[472px]">
          <div className="flex flex-col items-center gap-0 sm:gap-[10px] w-[205px] sm:w-full">
            <img 
              src="/image35.png" 
              alt="Немає збережених адрес" 
              className="w-[280px] h-[220px] sm:w-[472px] sm:h-[372px] object-contain sm:-my-[56px]"
            />
            <div className="flex flex-col justify-center items-center py-5 gap-5 w-full sm:w-[472px] sm:min-h-[214px] rounded-[10px]">
              <h2 className="font-montserrat font-light sm:font-semibold text-[18px] sm:text-[24px] leading-[22px] sm:leading-[29px] text-choco-light text-center">
                Наразі у вас немає збережених адрес!
              </h2>
              <button 
                className="flex flex-row justify-center items-center px-[30px] py-[16px] gap-[10px] w-[235px] sm:w-[184px] h-[40px] bg-wine-red rounded-[31px] transition-opacity hover:opacity-90"
                onClick={handleOpenAddForm}
              >
                <span className="font-montserrat font-medium sm:font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-creamy text-center">
                  Додати адресу
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[10px] w-full max-w-[1440px] relative">
      <div className="w-full">
        {(isAdding || editingId) && (
          <h2 className="text-xl font-montserrat font-bold text-choco-dark mb-4 sm:px-[60px]">
            {isAdding ? "Додати нову адресу" : "Редагувати адресу"}
          </h2>
        )}
        
        {(!isAdding && !editingId) && (
          <div className="flex flex-col items-start px-[15px] sm:px-[0px] py-[10px] gap-[10px] w-full sm:h-[60px]">
            <button 
              onClick={handleOpenAddForm}
              className="flex flex-row justify-center items-center w-full sm:w-[266px] h-[40px] px-[30px] py-[16px] bg-[#893E3E] rounded-[31px] gap-[10px] transition-opacity hover:opacity-90 flex-none"
            >
              <div className="flex flex-row justify-center items-center gap-[14px] w-[192px] h-[22px] flex-none">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-none">
                  <path d="M6.81818 6.81818V0H8.18182V6.81818H15V8.18182H8.18182V15H6.81818V8.18182H0V6.81818H6.81818Z" fill="#F5EEE0"/>
                </svg>
                <span className="w-[168px] h-[20px] font-montserrat font-normal text-[16px] leading-[20px] text-[#F5EEE0] flex-none whitespace-nowrap">
                  Додати нову адресу
                </span>
              </div>
            </button>
          </div>
        )}
      </div>

      {(isAdding || editingId) ? (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-lg px-[15px] sm:px-[60px]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="flex flex-col gap-[8px]">
              <span className="text-sm text-choco-light font-montserrat">Регіон/Область</span>
              <input type="text" name="region" value={formData.region} onChange={handleInputChange} className="w-full h-[44px] px-[12px] py-[12px] bg-light-creamy border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] focus:outline-none focus:border-[#893E3E] transition-colors" />
            </label>
            <label className="flex flex-col gap-[8px]">
              <span className="text-sm text-choco-light font-montserrat">Місто *</span>
              <input type="text" name="city" required value={formData.city} onChange={handleInputChange} className="w-full h-[44px] px-[12px] py-[12px] bg-light-creamy border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] focus:outline-none focus:border-[#893E3E] transition-colors" />
            </label>
            <label className="flex flex-col gap-[8px] sm:col-span-2">
              <span className="text-sm text-choco-light font-montserrat">Вулиця *</span>
              <input type="text" name="street" required value={formData.street} onChange={handleInputChange} className="w-full h-[44px] px-[12px] py-[12px] bg-light-creamy border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] focus:outline-none focus:border-[#893E3E] transition-colors" />
            </label>
            <label className="flex flex-col gap-[8px]">
              <span className="text-sm text-choco-light font-montserrat">Будинок</span>
              <input type="text" name="house" value={formData.house} onChange={handleInputChange} className="w-full h-[44px] px-[12px] py-[12px] bg-light-creamy border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] focus:outline-none focus:border-[#893E3E] transition-colors" />
            </label>
            <label className="flex flex-col gap-[8px]">
              <span className="text-sm text-choco-light font-montserrat">Квартира</span>
              <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} className="w-full h-[44px] px-[12px] py-[12px] bg-light-creamy border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] focus:outline-none focus:border-[#893E3E] transition-colors" />
            </label>
            <label className="flex flex-col gap-[8px]">
              <span className="text-sm text-choco-light font-montserrat">Індекс</span>
              <input type="text" name="postalCode" value={formData.postalCode} onChange={handleInputChange} className="w-full h-[44px] px-[12px] py-[12px] bg-light-creamy border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#888888] focus:outline-none focus:border-[#893E3E] transition-colors" />
            </label>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer mt-2">
            <input type="checkbox" name="isDefault" checked={formData.isDefault} onChange={handleInputChange} className="accent-wine-red" />
            <span className="text-sm text-choco-dark font-montserrat">Зробити основною адресою</span>
          </label>

          <div className="flex flex-col sm:flex-row items-center gap-[10px] mt-4">
            <button type="submit" className="flex flex-row justify-center items-center px-[30px] w-full sm:w-[258px] h-[40px] bg-wine-red text-white rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] hover:opacity-90 transition-opacity gap-[10px]">
              Зберегти
            </button>
            <button type="button" onClick={handleCancel} className="flex flex-row justify-center items-center px-[30px] w-full sm:w-[258px] h-[40px] border border-[#705A5A] rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] text-[#705A5A] hover:bg-light-creamy transition-colors gap-[10px]">
              Скасувати
            </button>
          </div>
        </form>
      ) : (
        <div className="flex flex-row flex-wrap items-center sm:items-start content-start px-[15px] py-[10px] sm:px-[60px] sm:py-[20px] gap-[10px] sm:gap-[20px] w-full max-w-[1440px]">
          {addresses.map((addr) => (
            <div 
              key={addr._id} 
              className="flex flex-col justify-center items-center p-[20px] gap-[20px] w-[343px] sm:w-[350px] min-h-[214px] rounded-[10px] border border-transparent hover:border-[#E3D6BF] transition-all"
            >
              <div className="flex flex-row justify-between items-start p-0 w-[303px] sm:w-[310px]">
                <div className="flex flex-col items-start p-0 w-[232px] sm:w-[239px] flex-grow">
                  <span className="w-[183px] sm:w-[239px] h-[17px] sm:h-[20px] overflow-hidden text-ellipsis whitespace-nowrap font-montserrat font-medium sm:font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-[#705A5A]">
                    {addr.firstName || user?.name || "Андрій Майборода"}
                  </span>
                  <span className="w-[183px] sm:w-[239px] h-[17px] sm:h-[20px] mt-[2px] sm:mt-0 overflow-hidden text-ellipsis whitespace-nowrap font-montserrat font-medium sm:font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-[#705A5A]/50">
                    {user?.email || "maybah2707@gmail.com"}
                  </span>
                </div>
                
                <div className="flex flex-col items-end gap-[15px] p-0 relative">
                  <div className="flex flex-row items-center p-0 gap-[15px]">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleOpenEditForm(addr); }}
                      className="text-[#705A5A] hover:text-[#893E3E] transition-colors"
                    >
                      <EditIcon className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" fill="currentColor" />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDelete(addr._id); }}
                      className="text-[#705A5A] hover:text-[#893E3E] transition-colors"
                    >
                      <BasketIcon className="w-[14px] h-[16px] sm:w-[16px] sm:h-[18px]" fill="currentColor" />
                    </button>
                  </div>
                  
                  <div className="flex flex-col items-end gap-[4px] relative">
                    <button 
                      onClick={() => !addr.isDefault && handleSetDefault(addr._id)}
                      className={`flex items-center justify-center w-[22px] h-[22px] rounded-full border-[1.5px] transition-all mr-[14px] sm:mr-[16px] ${addr.isDefault ? 'border-[#705A5A] bg-[#705A5A] text-white' : 'border-[#705A5A]/30 text-[#705A5A]/30 hover:border-[#705A5A]/60'}`}
                      title={addr.isDefault ? "Основна адреса" : "Зробити основною адресою"}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    </button>
                    {addr.isDefault && (
                      <span className="absolute top-[26px] right-0 px-[6px] py-[2px] bg-[#E3D6BF]/50 border border-[#E3D6BF] text-[#705A5A] text-[9px] font-montserrat font-medium rounded-[4px] uppercase tracking-wider text-center">
                        Основна
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="w-[303px] sm:w-[310px] min-h-[80px] font-montserrat font-medium sm:font-normal text-[16px] leading-[20px] text-[#705A5A]">
                Україна, <br/>
                {addr.region ? addr.region + ' обл., ' : ''}м. {addr.city}, <br/>
                вул. {addr.street}{addr.house ? `, ${addr.house}` : ''}{addr.apartment ? `, ${addr.apartment}` : ''} <br/>
                {addr.phone || user?.phone || '+38 (096) 535-08-43'}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Addresses;
