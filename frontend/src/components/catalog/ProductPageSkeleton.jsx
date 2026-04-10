const ProductPageSkeleton = () => {
  return (
    <div className="container mx-auto px-4 py-12 max-w-7xl">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-[60px]">
        <div className="w-full lg:w-1/2">
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[650px] bg-dark-creamy/20 animate-pulse rounded-2xl"></div>
        </div>
        <div className="w-full lg:w-1/2 flex flex-col pt-4">
          <div className="h-10 bg-dark-creamy/20 animate-pulse rounded w-3/4 mb-4"></div>
          <div className="h-6 bg-dark-creamy/20 animate-pulse rounded w-1/3 mb-6"></div>
          <div className="h-[2px] w-full bg-dark-creamy/20 my-6"></div>
          <div className="h-5 bg-dark-creamy/20 animate-pulse rounded w-full mb-2"></div>
          <div className="h-5 bg-dark-creamy/20 animate-pulse rounded w-4/5 mb-8"></div>
          <div className="space-y-4 mb-10 w-full sm:w-2/3">
            <div className="h-12 bg-dark-creamy/20 animate-pulse rounded w-full"></div>
            <div className="h-12 bg-dark-creamy/20 animate-pulse rounded w-full"></div>
            <div className="h-12 bg-dark-creamy/20 animate-pulse rounded w-full"></div>
          </div>
          <div className="flex gap-4 mt-auto">
            <div className="h-[50px] sm:h-[60px] bg-dark-creamy/20 animate-pulse rounded w-[250px]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPageSkeleton
