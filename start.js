#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
╔════════════════════════════════════════════════════════╗
║                                                        ║
║          🚀 BinaKata Development Starter 🚀            ║  
║                                                        ║
║     Platform Pembelajaran Adaptif untuk Anak Disleksia ║
║                                                        ║
╚════════════════════════════════════════════════════════╝

🔍 Checking prerequisites...
`);

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.substring(1).split('.')[0]);

if (majorVersion < 18) {
  console.error('❌ Node.js 18+ is required. Current version:', nodeVersion);
  console.error('Please install Node.js 18+ from: https://nodejs.org/');
  process.exit(1);
}

console.log('✅ Node.js version:', nodeVersion);

// Check Python
exec('python --version', (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Python is not installed or not in PATH');
    console.error('Please install Python 3.8+ from: https://www.python.org/');
    process.exit(1);
  }
  
  console.log('✅ Python version:', stdout.trim());
  
  // Check if this is first run
  const frontendNodeModules = path.join(__dirname, 'frontend', 'node_modules');
  const isFirstRun = !fs.existsSync(frontendNodeModules);
  
  if (isFirstRun) {
    console.log(`
🔧 First-time setup detected. Installing dependencies...
This might take a few minutes...
`);
    
    runSetup();
  } else {
    console.log(`
⚡ Dependencies found. Starting development servers...
`);
    
    startDev();
  }
});

function runSetup() {
  console.log('📦 Installing root dependencies...');
  
  const npmInstall = spawn('npm', ['install'], {
    stdio: 'inherit',
    shell: true,
    cwd: __dirname
  });
  
  npmInstall.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to install root dependencies');
      process.exit(1);
    }
    
    console.log('📦 Installing all project dependencies...');
    
    const setupProcess = spawn('npm', ['run', 'setup'], {
      stdio: 'inherit', 
      shell: true,
      cwd: __dirname
    });
    
    setupProcess.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Setup failed');
        process.exit(1);
      }
      
      console.log(`
🎉 Setup completed successfully!

Starting development servers...
`);
      
      startDev();
    });
  });
}

function startDev() {
  console.log(`
🚀 Starting BinaKata services...

📊 Services will be available at:
  🎨 Frontend:    http://localhost:3000
  🔌 Backend API: http://localhost:8000  
  🤖 ML Service:  http://localhost:5000

⏱️  Please wait 10-15 seconds for all services to start...
🌐 BinaKata will be ready at: http://localhost:3000

Press Ctrl+C to stop all services
`);
  
  const devProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit',
    shell: true, 
    cwd: __dirname
  });
  
  // Handle Ctrl+C gracefully
  process.on('SIGINT', () => {
    console.log(`
🛑 Stopping BinaKata services...
`);
    devProcess.kill();
    process.exit(0);
  });
  
  devProcess.on('close', (code) => {
    console.log(`
👋 BinaKata services stopped.
`);
    process.exit(code);
  });
}