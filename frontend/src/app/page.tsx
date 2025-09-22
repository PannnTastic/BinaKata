import Link from 'next/link'
import { BookOpen, Brain, TrendingUp, Users, Star, CheckCircle, Sparkles, ArrowRight } from 'lucide-react'
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '@/components/ui'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 overflow-hidden">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        
        <div className="text-center space-y-8 max-w-5xl mx-auto relative z-10">
          <div className="space-y-6 animate-fadeIn">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-white/80 backdrop-blur-sm rounded-full shadow-large mb-6 border border-white/20">
              <div className="text-4xl animate-bounce-gentle">📚</div>
            </div>
            
            <div className="space-y-4">
              <Badge variant="secondary" size="md" className="mb-4">
                <Sparkles className="w-4 h-4 mr-2" />
                Teknologi AI untuk Pembelajaran
              </Badge>
              
              <h1 className="text-6xl md:text-7xl font-bold text-gray-900 leading-tight">
                <span className="gradient-text">Bina</span><span className="text-purple-600">Kata</span>
              </h1>
              
              <p className="text-2xl md:text-3xl text-gray-700 font-semibold max-w-3xl mx-auto">
                Solusi Inovatif untuk Pembelajaran Adaptif Anak Disleksia
              </p>
              
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Platform pembelajaran berbasis AI yang membantu anak penyandang disleksia mengembangkan kemampuan literasi dengan pendekatan multisensori yang dipersonalisasi
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slideIn" style={{animationDelay: '0.3s'}}>
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="w-full sm:w-auto shadow-large hover:scale-105 transform transition-all duration-200">
                <ArrowRight className="w-5 h-5 mr-2" />
                Mulai Sekarang
              </Button>
            </Link>
            
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto glass-card hover:scale-105 transform transition-all duration-200">
                Masuk ke Akun
              </Button>
            </Link>
          </div>

          {/* Quick Demo Access */}
          <div className="pt-8 animate-fadeIn" style={{animationDelay: '0.6s'}}>
            <Link href="/learning">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 hover:from-purple-500/20 hover:to-pink-500/20 border border-purple-200 hover:border-purple-300 transition-all duration-200 backdrop-blur-sm">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <span className="font-semibold text-purple-800">Coba Demo Pembelajaran</span>
                <Badge variant="success" size="sm">Gratis</Badge>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16 animate-fadeIn">
          <Badge variant="primary" size="lg" className="mb-6">
            <Star className="w-4 h-4 mr-2" />
            Fitur Unggulan
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dirancang Khusus untuk Anak Disleksia
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Platform komprehensif dengan pendekatan inovatif berbasis riset terkini dan teknologi AI untuk mendukung pembelajaran yang efektif
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <Card variant="elevated" padding="lg" className="group hover:scale-105 transform transition-all duration-300 animate-slideIn">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl mb-3">Deteksi Dini Disleksia</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Sistem tes komprehensif berbasis machine learning dan riset terkini untuk mengidentifikasi pola kesulitan membaca dan menulis dengan akurasi tinggi.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-blue-600 font-semibold">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Akurasi Tinggi
                </div>
                <Badge variant="primary" size="sm">AI Powered</Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg" className="group hover:scale-105 transform transition-all duration-300 animate-slideIn" style={{animationDelay: '0.1s'}}>
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl mb-3">Pembelajaran Adaptif</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Modul pembelajaran yang dipersonalisasi menggunakan pendekatan multisensori (visual, auditori, kinestetik) sesuai dengan kebutuhan individual anak.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-green-600 font-semibold">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Personal & Interaktif
                </div>
                <Badge variant="success" size="sm">Multisensori</Badge>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated" padding="lg" className="group hover:scale-105 transform transition-all duration-300 animate-slideIn" style={{animationDelay: '0.2s'}}>
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <CardHeader>
              <CardTitle className="text-xl mb-3">Pemantauan Kemajuan</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Dashboard komprehensif dengan visualisasi grafik interaktif, analisis statistik, dan kalender konsistensi untuk orang tua dan pengajar.
              </p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-purple-600 font-semibold">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  Data Lengkap
                </div>
                <Badge variant="secondary" size="sm">Real-time</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Learning Modules Preview */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
        <div className="text-center mb-16 animate-fadeIn">
          <Badge variant="secondary" size="lg" className="mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Modul Pembelajaran
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Tiga Pilar Pembelajaran Inti
          </h2>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Modul terintegrasi yang dirancang khusus berdasarkan penelitian tentang kebutuhan pembelajaran anak disleksia
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Link href="/learning/letters" className="group animate-slideIn">
            <Card variant="elevated" padding="lg" className="group-hover:scale-105 transform transition-all duration-300 group-hover:shadow-2xl">
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-3xl text-white font-bold">A</div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl mb-3">Pengenalan Huruf</CardTitle>
                </CardHeader>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Pembelajaran interaktif mengenal huruf A-Z dengan metode multisensori yang menyenangkan dan efektif
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="primary" size="sm">26 Huruf</Badge>
                  <Badge variant="success" size="sm">Interaktif</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/learning/spelling" className="group animate-slideIn" style={{animationDelay: '0.1s'}}>
            <Card variant="elevated" padding="lg" className="group-hover:scale-105 transform transition-all duration-300 group-hover:shadow-2xl">
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-3xl">✏️</div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl mb-3">Pelatihan Ejaan</CardTitle>
                </CardHeader>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Latihan mengeja kata dengan panduan visual dan audio yang dipersonalisasi sesuai tingkat kemampuan
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="success" size="sm">Audio Visual</Badge>
                  <Badge variant="warning" size="sm">Adaptif</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/learning/words" className="group animate-slideIn" style={{animationDelay: '0.2s'}}>
            <Card variant="elevated" padding="lg" className="group-hover:scale-105 transform transition-all duration-300 group-hover:shadow-2xl">
              <CardContent className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                  <div className="text-3xl">🧩</div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl mb-3">Penyusunan Kata</CardTitle>
                </CardHeader>
                <p className="text-gray-600 mb-6 leading-relaxed">
                  Aktivitas drag & drop yang mengasah kemampuan menyusun huruf menjadi kata dengan interface yang intuitif
                </p>
                <div className="flex items-center justify-center gap-2">
                  <Badge variant="warning" size="sm">Drag & Drop</Badge>
                  <Badge variant="secondary" size="sm">Gamifikasi</Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              📊 Mengapa BinaKata Penting?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-3xl font-bold mb-2">10%</div>
              <p className="text-blue-100">Anak mengalami disleksia</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">5 Juta</div>
              <p className="text-blue-100">Anak di Indonesia dengan disleksia</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">74/79</div>
              <p className="text-blue-100">Peringkat literasi Indonesia (PISA)</p>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">59%</div>
              <p className="text-blue-100">Siswa SD kesulitan membaca</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="relative">
          <Card variant="gradient" padding="lg" className="text-center text-white relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full mix-blend-overlay filter blur-xl"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full mix-blend-overlay filter blur-xl"></div>
            
            <CardContent className="relative z-10 py-8">
              <div className="animate-fadeIn">
                <div className="text-5xl mb-6 animate-bounce-gentle">🌟</div>
                <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                  Siap Membantu Anak Anda Berkembang?
                </h2>
                <p className="text-xl mb-10 opacity-90 max-w-3xl mx-auto leading-relaxed">
                  Bergabunglah dengan ribuan keluarga yang telah mempercayakan pembelajaran adaptif anak mereka kepada BinaKata. Dapatkan akses ke platform terdepan untuk anak disleksia.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                  <Link href="/auth/register">
                    <Button 
                      size="lg" 
                      className="bg-white text-purple-600 hover:bg-gray-100 shadow-large hover:scale-105 transform transition-all duration-200 w-full sm:w-auto"
                    >
                      <ArrowRight className="w-5 h-5 mr-2" />
                      Daftar Sekarang
                    </Button>
                  </Link>
                  
                  <Link href="/screening">
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm hover:scale-105 transform transition-all duration-200 w-full sm:w-auto"
                    >
                      <Brain className="w-5 h-5 mr-2" />
                      Coba Tes Skrining
                    </Button>
                  </Link>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-8 text-sm opacity-80">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>100% Gratis Dimulai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Tidak Ada Komitmen</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    <span>Dukungan 24/7</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
