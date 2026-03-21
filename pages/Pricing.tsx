
import React from 'react';
import { handlePurchase } from '../services/api';

const PricingCard: React.FC<{
  title: string;
  subtitle: string;
  price: number;
  questions: number;
  popular?: boolean;
  color?: string;
  planId: string;
  period?: string;
  borderColor?: string;
}> = ({ title, subtitle, price, questions, popular, color = "indigo", planId, period = "tek seferlik", borderColor }) => (
  <div className={`relative flex flex-col p-8 bg-white rounded-3xl border ${popular ? 'border-blue-500 shadow-2xl shadow-blue-500/20 scale-105 z-10' : (borderColor || 'border-slate-100 shadow-sm')} transition-all hover:shadow-md`}>
    {popular && (
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-widest">
        En Popüler
      </div>
    )}
    <h3 className="text-xl font-bold text-slate-800 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-6">{subtitle}</p>
    
    <div className="mb-8">
      <span className="text-4xl font-bold text-slate-800">{price} TL</span>
      <span className="text-slate-400 text-sm ml-2">{period}</span>
    </div>

    <ul className="space-y-4 mb-8 flex-grow text-sm text-slate-500">
      <li className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        <strong className="text-slate-800">{questions} soru</strong> çözümü
      </li>
      <li className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        Adım adım öğretmen anlatımı
      </li>
      <li className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        WhatsApp üzerinden hızlı erişim
      </li>
      <li className="flex items-center">
        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
        Geçerlilik süresi yok
      </li>
    </ul>

    <button 
      onClick={() => handlePurchase(planId)}
      className={`w-full py-4 px-6 rounded-2xl font-bold transition-all ${popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-500/20' : 'bg-slate-50 text-slate-800 border border-slate-200 hover:bg-slate-100'}`}
    >
      Paketi Seç
    </button>
  </div>
);

const Pricing: React.FC = () => {
  return (
    <div className="bg-transparent py-24 sm:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold tracking-tight text-blue-600 mb-4">Çözüm Paketleri</h2>
          <p className="mt-2 text-4xl font-extrabold text-slate-800 sm:text-5xl">Sınav yolculuğunda sana en uygun paket.</p>
          <p className="mt-4 text-xl text-slate-500">Hedefine ulaşmak için ihtiyacın olan soru kredisini seç.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <PricingCard 
            planId="mini"
            title="Mini Çözüm ✅"
            subtitle="Takıldım, çözdüm, devam."
            price={99}
            questions={5}
            period="tek seferlik"
            borderColor="border-green-500"
          />
          <PricingCard 
            planId="net-arttir"
            title="Net Arttır 🎉"
            subtitle="Her soru biraz daha net."
            price={229}
            questions={15}
            period="aylık"
          />
          <PricingCard 
            planId="full-focus"
            title="Full Focus 🥇"
            subtitle="Dikkat full, hedef net."
            price={299}
            questions={25}
            popular
            period="aylık"
          />
          <PricingCard 
            planId="efsane-mod"
            title="Efsane Mod 🚀"
            subtitle="Son seviye açıldı."
            price={549}
            questions={55}
            period="aylık"
          />
        </div>

        <div className="mt-20 text-center">
          <p className="text-slate-500 text-sm">Tüm ödemeleriniz <span className="font-bold text-slate-800">iyzico</span> güvencesiyle korunmaktadır.</p>
        </div>
      </div>
    </div>
  );
};

export default Pricing;
