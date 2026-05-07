import { useState, useEffect, useRef, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { articlesAPI } from '../../services/api';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css'; // CSS styles for React Quill
import toast from 'react-hot-toast';
import { imageService } from '../../services/imageService';

const ArticleEditor = ({ articleId, onCancel, onSuccess }) => {
  const isEditing = !!articleId;
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    status: 'Чернетка', // default
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [existingImageUrl, setExistingImageUrl] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  const quillRef = useRef(null);

  // Drag and Drop handlers
  const handleDragEnter = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      if (!files[0].type.startsWith('image/')) {
        return toast.error('Тільки зображення!');
      }
      setSelectedImage(files[0]);
    }
  };

  const handleFileSelect = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setSelectedImage(files[0]);
    }
  };
  
  const { data: initialArticle, isLoading: isLoadingArticle } = useQuery({
    queryKey: ['admin_article', articleId],
    queryFn: () => articlesAPI.getById(articleId), // Note: you might use getAdminAll and filter, or a separate getAdminById if needed
    enabled: !!articleId && isEditing, // ЗАХИСТ: робити запит лише якщо є реальний articleId
  });

  const [isFormInitialized, setIsFormInitialized] = useState(!isEditing);

  useEffect(() => {
    if (isEditing && initialArticle) {
      // Очищуємо контент від класів, які можуть зламати ReactQuill (якщо вони залишилися в БД)
      let safeContent = initialArticle.content || '';
      safeContent = safeContent.replace(/class="article-image"[^>]*>/g, '>');
      safeContent = safeContent.replace(/alt="Вкладене зображення"/g, '');

      setFormData({
        title: initialArticle.title || '',
        excerpt: initialArticle.excerpt || '',
        content: safeContent,
        status: initialArticle.status || 'Чернетка',
      });
      setExistingImageUrl(initialArticle.imageUrl || '');
      setIsFormInitialized(true);
    }
  }, [isEditing, initialArticle, articleId]); // Додаємо articleId в залежності

  const saveMutation = useMutation({
    mutationFn: (data) => isEditing ? articlesAPI.update(articleId, data) : articlesAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin_articles'] });
      queryClient.invalidateQueries({ queryKey: ['admin_article', articleId] });
      if (onSuccess) onSuccess();
    }
  });

  const handleSave = async (publish = false) => {
    // Basic validation
    if (!formData.title.trim() || !formData.excerpt.trim() || !formData.content.trim()) {
      toast.error("Будь ласка, заповніть всі обов'язкові поля!");
      return;
    }

    const payload = { ...formData };
    if (publish) {
      payload.status = 'Опубліковано';
    }

    try {
      if (selectedImage) {
        // Конвертируем картинку в base64
        const base64Images = await imageService.filesToBase64([selectedImage]);
        if (base64Images.length > 0) {
          payload.imageUrl = base64Images[0];
        }
      } else {
        payload.imageUrl = existingImageUrl;
      }

      // -- МЕХАНІЗМ ПЕРЕХОПЛЕННЯ BASE64 В СТАТТІ (Для скопійованих чи перетягнутих зображень) --
      let contentHtml = payload.content;
      // Шукаємо зображення будь-якого розміру і типу (jpeg, png, webp)
      const base64SrcRegex = /<img[^>]+src="data:image\/[^;]+;base64,[^"]+"[^>]*>/g;
      const base64Matches = contentHtml.match(base64SrcRegex);
      
      if (base64Matches && base64Matches.length > 0) {
        const loadingToastId = toast.loading(`Обробка та завантаження ${base64Matches.length} вбудованих зображень...`);
        try {
          for (let i = 0; i < base64Matches.length; i++) {
            const imgTag = base64Matches[i];
            
            // Вилучаємо власне саму стрічку data:image/...;base64,... з src=""
            const srcRegex = /src="(data:image\/[^;]+;base64,[^"]+)"/;
            const srcMatch = imgTag.match(srcRegex);
            
            if (srcMatch && srcMatch[1]) {
               const base64String = srcMatch[1];
               const response = await articlesAPI.uploadImage(base64String);
               if (response && response.url) {
                 // Замінюємо ВЕСЬ тег <img> на новий акуратний (звичайний Quill-формат, щоб він не ламався при редагуванні)
                 const newImgTag = `<img src="${response.url}">`;
                 contentHtml = contentHtml.replace(imgTag, newImgTag);
               }
            }
          }
          payload.content = contentHtml;
          toast.success('Зображення в тексті успішно оптимізовано!', { id: loadingToastId });
        } catch (imgError) {
          console.error(imgError);
          toast.error('Сталась помилка при оптимізації зображень', { id: loadingToastId });
          return; // Перериваємо збереження, якщо фото не завантажило
        }
      }
      // ------------------------------------------------------------------------------------------
      
      saveMutation.mutate(payload);
    } catch (err) {
      toast.error('Помилка обробки зображення');
    }
  };

  // React Quill Image Handler
  const imageHandler = () => {
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      if (file) {
        if (!imageService.validateSingleFile(file)) return;
        
        const toastId = toast.loading('Завантаження зображення на сервер...');
        try {
          const base64Image = await imageService.fileToBase64(file);
          const response = await articlesAPI.uploadImage(base64Image);
          const url = response.url;
          
          if (quillRef.current) {
            const quill = quillRef.current.getEditor();
            const range = quill.getSelection(true);
            quill.insertEmbed(range.index, 'image', url);
            quill.setSelection(range.index + 1, 0);
          }
          toast.success('Зображення успішно завантажено', { id: toastId });
        } catch (error) {
          console.error(error);
          toast.error('Помилка при завантаженні зображення на Cloudinary', { id: toastId });
        }
      }
    };
  };

  // React Quill simple config
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        [{'list': 'ordered'}, {'list': 'bullet'}],
        ['link', 'image'],
        ['clean']
      ],
      handlers: {
        image: imageHandler
      }
    }
  }), []);

  if (isEditing && (!isFormInitialized || isLoadingArticle)) {
    return (
      <div className="flex flex-col w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto animate-pulse">
        <div className="h-10 bg-choco-light/10 rounded-md w-1/3 mx-auto mb-6"></div>
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-choco-light/10 rounded w-24"></div>
            <div className="h-12 bg-choco-light/10 rounded-[10px] w-full"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-choco-light/10 rounded w-48"></div>
            <div className="h-[220px] bg-choco-light/10 rounded-[10px] w-full"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-choco-light/10 rounded w-24"></div>
            <div className="h-24 bg-choco-light/10 rounded-[10px] w-full"></div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="h-4 bg-choco-light/10 rounded w-32"></div>
            <div className="h-[600px] bg-choco-light/10 rounded-[10px] w-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-[1440px] px-[15px] sm:px-[30px] lg:px-[60px] mx-auto">
      <h2 className="font-cormorant font-bold text-[28px] lg:text-[40px] text-choco-dark mb-6 text-center">
        {isEditing ? 'Редагувати статтю' : 'Додати нову статтю'}
      </h2>

      {/* Main form flex */}
      <div className="flex flex-col gap-6">
        
        {/* Title Input */}
        <div className="flex flex-col gap-2">
          <label className="font-montserrat text-[14px] text-choco-light">Заголовок</label>
          <input 
            type="text" 
            className="w-full bg-creamy border border-choco-light/30 rounded-[10px] px-4 py-3 font-montserrat text-choco-dark focus:outline-none focus:border-wine-red"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            placeholder="Введіть заголовок статті"
          />
        </div>

        {/* Thumbnail uploader */}
        <div className="flex flex-col gap-2">
           <label className="font-montserrat text-[14px] text-choco-light">Постер (Обкладинка) статті</label>
           <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-stretch h-[220px]">
             
             {/* Upload zone */}
             <div 
               onClick={() => document.getElementById('poster-file-input').click()}
               onDragEnter={handleDragEnter}
               onDragLeave={handleDragLeave}
               onDragOver={handleDragOver}
               onDrop={handleDrop}
               className={`flex-1 w-full border-2 border-dashed rounded-[10px] flex flex-col items-center justify-center p-4 cursor-pointer transition-all ${
                 isDragging ? 'border-wine-red bg-[#F8F2E8] scale-[1.02]' : 'border-choco-light/50 hover:border-choco-light hover:bg-[#F8F2E8]'
               }`}
             >
                <div className="w-[60px] h-[60px] rounded-full border border-choco-light/50 flex items-center justify-center mb-2">
                  <span className="text-choco-light text-[24px]">+</span>
                </div>
                <span className="text-[13px] text-choco-light/70 font-montserrat text-center max-w-[200px]">
                  Перетяніть фото сюди або натисніть щоб завантажити
                </span>
                <input
                  id="poster-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
             </div>

             {/* Preview zone */}
             <div className="w-[300px] h-full rounded-[10px] overflow-hidden bg-creamy relative flex items-center justify-center border border-choco-light/20 shadow-sm">
                {(selectedImage || existingImageUrl) ? (
                  <>
                    <img 
                      src={selectedImage ? URL.createObjectURL(selectedImage) : existingImageUrl} 
                      alt="Обкладинка статті"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);
                        setExistingImageUrl('');
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-white/80 hover:bg-wine-red hover:text-white backdrop-blur-sm text-choco-dark transition-colors rounded-full flex items-center justify-center text-lg leading-none"
                    >
                      ×
                    </button>
                  </>
                ) : (
                  <span className="text-[14px] text-choco-light/40 font-montserrat">Немає постера</span>
                )}
             </div>

           </div>
        </div>

        {/* Excerpt Input */}
        <div className="flex flex-col gap-2">
          <label className="font-montserrat text-[14px] text-choco-light">Короткий опис</label>
          <textarea 
            className="w-full h-[100px] bg-creamy border border-choco-light/30 rounded-[10px] px-4 py-3 font-montserrat text-choco-dark focus:outline-none focus:border-wine-red resize-none"
            value={formData.excerpt}
            onChange={(e) => setFormData(prev => ({...prev, excerpt: e.target.value}))}
            placeholder="Введіть прев'ю статті (відображається в списку)"
          />
        </div>

        {/* React Quill Editor for Content */}
        <div className="flex flex-col gap-2">
          <label className="font-montserrat text-[14px] text-choco-light">Текст статті</label>
          <div className="bg-creamy rounded-[10px] overflow-hidden border border-choco-light/30 [&_.ql-toolbar]:border-none [&_.ql-toolbar]:border-b [&_.ql-toolbar]:border-choco-light/30 [&_.ql-container]:border-none [&_.ql-editor]:min-h-[600px] [&_.ql-editor]:pb-[100px] [&_.ql-editor_img]:max-w-full [&_.ql-editor_img]:w-auto [&_.ql-editor_img]:h-auto [&_.ql-editor]:whitespace-pre-wrap [&_.ql-editor_img]:my-4 [&_.ql-editor]:font-montserrat [&_.ql-editor]:text-choco-dark [&_.ql-editor]:caret-choco-dark [&_.ql-editor]:cursor-text [&_.ql-editor]:text-[16px]">
            <ReactQuill 
              ref={quillRef}
              theme="snow" 
              value={formData.content} 
              onChange={(val) => setFormData(prev => ({...prev, content: val}))} 
              modules={modules}
              placeholder="Введіть текст статті..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
          <button 
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto px-6 py-3 border border-choco-light rounded-[10px] text-choco-light font-montserrat font-medium hover:bg-choco-light/10 transition-colors"
          >
            Відсунути (Скасувати)
          </button>
          
          <button 
            type="button"
            onClick={() => handleSave(false)}
            disabled={saveMutation.isPending}
            className="w-full sm:w-auto px-6 py-3 bg-creamy border border-choco-dark text-choco-dark font-montserrat font-medium rounded-[10px] hover:bg-choco-dark/10 transition-colors"
          >
            Зберегти як чернетку
          </button>

          <button 
            type="button"
            onClick={() => handleSave(true)}
            disabled={saveMutation.isPending}
            className="w-full sm:w-auto px-6 py-3 bg-wine-red text-creamy font-montserrat font-medium rounded-[10px] hover:bg-wine-red/90 transition-colors"
          >
            Зберегти та опублікувати
          </button>
        </div>

      </div>
    </div>
  );
};

export default ArticleEditor;