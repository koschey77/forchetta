import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useUserStore } from '../../stores/useUserStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { userAPI } from '../../services/api'
import imageService from '../../services/imageService'
import toast from 'react-hot-toast'

const GeneralData = () => {
  const { user } = useUserStore()
  const queryClient = useQueryClient()

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    phone: user?.phone || '',
    email: user?.email || '',
    avatarFile: null
  })

  const handleAvatarChange = (e) => {
    const file = e.target.files[0]
    if (file && imageService.validateSingleFile(file)) {
      setFormData(prev => ({ ...prev, avatarFile: file }))
    }
    e.target.value = '' 
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const updateProfileMutation = useMutation({
    mutationFn: async (dataToSubmit) => {
      return userAPI.updateProfile(dataToSubmit)
    },
    onSuccess: (updatedUser) => {
      useUserStore.setState((state) => ({ user: { ...state.user, ...updatedUser } }))
      queryClient.setQueryData(['userProfile'], updatedUser)
      queryClient.invalidateQueries({ queryKey: ['userProfile'] })
      
      toast.success('Дані успішно оновлено!')
      setFormData(prev => ({ ...prev, avatarFile: null })) 
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Помилка оновлення даних')
    }
  })

  const handleSubmit = async () => {
    const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`.trim()
    
    const dataToSubmit = {
      name: fullName,
      phone: formData.phone
    }

    if (formData.avatarFile) {
      try {
        const base64 = await imageService.fileToBase64(formData.avatarFile)
        dataToSubmit.avatar = base64
      } catch (error) {
        console.error('Error processing avatar:', error)
        toast.error('Помилка обробки зображення')
        return
      }
    }

    updateProfileMutation.mutate(dataToSubmit)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[564px] mx-auto px-[15px] pt-[30px] pb-[20px] sm:px-0 sm:py-10">
      {/* Avatar Section */}
      <div className="flex flex-col items-center sm:items-start gap-6 w-full sm:w-[149px]">
        {!(formData.avatarFile || user?.avatar || user?.picture) && (
          <h3 className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light">
            Додайте фото
          </h3>
        )}
        <input 
          type="file" 
          id="avatar-upload" 
          className="hidden" 
          accept="image/*" 
          onChange={handleAvatarChange} 
        />
        <label 
          htmlFor="avatar-upload" 
          className="flex justify-center items-center gap-[10px] w-[149px] h-[149px] border-[3px] border-dark-creamy rounded-[88px] relative overflow-hidden cursor-pointer group hover:border-choco-light transition-colors"
        >
          {formData.avatarFile ? (
            <img 
              src={imageService.getDisplayUrl(formData.avatarFile)} 
              alt="Selected Avatar" 
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
            />
          ) : (user?.avatar || user?.picture) ? (
            <img 
              src={user.avatar || user.picture} 
              alt={user.name} 
              className="w-full h-full object-cover group-hover:opacity-75 transition-opacity"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="absolute w-[54px] h-[54px] bg-choco-light/50 rotate-45 flex items-center justify-center pointer-events-none">
              <span className="text-white text-[54px] font-light leading-none -rotate-45" style={{ marginTop: '-4px' }}>+</span>
            </div>
          )}
        </label>

        {user?.role === "admin" && (
          <div className="flex justify-center w-full">
            <Link
              to="/admin"
              className="inline-flex items-center justify-center px-[20px] h-[34px] bg-choco-light text-creamy rounded-[30px] font-montserrat text-sm font-medium transition-opacity hover:opacity-90"
            >
              Адмін панель
            </Link>
          </div>
        )}
      </div>

      {/* Name Inputs */}
      <div className="flex flex-col items-start px-0 py-3 sm:p-3 gap-6 w-full">
        <h3 className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light w-full">
          Ваше ім&apos;я
        </h3>
        <div className="flex flex-col sm:flex-row items-start gap-6 w-full">
          {/* FirstName */}
          <div className="flex flex-col items-start gap-2 w-full sm:flex-1">
            <label className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light h-[20px]">
              Ім&apos;я
            </label>
            <input 
              type="text" 
                name="firstName"
                placeholder="Ім'я"
                value={formData.firstName}
                onChange={handleChange}
                className="flex flex-row items-center px-3 py-3 gap-2 w-full h-[44px] bg-transparent border border-choco-light rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] outline-none text-choco-dark placeholder:text-choco-light/50"
              />
            </div>
            {/* LastName */}
            <div className="flex flex-col items-start gap-2 w-full sm:flex-1">
              <label className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light h-[20px]">
                Прізвище
              </label>
              <input 
                type="text" 
                name="lastName"
                placeholder="Прізвище"
                value={formData.lastName}
                onChange={handleChange}
                className="flex flex-row items-center px-3 py-3 gap-2 w-full h-[44px] bg-transparent border border-choco-light rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] outline-none text-choco-dark placeholder:text-choco-light/50"
              />
            </div>
          </div>
        </div>

        {/* Phone Input */}
        <div className="flex flex-col items-start px-0 py-3 sm:p-3 gap-6 w-full">
          <h3 className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light w-full">
            Телефон
          </h3>
          <div className="flex flex-col items-start gap-2 w-full">
            <label className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light h-[20px]">
              Номер телефону
            </label>
            <input 
              type="tel" 
              name="phone"
              placeholder=""
              value={formData.phone}
              onChange={handleChange}
              className="flex flex-row items-center px-3 py-3 gap-3 w-full h-[44px] bg-transparent border border-choco-light rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] outline-none text-choco-dark placeholder:text-choco-light/50"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="flex flex-col items-start px-0 py-3 sm:p-3 gap-6 w-full">
          <h3 className="font-montserrat font-semibold text-[18px] leading-[22px] text-choco-light w-full">
            Пошта
          </h3>
          <div className="flex flex-col items-start gap-2 w-full">
            <label className="font-montserrat font-normal text-[16px] leading-[20px] text-choco-light h-[20px]">
              Електронна пошта
            </label>
            <input 
              type="email" 
              name="email"
              value={formData.email}
              disabled
              placeholder="Your@gmail.com"
              className="flex flex-row items-center px-3 py-3 gap-3 w-full h-[44px] bg-dark-creamy/30 border border-choco-light rounded-[31px] font-montserrat font-normal text-[16px] leading-[20px] outline-none text-choco-light/50 cursor-not-allowed"
            />
          </div>
        </div>

      {/* Actions */}
      <div className="flex flex-col justify-center items-center gap-6 w-full pt-6">
        <div className="flex flex-col sm:flex-row-reverse justify-center items-center gap-6 w-full">
          <button 
            onClick={handleSubmit}
            disabled={updateProfileMutation.isPending}
            className="flex flex-row justify-center items-center py-4 px-[30px] gap-[10px] w-full sm:w-[258px] h-[40px] bg-wine-red rounded-[31px] font-montserrat font-medium sm:font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-light-gray transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {updateProfileMutation.isPending ? 'Збереження...' : 'Зберегти зміни'}
          </button>
          <button 
            onClick={() => setFormData({
              firstName: user?.name?.split(' ')[0] || '',
              lastName: user?.name?.split(' ')[1] || '',
              phone: user?.phone || '',
              email: user?.email || '',
              avatarFile: null
            })}
            className="flex flex-row justify-center items-center py-4 px-[30px] gap-[10px] w-full sm:w-[258px] h-[40px] border border-choco-dark rounded-[31px] font-montserrat font-medium sm:font-normal text-[14px] sm:text-[16px] leading-[17px] sm:leading-[20px] text-choco-dark transition-colors hover:bg-creamy"
          >
            Скасувати
          </button>
        </div>
        <div className="flex flex-row justify-center items-center gap-4 w-full">
          <button className="flex flex-row justify-center items-center py-4 px-[30px] gap-[10px] h-[51px] rounded-[31px] font-montserrat font-semibold text-[16px] leading-[120%] uppercase text-choco-light/50 transition-opacity hover:opacity-90 hover:text-wine-red">
            ВИДАЛИТИ АКАУНТ
          </button>
        </div>
      </div>
    </div>
  )
}

export default GeneralData
