import React from 'react';

const OgrenmeModelimiz: React.FC = () => {
  return (
    <div className="bg-slate-50 py-24 sm:py-32 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-2 block">VELİLER İÇİN</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Öğrenme Döngüsünü <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Tamamlayan Sistem</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Sevgili Veliler,<br/>Her öğrenci aynı seviyede başlamaz, ama her öğrenci doğru yönlendirmeyle gelişebilir.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-10">
          
          <section>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Sınavlar sadece bilgiyi ölçmez. Aynı zamanda öğrencilerin hangi seviyede olduğunu ve nerede zorlandığını ortaya çıkarır. Bu nedenle sınavlarda yalnızca "kolay" sorular değil, farklı zorluk seviyelerine sahip sorular bulunur:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <li className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold mb-3">3</div>
                <span className="text-slate-700 font-medium text-sm">En yüksek başarıyı hedefleyen öğrenciler için zor sorular</span>
              </li>
              <li className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold mb-3">2</div>
                <span className="text-slate-700 font-medium text-sm">Ortalama seviyedeki öğrenciler için orta seviye sorular</span>
              </li>
              <li className="bg-slate-50 p-5 rounded-2xl border border-slate-100 flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold mb-3">1</div>
                <span className="text-slate-700 font-medium text-sm">Temel kazanımları ölçen daha erişilebilir sorular</span>
              </li>
            </ul>
            <p className="text-slate-600 text-lg leading-relaxed font-semibold">
              Bu yapı sayesinde her öğrenci, kendi seviyesine uygun sorularla karşılaşır ve gerçek performansı ortaya çıkar.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Asıl farkı yaratan nokta: Öğrencinin takıldığı sorular</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Bir öğrenci bir soruda takıldığında, o sorunun çözümünü sadece "cevap" olarak görmek yeterli değildir. Çünkü gerçek öğrenme şunları içerir:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-lg leading-relaxed space-y-2 mb-4">
              <li>Sorunun hangi mantıkla çözüldüğünü</li>
              <li>Nerede hata yapıldığını</li>
              <li>Aynı tip sorular için hangi ipuçlarının kullanılacağını</li>
            </ul>
            <p className="text-slate-600 text-lg leading-relaxed">
              Eğer öğrenci bu noktayı kaçırırsa, aynı konuyla ilgili benzer sorularda tekrar zorlanır.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Öğrenme sadece ders sırasında gerçekleşmez</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Eğitim 3 aşamadan oluşur:
            </p>
            <ol className="list-decimal list-inside text-slate-600 text-lg leading-relaxed space-y-2 mb-4 font-medium">
              <li><span className="text-slate-900">Öğretim</span> (konunun anlatılması)</li>
              <li><span className="text-slate-900">Pekiştirme</span> (soru çözümü ve pratik)</li>
              <li><span className="text-slate-900">Yanlışların düzeltilmesi</span> ve tekrar öğrenme</li>
            </ol>
            <p className="text-slate-600 text-lg leading-relaxed font-semibold text-slate-800">
              Ancak çoğu öğrencide en kritik aşama olan 3. adım eksik kalır.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mt-2">
              Kurs desteği olmayan veya özel ders almayan öğrenciler, çoğu zaman bu eksikliği kendi başlarına gideremezler.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Kritik Soru bu boşluğu kapatmak için tasarlandı</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              WhatsApp üzerinden çalışan sistemimiz sayesinde öğrenci:
            </p>
            
            <div className="space-y-4 mb-8">
              <div className="flex bg-slate-50 rounded-xl p-4 border border-slate-100 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold mr-4 shrink-0">1</div>
                <p className="text-slate-700 pt-1">Takıldığı sorunun fotoğrafını gönderir</p>
              </div>
              <div className="flex bg-slate-50 rounded-xl p-4 border border-slate-100 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold mr-4 shrink-0">2</div>
                <p className="text-slate-700 pt-1">Soru uzman öğretmenler tarafından çözülür</p>
              </div>
              <div className="flex bg-slate-50 rounded-xl p-4 border border-slate-100 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold mr-4 shrink-0">3</div>
                <p className="text-slate-700 pt-1">Sadece cevap değil, adım adım öğretici anlatım hazırlanır</p>
              </div>
              <div className="flex bg-slate-50 rounded-xl p-4 border border-slate-100 items-start">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex justify-center items-center font-bold mr-4 shrink-0">4</div>
                <p className="text-slate-700 pt-1">Çözüm tekrar öğrenciye WhatsApp üzerinden iletilir</p>
              </div>
            </div>
            
            <p className="text-slate-600 text-lg leading-relaxed mb-6">
              Bu sayede öğrenci, öğrenmeyi yarıda bırakmaz — o an tamamlar.
            </p>
            
            <div className="mt-8 p-6 bg-slate-900 rounded-2xl text-center shadow-lg">
              <p className="text-xl font-medium text-white leading-relaxed">
                Kritik Soru, sadece soru çözen bir sistem değil;<br/>
                <span className="text-blue-400 font-bold">öğrencinin öğrenme döngüsünü tamamlayan bir destek mekanizmasıdır.</span>
              </p>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
};

export default OgrenmeModelimiz;
