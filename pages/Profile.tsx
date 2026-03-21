
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { cities } from '../data/cities';
import { 
  fetchUserStats, 
  fetchQuestionHistory, 
  fetchPaymentHistory, 
  UserStats, 
  QuestionHistoryItem, 
  PaymentHistoryItem 
} from '../services/api';

type TabType = 'personal' | 'plan' | 'questions' | 'payments';

const Profile: React.FC = () => {
  const { user, updateProfile, logout, deleteAccount, changePassword } = useAuth();
  const navigate = useNavigate();
  // Default tab changed to 'plan' based on new order requirement
  const [activeTab, setActiveTab] = useState<TabType>('plan');
  const [isLoading, setIsLoading] = useState(false);

  // Data States
  const [stats, setStats] = useState<UserStats | null>(null);
  const [questions, setQuestions] = useState<QuestionHistoryItem[]>([]);
  const [payments, setPayments] = useState<PaymentHistoryItem[]>([]);

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate('/giris');
  }, [user, navigate]);

  // Initial Data Fetch
  useEffect(() => {
    const loadInitialData = async () => {
      const s = await fetchUserStats();
      setStats(s);
    };
    loadInitialData();
  }, []);

  // Lazy Load Data on Tab Change
  useEffect(() => {
    const loadTabData = async () => {
      if (activeTab === 'questions' && questions.length === 0) {
        setIsLoading(true);
        const data = await fetchQuestionHistory();
        setQuestions(data);
        setIsLoading(false);
      }
      if (activeTab === 'payments' && payments.length === 0) {
        setIsLoading(true);
        const data = await fetchPaymentHistory();
        setPayments(data);
        setIsLoading(false);
      }
    };
    loadTabData();
  }, [activeTab, questions.length, payments.length]);

  if (!user) return null;

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      {/* Header & Greeting Section */}
      <div className="bg-white border-b border-slate-200 pt-32 pb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Merhaba {user.name}! 👋</h1>
              <p className="text-slate-500 mt-1 text-lg">İşte güncel durumun ve paket bilgilerin.</p>
            </div>
          </div>
          
          {/* Tabs - Reordered as requested */}
          <div className="flex overflow-x-auto scrollbar-hide space-x-8">
            <TabButton 
              active={activeTab === 'plan'} 
              onClick={() => setActiveTab('plan')} 
              label="Paket & Kredi" 
            />
            <TabButton 
              active={activeTab === 'questions'} 
              onClick={() => setActiveTab('questions')} 
              label="Soru Çözüm Geçmişi" 
            />
            <TabButton 
              active={activeTab === 'payments'} 
              onClick={() => setActiveTab('payments')} 
              label="Ödeme Geçmişi" 
            />
            <TabButton 
              active={activeTab === 'personal'} 
              onClick={() => setActiveTab('personal')} 
              label="Kişisel Bilgiler" 
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'plan' && <PlanCreditTab stats={stats} user={user} />}
        {activeTab === 'questions' && <QuestionHistoryTab data={questions} loading={isLoading} />}
        {activeTab === 'payments' && <PaymentHistoryTab data={payments} loading={isLoading} />}
        {activeTab === 'personal' && <PersonalTab user={user} updateProfile={updateProfile} logout={logout} navigate={navigate} deleteAccount={deleteAccount} changePassword={changePassword} />}
      </div>
    </div>
  );
};

// --- Sub-Components ---

const TabButton: React.FC<{ active: boolean; onClick: () => void; label: string }> = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
      active 
        ? 'border-blue-600 text-blue-600' 
        : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-200'
    }`}
  >
    {label}
  </button>
);

// 1. Plan & Credit Tab
const PlanCreditTab: React.FC<{ stats: UserStats | null, user: any }> = ({ stats, user }) => {
  const navigate = useNavigate();

  if (!stats) return <div className="p-10 text-center">Yükleniyor...</div>;
  
  const totalQuestions = user?.package === 'free' ? 1 : Math.max(user?.tokens || 1, 1);
  const percentage = Math.round(((user?.tokens || 0) / totalQuestions) * 100);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Credit Card */}
      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between h-full">
        <div>
          <h3 className="text-slate-400 text-sm font-bold uppercase tracking-wider mb-4">Kalan Soru Hakkı</h3>
          <div className="flex items-baseline space-x-2 mb-4">
            <span className="text-6xl font-bold text-slate-800">{user?.tokens || 0}</span>
            <span className="text-slate-500 text-xl">/ {totalQuestions}</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 mb-2">
            <div 
              className="bg-blue-600 h-3 rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min(percentage, 100)}%` }}
            ></div>
          </div>
          <p className="text-xs text-slate-500 text-right">%{Math.min(percentage, 100)} Kullanılabilir</p>
        </div>
        <button 
          onClick={() => navigate('/fiyatlandirma')}
          className="mt-8 w-full py-4 bg-slate-900 text-white font-bold rounded-2xl hover:bg-slate-800 transition-all"
        >
          Kredi Yükle
        </button>
      </div>

      {/* Active Plan Card */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-700 p-8 rounded-3xl shadow-xl text-white flex flex-col justify-between h-full relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">AKTİF PAKETİN</h3>
              <p className="text-3xl font-bold capitalize">{user?.package === 'free' ? 'Ücretsiz Paket' : user?.package}</p>
            </div>
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold border border-white/30">Aktif</span>
          </div>
          <p className="text-blue-50 text-sm mb-6 leading-relaxed opacity-90">
            Bu paketteki tüm soruların öğretmen anlatımıyla çözülmeye devam ediyor.
            {stats.planExpiryDate && <br/>}
            {stats.planExpiryDate && <span className="text-xs opacity-70 mt-2 block">Bitiş Tarihi: {stats.planExpiryDate}</span>}
          </p>
        </div>

        <button 
          onClick={() => navigate('/fiyatlandirma')}
          className="relative z-10 w-full py-4 bg-white text-blue-600 font-bold rounded-2xl hover:bg-slate-50 transition-all"
        >
          Paketi Yükselt
        </button>
      </div>
    </div>
  );
};

// 2. Question History Tab
const QuestionHistoryTab: React.FC<{ data: QuestionHistoryItem[]; loading: boolean }> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data; 
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 text-slate-500">
            Henüz soru çözmemişsiniz.
          </div>
        ) : (
          currentData.map((item) => (
            <div key={item.id} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 font-bold text-sm">
                  {item.examType}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-base">{item.subject}</h4>
                  <p className="text-slate-500 text-sm">{item.topic}</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-slate-800 font-medium text-sm mb-1">{formatDate(item.date)}</div>
                <div className="text-slate-500 text-sm font-medium">
                  {item.solutionTime}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            Önceki
          </button>
          <span className="px-4 py-2 text-sm text-slate-500">Sayfa {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

// 3. Payment History Tab
const PaymentHistoryTab: React.FC<{ data: PaymentHistoryItem[]; loading: boolean }> = ({ data, loading }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filteredData = data; 
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const currentData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  const formatTime = (dateString: string) => {
    try {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return '';
        return date.toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
        return '';
    }
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* List */}
      <div className="space-y-4">
        {loading ? (
           <div className="text-center py-10 text-slate-500">Yükleniyor...</div>
        ) : currentData.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-3xl border border-slate-200 text-slate-500">
            Henüz ödeme geçmişi bulunmuyor.
          </div>
        ) : (
          currentData.map((item) => (
            <div key={item.id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex justify-between items-center">
              <div>
                <h3 className="font-bold text-slate-800 text-lg mb-1">{item.planName}</h3>
                <p className="text-slate-500 text-sm font-medium">
                  {formatDate(item.date)} {formatTime(item.date)}
                </p>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-slate-800">{Math.round(item.amount)} TL</div>
              </div>
            </div>
          ))
        )}
      </div>
      
       {/* Pagination */}
       {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            Önceki
          </button>
          <span className="px-4 py-2 text-sm text-slate-500">Sayfa {currentPage} / {totalPages}</span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-500 hover:bg-slate-50 disabled:opacity-50"
          >
            Sonraki
          </button>
        </div>
      )}
    </div>
  );
};

// 4. Personal Info Tab
const PersonalTab: React.FC<{ user: any; updateProfile: any; logout: any; navigate: any; deleteAccount: any; changePassword: any }> = ({ user, updateProfile, logout, navigate, deleteAccount, changePassword }) => {
  const [formData, setFormData] = useState({
    name: user.name || '',
    surname: user.surname || '',
    phone: user.phone || '',
    address: user.address || '',
    city: user.city || '',
    district: user.district || '',
    email: user.email || '',
    tcNo: user.tcNo || '',
    targetExam: user.targetExam || '',
  });
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);
  
  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordError, setPasswordError] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.name === 'city') {
      setFormData((prev: any) => ({ ...prev, district: '', [e.target.name]: e.target.value }));
    }
  };

  const handlePasswordInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate phone number
    if (formData.phone) {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
        setMessage({ type: 'error', text: 'Geçerli bir telefon numarası giriniz (Örn: 05XX XXX XX XX)' });
        return;
      }
    }
    
    try {
      await updateProfile(formData);
      setMessage({ type: 'success', text: 'Bilgileriniz başarıyla güncellendi.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      if (error.message === 'phone-already-in-use') {
        setMessage({ type: 'error', text: 'Bu telefon numarası başka bir hesap tarafından kullanılıyor.' });
      } else {
        setMessage({ type: 'error', text: 'Bilgileriniz güncellenirken bir hata oluştu.' });
      }
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Hesabınızı silmek istediğinize emin misiniz? Bu işlem geri alınamaz.')) {
      try {
        await deleteAccount();
        navigate('/');
      } catch (error) {
        setMessage({ type: 'error', text: 'Hesap silinirken bir hata oluştu. Lütfen tekrar giriş yapıp deneyin.' });
      }
    }
  };

  const closePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setPasswordData({ current: '', new: '', confirm: '' });
    setPasswordError('');
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    
    if (passwordData.new !== passwordData.confirm) {
      setPasswordError('Yeni şifreler eşleşmiyor.');
      return;
    }
    if (passwordData.new.length < 6) {
      setPasswordError('Yeni şifre en az 6 karakter olmalıdır.');
      return;
    }
    
    setIsChangingPassword(true);
    try {
      await changePassword(passwordData.current, passwordData.new);
      closePasswordModal();
      setMessage({ type: 'success', text: 'Şifreniz başarıyla güncellendi.' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error: any) {
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
        setPasswordError('Mevcut şifreniz hatalı.');
      } else {
        setPasswordError('Şifre güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-4 duration-500 relative">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6">Kişisel Bilgiler</h2>
        
        {message && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${message.type === 'success' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Ad</label>
              <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Soyad</label>
              <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">E-posta</label>
              <input type="email" disabled value={formData.email} className="w-full bg-slate-50 text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telefon</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">TC Kimlik No</label>
              <input type="text" disabled value={formData.tcNo} className="w-full bg-slate-50 text-slate-500 border border-slate-200 rounded-xl px-4 py-2.5 cursor-not-allowed" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Hazırlandığım Sınav</label>
              <select name="targetExam" value={formData.targetExam} onChange={handleChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Seçiniz</option>
                <option value="LGS">LGS</option>
                <option value="TYT">TYT</option>
                <option value="AYT">AYT</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">İl</label>
              <select name="city" value={formData.city} onChange={handleChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none">
                <option value="">Seçiniz</option>
                {Object.keys(cities).map(city => <option key={city} value={city}>{city}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">İlçe</label>
              <select name="district" value={formData.district} onChange={handleChange} disabled={!formData.city} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none disabled:bg-slate-50 disabled:text-slate-500">
                <option value="">Seçiniz</option>
                {formData.city && cities[formData.city]?.map((d: string) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Adres</label>
              <textarea name="address" rows={3} value={formData.address} onChange={handleChange} className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-slate-200 gap-4">
            <div className="flex gap-4 w-full md:w-auto">
               <button type="button" onClick={() => setIsPasswordModalOpen(true)} className="flex-1 md:flex-none px-6 py-2 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors">
                  Şifre Değiştir
               </button>
               <button type="button" onClick={handleDelete} className="flex-1 md:flex-none px-6 py-2 bg-red-50 text-red-600 font-medium rounded-xl hover:bg-red-100 transition-colors">
                  Hesabı Sil
               </button>
            </div>
            <button type="submit" className="w-full md:w-auto px-8 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
              Değişiklikleri Kaydet
            </button>
          </div>
        </form>
      </div>

      {/* Password Change Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 p-8 w-full max-w-md animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Şifre Değiştir</h3>
            
            {passwordError && (
              <div className="mb-6 p-4 rounded-xl text-sm bg-red-50 text-red-600 border border-red-200">
                {passwordError}
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mevcut Şifre</label>
                <div className="relative">
                  <input 
                    type={showCurrentPassword ? "text" : "password"} 
                    name="current" 
                    value={passwordData.current} 
                    onChange={handlePasswordInputChange} 
                    required
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre</label>
                <div className="relative">
                  <input 
                    type={showNewPassword ? "text" : "password"} 
                    name="new" 
                    value={passwordData.new} 
                    onChange={handlePasswordInputChange} 
                    required
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Yeni Şifre (Tekrar)</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirm" 
                    value={passwordData.confirm} 
                    onChange={handlePasswordInputChange} 
                    required
                    className="w-full bg-white border border-slate-200 text-slate-800 rounded-xl px-4 py-2.5 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              
              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={closePasswordModal}
                  className="flex-1 px-4 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
                >
                  İptal
                </button>
                <button 
                  type="submit" 
                  disabled={isChangingPassword}
                  className="flex-1 px-4 py-2.5 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? 'Güncelleniyor...' : 'Güncelle'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
