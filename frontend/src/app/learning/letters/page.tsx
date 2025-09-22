'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle, Star, Trophy } from 'lucide-react';
import { updateLetterProgress } from '@/lib/progress';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const LETTER_EXAMPLES = {
  'A': { word: 'APEL', image: '🍎', sound: '/sounds/a.mp3' },
  'B': { word: 'BOLA', image: '⚽', sound: '/sounds/b.mp3' },
  'C': { word: 'CERI', image: '🍒', sound: '/sounds/c.mp3' },
  'D': { word: 'DONAT', image: '🍩', sound: '/sounds/d.mp3' },
  'E': { word: 'ELANG', image: '🦅', sound: '/sounds/e.mp3' },
  'F': { word: 'FISH', image: '🐠', sound: '/sounds/f.mp3' },
  'G': { word: 'GITAR', image: '🎸', sound: '/sounds/g.mp3' },
  'H': { word: 'HATI', image: '❤️', sound: '/sounds/h.mp3' },
  'I': { word: 'IKAN', image: '🐟', sound: '/sounds/i.mp3' },
  'J': { word: 'JAM', image: '🕐', sound: '/sounds/j.mp3' },
  'K': { word: 'KUCING', image: '🐱', sound: '/sounds/k.mp3' },
  'L': { word: 'LOVE', image: '💖', sound: '/sounds/l.mp3' },
  'M': { word: 'MATAHARI', image: '☀️', sound: '/sounds/m.mp3' },
  'N': { word: 'NANAS', image: '🍍', sound: '/sounds/n.mp3' },
  'O': { word: 'ORANGE', image: '🍊', sound: '/sounds/o.mp3' },
  'P': { word: 'PIZZA', image: '🍕', sound: '/sounds/p.mp3' },
  'Q': { word: 'QUEEN', image: '👸', sound: '/sounds/q.mp3' },
  'R': { word: 'ROBOT', image: '🤖', sound: '/sounds/r.mp3' },
  'S': { word: 'STAR', image: '⭐', sound: '/sounds/s.mp3' },
  'T': { word: 'TREE', image: '🌳', sound: '/sounds/t.mp3' },
  'U': { word: 'UMBRELLA', image: '☂️', sound: '/sounds/u.mp3' },
  'V': { word: 'VIOLET', image: '💜', sound: '/sounds/v.mp3' },
  'W': { word: 'WATER', image: '💧', sound: '/sounds/w.mp3' },
  'X': { word: 'XBOX', image: '🎮', sound: '/sounds/x.mp3' },
  'Y': { word: 'YELLOW', image: '💛', sound: '/sounds/y.mp3' },
  'Z': { word: 'ZEBRA', image: '🦓', sound: '/sounds/z.mp3' },
};

interface GameStats {
  correct: number;
  incorrect: number;
  streak: number;
  maxStreak: number;
}

export default function LetterLearningPage() {
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const [gameMode, setGameMode] = useState<'learn' | 'quiz'>('learn');
  const [quizOptions, setQuizOptions] = useState<string[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [stats, setStats] = useState<GameStats>({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0 });
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [childId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedChildId') || '1';
    }
    return '1';
  });
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  
  const currentLetter = ALPHABET[currentLetterIndex];
  const letterData = LETTER_EXAMPLES[currentLetter as keyof typeof LETTER_EXAMPLES];

  // Generate quiz options
  const generateQuizOptions = () => {
    const correct = currentLetter;
    const options = [correct];
    
    while (options.length < 4) {
      const randomLetter = ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
      if (!options.includes(randomLetter)) {
        options.push(randomLetter);
      }
    }
    
    // Shuffle options
    return options.sort(() => Math.random() - 0.5);
  };

  useEffect(() => {
    if (gameMode === 'quiz') {
      setQuizOptions(generateQuizOptions());
      setSelectedAnswer(null);
      setShowResult(false);
    }
  }, [currentLetterIndex, gameMode]);

  const playSound = async (letter: string) => {
    try {
      // Simulate letter sound with Text-to-Speech or play audio
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(letter);
        utterance.rate = 0.7;
        utterance.pitch = 1.2;
        utterance.volume = 0.8;
        speechSynthesis.speak(utterance);
      }
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  };

  const handleQuizAnswer = (answer: string) => {
    setSelectedAnswer(answer);
    setShowResult(true);
    
    const isCorrect = answer === currentLetter;
    
    setStats(prev => {
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      return {
        correct: prev.correct + (isCorrect ? 1 : 0),
        incorrect: prev.incorrect + (isCorrect ? 0 : 1),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak)
      };
    });

    if (isCorrect) {
      setCompletedLetters(prev => new Set([...prev, currentLetter]));
      if (!completedLetters.has(currentLetter)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }

    // Auto advance after 2 seconds
    setTimeout(() => {
      if (isCorrect && currentLetterIndex < ALPHABET.length - 1) {
        setCurrentLetterIndex(prev => prev + 1);
      }
      setShowResult(false);
    }, 2000);
  };

  const nextLetter = () => {
    if (currentLetterIndex < ALPHABET.length - 1) {
      setCurrentLetterIndex(prev => prev + 1);
    }
  };

  const prevLetter = () => {
    if (currentLetterIndex > 0) {
      setCurrentLetterIndex(prev => prev - 1);
    }
  };

  const resetProgress = () => {
    setStats({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0 });
    setCompletedLetters(new Set());
    setCurrentLetterIndex(0);
    setGameMode('learn');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/learning" 
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Modul</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🔤 Pengenalan Huruf
              </h1>
              <p className="text-gray-600">
                Huruf {currentLetter} ({currentLetterIndex + 1}/{ALPHABET.length})
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
                    const letters = Array.from(completedLetters);
                    await Promise.all(
                      letters.map(l => updateLetterProgress(childId, l, true))
                    );
                    alert('Progress huruf berhasil disimpan!');
                  } catch (e) {
                    console.error(e);
                    alert('Gagal menyimpan progress. Coba lagi.');
                  } finally {
                    setIsSaving(false);
                  }
                }}
                disabled={isSaving || completedLetters.size === 0}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors"
              >
                {isSaving ? 'Menyimpan...' : 'Selesai'}
              </button>
            </div>
          </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Progress Keseluruhan</span>
            <span>{completedLetters.size}/26 huruf</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 bg-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedLetters.size / 26) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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
        </div>

        {/* Game Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 flex">
            <button
              onClick={() => setGameMode('learn')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                gameMode === 'learn' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              📚 Belajar
            </button>
            <button
              onClick={() => setGameMode('quiz')}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                gameMode === 'quiz' 
                  ? 'bg-blue-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🎯 Kuis
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {gameMode === 'learn' ? (
            /* Learning Mode */
            <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
              <div className="mb-8">
                <div 
                  className={`inline-flex items-center justify-center w-32 h-32 rounded-full text-6xl font-bold text-white mb-6 ${
                    completedLetters.has(currentLetter) ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  {currentLetter}
                  {completedLetters.has(currentLetter) && (
                    <CheckCircle className="w-8 h-8 absolute ml-20 -mt-20" />
                  )}
                </div>
                
                <button
                  onClick={() => playSound(currentLetter)}
                  className="flex items-center gap-2 mx-auto bg-blue-100 hover:bg-blue-200 text-blue-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                  Dengarkan Huruf {currentLetter}
                </button>
              </div>

              <div className="mb-8">
                <div className="text-8xl mb-4">{letterData.image}</div>
                <div className="text-2xl font-bold text-gray-800 mb-2">
                  {letterData.word}
                </div>
                <div className="text-gray-600">
                  {currentLetter} untuk {letterData.word}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <button
                  onClick={prevLetter}
                  disabled={currentLetterIndex === 0}
                  className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  ← Sebelumnya
                </button>
                
                <button
                  onClick={() => setGameMode('quiz')}
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  🎯 Tes Pemahaman
                </button>
                
                <button
                  onClick={nextLetter}
                  disabled={currentLetterIndex === ALPHABET.length - 1}
                  className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  Selanjutnya →
                </button>
              </div>
            </div>
          ) : (
            /* Quiz Mode */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="text-8xl mb-4">{letterData.image}</div>
                <div className="text-xl text-gray-700 mb-2">
                  Huruf apa yang tepat untuk:
                </div>
                <div className="text-3xl font-bold text-gray-900">
                  {letterData.word}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {quizOptions.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !showResult && handleQuizAnswer(option)}
                    disabled={showResult}
                    className={`
                      w-full h-20 text-3xl font-bold rounded-xl transition-all duration-300
                      ${showResult
                        ? option === currentLetter
                          ? 'bg-green-500 text-white'
                          : option === selectedAnswer
                            ? 'bg-red-500 text-white'
                            : 'bg-gray-100 text-gray-400'
                        : 'bg-blue-100 hover:bg-blue-200 text-blue-800 hover:scale-105'
                      }
                    `}
                  >
                    {option}
                    {showResult && option === currentLetter && (
                      <CheckCircle className="w-6 h-6 inline ml-2" />
                    )}
                    {showResult && option === selectedAnswer && option !== currentLetter && (
                      <XCircle className="w-6 h-6 inline ml-2" />
                    )}
                  </button>
                ))}
              </div>

              {showResult && (
                <div className={`text-center p-4 rounded-lg ${
                  selectedAnswer === currentLetter ? 'bg-green-100' : 'bg-red-100'
                }`}>
                  <div className={`text-xl font-bold mb-2 ${
                    selectedAnswer === currentLetter ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {selectedAnswer === currentLetter ? '🎉 Benar!' : '😔 Salah!'}
                  </div>
                  <div className="text-gray-700">
                    {selectedAnswer === currentLetter 
                      ? `Hebat! ${currentLetter} memang untuk ${letterData.word}`
                      : `Jawaban yang benar adalah ${currentLetter} untuk ${letterData.word}`
                    }
                  </div>
                </div>
              )}

              <div className="flex justify-center mt-6">
                <button
                  onClick={() => setGameMode('learn')}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  📚 Kembali Belajar
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Alphabet Grid */}
        <div className="mt-12 max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🔤 Semua Huruf
          </h3>
          <div className="grid grid-cols-6 md:grid-cols-13 gap-2">
            {ALPHABET.map((letter, index) => (
              <button
                key={letter}
                onClick={() => setCurrentLetterIndex(index)}
                className={`
                  w-12 h-12 rounded-lg font-bold text-lg transition-all duration-300
                  ${completedLetters.has(letter)
                    ? 'bg-green-500 text-white'
                    : currentLetterIndex === index
                      ? 'bg-blue-500 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }
                `}
              >
                {letter}
                {completedLetters.has(letter) && (
                  <Star className="w-3 h-3 absolute ml-6 -mt-6 text-yellow-400" />
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
                Hebat Sekali!
              </h2>
              <p className="text-gray-600 mb-6">
                Kamu berhasil menguasai huruf <strong>{currentLetter}</strong>!
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