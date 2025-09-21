import Link from 'next/link'

export default function HomePage() {
  return (
    <main className="space-y-8">
      <header className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">BinaKata</h1>
        <p className="text-lg text-gray-600">Deteksi Dini Disleksia Untuk Masa Depan Yang Lebih Baik</p>
        <div className="space-x-2">
          <Link href="/auth/register" className="btn">Mulai Sekarang</Link>
          <Link href="/auth/login" className="btn bg-white text-primary border border-primary hover:bg-blue-50">Masuk</Link>
        </div>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="card">
          <h3 className="font-semibold mb-2">Deteksi Dini</h3>
          <p className="text-sm text-gray-600">Tes komprehensif berbasis riset terkini untuk mengidentifikasi pola kesulitan.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Pembelajaran Adaptif</h3>
          <p className="text-sm text-gray-600">Konten disesuaikan kemampuan anak dengan pendekatan multisensori.</p>
        </div>
        <div className="card">
          <h3 className="font-semibold mb-2">Pemantauan Kemajuan</h3>
          <p className="text-sm text-gray-600">Grafik, statistik, dan kalender konsistensi untuk orang tua/pengajar.</p>
        </div>
      </section>
    </main>
  )
}