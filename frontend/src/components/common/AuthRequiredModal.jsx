import * as Dialog from '@radix-ui/react-dialog';
import { useNavigate } from 'react-router-dom';
import { useUserStore } from '../../stores/useUserStore';
import { CloseIcon } from '../icons/index.jsx';

const AuthRequiredModal = () => {
  const navigate = useNavigate();
  const isAuthModalOpen = useUserStore((state) => state.isAuthModalOpen);
  const closeAuthModal = useUserStore((state) => state.closeAuthModal);

  const handleLogin = () => {
    closeAuthModal();
    navigate('/login');
  };

  const handleSignup = () => {
    closeAuthModal();
    navigate('/signup');
  };

  return (
    <Dialog.Root open={isAuthModalOpen} onOpenChange={(open) => !open && closeAuthModal()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] sm:w-[550px] bg-[linear-gradient(148.12deg,#2B1A12_22.81%,#893E3E_98.64%)] pt-[34px] px-[20px] pb-[65px] rounded-[20px] shadow-[-7px_6px_8.8px_rgba(0,0,0,0.25)] z-50 flex flex-col items-center focus:outline-none">
          {/* Close Button Header */}
          <div className="w-full max-w-[508px] flex justify-end">
            <Dialog.Close asChild>
              <button className="text-creamy hover:scale-110 transition-transform focus:outline-none" aria-label="Закрити">
                <CloseIcon className="w-[33px] h-[33px] stroke-2" />
              </button>
            </Dialog.Close>
          </div>

          {/* Main Content Layout */}
          <div className="flex flex-col items-center justify-between w-full max-w-[508px] sm:gap-[65px] gap-8 mt-2 sm:mt-0">
            {/* Top Text & Image */}
            <div className="flex flex-col items-center gap-[12px] max-w-[341px] mx-auto">
              <Dialog.Title className="w-full font-montserrat font-medium text-[24px] leading-[29px] text-center text-creamy">
                Ласкаво просимо до родини Forchetta!
              </Dialog.Title>
              <Dialog.Description className="w-[267px] max-w-full mx-auto font-montserrat font-light text-[12px] leading-[15px] text-center text-creamy">
                Будь ласка, увійдіть у свій акаунт або зареєструйтесь, щоб купувати та додавати товари в улюблене.
              </Dialog.Description>

              <img src="/Sweet-modal.svg" alt="Солодощі" className="w-[190px] h-[173px] object-cover mt-2" />
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center w-full gap-4">
              <button
                onClick={handleSignup}
                className="flex items-center justify-center w-full sm:w-[245px] h-[50px] rounded-[60px] bg-transparent border-[1.5px] border-creamy text-creamy font-montserrat font-medium text-[14px] leading-[17px] hover:bg-creamy/10 transition-colors"
              >
                Створити акаунт
              </button>
              <button
                onClick={handleLogin}
                className="flex items-center justify-center w-full sm:w-[245px] h-[50px] rounded-[60px] bg-creamy border border-choco-dark text-choco-dark font-montserrat font-medium text-[14px] leading-[17px] hover:bg-dark-creamy transition-colors shadow-sm"
              >
                Увійти
              </button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
};

export default AuthRequiredModal;
