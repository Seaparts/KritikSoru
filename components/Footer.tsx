
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from './Logo';

const Footer: React.FC = () => {
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div className="col-span-2">
            <Link to="/" className="inline-block mb-4">
              <Logo />
            </Link>
            <p className="text-slate-500 text-sm max-w-xs">
              Türkiye'nin her yerinden TYT, AYT ve LGS öğrencilerine özel, öğretmen anlatımlı soru çözüm platformu.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Platform</h4>
            <ul className="space-y-2">
              <li><Link to="/nasil-calisir" className="text-sm text-slate-500 hover:text-blue-600">Nasıl Çalışır?</Link></li>
              <li><Link to="/fiyatlandirma" className="text-sm text-slate-500 hover:text-blue-600">Çözüm Paketleri</Link></li>
              <li><Link to="/kayit" className="text-sm text-slate-500 hover:text-blue-600">Kayıt Ol</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">Yasal</h4>
            <ul className="space-y-2">
              <li><button onClick={() => setIsTermsModalOpen(true)} className="text-sm text-slate-500 hover:text-blue-600 cursor-pointer">Kullanım Şartları</button></li>
              <li><button onClick={() => setIsPrivacyModalOpen(true)} className="text-sm text-slate-500 hover:text-blue-600 cursor-pointer">Gizlilik Politikası</button></li>
              <li><button onClick={() => setIsKvkkModalOpen(true)} className="text-sm text-slate-500 hover:text-blue-600 cursor-pointer">KVKK Politikası</button></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-slate-500">
          <p>© 2024 kritiksoru.com. Tüm hakları saklıdır.</p>
          <div className="flex space-x-6">
            <span className="hover:text-blue-600 cursor-pointer">Instagram</span>
            <span className="hover:text-blue-600 cursor-pointer">WhatsApp Destek</span>
          </div>
        </div>
      </div>

      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Kullanım Şartları</h3>
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4">
              <p>
                Bu Kullanım Şartları (“Şartlar”), DENEYSEL İNTERNET HİZMETLERİ LİMİTED ŞİRKETİ / www.kritiksoru.com (“Hizmet Sağlayıcı”) tarafından sunulan soru çözüm destek hizmetine ilişkin web sitesi ve WhatsApp üzerinden sunulan tüm hizmetlerin kullanım koşullarını düzenler. Hizmeti kullanan herkes (“Kullanıcı”) bu şartları kabul etmiş sayılır.
              </p>
              <h4 className="font-bold text-slate-800">1. Hizmetin Tanımı</h4>
              <p>
                Hizmet; öğrencilerin çözemediği soruların fotoğrafını WhatsApp üzerinden göndermesi ve bu sorulara yönelik açıklamalı çözüm ve doğru cevap bilgisinin dijital ortamda iletilmesini kapsayan bir eğitim destek hizmetidir.
                <br />Web uygulaması (webapp) aşağıdaki işlevleri içerir:
              </p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Abonelik oluşturma ve yönetimi</li>
                <li>Hizmetin nasıl çalıştığına dair bilgilendirme</li>
                <li>Paket ve fiyatlandırma bilgileri</li>
                <li>Ödeme işlemleri</li>
              </ul>
              <p>
                Hizmet bir özel ders, birebir öğretmenlik veya resmi eğitim kurumu hizmeti değildir. Destek amaçlı dijital çözümler sunar.
              </p>
              
              <h4 className="font-bold text-slate-800">2. Hizmetin Kapsamı ve Niteliği</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sunulan çözümler eğitim destek amaçlıdır.</li>
                <li>Yanıtlar otomatik sistemler ve/veya uzman içerik sağlayıcılar tarafından hazırlanabilir.</li>
                <li>Çözümlerin doğruluğu için makul özen gösterilir ancak mutlak doğruluk garantisi verilmez.</li>
                <li>Hizmet, sınav başarısı veya akademik sonuç garantisi vermez.</li>
              </ul>

              <h4 className="font-bold text-slate-800">3. Kullanım Koşulları</h4>
              <p>Kullanıcı:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Doğru ve güncel bilgi vermeyi,</li>
                <li>Hizmeti hukuka ve ahlaka uygun kullanmayı,</li>
                <li>Sistemi kötüye kullanmamayı,</li>
                <li>Spam, saldırı, test amaçlı aşırı yük oluşturmamayı,</li>
                <li>Başkasına ait içerikleri izinsiz göndermemeyi</li>
              </ul>
              <p>kabul eder.</p>
              <p>Hizmet Sağlayıcı, kötüye kullanım tespitinde hizmeti askıya alma veya sonlandırma hakkını saklı tutar.</p>

              <h4 className="font-bold text-slate-800">4. Yaş Şartı</h4>
              <p>18 yaş altındaki kullanıcılar hizmeti ancak veli/yasal temsilci onayı ile kullanabilir. Abonelik ve ödeme işlemlerinin yasal sorumluluğu veliye aittir.</p>

              <h4 className="font-bold text-slate-800">5. Abonelik ve Paketler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hizmet abonelik modeli ile çalışır.</li>
                <li>Paket içerikleri ve kullanım limitleri web sitesinde belirtilir.</li>
                <li>Hizmet Sağlayıcı paket içeriklerini ve fiyatları değiştirme hakkını saklı tutar.</li>
                <li>Değişiklikler yeni dönem aboneliklerinde geçerlidir.</li>
              </ul>

              <h4 className="font-bold text-slate-800">6. Ödeme ve Faturalandırma</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ödemeler webapp üzerinde belirtilen ödeme sağlayıcıları aracılığıyla alınır.</li>
                <li>Kullanıcı ödeme sırasında girdiği bilgilerin doğruluğundan sorumludur.</li>
                <li>Ödeme altyapısı üçüncü taraf servisler tarafından sağlanabilir. Bu servislerin kendi sözleşmeleri geçerlidir.</li>
                <li>Gerekli durumlarda faturalandırma yürürlükteki mevzuata uygun şekilde yapılır.</li>
              </ul>

              <h4 className="font-bold text-slate-800">7. İptal ve İade</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Dijital içerik ve anında sunulan hizmetler kapsamında, yürürlükteki mevzuatın izin verdiği ölçüde cayma hakkı sınırlı olabilir.</li>
                <li>Kullanılmamış dönemler için iade koşulları paket açıklamasında belirtilir.</li>
                <li>Kötüye kullanım tespit edilen hesaplarda iade yapılmayabilir.</li>
              </ul>

              <h4 className="font-bold text-slate-800">8. Hizmet Sürekliliği</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hizmet Sağlayıcı kesintisiz hizmet vermeyi hedefler ancak garanti etmez.</li>
                <li>Bakım, güncelleme, teknik arıza, üçüncü taraf servis kesintileri nedeniyle duraksamalar yaşanabilir.</li>
                <li>Geçici kesintilerden dolayı tazminat yükümlülüğü doğmaz.</li>
              </ul>

              <h4 className="font-bold text-slate-800">9. İçerik ve Fikri Mülkiyet</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sunulan çözüm içerikleri, metinler, anlatımlar ve sistem çıktıları Hizmet Sağlayıcı’ya aittir.</li>
                <li>İzinsiz kopyalanamaz, dağıtılamaz, satılamaz.</li>
                <li>Kullanıcı gönderdiği soru içeriklerini hizmetin sunulması amacıyla işlenmesine izin vermiş sayılır.</li>
              </ul>

              <h4 className="font-bold text-slate-800">10. Sorumluluk Reddi</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sunulan çözümler yalnızca destek amaçlıdır.</li>
                <li>Sınav sonuçları, akademik başarı veya başarısızlıktan Hizmet Sağlayıcı sorumlu değildir.</li>
                <li>Yanlış okunan görseller, eksik fotoğraflar veya hatalı gönderimler sonucu oluşabilecek yanlış cevaplardan kullanıcı sorumludur.</li>
                <li>Kullanıcı, çözümleri kontrol ederek kullanmayı kabul eder.</li>
              </ul>

              <h4 className="font-bold text-slate-800">11. Üçüncü Taraf Hizmetler</h4>
              <p>Hizmet kapsamında:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>WhatsApp</li>
                <li>Ödeme sistemleri</li>
                <li>Barındırma ve altyapı servisleri</li>
              </ul>
              <p>kullanılabilir. Bu servislerin çalışma koşulları ve gizlilik politikaları ayrıca geçerlidir.</p>

              <h4 className="font-bold text-slate-800">12. Gizlilik ve Veri Koruma</h4>
              <p>Kişisel verilerin işlenmesine ilişkin esaslar Gizlilik Politikası ve KVKK Aydınlatma Metni içinde ayrıca düzenlenir. Kullanıcı bu metinleri kabul ettiğini beyan eder.</p>

              <h4 className="font-bold text-slate-800">13. Hesap Askıya Alma ve Sonlandırma</h4>
              <p>Aşağıdaki durumlarda hizmet durdurulabilir:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kötüye kullanım</li>
                <li>Otomatik saldırı / bot kullanım</li>
                <li>Sistem manipülasyonu</li>
                <li>Hakaret, yasa dışı içerik gönderimi</li>
              </ul>

              <h4 className="font-bold text-slate-800">14. Değişiklik Hakkı</h4>
              <p>Hizmet Sağlayıcı bu Kullanım Şartları’nı güncelleme hakkını saklı tutar. Güncel metin web sitesinde yayımlandığı tarihte yürürlüğe girer.</p>

              <h4 className="font-bold text-slate-800">15. Uyuşmazlık ve Yetki</h4>
              <p>Bu şartlar Türkiye Cumhuriyeti hukukuna tabidir. Uyuşmazlıklarda BURSA Mahkemeleri ve İcra Daireleri yetkilidir.</p>

              <h4 className="font-bold text-slate-800">16. İletişim</h4>
              <p>Hizmetle ilgili tüm talepler için:</p>
              <ul className="list-none space-y-1">
                <li><strong>Şirket/Marka:</strong> DENEYSEL İNTERNET HİZMETLERİ LİMİTED ŞİRKETİ</li>
                <li><strong>E-posta:</strong> info@kritiksoru.com</li>
                <li><strong>Web:</strong> www.kritiksoru.com</li>
                <li><strong>Adres:</strong> KAYAPA ORGANİZE SANAYİ BÖLGESİ BEYAZ CADDE NO: 17 NİLÜFER/BURSA</li>
                <li><strong>Son Güncelleme Tarihi:</strong> 17.03.2026</li>
              </ul>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {isKvkkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">KVKK Aydınlatma Metni</h3>
              <button 
                onClick={() => setIsKvkkModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4">
              <h4 className="font-bold text-slate-800 text-lg">KVKK AYDINLATMA METNİ (UYUMLU SÜRÜM)</h4>
              
              <div className="space-y-1">
                <p><strong>Veri Sorumlusu:</strong></p>
                <p>DENEYSEL İNTERNET HİZMETLERİ LİMİTED ŞİRKETİ – www.kritiksoru.com</p>
                <p><strong>E-posta:</strong> info@kritiksoru.com</p>
                <p><strong>Adres:</strong> KAYAPA ORGANİZE SANAYİ BÖLGESİ BEYAZ CADDE NO: 17 NİLÜFER/BURSA</p>
              </div>

              <p>WhatsApp üzerinden soru çözüm destek hizmeti ve webapp abonelik sistemi kapsamında kişisel verileriniz 6698 sayılı KVKK uyarınca işlenmektedir.</p>

              <h4 className="font-bold text-slate-800">İşlenen Veriler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ad-soyad</li>
                <li>Telefon numarası</li>
                <li>E-posta</li>
                <li>TC Kimlik Numarası</li>
                <li>Adres</li>
                <li>Abonelik ve paket bilgisi</li>
                <li>Ödeme işlem kaydı (kart verisi saklanmaz)</li>
                <li>WhatsApp mesaj içerikleri ve gönderilen soru görselleri</li>
                <li>IP ve teknik kayıtlar</li>
              </ul>

              <h4 className="font-bold text-slate-800">İşleme Amaçları</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Soru çözüm hizmetinin sunulması</li>
                <li>Abonelik ve ödeme işlemleri</li>
                <li>Kullanıcı desteği</li>
                <li>Hizmet kalitesi geliştirme</li>
                <li>Güvenlik ve kötüye kullanım önleme</li>
                <li>Yasal yükümlülüklerin yerine getirilmesi</li>
              </ul>

              <h4 className="font-bold text-slate-800">Hukuki Sebep</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Sözleşmenin ifası</li>
                <li>Meşru menfaat</li>
                <li>Hukuki yükümlülük</li>
                <li>Gerekli hallerde açık rıza</li>
              </ul>

              <h4 className="font-bold text-slate-800">Aktarım</h4>
              <p>Veriler:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ödeme kuruluşlarına</li>
                <li>Hosting ve altyapı sağlayıcılara</li>
                <li>WhatsApp/Meta altyapısına</li>
                <li>Muhasebe hizmetlerine</li>
              </ul>
              <p>aktarılabilir.</p>

              <h4 className="font-bold text-slate-800">Saklama Süresi</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Abonelik süresi boyunca</li>
                <li>Yasal süreler kadar</li>
                <li>Sonrasında silme / anonimleştirme</li>
              </ul>

              <h4 className="font-bold text-slate-800">Haklar</h4>
              <p>KVKK md.11 kapsamındaki tüm haklara sahipsiniz. Başvurular: info@kritiksoru.com</p>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsKvkkModalOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
      {isPrivacyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white border border-slate-100 rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden text-left">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-xl font-bold text-slate-800">Gizlilik ve Çerez Politikası</h3>
              <button 
                onClick={() => setIsPrivacyModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-600 space-y-4">
              <h4 className="font-bold text-slate-800 text-lg">GİZLİLİK POLİTİKASI</h4>
              <p>Bu politika DENEYSEL İNTERNET HİZMETLERİ LİMİTED ŞİRKETİ / www.kritiksoru.com tarafından sunulan soru çözüm destek hizmetinin gizlilik esaslarını açıklar.</p>
              
              <h4 className="font-bold text-slate-800">Toplanan Bilgiler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hesap ve abonelik bilgileri</li>
                <li>WhatsApp yazışmaları</li>
                <li>Gönderilen soru görselleri</li>
                <li>İşlem ve ödeme kayıtları</li>
                <li>Teknik kullanım verileri</li>
              </ul>

              <h4 className="font-bold text-slate-800">Kullanım Amaçları</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Hizmeti sağlamak</li>
                <li>Soruları yanıtlamak</li>
                <li>Aboneliği yönetmek</li>
                <li>Dolandırıcılığı önlemek</li>
                <li>Sistem güvenliği sağlamak</li>
              </ul>

              <h4 className="font-bold text-slate-800">Üçüncü Taraflar</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Ödeme altyapısı</li>
                <li>Mesajlaşma platformu</li>
                <li>Sunucu sağlayıcıları</li>
              </ul>

              <h4 className="font-bold text-slate-800">Veri Güvenliği</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Erişim kısıtlama</li>
                <li>Loglama</li>
                <li>Şifreleme</li>
                <li>Yetkilendirme kontrolleri</li>
              </ul>

              <h4 className="font-bold text-slate-800">Çocukların Verisi</h4>
              <p>18 yaş altı kullanıcılar veli onayı ile hizmet almalıdır.</p>

              <h4 className="font-bold text-slate-800">Güncelleme</h4>
              <p>Politika değişirse web sitesinde yayımlanır.</p>

              <div className="my-8 border-t border-slate-100"></div>

              <h4 className="font-bold text-slate-800 text-lg">ÇEREZ POLİTİKASI</h4>
              <p>Webapp aşağıdaki çerezleri kullanır:</p>

              <h4 className="font-bold text-slate-800">Zorunlu Çerezler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Oturum yönetimi</li>
                <li>Güvenlik</li>
              </ul>

              <h4 className="font-bold text-slate-800">Analitik Çerezler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Kullanım ölçümü</li>
                <li>Performans iyileştirme</li>
              </ul>

              <h4 className="font-bold text-slate-800">İşlevsel Çerezler</h4>
              <ul className="list-disc pl-5 space-y-1">
                <li>Tercih hatırlama</li>
              </ul>

              <p className="mt-4">Tarayıcı ayarlarından çerezleri kapatabilirsiniz; bazı fonksiyonlar çalışmayabilir.</p>
            </div>
            <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsPrivacyModalOpen(false)}
                className="px-6 py-2 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};

export default Footer;
