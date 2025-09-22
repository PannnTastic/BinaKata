# 🚀 BinaKata - Local Development Guide

Panduan lengkap untuk menjalankan BinaKata secara lokal di Windows tanpa Docker.

## 📋 Prerequisites (Prasyarat)

Sebelum menjalankan BinaKata, pastikan Anda telah menginstall:

### 1. Node.js (Required)
- **Version**: Node.js 18+ dengan npm
- **Download**: https://nodejs.org/
- **Check**: `node --version` dan `npm --version`

### 2. Python (Required untuk ML Service)
- **Version**: Python 3.8+
- **Download**: https://www.python.org/
- **Check**: `python --version` dan `pip --version`

### 3. Git (Optional tapi recommended)
- **Download**: https://git-scm.com/
- **Check**: `git --version`

## 🎯 Quick Start (Mulai Cepat)

### Option 1: One-Click Setup (Recommended)
```bash
# Double-click file ini atau jalankan di command prompt:
run-local.bat
```

### Option 2: PowerShell (Advanced Users)
```powershell
# Jalankan di PowerShell sebagai Administrator:
.\run-local.ps1

# Dengan opsi:
.\run-local.ps1 -SkipSetup      # Skip dependency installation
.\run-local.ps1 -Verbose        # Show detailed status
```

### Option 3: Frontend Only (UI Testing)
```bash
# Untuk testing UI saja:
run-frontend-only.bat
```

## 📁 Project Structure

```
binakata/
├── frontend/          # Next.js Frontend (Port 3000)
├── backend/           # Node.js/Express Backend (Port 8000)  
├── ml-service/        # Python ML Service (Port 5000)
├── run-local.bat      # Main setup script
├── run-local.ps1      # PowerShell setup script  
├── stop-local.bat     # Stop all services
├── stop-local.ps1     # PowerShell stop script
└── LOCAL_DEVELOPMENT.md
```

## 🔧 Manual Setup (Advanced)

Jika automated script tidak bekerja, ikuti langkah manual ini:

### 1. Setup Frontend
```bash
cd frontend
npm install
npx prisma generate
npx prisma db push
npm run dev
```

### 2. Setup Backend  
```bash
cd backend
npm install
npm run dev
```

### 3. Setup ML Service
```bash
cd ml-service
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

## 🌐 Service URLs

Setelah semua service berjalan:

- **🎨 Frontend (BinaKata App)**: http://localhost:3000
- **🔌 Backend API**: http://localhost:8000
- **🤖 ML Service API**: http://localhost:5000

## 🛠️ Available Scripts

| Script | Description | Usage |
|--------|-------------|--------|
| `run-local.bat` | Setup dan jalankan semua service | Double-click atau `.\run-local.bat` |
| `run-local.ps1` | PowerShell version dengan advanced options | `.\run-local.ps1` |
| `stop-local.bat` | Stop semua service | Double-click atau `.\stop-local.bat` |
| `stop-local.ps1` | PowerShell stop script | `.\stop-local.ps1` |
| `run-frontend-only.bat` | Jalankan frontend saja | Double-click atau `.\run-frontend-only.bat` |

## 🐛 Troubleshooting

### Common Issues:

#### 1. Port sudah digunakan
```bash
# Check port yang digunakan:
netstat -ano | findstr :3000
netstat -ano | findstr :8000  
netstat -ano | findstr :5000

# Kill process by PID:
taskkill /PID [PID_NUMBER] /F
```

#### 2. Node.js tidak ditemukan
- Install Node.js dari https://nodejs.org/
- Restart command prompt/PowerShell
- Check PATH environment variable

#### 3. Python tidak ditemukan  
- Install Python dari https://www.python.org/
- Centang "Add Python to PATH" saat install
- Restart command prompt/PowerShell

#### 4. npm install gagal
```bash
# Clear cache dan coba lagi:
npm cache clean --force
npm install
```

#### 5. Prisma database error
```bash
cd frontend
npx prisma db push --force-reset
npx prisma generate
```

#### 6. Python virtual environment error
```bash
cd ml-service
rmdir /s venv
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

### Performance Issues:

#### Slow startup?
- Close unnecessary applications
- Run services one by one instead of all at once
- Check antivirus exclusions

#### High memory usage?
- Use `run-frontend-only.bat` for UI-only testing
- Close unused browser tabs
- Restart services periodically

## 📝 Development Workflow

### Recommended Development Flow:

1. **First Run**: Use `run-local.bat` untuk full setup
2. **Daily Development**: 
   - Frontend only: `run-frontend-only.bat`
   - Full stack: `run-local.bat -SkipSetup` (PowerShell)
3. **Testing**: All services dengan `run-local.bat`
4. **Cleanup**: `stop-local.bat` setelah selesai

### Code Changes:
- **Frontend**: Hot reload otomatis di port 3000
- **Backend**: Nodemon restart otomatis
- **ML Service**: Manual restart diperlukan

## 🔐 Environment Variables

File `.env` akan di-generate otomatis. Untuk kustomisasi:

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

## 🚀 Production Build

Untuk build production:

```bash
# Frontend production build
cd frontend
npm run build
npm start

# Backend production
cd backend  
npm run build
npm run start

# ML Service production
cd ml-service
python app.py --production
```

## 📚 Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [Prisma Documentation](https://www.prisma.io/docs)

## 🆘 Getting Help

Jika mengalami masalah:

1. Check troubleshooting section di atas
2. Restart semua services dengan `stop-local.bat` lalu `run-local.bat`
3. Check console output untuk error messages
4. Pastikan semua prerequisites terinstall dengan benar

## ✨ Tips & Tricks

- **Faster Startup**: Skip setup dengan `run-local.ps1 -SkipSetup`
- **UI Testing**: Gunakan `run-frontend-only.bat` untuk development UI
- **Multiple Instances**: Jangan jalankan multiple instances script bersamaan
- **Browser**: Gunakan Chrome/Edge untuk best compatibility
- **Development**: Buka DevTools (F12) untuk debugging

---

**Happy Coding! 🎉**

Developed with ❤️ by Tim BinaKata