import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesAPI } from '../../services/api';
import { EditIcon, BasketIcon, EyeIcon } from '../../components/icons';
import { SelectDropdown } from '../../components/ui/dropdowns';
import NoConnection from '../../components/errors/NoConnection';
import NoResults from '../../components/errors/NoResults';

const statusColors = {
  'Опубліковано': 'bg-[#22AD5C]', // Correct Green
  'Чернетка': 'bg-[#E5B540]', // yellow/gold for draft
  'Приховано': 'bg-[#333333]' // dark grey/black for hidden
};

const StatusLabelWithDot = ({ status }) => (
  <div className="flex items-center gap-[5px] lg:gap-2">
    <div className={`w-[9px] h-[9px] rounded-full ${statusColors[status] || 'bg-gray-400'}`}></div>
    <span className="whitespace-nowrap font-montserrat font-light text-[10px] lg:text-[14px] text-choco-dark">{status}</span>
  </div>
);

const statusOptions = ['Опубліковано', 'Чернетка', 'Приховано'].map(s => ({
  value: s,
  label: <StatusLabelWithDot status={s} />
}));

const sortOptions = [
  { value: 'newest', label: 'Найновіші' },
  { value: 'oldest', label: 'Найстаріші' },
  { value: 'views', label: 'За переглядами' },
];

const ArticleCard = ({ article, onEdit, onDelete }) => {
  const queryClient = useQueryClient();
  const dateStr = new Date(article.createdAt).toLocaleDateString('uk-UA', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }) => articlesAPI.update(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_articles'] });
    }
  });

  const handleStatusChange = (newStatus) => {
    if (newStatus !== article.status) {
      updateStatusMutation.mutate({ id: article._id, status: newStatus });
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between w-full py-[18px] lg:py-5 border-b border-choco-light/20 last:border-b-0 gap-[18px] lg:gap-5 mx-auto max-w-[345px] lg:max-w-none">
      
      {/* Left part (Mobile: Top text & image) */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-[20px] lg:gap-5 w-full lg:w-3/4">
        
        {/* Thumbnail */}
        <div className="relative w-full h-[141px] lg:w-[200px] lg:h-[130px] rounded-[10px] bg-dark-creamy flex-shrink-0 flex flex-col justify-start items-end p-[10px] pr-[15px] lg:p-0 overflow-hidden lg:overflow-visible">
          {/* Inner container for image clipping so overlay actions stay above */}
          <div className="absolute inset-0 w-full h-full lg:rounded-[10px] overflow-hidden">
            {article.imageUrl ? (
               <img src={article.imageUrl} alt={article.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-choco-light/50 font-montserrat text-sm">Немає фото</div>
            )}
          </div>

          {/* Mobile Actions Overlay on Image */}
          <div className="relative z-10 flex lg:hidden items-center gap-[3px]">
             <button onClick={() => onEdit(article._id)} className="w-[30px] h-[30px] bg-creamy rounded-full flex items-center justify-center text-wine-red">
               <EditIcon className="w-[14px] h-[14px]" />
             </button>
             <button onClick={() => onDelete(article._id)} className="w-[30px] h-[30px] bg-creamy rounded-full flex items-center justify-center text-wine-red">
               <BasketIcon className="w-[14px] h-[15px]" />
             </button>
          </div>
        </div>

        {/* Text Details */}
        <div className="flex flex-col items-start gap-[25px] flex-1 lg:gap-2 w-full">
          <div className="flex flex-col gap-0 lg:gap-2">
            <h3 className="font-montserrat font-medium text-[14px] lg:text-[18px] text-choco-light lg:text-choco-dark m-0 mb-[10px] lg:mb-0 line-clamp-2">
              {article.title}
            </h3>
            <p className="font-montserrat font-light text-[12px] lg:text-[14px] text-choco-light m-0 line-clamp-3">
              {article.excerpt}
            </p>
          </div>
          
          <div className="flex flex-row justify-between items-center w-full lg:inline-block lg:w-auto">
            <Link to={`/journal/${article._id}`} className="font-montserrat font-light text-[12px] text-[#3758F9] lg:text-wine-red underline lg:decoration-wine-red/30 cursor-pointer lg:mt-1">
              Переглянути увесь текст...
            </Link>
            <span className="lg:hidden font-montserrat font-medium text-[14px] text-choco-light">{dateStr}</span>
          </div>
        </div>
      </div>

      {/* Right part: Stats, Status, Actions */}
      <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between w-full lg:w-1/4 gap-0 lg:gap-5 mt-[-18px] lg:mt-0">
        
        {/* Date and Views */}
        <div className="flex flex-col items-end gap-1 w-auto">
          <span className="hidden lg:inline-block font-montserrat text-[14px] text-choco-light">{dateStr}</span>
          <div className="flex items-center gap-[5px] text-choco-light lg:mt-1">
            <EyeIcon className="w-[20px] h-[20px] lg:w-4 lg:h-4" />
            <span className="font-montserrat font-light text-[10px] lg:text-[12px]">{article.viewsCount} Переглядів</span>
          </div>
        </div>

        {/* Status Dropdown and Desktop Actions */}
        <div className="flex items-center gap-4">
          <SelectDropdown
            value={article.status}
            onChange={handleStatusChange}
            options={statusOptions}
            width="w-[106px] lg:w-[160px]"
            buttonClassName="px-0 py-0 border-none bg-transparent lg:px-3 lg:py-2 lg:border lg:bg-creamy"
            showCheckmarks={false}
          />
          <div className="hidden lg:flex items-center gap-3">
            <button onClick={() => onEdit(article._id)} className="text-choco-light hover:text-wine-red transition-colors">
              <EditIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(article._id)} className="text-choco-light hover:text-wine-red transition-colors">
              <BasketIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArticleCardSkeleton = () => (
  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full py-5 border-b border-choco-light/20 last:border-b-0 gap-5 animate-pulse">
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 w-full lg:w-3/4">
      <div className="w-[120px] sm:w-[200px] h-[80px] sm:h-[130px] rounded-[10px] bg-choco-light/10 flex-shrink-0"></div>
      <div className="flex flex-col items-start gap-2 flex-1 w-full">
        <div className="h-5 bg-choco-light/10 rounded w-3/4"></div>
        <div className="h-3 bg-choco-light/10 rounded w-full"></div>
        <div className="h-3 bg-choco-light/10 rounded w-5/6"></div>
        <div className="h-3 bg-choco-light/10 rounded w-1/4 mt-1"></div>
      </div>
    </div>
    <div className="flex flex-col sm:flex-row lg:flex-col items-end sm:items-center lg:items-end justify-between w-full lg:w-1/4 gap-3 lg:gap-5">
      <div className="flex flex-col items-end gap-2 w-full sm:w-auto">
        <div className="h-4 bg-choco-light/10 rounded w-24"></div>
        <div className="h-3 bg-choco-light/10 rounded w-20"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-[38px] w-[160px] bg-choco-light/10 rounded-[10px]"></div>
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 bg-choco-light/10 rounded-full"></div>
          <div className="w-5 h-5 bg-choco-light/10 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

const ArticleList = ({ onEditArticle }) => {
  const queryClient = useQueryClient();
  const [sortOption, setSortOption] = useState('newest');

  const { data: articles, isLoading, isError } = useQuery({
    queryKey: ['admin_articles'],
    queryFn: () => articlesAPI.getAdminAll(),
    refetchOnWindowFocus: false,
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => articlesAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_articles'] });
    }
  });

  const handleDelete = (id) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю статтю? Ця дія незворотна.")) {
      deleteMutation.mutate(id);
    }
  };

  if (isError) return <NoConnection />;

  let sortedArticles = [...(articles || [])];
  
  if (sortOption === 'newest') {
    sortedArticles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } else if (sortOption === 'oldest') {
    sortedArticles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
  } else if (sortOption === 'views') {
    sortedArticles.sort((a, b) => b.viewsCount - a.viewsCount);
  }

  return (
    <div className="flex flex-col w-full">
      {/* Header controls */}
      <div className="flex flex-row justify-center sm:justify-between items-center gap-[12px] mb-6 w-full">
        <button
          onClick={() => onEditArticle(null)}
          className="flex-1 flex justify-center items-center h-[40px] max-w-[226px] bg-wine-red text-creamy font-montserrat font-medium text-[14px] rounded-[31px] hover:bg-wine-red/90 transition-colors gap-2"
        >
          <span className="text-[20px] leading-none font-light mb-[2px]">+</span>
          <span>Додати статтю</span>
        </button>

        <div className="flex-1 max-w-[226px]">
          <SelectDropdown
            value={sortOption}
            onChange={(val) => setSortOption(val)}
            options={sortOptions}     
            className="flex-1 h-[40px] w-full rounded-[31px] bg-light-creamy border-choco-light text-[14px] sm:text-[16px] text-choco-light font-montserrat px-4 justify-between"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col w-full">
          {[...Array(4)].map((_, i) => <ArticleCardSkeleton key={i} />)}
        </div>
      ) : sortedArticles.length === 0 ? (
        <NoResults message="Статей поки немає. Створіть першу!" />
      ) : (
        <div className="flex flex-col w-full">
          {sortedArticles.map(article => (
            <ArticleCard 
              key={article._id} 
              article={article} 
              onEdit={onEditArticle} 
              onDelete={handleDelete} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ArticleList;