import * as AlertDialog from '@radix-ui/react-alert-dialog';
import useFilterStore from '../../../stores/useFilterStore';

// Компонент контролю фільтрів (кнопка очищення з підтвердженням)

const FilterControls = () => {
  const { resetAll, hasAppliedFilters, sortOption } = useFilterStore();

  const handleClearAll = () => {
    resetAll();
  };

  // Перевіряємо, чи є застосовані фільтри або сортування
  const hasAnyFilters = hasAppliedFilters() || sortOption !== '';

  // Якщо немає фільтрів і сортування, вимикаємо кнопку
  if (!hasAnyFilters) {
    return (
      <div className="flex flex-row items-center justify-center w-full h-[41px]">
        <button 
          disabled
          className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] w-full h-[41px] bg-creamy-light border border-creamy-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-choco-light/50 cursor-not-allowed whitespace-nowrap"
        >
          Очистити все
        </button>
      </div>
    );
  }

  // Якщо є фільтри або сортування, показуємо діалог підтвердження

  return (
    <div className="flex flex-row items-center justify-center w-full h-[41px]">
      <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
          <button className="flex flex-row justify-center items-center px-[30px] py-[10px] gap-[6px] w-full h-[41px] bg-creamy border border-choco-light rounded-[22.5px] text-figma-xs font-montserrat font-light text-choco-light hover:opacity-80 transition-opacity whitespace-nowrap">
            Очистити все
          </button>
        </AlertDialog.Trigger>

        <AlertDialog.Portal>
          <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-50" />
          <AlertDialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-creamy border border-choco-light rounded-[15px] p-6 w-[90vw] max-w-[400px] z-50 shadow-xl">
            <AlertDialog.Title className="text-figma-lg font-montserrat font-medium text-choco-light mb-3">
              Підтвердити скидання
            </AlertDialog.Title>
            <AlertDialog.Description className="text-figma-md font-montserrat font-light text-choco-light mb-6">
              Ви впевнені, що хочете очистити фільтри та пошук?
            </AlertDialog.Description>

            <div className="flex justify-end gap-3">
              <AlertDialog.Cancel asChild>
                <button className="px-[20px] sm:px-[25px] lg:px-[30px] py-2 bg-transparent border border-choco-light text-choco-light rounded-[10px] text-figma-sm font-montserrat font-light hover:bg-dark-creamy transition-colors whitespace-nowrap min-w-[80px]">
                  Ні
                </button>
              </AlertDialog.Cancel>

              <AlertDialog.Action asChild>
                <button
                  onClick={handleClearAll}
                  className="px-[20px] sm:px-[25px] lg:px-[30px] py-2 bg-choco-light text-creamy rounded-[10px] text-figma-sm font-montserrat font-medium hover:bg-choco-dark transition-colors whitespace-nowrap min-w-[120px]"
                >
                  Так, очистити
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    </div>
  );
};

export default FilterControls;