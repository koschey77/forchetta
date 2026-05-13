import { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import api from '../../services/api';
import { CustomersCardIcon, OrdersCardIcon, DollarCardIcon, ArrowUpCardIcon } from '../../components/icons';
import NoConnection from '../../components/errors/NoConnection';

// Компонент картки KPI
const KpiCard = ({ title, value, icon: Icon }) => (
  <div className="flex flex-col justify-center items-center py-4 sm:py-6 px-2 sm:px-8 gap-2 sm:gap-4 bg-[#FFFBF2] rounded-[20px] sm:rounded-[28px] shadow-sm hover:shadow-md transition-shadow">
    <Icon className="w-[45px] h-[45px] sm:w-[65px] sm:h-[65px] text-[#893E3E]" />
    <div className="flex flex-col items-center gap-1">
      <span className="font-montserrat font-medium text-[11px] sm:text-sm text-[#888888] text-center leading-tight">
        {title}
      </span>
      <span className="font-montserrat font-semibold text-lg sm:text-2xl text-choco-dark text-center">
        {value}
      </span>
    </div>
  </div>
);

// Компонент картки відгуків
const CustomerReviewsCard = ({ reviewStatsData = [], totalReviewsCount = 0 }) => {
  const defaultReviews = [
    { label: 'Чудово', percent: 77, bg: '#E8F9F0', fill: 'rgba(23, 191, 107, 0.68)' },
    { label: 'Добре', percent: 61, bg: '#E8F9F0', fill: 'rgba(65, 217, 141, 0.57)' },
    { label: 'Непогано', percent: 53, bg: '#FFF9EA', fill: 'rgba(255, 198, 50, 0.64)' },
    { label: 'Погано', percent: 33, bg: '#FCF6EB', fill: 'rgba(229, 165, 60, 0.55)' },
    { label: 'Жахливо', percent: 26, bg: '#FDEBEB', fill: 'rgba(237, 51, 51, 0.74)' },
  ];

  const reviews = reviewStatsData.length > 0 ? reviewStatsData : defaultReviews;
  
  let averageRatingStr = "0.0";
  let averageRatingNum = 0;
  if (reviewStatsData.length > 0 && totalReviewsCount > 0) {
    const totalScore = reviewStatsData.reduce((acc, curr, idx) => acc + curr.count * (5 - idx), 0);
    averageRatingNum = totalScore / totalReviewsCount;
    averageRatingStr = averageRatingNum.toFixed(1);
  } else {
    averageRatingNum = 4.0;
    averageRatingStr = "4.0";
  }

  const fullStars = Math.floor(averageRatingNum);
  const emptyStars = 5 - fullStars;

  return (
    <div className="bg-[#FFFBF2] rounded-[15px] p-[19px] px-[15px] sm:px-6 shadow-sm flex flex-col gap-[27px] min-w-0">
      
      {/* Header */}
      <div className="flex justify-between items-center w-full">
        <h2 className="font-montserrat font-semibold text-[18px] text-[#2B1A12] leading-[22px]">Оцінки покупців</h2>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#0AC277" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="cursor-pointer hover:rotate-180 transition-transform duration-500">
          <path d="M21 2v6h-6"></path>
          <path d="M3 12a9 9 0 0 1 15-6.7L21 8"></path>
          <path d="M3 22v-6h6"></path>
          <path d="M21 12a9 9 0 0 1-15 6.7L3 16"></path>
        </svg>
      </div>

      {/* Stars & Rating */}
      <div className="flex justify-between items-center w-full">
        <div className="flex items-center gap-[6px]">
          {Array(fullStars).fill().map((_, i) => (
             <svg key={`full-${i}`} width="24" height="24" viewBox="0 0 24 24" fill="#FFBB0B" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
          {/* Empty Stars */}
          {Array(emptyStars).fill().map((_, i) => (
            <svg key={`empty-${i}`} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#FFBB0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
            </svg>
          ))}
        </div>
        <div className="flex items-baseline gap-1">
          <span className="font-montserrat font-semibold text-[20px] text-[#323232] leading-[24px]">{averageRatingStr}</span>
          <span className="font-montserrat font-medium text-[14px] text-[#888888] leading-[17px]">із 5</span>
        </div>
      </div>

      {/* Progress Bars */}
      <div className="flex flex-col gap-[18px]">
         {reviews.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 w-full">
               <span className="w-[140px] font-montserrat font-medium text-[14px] text-[#323232] truncate" title={item.label}>{item.label}</span>
               <div className="flex-1 h-[9px] rounded-[10px]" style={{ backgroundColor: item.bg }}>
                   <div className="h-full rounded-[10px] transition-all duration-1000" style={{ width: `${item.percent}%`, backgroundColor: item.fill }}></div>
               </div>
               <span className="font-montserrat font-medium text-[12px] text-[#888888] w-[20px] text-right">{item.count !== undefined ? item.count : ''}</span>
            </div>
         ))}
      </div>
    </div>
  );
};

const RegistrationStatsChart = () => {
  const [period, setPeriod] = useState(30);

  const { data: registrationsData, isLoading } = useQuery({
    queryKey: ['adminDashboardRegistrations', period],
    queryFn: () => api.stats.getRegistrationStats(period),
    placeholderData: keepPreviousData,
  });

  return (
    <div className="bg-[#FFFBF2] rounded-[15px] p-[18px] shadow-sm flex flex-col gap-[20px] min-w-0">
      <div className="flex justify-between items-center w-full">
        <h2 className="font-montserrat font-semibold text-[18px] text-[#2B1A12] leading-[22px]">Динаміка реєстрацій</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="bg-transparent border border-choco-light/30 rounded-lg text-sm font-montserrat p-1 text-choco-dark focus:outline-none"
        >
          <option value={7}>За 7 днів</option>
          <option value={14}>За 14 днів</option>
          <option value={30}>За місяць</option>
        </select>
      </div>
      <div className="w-full h-[250px] relative">
        {isLoading && !registrationsData && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#FFFBF2]/50">
            <div className="w-8 h-8 border-4 border-[#D4C4B7] border-t-[#893E3E] rounded-full animate-spin"></div>
          </div>
        )}
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={registrationsData || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorReg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#893E3E" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#893E3E" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E3D6BF" opacity={0.5} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888888', fontSize: 12, fontFamily: 'Montserrat' }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#888888', fontSize: 12, fontFamily: 'Montserrat' }}
              allowDecimals={false}
            />
            <Tooltip 
              contentStyle={{ borderRadius: '10px', border: '1px solid #E3D6BF', backgroundColor: '#FFFBF2' }}
              itemStyle={{ color: '#893E3E', fontWeight: 600, fontFamily: 'Montserrat' }}
              labelStyle={{ fontWeight: 500, fontFamily: 'Montserrat', color: '#2B1A12' }}
              formatter={(value) => [value, 'Нові клієнти']}
            />
            <Area type="monotone" dataKey="value" stroke="#893E3E" strokeWidth={2} fillOpacity={1} fill="url(#colorReg)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => api.stats.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="w-full flex justify-center items-center py-32">
        <div className="w-12 h-12 border-4 border-[#D4C4B7] border-t-[#893E3E] rounded-full animate-spin"></div>
      </div>
    );
  }
  if (isError) return <NoConnection />;

  const { kpi, orderStatusData, salesData } = data;

  return (
    <div className="w-full flex flex-col gap-8 pb-10">
      
      {/* Верхній ряд: KPI картки */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
        <KpiCard title="Всього покупців" value={kpi.totalUsers.toLocaleString()} icon={CustomersCardIcon} />
        <KpiCard title="Всього замовлень" value={kpi.totalOrders.toLocaleString()} icon={OrdersCardIcon} />
        <KpiCard title="Всього доходу" value={`₴ ${kpi.totalIncome.toLocaleString()}`} icon={DollarCardIcon} />
        <KpiCard title="Усього товарів" value={kpi.totalProducts.toLocaleString()} icon={ArrowUpCardIcon} />
      </div>

      {/* Середній ряд: Графіки (Дохід) */}
      <div className="bg-[#FFFBF2] rounded-[28px] p-6 shadow-sm flex flex-col gap-6 min-w-0">
        <h2 className="font-montserrat font-semibold text-xl text-choco-dark ml-2">Дохід по днях</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#893E3E" stopOpacity={1}/>
                  <stop offset="95%" stopColor="#D4C4B7" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E3D6BF" opacity={0.6} />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 13, fontFamily: 'Montserrat', fontWeight: 500 }} 
                dy={10}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#888888', fontSize: 13, fontFamily: 'Montserrat', fontWeight: 500 }}
                  tickFormatter={(val) => val >= 1000 ? `₴${Math.round(val / 1000)}k` : `₴${val}`}
                domain={[0, dataMax => (dataMax === 0 ? 5000 : dataMax)]}
              />
              <Tooltip 
                cursor={{ fill: '#f5eee0', opacity: 0.5 }}
                contentStyle={{ borderRadius: '15px', border: '1px solid #E3D6BF', backgroundColor: '#FFFBF2', color: '#2B1A12' }}
                itemStyle={{ color: '#893E3E', fontWeight: 700, fontFamily: 'Montserrat' }}
                labelStyle={{ fontWeight: 600, fontFamily: 'Montserrat', color: '#2B1A12' }}
                formatter={(value) => [`₴ ${value.toLocaleString()}`, 'Дохід']}
              />
              <Bar dataKey="value" fill="url(#colorSales)" radius={[8, 8, 0, 0]} barSize={42} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Нижній ряд: Статуси та Відгуки */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Кругова діаграма статусів */}
        <div className="bg-[#FFFBF2] rounded-[15px] p-[18px] shadow-sm flex flex-col justify-center items-center gap-[29px] min-w-0">
          {/* Header */}
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col">
              <h2 className="font-montserrat font-semibold text-[18px] text-[#2B1A12] leading-[22px]">Статус замовлень</h2>
              <span className="font-montserrat font-medium text-[12px] text-[#616262] leading-[15px] mt-[7px]">Замовлення за поточний місяць</span>
            </div>
            {/* carbon:growth icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19.5 7.5L14.625 12.375L10.875 8.625L4.5 15" stroke="#0AC277" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M15 7.5H19.5V12" stroke="#0AC277" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          {/* Main content frame (Pie + Legend) */}
          <div className="flex flex-row items-center gap-[42px] w-full justify-center">
            
            {/* Left: Pie Container */}
            <div className="flex flex-col items-center gap-[7px] w-[165px]">
               <div className="relative w-[165px] h-[165px]">
                  <ResponsiveContainer width={165} height={165}>
                    <PieChart>
                       <Pie
                         data={orderStatusData}
                         cx="50%"
                         cy="50%"
                         innerRadius={55}
                         outerRadius={82.5}
                         paddingAngle={0}
                         dataKey="value"
                         stroke="none"
                       >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                       </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Absolute text 100% */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="font-montserrat font-semibold text-[18px] text-[#2B1A12]">100%</span>
                  </div>
               </div>
               <span className="font-montserrat font-medium text-[14px] text-[#888888]">Співвідношення</span>
            </div>

            {/* Right: Legend Container */}
            <div className="flex flex-col gap-[10px]">
               {orderStatusData.map((status, idx) => (
                  <div key={idx} className="flex items-center gap-[6px]">
                     <div className="w-[12px] h-[12px] rounded-full" style={{ backgroundColor: status.color }}></div>
                     <span className="font-montserrat font-medium text-[14px] text-[#2B1A12]">{status.name}</span>
                  </div>
               ))}
            </div>

          </div>
        </div>

        {/* Картка відгуків покупців */}
        <CustomerReviewsCard reviewStatsData={data.reviewStatsData} totalReviewsCount={data.totalReviewsCount} />
      </div>

      {/* Останній ряд: Реєстрації та Розподіл по категоріях */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-2">
        
        {/* Графік реєстрацій (Ізольований) */}
        <RegistrationStatsChart />

        {/* Розподіл по категоріях */}
        <div className="bg-[#FFFBF2] rounded-[15px] p-[18px] shadow-sm flex flex-col gap-[20px] min-w-0">
          <h2 className="font-montserrat font-semibold text-[18px] text-[#2B1A12] leading-[22px]">Розподіл за категоріями (Виторг)</h2>
          <div className="w-full h-[250px]">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={data.categoryDistributionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                  stroke="none"
                >
                  {data.categoryDistributionData && data.categoryDistributionData.map((entry, index) => {
                    const colors = ['#893E3E', '#D4C4B7', '#66BC91', '#4A90E2', '#FFBB0B', '#9B51E0', '#FF6C6C', '#323232'];
                    return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                  })}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₴ ${value.toLocaleString()}`, 'Виторг']}
                  contentStyle={{ borderRadius: '10px', border: 'none', backgroundColor: '#fff', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

    </div>
  );
};

export default AdminDashboard;
