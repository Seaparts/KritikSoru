
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { fetchUserStats, fetchQuestionHistory, fetchPaymentHistory, UserStats, QuestionHistoryItem, PaymentHistoryItem } from '../services/api';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [solvedQuestions, setSolvedQuestions] = useState<QuestionHistoryItem[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<PaymentHistoryItem[]>([]);
  const [isQuestionHistoryOpen, setIsQuestionHistoryOpen] = useState(false);
  const [isPaymentHistoryOpen, setIsPaymentHistoryOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserStats(user.id).then(setStats);
      fetchQuestionHistory(user.id).then(setSolvedQuestions);
      fetchPaymentHistory(user.id).then(setPaymentHistory);
    }
  }, [user?.id]);

  if (!stats) return <div className="p-10 text-center">Yükleniyor...</div>;

  return (
    <div className="flex-grow bg-slate-50 pt-32 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="mb-12 flex justify-between items-end">
          <div className="flex items-center space-x-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">Merhaba {user?.name}! 👋</h1>
              <p className="text-slate-500 mt-1">İşte güncel durumun ve paket bilgilerin.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-white border border-slate-200 rounded-full text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">Hesap Ayarları</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Stats Card */}
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center">
              <div>
                <h3 className="text-slate-500 text-sm font-medium mb-1">Kalan Soru Hakkı</h3>
                <div className="flex items-baseline space-x-2">
                  <span className="text-6xl font-bold text-slate-800">{user?.tokens || 0}</span>
                  <span className="text-slate-400 text-lg">/ {user?.package === 'free' ? 1 : (user?.tokens || 0)}</span>
                </div>
              </div>
              <div className="mt-6 md:mt-0 flex space-x-4">
                <Link to="/fiyatlandirma" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                  Kredi Yükle
                </Link>
              </div>
            </div>

            {/* Active Plan Info */}
            <div className="bg-slate-800 p-8 rounded-3xl text-white border border-slate-700">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Aktif Paketin</h3>
                  <p className="text-2xl font-bold capitalize">{user?.package === 'free' ? 'Ücretsiz Paket' : user?.package}</p>
                </div>
                <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">Aktif</span>
              </div>
              <p className="text-slate-300 text-sm mb-8">Bu paketteki tüm soruların öğretmen anlatımıyla çözülmeye devam ediyor.</p>
              <div className="w-full bg-slate-900 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(((user?.tokens || 0) / (user?.package === 'free' ? 1 : Math.max(user?.tokens || 1, 1))) * 100, 100)}%` }}></div>
              </div>
            </div>

            {/* Question History Collapsible Section */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setIsQuestionHistoryOpen(!isQuestionHistoryOpen)}
                className="w-full px-8 py-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <h4 className="font-bold text-slate-800">Soru Geçmişi</h4>
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-semibold border border-blue-100">
                    {solvedQuestions.length} Çözüm
                  </span>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isQuestionHistoryOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isQuestionHistoryOpen && (
                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="border-t border-slate-100 pt-4 space-y-4">
                    {solvedQuestions.map(item => (
                      <div key={item.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all overflow-hidden mb-4">
                        <div 
                          className="p-4 flex items-center justify-between gap-4 cursor-pointer"
                          onClick={() => {
                            // Simple toggle logic for dashboard
                            const el = document.getElementById(`q-content-${item.id}`);
                            const icon = document.getElementById(`q-icon-${item.id}`);
                            if (el && icon) {
                              if (el.classList.contains('hidden')) {
                                el.classList.remove('hidden');
                                icon.innerHTML = '<polyline points="18 15 12 9 6 15"></polyline>';
                              } else {
                                el.classList.add('hidden');
                                icon.innerHTML = '<polyline points="6 9 12 15 18 9"></polyline>';
                              }
                            }
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-500 font-bold text-sm">
                              {item.examType}
                            </div>
                            <div>
                              <h4 className="font-bold text-slate-800 text-base">{item.subject}</h4>
                              <p className="text-slate-500 text-sm">{item.topic}</p>
                            </div>
                          </div>
                          <div className="text-right flex items-center gap-4">
                            <div>
                              <div className="text-slate-800 font-medium text-sm mb-1">
                                {new Date(item.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short', year: 'numeric' })}
                              </div>
                              <div className="text-slate-500 text-sm font-medium">
                                {item.status === 'solved' ? 'Çözüldü' : 'Bekliyor'}
                              </div>
                            </div>
                            <div className="text-slate-400">
                              <svg id={`q-icon-${item.id}`} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expanded Content */}
                        <div id={`q-content-${item.id}`} className="hidden p-4 border-t border-slate-100 bg-slate-50/50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Question Image/Text */}
                            <div>
                              <h5 className="font-bold text-slate-700 mb-2 text-sm uppercase tracking-wider">Soru</h5>
                              {item.imageUrl && item.imageUrl !== 'https://picsum.photos/seed/error/800/600' ? (
                                <div className="rounded-xl overflow-hidden border border-slate-200 mb-3">
                                  <img src={item.imageUrl} alt="Soru" className="w-full h-auto object-contain max-h-64 bg-white" referrerPolicy="no-referrer" />
                                </div>
                              ) : null}
                              {item.questionText && (
                                <div className="bg-white p-4 rounded-xl border border-slate-200 text-slate-700 text-sm whitespace-pre-wrap">
                                  {item.questionText}
                                </div>
                              )}
                            </div>
                            
                            {/* Answer Text */}
                            <div>
                              <h5 className="font-bold text-blue-700 mb-2 text-sm uppercase tracking-wider">Çözüm</h5>
                              <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 text-slate-800 text-sm whitespace-pre-wrap h-full">
                                {item.answerText || 'Çözüm bulunamadı.'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Payment History Collapsible Section */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden transition-all duration-300">
              <button 
                onClick={() => setIsPaymentHistoryOpen(!isPaymentHistoryOpen)}
                className="w-full px-8 py-6 flex justify-between items-center hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <h4 className="font-bold text-slate-800">Ödeme Geçmişi</h4>
                  <span className="text-[10px] text-slate-500 italic">iyzico güvencesiyle</span>
                </div>
                <svg 
                  className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isPaymentHistoryOpen ? 'rotate-180' : ''}`} 
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {isPaymentHistoryOpen && (
                <div className="px-8 pb-8 animate-in fade-in slide-in-from-top-2 duration-300">
                  <div className="border-t border-slate-100 pt-4 space-y-4">
                    {paymentHistory.map(item => (
                      <div key={item.id} className="flex justify-between items-center py-4 border-b border-slate-100 last:border-0">
                        <div className="text-left">
                          <p className="font-semibold text-slate-700">{item.planName}</p>
                          <p className="text-xs text-slate-500">{item.date}</p>
                        </div>
                        <span className="font-bold text-slate-800">{item.amount} TL</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <h4 className="font-bold text-slate-800 mb-6">Hızlı Yardım</h4>
              <ul className="space-y-4">
                <li className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 font-bold text-slate-500">?</span>
                  Soru nasıl gönderilir?
                </li>
                <li className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 font-bold text-slate-500">?</span>
                  WhatsApp hattına ulaş
                </li>
                <li className="flex items-center text-sm text-slate-600 cursor-pointer hover:text-blue-600 transition-colors">
                  <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center mr-3 font-bold text-slate-500">?</span>
                  Fatura bilgileri
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 p-8 rounded-3xl border border-blue-100">
              <h4 className="font-bold text-blue-800 mb-2">Arkadaşını Davet Et</h4>
              <p className="text-sm text-blue-600 mb-6">Her davetin için 5 soru kredisi kazan!</p>
              <button className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 transition-all">Referans Kodu Al</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;