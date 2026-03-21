
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';
import { cities } from '../data/cities';
import { useAuth } from '../context/AuthContext';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    phone: '',
    address: '',
    city: '',
    district: '',
    email: '',
    password: '',
    confirmPassword: '',
    tcNo: '',
    targetExam: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [isKvkkModalOpen, setIsKvkkModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      city: e.target.value,
      district: '' // Reset district when city changes
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!formData.name) newErrors.name = 'Ad zorunludur';
    if (!formData.surname) newErrors.surname = 'Soyad zorunludur';
    if (!formData.phone) {
      newErrors.phone = 'Telefon zorunludur';
    } else {
      const cleanedPhone = formData.phone.replace(/\D/g, '');
      if (cleanedPhone.length < 10 || cleanedPhone.length > 12) {
        newErrors.phone = 'Geçerli bir telefon numarası giriniz (Örn: 05XX XXX XX XX)';
      }
    }
    if (!formData.address) newErrors.address = 'Adres zorunludur';
    if (!formData.city) newErrors.city = 'İl seçimi zorunludur';
    if (!formData.district) newErrors.district = 'İlçe seçimi zorunludur';
    if (!formData.targetExam) newErrors.targetExam = 'Sınav seçimi zorunludur';
    
    if (!formData.tcNo) {
      newErrors.tcNo = 'TC Kimlik No zorunludur';
    } else if (!/^\d{11}$/.test(formData.tcNo)) {
      newErrors.tcNo = 'TC Kimlik No 11 haneli rakamlardan oluşmalıdır';
    }
    
    if (!formData.email) {
      newErrors.email = 'E-posta zorunludur';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Geçerli bir e-posta adresi giriniz';
    }

    if (!formData.password) {
      newErrors.password = 'Şifre zorunludur';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Şifre en az 8 karakter olmalıdır';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Şifreler eşleşmiyor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (validate()) {
      try {
        await register({
          name: formData.name,
          surname: formData.surname,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          district: formData.district,
          tcNo: formData.tcNo,
          targetExam: formData.targetExam,
          password: formData.password
        });

        alert('Kayıt başarılı! Yönlendiriliyorsunuz...');
        navigate('/');
      } catch (error: any) {
        console.error('Registration error:', error);
        if (error.code === 'auth/email-already-in-use') {
          setErrors({ ...errors, email: 'Bu e-posta adresi zaten kullanımda.' });
        } else if (error.message === 'phone-already-in-use') {
          setErrors({ ...errors, phone: 'Bu telefon numarası zaten kullanımda.' });
        } else {
          setErrors({ ...errors, email: 'Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.' });
        }
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-slate-50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center mb-8">
          <Logo />
        </Link>
        <div className="bg-white py-10 px-4 shadow-xl sm:rounded-3xl sm:px-10 border border-slate-200">
          <h2 className="text-2xl font-bold text-slate-800 mb-2 text-center">Aramıza Katıl</h2>
          <p className="text-center text-slate-500 mb-8 text-sm">Hemen hesabını oluştur, sorularını çözdür.</p>
          
          <form className="space-y-4" onSubmit={handleRegister}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Ad</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.name ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} 
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Soyad</label>
                <input 
                  type="text" 
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.surname ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} 
                />
                {errors.surname && <p className="text-xs text-red-500 mt-1">{errors.surname}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Telefon (WhatsApp)</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="05XX XXX XX XX"
                className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.phone ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400`} 
              />
              {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">E-posta</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.email ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} 
              />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">TC Kimlik No</label>
                <input 
                  type="text" 
                  name="tcNo"
                  value={formData.tcNo}
                  onChange={handleChange}
                  maxLength={11}
                  placeholder="11 Haneli TC Kimlik No"
                  className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.tcNo ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400`} 
                />
                {errors.tcNo && <p className="text-xs text-red-500 mt-1">{errors.tcNo}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Hazırlandığım Sınav</label>
                <select 
                  name="targetExam"
                  value={formData.targetExam}
                  onChange={handleChange}
                  className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.targetExam ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none`}
                >
                  <option value="">Seçiniz</option>
                  <option value="LGS">LGS</option>
                  <option value="TYT">TYT</option>
                  <option value="AYT">AYT</option>
                </select>
                {errors.targetExam && <p className="text-xs text-red-500 mt-1">{errors.targetExam}</p>}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">İl</label>
                <select 
                  name="city" 
                  value={formData.city} 
                  onChange={handleCityChange}
                  className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.city ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none`}
                >
                  <option value="">Seçiniz</option>
                  {Object.keys(cities).map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
                {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">İlçe</label>
                <select 
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  disabled={!formData.city}
                  className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.district ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all appearance-none disabled:bg-slate-100 disabled:text-slate-400`}
                >
                  <option value="">Seçiniz</option>
                  {formData.city && cities[formData.city]?.map(dist => (
                    <option key={dist} value={dist}>{dist}</option>
                  ))}
                </select>
                {errors.district && <p className="text-xs text-red-500 mt-1">{errors.district}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">Adres</label>
              <textarea 
                name="address"
                rows={2}
                value={formData.address}
                onChange={handleChange}
                className={`mt-1 block w-full bg-slate-50 text-slate-800 border ${errors.address ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all resize-none`} 
              />
              {errors.address && <p className="text-xs text-red-500 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Şifre</label>
                <div className="relative mt-1">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min 8 karakter"
                    className={`block w-full bg-slate-50 text-slate-800 border ${errors.password ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all placeholder:text-slate-400`} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Şifre Tekrar</label>
                <div className="relative mt-1">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className={`block w-full bg-slate-50 text-slate-800 border ${errors.confirmPassword ? 'border-red-500' : 'border-slate-200'} rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all`} 
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>
            </div>

            <div className="pt-4">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol ve Başla'}
              </button>
            </div>
          </form>
          <div className="mt-8 text-center text-xs text-slate-500">
            Kayıt olarak <button type="button" onClick={() => setIsTermsModalOpen(true)} className="font-bold underline hover:text-slate-700">Kullanım Şartları</button> ve <button type="button" onClick={() => setIsKvkkModalOpen(true)} className="font-bold underline hover:text-slate-700">KVKK Politikamızı</button> kabul etmiş sayılırsınız.
            <div className="mt-2 text-sm text-slate-500">
              Zaten hesabın var mı? <Link to="/giris" className="font-bold text-blue-600 hover:text-blue-700">Giriş Yap</Link>
            </div>
          </div>
        </div>
      </div>

      {isTermsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
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
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsTermsModalOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {isKvkkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden border border-slate-200">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
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
            <div className="p-6 border-t border-slate-200 bg-slate-50 flex justify-end">
              <button 
                onClick={() => setIsKvkkModalOpen(false)}
                className="px-6 py-2 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
