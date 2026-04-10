const NoResults = ({ imageSrc = "https://res.cloudinary.com/dmdlogqqf/image/upload/v1775855025/notFound_cmjrgz.png" }) => {
  return (
    <div className="col-span-2 sm:col-span-full flex flex-col items-center justify-center py-[60px] w-full">
      {/* Контейнер по стилям из Figma */}
      <div className="flex flex-col items-center p-0 gap-[20px]">
        {/* Текст "Немає результатів" над картинкой */}
        <h2 className="w-full sm:w-[350px] h-[29px] text-center font-montserrat font-light text-[24px] leading-[29px] text-choco-light m-0">
          Немає результатів пошуку
        </h2>

        <img src={imageSrc} alt="Немає результатів" className="max-w-full object-contain" />
      </div>
    </div>
  )
}

export default NoResults;
