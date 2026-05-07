import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { articlesAPI } from '../services/api';
import Error404 from '../components/errors/Error404';
import NoConnection from '../components/errors/NoConnection';

const ArticlePageSkeleton = () => {
  return (
    <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto py-8 md:py-[50px] animate-pulse">
      <div className="h-[20px] w-24 bg-choco-light/10 rounded-[5px] mb-8"></div>
      
      <div className="w-full">
        <div className="w-full aspect-[16/9] lg:aspect-[2/1] bg-choco-light/10 rounded-[10px] mb-8 md:mb-12"></div>
        <div className="h-10 w-full bg-choco-light/10 rounded-md mb-6"></div>
        <div className="h-10 w-2/3 bg-choco-light/10 rounded-md mb-8"></div>
        <div className="flex gap-4 mb-12 border-b border-choco-light/20 pb-6">
          <div className="h-4 w-24 bg-choco-light/10 rounded-md"></div>
          <div className="h-4 w-24 bg-choco-light/10 rounded-md"></div>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full bg-choco-light/10 rounded-md"></div>
          <div className="h-4 w-full bg-choco-light/10 rounded-md"></div>
          <div className="h-4 w-5/6 bg-choco-light/10 rounded-md"></div>
          <div className="h-4 w-full bg-choco-light/10 rounded-md"></div>
        </div>
      </div>
    </div>
  );
};

const ArticlePage = () => {
  const { id } = useParams();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => articlesAPI.getById(id),
    refetchOnWindowFocus: false,
    retry: false
  });

  if (isLoading) return <ArticlePageSkeleton />;
  
  if (error) {
    if (error.response?.status === 404 || error.response?.status === 400) {
      return <Error404 message="Статтю не знайдено або її було видалено" />;
    }
    return <NoConnection />;
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('uk-UA', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  return (
    <main className="flex-grow bg-creamy relative overflow-hidden">
      <div className="w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto">
        {/* Головний заголовок */}
        <h1 className="font-cormorant font-bold text-[40px] md:text-[60px] text-choco-light text-left w-full leading-tight">
          Журнал Forchetta
        </h1>

        <article className="w-full">
          {/* Контент статті */}
          <div 
            className="article-content w-full overflow-hidden font-montserrat text-choco-dark leading-relaxed break-words
                       [&>p]:mb-6 [&>h1]:font-cormorant [&>h1]:text-[32px] [&>h1]:font-bold [&>h1]:mb-6 [&>h1]:mt-10 
                       [&>h2]:font-cormorant [&>h2]:text-[28px] [&>h2]:font-bold [&>h2]:mb-5 [&>h2]:mt-8
                       [&>h3]:font-cormorant [&>h3]:text-[24px] [&>h3]:font-bold [&>h3]:mb-4 [&>h3]:mt-6
                       [&_img]:max-w-full [&_img]:w-auto [&_img]:h-auto [&_img]:my-8 [&_img]:mx-auto
                       [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-6
                       [&>blockquote]:border-l-4 [&>blockquote]:border-choco-light [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:my-8 [&>blockquote]:text-choco-light
                       text-[16px] md:text-[18px]"
            dangerouslySetInnerHTML={{ __html: (article.content || '').replace(/&nbsp;/g, ' ') }}
          />

          <div className="flex w-full mt-8 md:mt-12 pt-6 pb-12 md:pb-16 border-t border-choco-light/20">
            <span className="font-montserrat font-light text-[14px] text-choco-light">
              {formatDate(article.createdAt)}
            </span>
          </div>
        </article>
      </div>
    </main>
  );
};

export default ArticlePage;
