import React from 'react';

const NetArttir: React.FC = () => {
  return (
    <div className="bg-slate-50 py-24 sm:py-32 font-sans selection:bg-blue-500/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-sm font-bold tracking-widest uppercase text-blue-600 mb-2 block">ÖĞRENCİLER İÇİN</span>
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 mb-6 leading-tight">
            Soruyu Geçme, <br className="hidden sm:block"/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Mantığını Öğren</span>
          </h2>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Başarını belirleyen şey çözdüğün sorular değil, çözemediğin sorulardan öğrendiklerindir.
          </p>
        </div>

        {/* Content Section */}
        <div className="bg-white p-8 md:p-12 rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 space-y-10">
          
          <section>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Ders çalışırken bazı soruların hemen çözülmesi normaldir. Ancak asıl gelişim, seni düşündüren ve zorlayan sorularla karşılaştığında gerçekleşir.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Çünkü sınavlarda her soru aynı seviyede değildir. Bazı sorular temel bilgileri ölçerken, bazıları daha ileri düzey düşünme becerileri ister. Bir öğrenci genellikle kendi seviyesindeki soruları çözebilir ve aldığı not da büyük ölçüde bunu yansıtır.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed font-semibold text-slate-800">
              Bir üst seviyeye çıkmanın yolu ise yapabildiklerini tekrar tekrar çözmek değil, yapamadığın soruların mantığını öğrenmektir.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Takıldığın an, öğrenmenin en değerli anıdır</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Bir soruyu çözemediğinde iki seçeneğin vardır:
            </p>
            <ul className="list-disc list-inside text-slate-600 text-lg leading-relaxed space-y-2 mb-4">
              <li>Soruyu geçip devam etmek</li>
              <li>Neden çözemediğini öğrenmek</li>
            </ul>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Çoğu öğrenci ilk seçeneği tercih eder. Ancak bu durumda aynı konuya ait benzer sorular karşısına çıktığında yine zorlanır.
            </p>
            <p className="text-slate-600 text-lg leading-relaxed">
              Oysa sorunun çözüm yöntemini, kullanılan ipuçlarını ve düşünme şeklini öğrendiğinde yalnızca o soruyu değil, benzer onlarca soruyu çözebilecek seviyeye ulaşırsın.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Öğrenme soru çözmekle bitmez</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Gerçek öğrenme üç aşamada gerçekleşir:
            </p>
            <ol className="list-decimal list-inside text-slate-600 text-lg leading-relaxed space-y-2 mb-4 font-medium">
              <li>Konuyu öğrenmek</li>
              <li>Soru çözerek pratik yapmak</li>
              <li>Yapılamayan soruların neden yapılamadığını anlamak</li>
            </ol>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Birçok öğrenci ilk iki aşamayı tamamlar ancak üçüncü aşamayı eksik bırakır. İşte bu yüzden bazen saatlerce çalışmana rağmen aynı konudaki sorularda tekrar hata yapabilirsin.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Kritik Soru tam bu noktada devreye girer</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Ders çalışırken takıldığın bir sorunun fotoğrafını çek veya soruyu metin olarak gönder. Öğretmenlerimiz soruyu inceleyerek sana:
            </p>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <li className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 font-medium">Sadece doğru cevabı değil,</span>
              </li>
              <li className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 font-medium">Çözümün mantığını,</span>
              </li>
              <li className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 font-medium">Kullanılan yöntemleri,</span>
              </li>
              <li className="flex items-center space-x-3 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <svg className="w-6 h-6 text-blue-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                <span className="text-slate-700 font-medium">Dikkat edilmesi gereken püf noktaları</span>
              </li>
            </ul>
            <p className="text-slate-600 text-lg leading-relaxed">
              adım adım anlatır. Böylece soruyu geçmek yerine gerçekten öğrenmiş olursun.
            </p>
          </section>

          <div className="h-px bg-slate-100 w-full my-8"></div>

          <section>
            <h3 className="text-2xl font-bold text-slate-900 mb-4">Hedefin sadece bugünkü soruyu çözmek değil</h3>
            <p className="text-slate-600 text-lg leading-relaxed mb-4">
              Bugünkü amaç bir soruyu çözmek olabilir. Ama asıl hedef;
            </p>
            <ul className="list-disc list-inside text-slate-600 text-lg leading-relaxed space-y-2 mb-6">
              <li>Bir sonraki denemede daha fazla net yapmak,</li>
              <li>Daha zor soruları çözebilmek,</li>
              <li>Kendi seviyeni her gün biraz daha yukarı taşımaktır.</li>
            </ul>
            <p className="text-xl font-bold text-slate-800 bg-blue-50 p-5 rounded-2xl border border-blue-100 inline-block">
              Kritik Soru, takıldığın her noktayı yeni bir öğrenme fırsatına dönüştürmek için burada. 🚀
            </p>
          </section>

        </div>
      </div>
    </div>
  );
};

export default NetArttir;
