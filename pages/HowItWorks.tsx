
import React from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';

const Step: React.FC<{ num: number; title: string; desc: string; icon: React.ReactNode }> = ({ num, title, desc, icon }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6 p-6 md:p-8 bg-slate-50 rounded-2xl border border-slate-100">
    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-xl flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm border border-slate-100">
      {num}
    </div>
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-lg leading-relaxed">{desc}</p>
    </div>
    <div className="flex-shrink-0 text-blue-500 hidden md:block">
      {icon}
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-slate-50 py-24 sm:py-32 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-2 block">REHBER</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Kritik Soru <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Nasıl Çalışır?</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Kritik Soru'yu kullanmak bir arkadaşına mesaj atmak kadar kolay.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-6">
          <Step 
            num={1}
            title="Sorunun Fotoğrafını Çek"
            desc="Çalışırken çözemediğin, anlamadığın veya çözüm yolu uzun gelen sorunun net bir fotoğrafını çek veya soruyu metin olarak yaz."
            icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <Step 
            num={2}
            title="WhatsApp Üzerinden Gönder"
            desc="Sana özel tanımlanan WhatsApp hattımıza soruyu gönder. Sistemimiz seni anında tanır ve sorunu uzman öğretmenlerimize iletir."
            icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <Step 
            num={3}
            title="Öğretmen Anlatımıyla Çözülsün"
            desc="Sorun öğretmenlerimiz tarafından titizlikle incelenir. Sadece cevap değil, mantığı kavraman için adım adım, dershane tadında bir anlatım hazırlanır."
            icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
          />
          <Step 
            num={4}
            title="Çözüm Tekrar Cebine Gelsin"
            desc="Hazırlanan çözüm anında WhatsApp üzerinden sana iletilir. Kafana takılan bir yer olursa tekrar inceleyebilir, eksiklerini anında kapatabilirsin."
            icon={<svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          />
          
          <div className="h-px bg-slate-100 w-full my-10"></div>

          <div className="p-8 md:p-10 bg-slate-50 border border-slate-100 rounded-2xl text-center text-slate-800">
            <h4 className="text-2xl font-bold mb-3 text-slate-900">Denemeye Hazır Mısın?</h4>
            <p className="mb-8 text-slate-600 text-lg">İlk sorunun çözümünü merak ediyorsan hemen bir paket seçip başla.</p>
            <Link to="/fiyatlandirma" className="inline-block px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 text-lg">
              Paketleri İncele
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
