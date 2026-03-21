
import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, BrainCircuit, FileText, CheckCircle2, GraduationCap, Clock, BookOpen } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-8 bg-white border border-slate-100 rounded-full shadow-sm">
            <span className="text-yellow-400 mr-2">⭐</span>
            <span className="text-sm font-medium text-slate-600">Binlerce öğrencinin tercihi</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-800 mb-6">
            Çek. Gönder. <span className="text-blue-600">Çöz.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-500 mb-10 leading-relaxed">
            Çözemediğin soruları gönder, öğretmen anlatımıyla adım adım çözümünü al. 
            TYT, AYT ve LGS'de netlerini arttırmanın en kolay yolu.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link 
              to="/fiyatlandirma" 
              className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-full hover:bg-slate-50 transition-all shadow-sm"
            >
              Paketleri İncele
            </Link>
            <Link 
              to="/kayit" 
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 transition-all shadow-md hover:shadow-lg"
            >
              Hemen Başla
            </Link>
          </div>
        </div>
      </section>

      {/* Visual Flow Section */}
      <section className="bg-white py-32 relative overflow-hidden border-y border-slate-100">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-50 rounded-full blur-[120px]"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Nasıl Çalışır?</h2>
            <p className="text-slate-500 text-lg max-w-2xl mx-auto">Sadece 4 adımda çözemediğin soruların mantığını kavra.</p>
          </div>

          <div className="relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8 relative z-10">
              
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <MessageCircle className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">1</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Soruyu Gönder</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Çözemediğin sorunun fotoğrafını çekip WhatsApp hattımıza yolla.</p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <BrainCircuit className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">2</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Kritik Soru İnceler</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Alanlarında tecrübeli öğretmenlerimiz soruyu analiz eder ve en iyi çözüm yolunu belirler.</p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <FileText className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">3</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Adım Adım Çözüm</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Sadece cevap değil, sorunun mantığını kavratan detaylı bir çözüm hazırlanır.</p>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <CheckCircle2 className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">4</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Çözüm Cebinde</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Hazırlanan özel çözüm görseli saniyeler içinde WhatsApp'tan sana iletilir.</p>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* Features/Trust Section */}
      <section className="py-24 bg-transparent relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 mb-4">Neden Kritik Soru?</h2>
          </div>

          <div className="relative">
            {/* Connecting Line for Desktop */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-slate-100 via-blue-200 to-slate-100 -translate-y-1/2 z-0"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 relative z-10">
              
              {/* Feature 1 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <GraduationCap className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">1</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Öğretmen Dokunuşu</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Sadece cevap anahtarı değil, bir dershane öğretmeninin tahtada anlattığı samimiyetle çözüm alırsın.</p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <Clock className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">2</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Her Zaman Yanında</h3>
                <p className="text-slate-500 text-sm leading-relaxed">Gece 2, sabah 7 fark etmez. Çözemediğin soru o an çözülür, çalışma motivasyonun hiç düşmez.</p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col items-center text-center group">
                <div className="w-20 h-20 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center mb-6 relative overflow-hidden transition-all duration-300 group-hover:scale-110 group-hover:border-blue-200 group-hover:shadow-md">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <BookOpen className="w-10 h-10 text-blue-500" />
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center border border-slate-100 text-xs font-bold text-slate-500 shadow-sm">3</div>
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-2">Tüm Sınavlar</h3>
                <p className="text-slate-500 text-sm leading-relaxed">TYT'den LGS'ye, matematikten tarihe kadar tüm derslerde uzman öğretmen desteği seni bekliyor.</p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
