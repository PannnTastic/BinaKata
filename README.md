# 🚀 BinaKata - Platform Pembelajaran Adaptif untuk Anak Disleksia

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18.0-blue?logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Python](https://img.shields.io/badge/Python-3.8+-yellow?logo=python)](https://python.org/)
[![Flask](https://img.shields.io/badge/Flask-2.0-green?logo=flask)](https://flask.palletsprojects.com/)

**BinaKata** adalah platform pembelajaran berbasis AI yang dirancang khusus untuk membantu anak penyandang disleksia mengembangkan kemampuan literasi dengan pendekatan multisensori yang dipersonalisasi.

## ✨ Fitur Utama

### 🧠 **Deteksi Dini Disleksia**
- Tes komprehensif berbasis machine learning
- Analisis pola kesulitan membaca dan menulis
- Akurasi tinggi berdasarkan riset terkini

### 📚 **Pembelajaran Adaptif**
- Modul pembelajaran yang dipersonalisasi
- Pendekatan multisensori (visual, auditori, kinestetik)
- Sistem adaptasi otomatis berdasarkan progress

### 📊 **Pemantauan Kemajuan**
- Dashboard interaktif dengan visualisasi real-time
- Kalender konsistensi dengan heatmap
- Statistik lengkap dan analisis progress

### 🎮 **Modul Pembelajaran Interaktif**
- **Pengenalan Huruf**: Belajar A-Z dengan cara menyenangkan
- **Pelatihan Ejaan**: Latihan mengeja dengan panduan visual & audio
- **Penyusunan Kata**: Drag & drop untuk merangkai huruf jadi kata

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework dengan App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Modern utility-first CSS
- **Lucide React** - Beautiful icons
- **Prisma** - Database ORM

### Backend
- **Node.js + Express** - Server-side API
- **SQLite** - Local database
- **Prisma** - Database management

### ML Service  
- **Python + Flask** - Machine learning API
- **Scikit-learn** - ML algorithms
- **NumPy & Pandas** - Data processing

## 🚀 Quick Start (Super Simple!)

### 🎯 One Command Setup (Recommended)

```bash
# Clone repository
git clone <repository-url>
cd binakata

# Install dan jalankan semuanya dengan satu command:
npm start
```

**That's it!** 🎉

### ⚡ Alternative Commands

```bash
# Jika ingin lebih kontrol:
npm install       # Install root dependencies
npm run setup     # Setup semua dependencies + database
npm run dev       # Start all services

# Atau jalankan individual:
npm run dev:frontend  # Frontend only
npm run dev:backend   # Backend only  
npm run dev:ml        # ML service only
```

## 📋 Prerequisites

Cuma butuh 2 hal:

- **Node.js 18+** - [Download](https://nodejs.org/)
- **Python 3.8+** - [Download](https://www.python.org/)

*Script akan auto-check dan kasih tau jika ada yang kurang*

## 🌐 Service URLs

Setelah setup, akses:

- **🎨 Frontend**: http://localhost:3000
- **🔌 Backend API**: http://localhost:8000  
- **🤖 ML Service**: http://localhost:5000

## 📁 Project Structure

```
binakata/
├── frontend/              # Next.js Frontend
│   ├── src/
│   │   ├── app/          # App Router pages
│   │   ├── components/   # React components
│   │   │   └── ui/       # Reusable UI components
│   │   ├── lib/          # Utilities & APIs
│   │   └── styles/       # Global styles
│   ├── prisma/           # Database schema
│   └── public/           # Static assets
│
├── backend/               # Express.js API
│   ├── src/
│   │   ├── routes/       # API endpoints
│   │   ├── middleware/   # Custom middleware
│   │   └── utils/        # Helper functions
│   └── package.json
│
├── ml-service/            # Python ML Service
│   ├── models/           # ML models
│   ├── utils/            # ML utilities
│   ├── app.py           # Flask app
│   └── requirements.txt
│
├── package.json          # 🎯 Main project config
├── start.js              # 🚀 Smart starter script
└── LOCAL_DEVELOPMENT.md  # 📖 Detailed guide
```

## 🎨 UI Components

### Design System
- **Consistent Colors**: Extended Tailwind palette
- **Typography**: Inter font dengan hierarchy yang clear  
- **Animations**: Smooth transitions dan micro-interactions
- **Responsive**: Mobile-first approach

### Key Components
- `Button` - Multiple variants (primary, secondary, success, etc.)
- `Card` - Flexible container dengan sub-components
- `Badge` - Status indicators dan labels
- `StatCard` - Interactive statistics display
- `LoadingSpinner` & `Skeleton` - Loading states
- `Toast` - Notification system

## 🔧 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm start` | 🚀 Setup + start everything (first-time friendly) |
| `npm run dev` | ⚡ Start all services (after setup) |
| `npm run setup` | 🔧 Install dependencies + setup database |
| `npm run dev:frontend` | 🎨 Frontend only |
| `npm run dev:backend` | 🔌 Backend only |
| `npm run dev:ml` | 🤖 ML service only |
| `npm run build` | 📦 Production build |

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user baru
- `POST /api/auth/login` - Login user

### Assessment
- `POST /api/assessments/start` - Mulai tes skrining
- `POST /api/assessments/submit` - Submit hasil tes

### Children Management
- `GET /api/children` - Daftar anak
- `POST /api/children` - Tambah data anak

### Dashboard
- `GET /api/dashboard/summary` - Summary statistik

## 🐛 Troubleshooting

### Common Issues

**Port sudah digunakan:**
```bash
netstat -ano | findstr :3000
taskkill /PID [PID] /F
```

**Dependencies error:**
```bash
npm run clean    # Clean semua dependencies
npm run setup    # Re-install everything
```

**Database issues:**
```bash
cd frontend
npx prisma db push --force-reset
npx prisma generate
```

Untuk troubleshooting lengkap, lihat [LOCAL_DEVELOPMENT.md](./LOCAL_DEVELOPMENT.md)

## 📖 Documentation

- [📋 Local Development Guide](./LOCAL_DEVELOPMENT.md) - Setup dan troubleshooting lengkap
- [🎨 UI Components Guide](./frontend/src/components/ui/) - Design system components
- [🔌 API Documentation](./backend/README.md) - Backend API endpoints
- [🤖 ML Service Guide](./ml-service/README.md) - Machine learning service

## 🌟 Features Preview

### 🏠 Homepage
- Modern landing page dengan gradient backgrounds
- Interactive feature cards dengan hover effects
- Mobile-responsive design
- Call-to-action yang engaging

### 📊 Dashboard  
- Real-time statistics dengan `StatCard` components
- Interactive calendar heatmap dengan tooltips
- Progress tracking dengan visual indicators
- Quick actions untuk navigasi mudah

### 🎓 Learning Modules
- Card-based layout untuk setiap modul
- Progress bars yang animated
- Badge system untuk status tracking
- Hover effects dan smooth transitions

### 🔤 Letter Learning
- Interactive alphabet learning
- Multi-sensory approach dengan audio
- Quiz mode dengan instant feedback
- Progress tracking per huruf

## 🚀 Production Deployment

### Docker (Recommended)
```bash
docker-compose up -d
```

### Manual Deployment
```bash
# Frontend
cd frontend
npm run build
npm start

# Backend  
cd backend
npm run build
npm run start

# ML Service
cd ml-service
python app.py --production
```

## 🔐 Environment Variables

### Frontend (.env.local)
```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
ML_SERVICE_URL="http://localhost:5000"
BACKEND_URL="http://localhost:8000"
```

### Backend (.env)
```env
PORT=8000
ML_SERVICE_URL=http://localhost:5000
DATABASE_URL="file:../frontend/prisma/dev.db"
```

### ML Service (.env)
```env
FLASK_PORT=5000
MODEL_PATH="./models/"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

**Tim BinaKata** - Dedicated to creating inclusive educational technology

## 🙏 Acknowledgments

- Terima kasih kepada komunitas open source
- Riset disleksia dan pendidikan inklusif
- Feedback dari pendidik dan orang tua

---

## 🎯 Getting Started

### Super Simple 3 Steps:

```bash
# 1. Clone
git clone https://github.com/your-username/binakata.git
cd binakata

# 2. Run (everything auto-setup)
npm start

# 3. Open browser
# http://localhost:3000
```

**Done!** 🎉 BinaKata will auto-setup and start all services.

---

**🌟 Developed with ❤️ for inclusive education**

*Platform pembelajaran yang membantu setiap anak mencapai potensi terbaiknya.*
