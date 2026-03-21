
import React from 'react';
// Added Link import from react-router-dom
import { Link } from 'react-router-dom';

const Step: React.FC<{ num: number; title: string; desc: string; icon: React.ReactNode }> = ({ num, title, desc, icon }) => (
  <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-8 p-8 bg-white rounded-3xl border border-slate-100 shadow-sm">
    <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-2xl font-bold text-blue-600 shadow-sm border border-blue-100">
      {num}
    </div>
    <div className="flex-grow">
      <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
      <p className="text-slate-500 leading-relaxed">{desc}</p>
    </div>
    <div className="flex-shrink-0 text-blue-500">
      {icon}
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-slate-50 py-24 sm:py-32">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-slate-800 mb-4">Nasıl Çalışır?</h2>
          <p className="text-lg text-slate-500">Kritik Soru'yu kullanmak bir arkadaşına mesaj atmak kadar kolay.</p>
        </div>

        <div className="space-y-8">
          <Step 
            num={1}
            title="Sorunun Fotoğrafını Çek"
            desc="Çalışırken çözemediğin, anlamadığın veya çözüm yolu uzun gelen sorunun net bir fotoğrafını çek veya soruyu metin olarak yaz."
            icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
          />
          <Step 
            num={2}
            title="WhatsApp Üzerinden Gönder"
            desc="Sana özel tanımlanan WhatsApp hattımıza soruyu gönder. Sistemimiz seni anında tanır ve sorunu uzman öğretmenlerimize iletir."
            icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>}
          />
          <Step 
            num={3}
            title="Öğretmen Anlatımıyla Çözülsün"
            desc="Sorun öğretmenlerimiz tarafından titizlikle incelenir. Sadece cevap değil, mantığı kavraman için adım adım, dershane tadında bir anlatım hazırlanır."
            icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
          />
          <Step 
            num={4}
            title="Çözüm Tekrar Cebine Gelsin"
            desc="Hazırlanan çözüm anında WhatsApp üzerinden sana iletilir. Kafana takılan bir yer olursa tekrar inceleyebilir, eksiklerini anında kapatabilirsin."
            icon={<svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>}
          />
        </div>

        <div className="mt-20 p-10 bg-blue-50 border border-blue-100 rounded-3xl text-center text-slate-800">
          <h4 className="text-2xl font-bold mb-4">Denemeye Hazır Mısın?</h4>
          <p className="mb-8 text-slate-600">İlk sorunun çözümünü merak ediyorsan hemen bir paket seçip başla.</p>
          <Link to="/fiyatlandirma" className="inline-block px-8 py-4 bg-blue-600 text-white font-bold rounded-full hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
            Paketleri İncele
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
