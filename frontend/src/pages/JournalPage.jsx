import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { articlesAPI } from '../services/api';
import NoConnection from '../components/errors/NoConnection';
import NoResults from '../components/errors/NoResults';

const JournalPageSkeleton = () => {
  return (
    <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto py-8 md:py-[50px] animate-pulse">
      {/* Title skeleton */}
      <div className="h-10 w-[300px] bg-choco-light/10 rounded-md mb-8 md:mb-12"></div>

      <div className="flex flex-col gap-[60px] md:gap-[80px]">
        {/* 1. Hero Article Skeleton */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-[60px] items-center">
          <div className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-[1/1] bg-choco-light/10 rounded-[10px]"></div>
          <div className="w-full lg:w-1/2 flex flex-col items-center text-center px-0 lg:px-4">
            <div className="h-8 w-3/4 max-w-[450px] bg-choco-light/10 rounded-md mb-6"></div>
            <div className="h-4 w-full max-w-[400px] bg-choco-light/10 rounded-md mb-3"></div>
            <div className="h-4 w-5/6 max-w-[400px] bg-choco-light/10 rounded-md mb-3"></div>
            <div className="h-4 w-4/6 max-w-[400px] bg-choco-light/10 rounded-md mb-10"></div>
            <div className="flex flex-row justify-between items-center w-full max-w-[450px]">
              <div className="h-4 w-[80px] bg-choco-light/10 rounded-md"></div>
              <div className="h-[43px] w-[140px] bg-choco-light/10 rounded-[5px]"></div>
            </div>
          </div>
        </div>

        {/* 2. Grid Articles Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
          {[1, 2].map((i) => (
            <div key={i} className="flex flex-col">
              <div className="w-full aspect-[4/3] lg:aspect-[3/2] bg-choco-light/10 rounded-[10px] mb-6"></div>
              <div className="h-8 w-3/4 bg-choco-light/10 rounded-md mb-4 self-center"></div>
              <div className="h-4 w-full bg-choco-light/10 rounded-md mb-3"></div>
              <div className="h-4 w-5/6 bg-choco-light/10 rounded-md mb-8"></div>
              <div className="mt-auto flex flex-row justify-between items-center w-full">
                <div className="h-4 w-[80px] bg-choco-light/10 rounded-md"></div>
                <div className="h-[43px] w-[140px] bg-choco-light/10 rounded-[5px]"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const JournalPage = () => {
  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ['journal_articles'],
    queryFn: () => articlesAPI.getMany(),
    refetchOnWindowFocus: false,
  });

  if (isLoading) return <JournalPageSkeleton />;
  if (isError) return <NoConnection />;
  if (!articles || articles.length === 0) return <NoResults message="Журнал поки що порожній. Нові публікації з'являться незабаром!" />;

  // Розділяємо статті за їх логічною позицією відповідно до дизайну
  const heroArticle = articles[0]; // Перша - велика
  const gridArticles = articles.slice(1, 3); // 2 і 3 - в два стовпці
  const listArticles = articles.slice(3); // Всі інші - списком

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <main className="flex-grow bg-creamy relative overflow-hidden">
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto py-4 md:py-8">
        <h1 className="font-cormorant font-bold text-[40px] md:text-[60px] text-choco-light text-left w-full leading-tight mb-8 md:mb-12">
          Журнал Forchetta
        </h1>

      <div className="flex flex-col gap-[60px] md:gap-[80px]">
        {/* 1. Hero Article (Великий блок) */}
        {heroArticle && (
          <div className="flex flex-col lg:flex-row gap-6 md:gap-10 lg:gap-[60px] items-center">
            {/* Image */}
            <div className="w-full lg:w-1/2 aspect-[4/5] lg:aspect-[1/1] overflow-hidden">
              <img 
                src={heroArticle.imageUrl || '/assets/placeholder.jpg'} 
                alt={heroArticle.title} 
                className="w-full h-full object-cover"
              />
            </div>
            {/* Text */}
            <div className="w-full lg:w-1/2 flex flex-col items-center mb-0 text-center px-0 lg:px-4">
              <h2 className="font-cormorant font-medium text-[28px] md:text-[32px] lg:text-[36px] text-choco-dark mb-6 leading-tight max-w-[450px]">
                {heroArticle.title}
              </h2>
              <p className="font-montserrat font-light text-[14px] md:text-[16px] text-choco-dark mb-10 max-w-[400px] leading-relaxed">
                {heroArticle.excerpt}
              </p>
              <div className="flex flex-row justify-between items-center w-full max-w-[450px]">
                <span className="font-montserrat font-light text-[14px] text-choco-light">
                  {formatDate(heroArticle.createdAt)}
                </span>
                <Link 
                  to={`/journal/${heroArticle._id}`} 
                  className="bg-choco-light hover:opacity-90 transition-opacity text-creamy font-montserrat font-medium text-[13px] tracking-wider uppercase py-3 px-8 rounded-[5px]"
                >
                  Читати далі
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 2. Grid Articles (Дві колонки на десктопі) */}
        {gridArticles.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16">
            {gridArticles.map((article) => (
              <div key={article._id} className="flex flex-col">
                <div className="w-full aspect-[4/3] lg:aspect-[3/2] overflow-hidden mb-6">
                  <img 
                    src={article.imageUrl || '/assets/placeholder.jpg'} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="font-cormorant font-medium text-[24px] lg:text-[28px] text-choco-dark mb-4 text-center leading-tight">
                  {article.title}
                </h2>
                <p className="font-montserrat font-light text-[14px] text-choco-dark mb-8 text-center line-clamp-4 leading-relaxed">
                  {article.excerpt}
                </p>
                <div className="mt-auto flex flex-row justify-between items-center w-full">
                  <span className="font-montserrat font-light text-[14px] text-choco-light">
                    {formatDate(article.createdAt)}
                  </span>
                  <Link 
                    to={`/journal/${article._id}`} 
                    className="bg-choco-light hover:opacity-90 transition-opacity text-creamy font-montserrat font-medium text-[13px] tracking-wider uppercase py-3 px-8 rounded-[5px]"
                  >
                    Читати далі
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 3. List Articles (Списком вниз) */}
        {listArticles.length > 0 && (
          <div className="flex flex-col gap-12 md:gap-[60px]">
            {listArticles.map((article) => (
              <div key={article._id} className="flex flex-col md:flex-row gap-6 md:gap-10 lg:gap-[60px] items-center">
                {/* Image */}
                <div className="w-full md:w-[350px] lg:w-[450px] aspect-[4/3] md:aspect-[3/2] overflow-hidden flex-shrink-0">
                  <img 
                    src={article.imageUrl || '/assets/placeholder.jpg'} 
                    alt={article.title} 
                    className="w-full h-full object-cover"
                  />
                </div>
                {/* Text */}
                <div className="flex flex-col w-full flex-grow items-center text-center">
                  <h2 className="font-cormorant font-medium text-[24px] lg:text-[28px] text-choco-dark mb-4 leading-tight max-w-[400px]">
                    {article.title}
                  </h2>
                  <p className="font-montserrat font-light text-[14px] text-choco-dark mb-8 line-clamp-3 leading-relaxed max-w-[450px]">
                    {article.excerpt}
                  </p>
                  <div className="flex flex-row justify-between items-center w-full mt-auto max-w-[450px]">
                    <span className="font-montserrat font-light text-[14px] text-choco-light">
                      {formatDate(article.createdAt)}
                    </span>
                    <Link 
                      to={`/journal/${article._id}`} 
                      className="bg-choco-light hover:opacity-90 transition-opacity text-creamy font-montserrat font-medium text-[13px] tracking-wider uppercase py-3 px-8 rounded-[5px]"
                    >
                      Читати далі
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      </div>
    </main>
  );
};

export default JournalPage;