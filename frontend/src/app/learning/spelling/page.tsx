'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle, Star, Trophy, Backspace, Lightbulb } from 'lucide-react';
import { updateSpellingProgress } from '@/lib/progress';

const SPELLING_WORDS = [
  // Level 1: Kata sederhana 3-4 huruf
  { word: 'BUKU', image: '📚', category: 'Sekolah', difficulty: 1, hint: 'Digunakan untuk membaca' },
  { word: 'MATA', image: '👁️', category: 'Tubuh', difficulty: 1, hint: 'Organ untuk melihat' },
  { word: 'KAKI', image: '🦵', category: 'Tubuh', difficulty: 1, hint: 'Organ untuk berjalan' },
  { word: 'BOLA', image: '⚽', category: 'Mainan', difficulty: 1, hint: 'Mainan bulat untuk menendang' },
  { word: 'APEL', image: '🍎', category: 'Buah', difficulty: 1, hint: 'Buah merah yang sehat' },
  { word: 'IKAN', image: '🐟', category: 'Hewan', difficulty: 1, hint: 'Hewan yang hidup di air' },
  { word: 'BAJU', image: '👕', category: 'Pakaian', difficulty: 1, hint: 'Pakaian yang dipakai' },
  { word: 'KUCING', image: '🐱', category: 'Hewan', difficulty: 1, hint: 'Hewan peliharaan yang meong' },
  { word: 'ANJING', image: '🐶', category: 'Hewan', difficulty: 1, hint: 'Hewan peliharaan yang guk-guk' },
  { word: 'RUMAH', image: '🏠', category: 'Tempat', difficulty: 1, hint: 'Tempat tinggal keluarga' },

  // Level 2: Kata sedang 5-6 huruf
  { word: 'SEKOLAH', image: '🏫', category: 'Tempat', difficulty: 2, hint: 'Tempat belajar anak-anak' },
  { word: 'KELUARGA', image: '👨‍👩‍👧‍👦', category: 'Orang', difficulty: 2, hint: 'Ayah, ibu, dan anak' },
  { word: 'SEPATU', image: '👟', category: 'Pakaian', difficulty: 2, hint: 'Alas kaki untuk jalan' },
  { word: 'POHON', image: '🌳', category: 'Alam', difficulty: 2, hint: 'Tumbuhan besar dengan batang' },
  { word: 'MOBIL', image: '🚗', category: 'Kendaraan', difficulty: 2, hint: 'Kendaraan beroda empat' },
  { word: 'SEPEDA', image: '🚲', category: 'Kendaraan', difficulty: 2, hint: 'Kendaraan beroda dua' },
  { word: 'MATAHARI', image: '☀️', category: 'Alam', difficulty: 2, hint: 'Bintang yang menerangi bumi' },
  { word: 'BULAN', image: '🌙', category: 'Alam', difficulty: 2, hint: 'Satelit bumi yang bersinar malam' },
  { word: 'BINTANG', image: '⭐', category: 'Alam', difficulty: 2, hint: 'Cahaya kecil di langit malam' },
  { word: 'KOMPUTER', image: '💻', category: 'Teknologi', difficulty: 2, hint: 'Alat untuk bekerja dan bermain game' },

  // Level 3: Kata sulit 7+ huruf
  { word: 'PERPUSTAKAAN', image: '📖', category: 'Tempat', difficulty: 3, hint: 'Tempat menyimpan banyak buku' },
  { word: 'PELAJARAN', image: '📝', category: 'Sekolah', difficulty: 3, hint: 'Materi yang dipelajari di sekolah' },
  { word: 'PERMAINAN', image: '🎮', category: 'Mainan', difficulty: 3, hint: 'Aktivitas yang menyenangkan' },
  { word: 'KECERDASAN', image: '🧠', category: 'Sifat', difficulty: 3, hint: 'Kemampuan berpikir yang baik' },
  { word: 'KEBAHAGIAAN', image: '😊', category: 'Perasaan', difficulty: 3, hint: 'Perasaan senang dan gembira' },
  { word: 'PERSAHABATAN', image: '🤝', category: 'Hubungan', difficulty: 3, hint: 'Hubungan baik antar teman' },
  { word: 'PEMBELAJARAN', image: '🎓', category: 'Pendidikan', difficulty: 3, hint: 'Proses mendapatkan pengetahuan' },
  { word: 'KEPERCAYAAN', image: '🤝', category: 'Sifat', difficulty: 3, hint: 'Keyakinan terhadap seseorang' },
  { word: 'KREATIVITAS', image: '🎨', category: 'Sifat', difficulty: 3, hint: 'Kemampuan menciptakan hal baru' },
  { word: 'TANGGUNG JAWAB', image: '💪', category: 'Sifat', difficulty: 3, hint: 'Kesediaan memikul tugas' }
];

interface SpellingStats {
  correct: number;
  incorrect: number;
  streak: number;
  maxStreak: number;
  hintsUsed: number;
}

export default function SpellingPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState<SpellingStats>({ 
    correct: 0, incorrect: 0, streak: 0, maxStreak: 0, hintsUsed: 0 
  });
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [gameMode, setGameMode] = useState<'typing' | 'letters'>('typing');
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<string[]>([]);
  
  // Get childId from URL params or localStorage (you can modify this based on your auth system)
  const [childId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedChildId') || '1';
    }
    return '1';
  });
  
  const currentWord = SPELLING_WORDS.filter(w => w.difficulty === difficulty)[currentWordIndex] || SPELLING_WORDS[0];
  const filteredWords = SPELLING_WORDS.filter(w => w.difficulty === difficulty);

  // Generate scrambled letters for letter-picking mode
  useEffect(() => {
    if (gameMode === 'letters' && currentWord) {
      const wordLetters = currentWord.word.split('');
      const extraLetters = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];
      const randomExtras = extraLetters.sort(() => 0.5 - Math.random()).slice(0, 4);
      const allLetters = [...wordLetters, ...randomExtras].sort(() => 0.5 - Math.random());
      setAvailableLetters(allLetters);
      setSelectedLetters([]);
    }
  }, [currentWord, gameMode]);

  const playWordSound = async () => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentWord.word);
        utterance.rate = 0.6;
        utterance.pitch = 1.0;
        utterance.volume = 0.8;
        utterance.lang = 'id-ID';
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing word sound:', error);
    }
  };

  const checkSpelling = async () => {
    const answer = gameMode === 'typing' ? userInput.toUpperCase() : selectedLetters.join('');
    const correct = answer === currentWord.word;
    
    setIsCorrect(correct);
    setShowResult(true);

    // Update local stats
    setStats(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak),
        hintsUsed: prev.hintsUsed
      };
    });

    // Save progress to database
    try {
      await updateSpellingProgress(
        childId,
        currentWordIndex,
        difficulty,
        correct,
        showHint ? 1 : 0 // Use current hint status, not accumulated stats
      );
      console.log('Progress saved successfully for word:', currentWord.word);
    } catch (error) {
      console.error('Failed to save progress:', error);
      // Continue with UI updates even if save fails
    }

    if (correct) {
      setCompletedWords(prev => new Set([...prev, currentWordIndex]));
      if (!completedWords.has(currentWordIndex)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }

    // Auto advance after 3 seconds
    setTimeout(() => {
      if (correct && currentWordIndex < filteredWords.length - 1) {
        nextWord();
      }
      setShowResult(false);
    }, 3000);
  };

  const nextWord = () => {
    if (currentWordIndex < filteredWords.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
      setUserInput('');
      setSelectedLetters([]);
      setShowHint(false);
      setShowResult(false);
    }
  };

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
      setUserInput('');
      setSelectedLetters([]);
      setShowHint(false);
      setShowResult(false);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const resetProgress = () => {
    setStats({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0, hintsUsed: 0 });
    setCompletedWords(new Set());
    setCurrentWordIndex(0);
    setUserInput('');
    setSelectedLetters([]);
    setShowHint(false);
    setShowResult(false);
  };

  const handleLetterSelect = (letter: string, index: number) => {
    setSelectedLetters(prev => [...prev, letter]);
    setAvailableLetters(prev => prev.filter((_, i) => i !== index));
  };

  const handleLetterRemove = (index: number) => {
    const letter = selectedLetters[index];
    setSelectedLetters(prev => prev.filter((_, i) => i !== index));
    setAvailableLetters(prev => [...prev, letter]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !showResult) {
      checkSpelling();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/learning" 
            className="flex items-center gap-2 text-green-600 hover:text-green-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Modul</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              ✏️ Pelatihan Ejaan
            </h1>
            <p className="text-gray-600">
              Level {difficulty} - Kata {currentWordIndex + 1}/{filteredWords.length}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={resetProgress}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <RotateCcw className="w-5 h-5" />
              <span>Reset</span>
            </button>
            <button
              onClick={async () => {
                if (!childId) return;
                setIsSaving(true);
                try {
                  const tasks = Array.from(completedWords).map(idx =>
                    updateSpellingProgress(childId, idx, difficulty, true, 0)
                  );
                  await Promise.all(tasks);
                  alert('Progress ejaan berhasil disimpan!');
                } catch (e) {
                  console.error(e);
                  alert('Gagal menyimpan progress. Coba lagi.');
                } finally {
                  setIsSaving(false);
                }
              }}
              disabled={isSaving || completedWords.size === 0}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {isSaving ? 'Menyimpan...' : 'Selesai'}
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress Level {difficulty}</span>
            <span>{completedWords.size}/{filteredWords.length} kata</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedWords.size / filteredWords.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
            <div className="text-sm text-gray-600">Benar</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
            <div className="text-sm text-gray-600">Salah</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.streak}</div>
            <div className="text-sm text-gray-600">Streak</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{stats.maxStreak}</div>
            <div className="text-sm text-gray-600">Max Streak</div>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.hintsUsed}</div>
            <div className="text-sm text-gray-600">Hint</div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          {/* Difficulty Selector */}
          <div className="bg-white rounded-lg p-1 flex">
            {[1, 2, 3].map(level => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  setCurrentWordIndex(0);
                  setUserInput('');
                  setSelectedLetters([]);
                  setShowResult(false);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  difficulty === level 
                    ? 'bg-green-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>

          {/* Mode Selector */}
          <div className="bg-white rounded-lg p-1 flex">
            <button
              onClick={() => setGameMode('typing')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                gameMode === 'typing' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              ⌨️ Ketik
            </button>
            <button
              onClick={() => setGameMode('letters')}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                gameMode === 'letters' 
                  ? 'bg-green-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🔤 Pilih Huruf
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Word Display */}
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{currentWord.image}</div>
              <div className="inline-flex items-center gap-3 mb-4">
                <div className="text-2xl font-bold text-gray-800">
                  Ejakan kata: "{currentWord.word}"
                </div>
                <button
                  onClick={playWordSound}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-gray-600">
                Kategori: {currentWord.category}
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-medium">Petunjuk:</span>
                </div>
                <p className="text-yellow-700 mt-1">{currentWord.hint}</p>
              </div>
            )}

            {/* Input Area */}
            {gameMode === 'typing' ? (
              <div className="mb-6">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ketik ejaannya di sini..."
                  className="w-full text-2xl text-center p-4 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                  disabled={showResult}
                  style={{ letterSpacing: '0.1em' }}
                />
              </div>
            ) : (
              /* Letter Selection Mode */
              <div className="mb-6">
                {/* Selected Letters */}
                <div className="mb-4">
                  <div className="text-center text-gray-600 mb-2">Kata yang tersusun:</div>
                  <div className="flex justify-center gap-2 min-h-[60px] items-center flex-wrap">
                    {selectedLetters.map((letter, index) => (
                      <button
                        key={index}
                        onClick={() => handleLetterRemove(index)}
                        className="w-12 h-12 bg-green-100 border-2 border-green-300 rounded-lg font-bold text-lg text-green-800 hover:bg-green-200 transition-colors"
                      >
                        {letter}
                      </button>
                    ))}
                    {selectedLetters.length === 0 && (
                      <div className="text-gray-400 text-lg">Pilih huruf di bawah</div>
                    )}
                  </div>
                </div>

                {/* Available Letters */}
                <div className="text-center">
                  <div className="text-gray-600 mb-2">Huruf yang tersedia:</div>
                  <div className="flex justify-center gap-2 flex-wrap">
                    {availableLetters.map((letter, index) => (
                      <button
                        key={index}
                        onClick={() => handleLetterSelect(letter, index)}
                        className="w-12 h-12 bg-blue-100 border-2 border-blue-300 rounded-lg font-bold text-lg text-blue-800 hover:bg-blue-200 transition-colors"
                        disabled={showResult}
                      >
                        {letter}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Result */}
            {showResult && (
              <div className={`text-center p-4 rounded-lg mb-6 ${
                isCorrect ? 'bg-green-100' : 'bg-red-100'
              }`}>
                <div className={`text-2xl font-bold mb-2 ${
                  isCorrect ? 'text-green-800' : 'text-red-800'
                }`}>
                  {isCorrect ? '🎉 Benar!' : '😔 Salah!'}
                </div>
                <div className="text-gray-700 text-lg">
                  {isCorrect 
                    ? `Hebat! Ejaan "${currentWord.word}" sudah tepat!`
                    : `Ejaan yang benar adalah "${currentWord.word}"`
                  }
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4">
              <button
                onClick={prevWord}
                disabled={currentWordIndex === 0}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ← Sebelumnya
              </button>
              
              <div className="flex gap-2">
                <button
                  onClick={useHint}
                  disabled={showHint || showResult}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint
                </button>
                
                <button
                  onClick={checkSpelling}
                  disabled={showResult || (gameMode === 'typing' ? !userInput : selectedLetters.length === 0)}
                  className="bg-green-500 hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  ✓ Cek Ejaan
                </button>
              </div>
              
              <button
                onClick={nextWord}
                disabled={currentWordIndex === filteredWords.length - 1}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Word Grid */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            📝 Daftar Kata Level {difficulty}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredWords.map((word, index) => (
              <button
                key={index}
                onClick={() => setCurrentWordIndex(index)}
                className={`
                  p-3 rounded-lg text-center transition-all duration-300 border-2
                  ${completedWords.has(index)
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : currentWordIndex === index
                      ? 'bg-blue-100 border-blue-300 text-blue-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">{word.image}</div>
                <div className="font-medium text-sm">{word.word}</div>
                {completedWords.has(index) && (
                  <CheckCircle className="w-4 h-4 mx-auto mt-1 text-green-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Celebration Modal */}
        {showCelebration && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 text-center max-w-md mx-4">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Ejaan Sempurna!
              </h2>
              <p className="text-gray-600 mb-6">
                Kamu berhasil mengeja kata <strong>"{currentWord.word}"</strong> dengan benar!
              </p>
              <div className="flex justify-center gap-4">
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Star className="w-8 h-8 text-yellow-500" />
                <Trophy className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}