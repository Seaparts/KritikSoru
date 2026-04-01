import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  Activity, RefreshCw, LogOut, Users, Package, MessageSquare, 
  DollarSign, TrendingUp, Server, Cpu, Database, Zap, Clock, ShieldCheck,
  CreditCard, AlertCircle, Lock, Eye, UserCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { fetchUsers, UserItem, fetchAllQuestions, QuestionHistoryItem, getAnalytics, getTokenUsageStats } from '../services/api';

// --- MOCK DATA ---

const tokenUsageData = Array.from({ length: 19 }).map((_, i) => ({
  date: `Mar ${i + 1}`,
  tokens: Math.floor(Math.random() * 50000) + 10000,
  cost: Number((Math.random() * 5).toFixed(4))
}));

const recentQuestions = Array.from({ length: 10 }).map((_, i) => ({
  id: `Q-${1000 + i}`,
  phone: `+90 555 123 45 ${i.toString().padStart(2, '0')}`,
  channel: i % 3 === 0 ? 'Web' : 'WhatsApp',
  question: 'Matematik - Türev',
  status: i % 5 === 0 ? 'Hata' : 'Çözüldü',
  model: 'gpt-4o',
  cost: `$${(Math.random() * 0.05).toFixed(4)}`,
  time: `${Math.floor(Math.random() * 10) + 1} dk önce`
}));

const expensiveQuestions = Array.from({ length: 10 }).map((_, i) => ({
  id: `Q-${9000 + i}`,
  phone: `+90 532 987 65 ${i.toString().padStart(2, '0')}`,
  channel: 'WhatsApp',
  question: 'Fizik - Karmaşık Devre',
  status: 'Çözüldü',
  model: 'gpt-4o-high-res',
  cost: `$${(Math.random() * 0.15 + 0.05).toFixed(4)}`,
  time: `${Math.floor(Math.random() * 24)} saat önce`
})).sort((a, b) => parseFloat(b.cost.slice(1)) - parseFloat(a.cost.slice(1)));

const recentPayments = Array.from({ length: 10 }).map((_, i) => ({
  id: `PAY-${5000 + i}`,
  phone: `+90 505 456 78 ${i.toString().padStart(2, '0')}`,
  provider: 'iyzico',
  amount: i % 4 === 0 ? '149.90 TL' : '299.90 TL',
  status: i % 8 === 0 ? 'Başarısız' : 'Başarılı',
  time: `${Math.floor(Math.random() * 5) + 1} saat önce`
}));

// --- COMPONENTS ---

const StatCard = ({ title, value, icon: Icon, subtitle, colorClass }: any) => (
  <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl shadow-sm flex flex-col justify-between">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <div className={`p-2 rounded-lg ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
    <div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      {subtitle && <div className="text-xs text-slate-500">{subtitle}</div>}
    </div>
  </div>
);

const SectionHeader = ({ title, icon: Icon }: any) => (
  <div className="flex items-center gap-3 mb-6">
    <div className="p-2 bg-slate-800 rounded-lg border border-slate-700">
      <Icon className="w-5 h-5 text-blue-400" />
    </div>
    <h2 className="text-xl font-bold text-white">{title}</h2>
  </div>
);

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isHealthy, setIsHealthy] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [usersList, setUsersList] = useState<UserItem[]>([]);
  const [questionsList, setQuestionsList] = useState<QuestionHistoryItem[]>([]);
  const [analyticsData, setAnalyticsData] = useState({
    totalVisits: 0,
    totalLoggedInVisits: 0,
    todayVisits: 0,
    todayLoggedInVisits: 0
  });
  const [tokenStats, setTokenStats] = useState({
    totalPromptTokens: 0,
    totalCompletionTokens: 0,
    totalTokens: 0,
    totalCost: 0,
    chartData: [] as any[]
  });
  const [systemHealth, setSystemHealth] = useState({
    status: "Yükleniyor...",
    uptime: "-",
    memoryRss: 0,
    heapUsed: 0,
    heapTotal: 0,
    nodeVersion: "-",
    environment: "-",
    webhookActive: false
  });
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
      
      // Update system health every 10 seconds
      const interval = setInterval(() => {
        fetch('/api/system-health')
          .then(res => res.json())
          .then(data => setSystemHealth(data))
          .catch(() => setSystemHealth(prev => ({ ...prev, status: "Bağlantı Hatası" })));
      }, 10000);
      
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoadingData(true);
    try {
      const [users, questions, analytics, tokens, healthRes] = await Promise.all([
        fetchUsers(),
        fetchAllQuestions(),
        getAnalytics(),
        getTokenUsageStats(),
        fetch('/api/system-health').then(res => res.json()).catch(() => null)
      ]);
      setUsersList(users);
      setQuestionsList(questions);
      setAnalyticsData(analytics);
      setTokenStats(tokens);
      if (healthRes) {
        setSystemHealth(healthRes);
        setIsHealthy(true);
      } else {
        setIsHealthy(false);
      }
    } catch (error) {
      console.error("Error loading admin data:", error);
      setIsHealthy(false);
    } finally {
      setLoadingData(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Hatalı şifre. Lütfen tekrar deneyin.');
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setTimeout(() => {
      setIsRefreshing(false);
      setIsHealthy(Math.random() > 0.1); // 10% chance to show error for demo
    }, 500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 font-sans">
        <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-blue-500/10 rounded-full border border-blue-500/20">
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-2">Admin Girişi</h1>
          <p className="text-slate-400 text-center mb-8 text-sm">Devam etmek için yönetici şifresini girin.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Şifre"
                className="w-full bg-slate-950 border border-slate-800 text-white px-4 py-3.5 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                autoFocus
              />
            </div>
            {error && <p className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg border border-red-500/20">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-3.5 rounded-xl transition-colors shadow-lg shadow-blue-500/20"
            >
              Giriş Yap
            </button>
          </form>
          <div className="mt-6 text-center">
            <button onClick={() => navigate('/')} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">
              Ana Sayfaya Dön
            </button>
          </div>
        </div>
      </div>
    );
  }

  const today = new Date();
  const todayStr = today.toLocaleDateString('tr-TR');
  const thisMonthStr = today.toLocaleDateString('tr-TR', { month: '2-digit', year: 'numeric' });

  const usersToday = usersList.filter(u => u.createdAt.startsWith(todayStr)).length;
  const usersThisMonth = usersList.filter(u => {
    const parts = u.createdAt.split(' ')[0].split('.');
    if (parts.length === 3) {
      return `${parts[1]}.${parts[2]}` === thisMonthStr;
    }
    return false;
  }).length;

  const questionsToday = questionsList.filter(q => q.date.startsWith(todayStr)).length;
  const questionsThisMonth = questionsList.filter(q => {
    const parts = q.date.split(' ')[0].split('.');
    if (parts.length === 3) {
      return `${parts[1]}.${parts[2]}` === thisMonthStr;
    }
    return false;
  }).length;

  const planCounts = {
    free: 0,
    mini: 0,
    netArttir: 0,
    fullFocus: 0,
    efsaneMod: 0,
  };

  usersList.forEach(u => {
    if (u.activePlan === 'free') planCounts.free++;
    else if (u.activePlan === 'mini') planCounts.mini++;
    else if (u.activePlan === 'net-arttir') planCounts.netArttir++;
    else if (u.activePlan === 'full-focus') planCounts.fullFocus++;
    else if (u.activePlan === 'efsane-mod') planCounts.efsaneMod++;
    else planCounts.free++; // default to free if unknown
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-slate-900/80 backdrop-blur-md border-b border-slate-800 shadow-sm">
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-black tracking-tighter text-white">
            Kritik<span className="text-blue-500">.com</span>
          </Link>
          <span className="px-2 py-1 ml-4 text-xs font-bold tracking-wider text-blue-400 uppercase bg-blue-500/10 rounded-full border border-blue-500/20 hidden sm:inline-block">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
            <span className="text-xs font-medium text-slate-400 hidden sm:inline-block">Sistem:</span>
            <div 
              className={`w-3 h-3 rounded-full ${isHealthy ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'}`} 
              title={isHealthy ? 'Bağlı' : 'Bağlantı Hatası'}
            ></div>
          </div>
          <button 
            onClick={handleRefresh} 
            className="p-2 text-slate-400 transition-colors rounded-lg hover:text-white hover:bg-slate-800 disabled:opacity-50" 
            title="Yenile"
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin text-blue-500' : ''}`} />
          </button>
          <button 
            onClick={handleLogout} 
            className="flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2 text-sm font-medium text-red-400 transition-colors rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline-block">Çıkış Yap</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 sm:p-6 mx-auto max-w-[1600px] space-y-8">
        
        {/* Top Summary Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <StatCard 
            title="Kullanıcılar" 
            value={usersList.length.toLocaleString('tr-TR')} 
            subtitle={`Bugün: +${usersToday} | Bu Ay: +${usersThisMonth}`}
            icon={Users} 
            colorClass="bg-blue-500/10 text-blue-400" 
          />
          <StatCard 
            title="Çözülen Sorular" 
            value={questionsList.length.toLocaleString('tr-TR')} 
            subtitle={`Bugün: +${questionsToday} | Bu Ay: +${questionsThisMonth}`}
            icon={MessageSquare} 
            colorClass="bg-emerald-500/10 text-emerald-400" 
          />
          <StatCard 
            title="Toplam Maliyet" 
            value="$4,250.45" 
            subtitle="Bugün: $45.20 | Bu Ay: $1,240.50"
            icon={TrendingUp} 
            colorClass="bg-orange-500/10 text-orange-400" 
          />
          <StatCard 
            title="Toplam Gelir" 
            value="₺452,890" 
            subtitle="Bugün: ₺4,500 | Bu Ay: ₺125,400"
            icon={DollarSign} 
            colorClass="bg-purple-500/10 text-purple-400" 
          />
        </div>

        {/* Site Analytics Grid */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
          <SectionHeader title="Site Ziyaret İstatistikleri" icon={Activity} />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <StatCard 
              title="Toplam Ziyaret" 
              value={analyticsData.totalVisits.toLocaleString('tr-TR')} 
              subtitle="Tüm zamanlar (Üye + Ziyaretçi)"
              icon={Eye} 
              colorClass="bg-indigo-500/10 text-indigo-400" 
            />
            <StatCard 
              title="Bugünkü Ziyaret" 
              value={analyticsData.todayVisits.toLocaleString('tr-TR')} 
              subtitle="Bugün (Üye + Ziyaretçi)"
              icon={Activity} 
              colorClass="bg-sky-500/10 text-sky-400" 
            />
            <StatCard 
              title="Toplam Üye Girişi" 
              value={analyticsData.totalLoggedInVisits.toLocaleString('tr-TR')} 
              subtitle="Tüm zamanlar (Sadece Üyeler)"
              icon={UserCheck} 
              colorClass="bg-fuchsia-500/10 text-fuchsia-400" 
            />
            <StatCard 
              title="Bugünkü Üye Girişi" 
              value={analyticsData.todayLoggedInVisits.toLocaleString('tr-TR')} 
              subtitle="Bugün (Sadece Üyeler)"
              icon={Users} 
              colorClass="bg-pink-500/10 text-pink-400" 
            />
          </div>
        </div>

        {/* OpenAI & Packages Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* OpenAI Stats */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <SectionHeader title="OpenAI API Kullanımı" icon={Cpu} />
            <div className="grid grid-cols-1 gap-4 mb-6">
              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex justify-between items-center">
                <div>
                  <div className="text-xs text-slate-500 mb-1">Harcanan Token</div>
                  <div className="text-2xl font-bold text-white">{tokenStats.totalTokens.toLocaleString('tr-TR')}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 mb-1">Toplam Maliyet</div>
                  <div className="text-2xl font-bold text-emerald-400">${tokenStats.totalCost?.toFixed(4) || "0.0000"}</div>
                </div>
              </div>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={tokenStats.chartData.length > 0 ? tokenStats.chartData : tokenUsageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value}`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#1e293b', borderRadius: '0.5rem', color: '#f8fafc' }}
                    itemStyle={{ color: '#10b981' }}
                    formatter={(value: number) => [`$${value.toFixed(4)}`, 'Maliyet']}
                  />
                  <Area type="monotone" dataKey="cost" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorCost)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Package Distribution */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <SectionHeader title="Paket Dağılımı" icon={Package} />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-300">Sadece Kayıtlı (Ücretsiz)</span>
                <span className="font-bold text-white">{planCounts.free.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-300">Mini Çözüm</span>
                <span className="font-bold text-white">{planCounts.mini.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-300">Net Arttır</span>
                <span className="font-bold text-white">{planCounts.netArttir.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-300">Full Focus</span>
                <span className="font-bold text-white">{planCounts.fullFocus.toLocaleString('tr-TR')}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <span className="text-sm font-medium text-slate-300">Efsane Mod</span>
                <span className="font-bold text-white">{planCounts.efsaneMod.toLocaleString('tr-TR')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Questions Tables */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Recent Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
            <SectionHeader title="Son Çözülen 10 Soru" icon={Clock} />
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ID</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Kanal</th>
                    <th className="px-4 py-3">Soru</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3">Maliyet</th>
                    <th className="px-4 py-3">Zaman</th>
                    <th className="px-4 py-3 rounded-tr-lg">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {questionsList.slice(0, 10).map((q) => {
                    const user = usersList.find(u => u.id === q.uid);
                    const phone = user?.phone || '-';
                    const channel = 'WhatsApp'; // Defaulting to WhatsApp for now
                    const questionTitle = `${q.subject} - ${q.topic}`;
                    const statusText = q.status === 'solved' ? 'Çözüldü' : q.status === 'error' ? 'Hata' : 'Bekliyor';
                    const statusClass = q.status === 'solved' ? 'bg-emerald-500/10 text-emerald-400' : q.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400';
                    
                    return (
                      <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-slate-400">{q.id.substring(0, 8)}</td>
                        <td className="px-4 py-3">{phone}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${channel === 'WhatsApp' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                            {channel}
                          </span>
                        </td>
                        <td className="px-4 py-3 truncate max-w-[150px]">{questionTitle}</td>
                        <td className="px-4 py-3 text-xs">{q.model || 'gpt-4o'}</td>
                        <td className="px-4 py-3 font-mono text-xs">${Number(q.cost || 0).toFixed(4)}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{q.date}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${statusClass}`}>
                            {statusText}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Expensive Questions */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
            <SectionHeader title="En Maliyetli 10 Soru" icon={AlertCircle} />
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ID</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Kanal</th>
                    <th className="px-4 py-3">Soru</th>
                    <th className="px-4 py-3">Model</th>
                    <th className="px-4 py-3">Maliyet</th>
                    <th className="px-4 py-3">Zaman</th>
                    <th className="px-4 py-3 rounded-tr-lg">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {[...questionsList]
                    .sort((a, b) => (b.cost || 0) - (a.cost || 0))
                    .slice(0, 10)
                    .map((q) => {
                      const user = usersList.find(u => u.id === q.uid);
                      const phone = user?.phone || '-';
                      const channel = 'WhatsApp';
                      const questionTitle = `${q.subject} - ${q.topic}`;
                      const statusText = q.status === 'solved' ? 'Çözüldü' : q.status === 'error' ? 'Hata' : 'Bekliyor';
                      const statusClass = q.status === 'solved' ? 'bg-emerald-500/10 text-emerald-400' : q.status === 'error' ? 'bg-red-500/10 text-red-400' : 'bg-yellow-500/10 text-yellow-400';
                      
                      return (
                        <tr key={q.id} className="hover:bg-slate-800/30 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-slate-400">{q.id.substring(0, 8)}</td>
                          <td className="px-4 py-3">{phone}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${channel === 'WhatsApp' ? 'bg-green-500/10 text-green-400' : 'bg-blue-500/10 text-blue-400'}`}>
                              {channel}
                            </span>
                          </td>
                          <td className="px-4 py-3 truncate max-w-[150px]">{questionTitle}</td>
                          <td className="px-4 py-3 text-xs">{q.model || 'gpt-4o'}</td>
                          <td className="px-4 py-3 font-mono text-xs text-orange-400 font-bold">${Number(q.cost || 0).toFixed(4)}</td>
                          <td className="px-4 py-3 text-xs text-slate-500">{q.date}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${statusClass}`}>
                              {statusText}
                            </span>
                          </td>
                        </tr>
                      );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Payments & System Health Row */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Recent Payments */}
          <div className="xl:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
            <SectionHeader title="Son 10 Ödeme" icon={CreditCard} />
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ID</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">Sağlayıcı</th>
                    <th className="px-4 py-3">Tutar</th>
                    <th className="px-4 py-3">Zaman</th>
                    <th className="px-4 py-3 rounded-tr-lg">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {recentPayments.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.id}</td>
                      <td className="px-4 py-3">{p.phone}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                          {p.provider}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-bold text-white">{p.amount}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">{p.time}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${p.status === 'Başarılı' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                          {p.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Health */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
            <SectionHeader title="Sistem Sağlığı" icon={Server} />
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Durum</span>
                </div>
                <span className={`text-sm font-bold ${systemHealth.status === 'Online' ? 'text-emerald-400' : 'text-red-400'}`}>
                  {systemHealth.status}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Uptime</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">{systemHealth.uptime}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Bellek (RSS)</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">{systemHealth.memoryRss} MB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Heap Kullanımı</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">{systemHealth.heapUsed} MB / {systemHealth.heapTotal} MB</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Database className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">DB Boyutu</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">1.2 GB (Tahmini)</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Webhook Logları</span>
                </div>
                <span className={`text-sm font-bold ${systemHealth.webhookActive ? 'text-emerald-400' : 'text-orange-400'}`}>
                  {systemHealth.webhookActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <Server className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Node.js</span>
                </div>
                <span className="text-sm font-bold text-white font-mono">{systemHealth.nodeVersion}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-slate-400" />
                  <span className="text-sm font-medium text-slate-300">Ortam</span>
                </div>
                <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">{systemHealth.environment}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Real Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm overflow-hidden flex flex-col">
          <SectionHeader title="Tüm Kullanıcılar (Gerçek Veri)" icon={Users} />
          <div className="overflow-x-auto flex-1">
            {loadingData ? (
              <div className="flex justify-center items-center py-10">
                <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
              </div>
            ) : (
              <table className="w-full text-left text-sm text-slate-300 whitespace-nowrap">
                <thead className="bg-slate-800/50 text-slate-400 uppercase text-xs">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">İsim</th>
                    <th className="px-4 py-3">Telefon</th>
                    <th className="px-4 py-3">E-posta</th>
                    <th className="px-4 py-3">Paket</th>
                    <th className="px-4 py-3">Kalan Kontör</th>
                    <th className="px-4 py-3">Günlük Soru</th>
                    <th className="px-4 py-3">Kayıt Tarihi</th>
                    <th className="px-4 py-3 rounded-tr-lg">Rol</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {usersList.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-4 py-8 text-center text-slate-500">Henüz kullanıcı bulunmuyor.</td>
                    </tr>
                  ) : (
                    usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-white">{u.name}</td>
                        <td className="px-4 py-3 font-mono text-xs">{u.phone}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{u.email}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 text-[10px] font-bold uppercase rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/20">
                            {u.activePlan}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-bold text-emerald-400">{u.tokens}</td>
                        <td className="px-4 py-3 text-xs text-slate-400">{u.dailyQuestionCount} / 5</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{u.createdAt}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded-md ${u.role === 'admin' ? 'bg-purple-500/10 text-purple-400' : 'bg-slate-700 text-slate-300'}`}>
                            {u.role}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminDashboard;
