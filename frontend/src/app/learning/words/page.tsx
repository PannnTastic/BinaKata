'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Volume2, RotateCcw, CheckCircle, XCircle, Star, Trophy, Shuffle, Lightbulb } from 'lucide-react';
import { updateWordProgress } from '@/lib/progress';

const WORD_EXERCISES = [
  // Level 1: Kata sederhana
  { 
    word: 'BUKU', 
    image: '📚', 
    hint: 'Digunakan untuk membaca cerita', 
    scrambled: ['U', 'B', 'K', 'U'],
    difficulty: 1,
    sentence: 'Aku membaca _____ di perpustakaan.'
  },
  { 
    word: 'MATA', 
    image: '👁️', 
    hint: 'Organ untuk melihat', 
    scrambled: ['A', 'T', 'M', 'A'],
    difficulty: 1,
    sentence: 'Aku melihat dengan _____ ku.'
  },
  { 
    word: 'BOLA', 
    image: '⚽', 
    hint: 'Mainan bundar untuk menendang', 
    scrambled: ['L', 'O', 'B', 'A'],
    difficulty: 1,
    sentence: 'Anak-anak bermain _____ di lapangan.'
  },
  { 
    word: 'IKAN', 
    image: '🐟', 
    hint: 'Hewan yang hidup di air', 
    scrambled: ['K', 'A', 'I', 'N'],
    difficulty: 1,
    sentence: '_____ berenang di dalam air.'
  },
  { 
    word: 'KAKI', 
    image: '🦵', 
    hint: 'Organ untuk berjalan', 
    scrambled: ['A', 'K', 'I', 'K'],
    difficulty: 1,
    sentence: 'Aku berjalan dengan _____ ku.'
  },

  // Level 2: Kata sedang
  { 
    word: 'KUCING', 
    image: '🐱', 
    hint: 'Hewan peliharaan yang suka ikan', 
    scrambled: ['G', 'U', 'C', 'I', 'K', 'N'],
    difficulty: 2,
    sentence: '_____ itu sangat lucu dan menggemaskan.'
  },
  { 
    word: 'SEKOLAH', 
    image: '🏫', 
    hint: 'Tempat belajar setiap hari', 
    scrambled: ['H', 'S', 'E', 'A', 'K', 'O', 'L'],
    difficulty: 2,
    sentence: 'Anak-anak pergi ke _____ untuk belajar.'
  },
  { 
    word: 'KELUARGA', 
    image: '👨‍👩‍👧‍👦', 
    hint: 'Ayah, ibu, dan anak-anak', 
    scrambled: ['A', 'K', 'E', 'L', 'U', 'A', 'R', 'G'],
    difficulty: 2,
    sentence: 'Aku sayang _____ ku.'
  },
  { 
    word: 'MATAHARI', 
    image: '☀️', 
    hint: 'Bintang yang memberikan cahaya', 
    scrambled: ['A', 'M', 'T', 'A', 'H', 'R', 'I', 'A'],
    difficulty: 2,
    sentence: '_____ bersinar terang di siang hari.'
  },
  { 
    word: 'SEPATU', 
    image: '👟', 
    hint: 'Alas kaki untuk melindungi', 
    scrambled: ['T', 'U', 'S', 'E', 'P', 'A'],
    difficulty: 2,
    sentence: 'Aku memakai _____ sebelum keluar rumah.'
  },

  // Level 3: Kata sulit
  { 
    word: 'PERPUSTAKAAN', 
    image: '📖', 
    hint: 'Tempat penyimpanan banyak buku', 
    scrambled: ['P', 'E', 'R', 'P', 'U', 'S', 'T', 'A', 'K', 'A', 'A', 'N'],
    difficulty: 3,
    sentence: 'Kami meminjam buku di _____.'
  },
  { 
    word: 'PEMBELAJARAN', 
    image: '🎓', 
    hint: 'Proses mendapatkan ilmu', 
    scrambled: ['P', 'E', 'M', 'B', 'E', 'L', 'A', 'J', 'A', 'R', 'A', 'N'],
    difficulty: 3,
    sentence: '_____ yang baik membuat anak cerdas.'
  },
  { 
    word: 'PERSAHABATAN', 
    image: '🤝', 
    hint: 'Hubungan baik antar teman', 
    scrambled: ['P', 'E', 'R', 'S', 'A', 'H', 'A', 'B', 'A', 'T', 'A', 'N'],
    difficulty: 3,
    sentence: '_____ sejati akan bertahan selamanya.'
  },
  { 
    word: 'KEBAHAGIAAN', 
    image: '😊', 
    hint: 'Perasaan senang dan gembira', 
    scrambled: ['K', 'E', 'B', 'A', 'H', 'A', 'G', 'I', 'A', 'A', 'N'],
    difficulty: 3,
    sentence: '_____ datang dari hati yang bersyukur.'
  },
  { 
    word: 'KREATIVITAS', 
    image: '🎨', 
    hint: 'Kemampuan menciptakan hal baru', 
    scrambled: ['K', 'R', 'E', 'A', 'T', 'I', 'V', 'I', 'T', 'A', 'S'],
    difficulty: 3,
    sentence: '_____ membantu kita berpikir berbeda.'
  }
];

interface WordStats {
  correct: number;
  incorrect: number;
  streak: number;
  maxStreak: number;
  hintsUsed: number;
  shufflesUsed: number;
}

interface DraggedLetter {
  letter: string;
  originalIndex: number;
}

export default function WordArrangementPage() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [childId] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('selectedChildId') || '1';
    }
    return '1';
  });
  const [arrangedLetters, setArrangedLetters] = useState<string[]>([]);
  const [availableLetters, setAvailableLetters] = useState<string[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [stats, setStats] = useState<WordStats>({ 
    correct: 0, incorrect: 0, streak: 0, maxStreak: 0, hintsUsed: 0, shufflesUsed: 0 
  });
  const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
  const [showCelebration, setShowCelebration] = useState(false);
  const [difficulty, setDifficulty] = useState(1);
  const [draggedItem, setDraggedItem] = useState<DraggedLetter | null>(null);
  
  const filteredExercises = WORD_EXERCISES.filter(ex => ex.difficulty === difficulty);
  const currentExercise = filteredExercises[currentWordIndex] || WORD_EXERCISES[0];

  useEffect(() => {
    if (currentExercise) {
      setAvailableLetters([...currentExercise.scrambled]);
      setArrangedLetters(new Array(currentExercise.word.length).fill(''));
      setShowHint(false);
      setShowResult(false);
    }
  }, [currentWordIndex, difficulty, currentExercise]);

  const playWordSound = async () => {
    try {
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(currentExercise.word);
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

  const shuffleAvailableLetters = () => {
    const shuffled = [...availableLetters].sort(() => Math.random() - 0.5);
    setAvailableLetters(shuffled);
    setStats(prev => ({ ...prev, shufflesUsed: prev.shufflesUsed + 1 }));
  };

  const handleDragStart = (e: React.DragEvent, letter: string, index: number, source: 'available' | 'arranged') => {
    setDraggedItem({ letter, originalIndex: index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDropOnArranged = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    const newArrangedLetters = [...arrangedLetters];
    const newAvailableLetters = [...availableLetters];

    // If there's already a letter in the target position, move it back to available
    if (newArrangedLetters[targetIndex]) {
      newAvailableLetters.push(newArrangedLetters[targetIndex]);
    }

    // Place the dragged letter in the target position
    newArrangedLetters[targetIndex] = draggedItem.letter;
    
    // Remove the dragged letter from available letters
    const letterIndex = newAvailableLetters.indexOf(draggedItem.letter);
    if (letterIndex > -1) {
      newAvailableLetters.splice(letterIndex, 1);
    }

    setArrangedLetters(newArrangedLetters);
    setAvailableLetters(newAvailableLetters);
    setDraggedItem(null);
  };

  const handleDropOnAvailable = (e: React.DragEvent) => {
    e.preventDefault();
    if (!draggedItem) return;

    // If dragging from arranged letters back to available
    const arrangedIndex = arrangedLetters.indexOf(draggedItem.letter);
    if (arrangedIndex > -1) {
      const newArrangedLetters = [...arrangedLetters];
      const newAvailableLetters = [...availableLetters];
      
      newArrangedLetters[arrangedIndex] = '';
      newAvailableLetters.push(draggedItem.letter);
      
      setArrangedLetters(newArrangedLetters);
      setAvailableLetters(newAvailableLetters);
    }
    
    setDraggedItem(null);
  };

  const handleLetterClick = (letter: string, index: number, source: 'available' | 'arranged') => {
    if (source === 'available') {
      // Find first empty slot in arranged letters
      const emptyIndex = arrangedLetters.findIndex(l => l === '');
      if (emptyIndex > -1) {
        const newArrangedLetters = [...arrangedLetters];
        const newAvailableLetters = [...availableLetters];
        
        newArrangedLetters[emptyIndex] = letter;
        newAvailableLetters.splice(index, 1);
        
        setArrangedLetters(newArrangedLetters);
        setAvailableLetters(newAvailableLetters);
      }
    } else {
      // Move from arranged back to available
      if (letter) {
        const newArrangedLetters = [...arrangedLetters];
        const newAvailableLetters = [...availableLetters];
        
        newArrangedLetters[index] = '';
        newAvailableLetters.push(letter);
        
        setArrangedLetters(newArrangedLetters);
        setAvailableLetters(newAvailableLetters);
      }
    }
  };

  const checkArrangement = () => {
    const formedWord = arrangedLetters.join('');
    const correct = formedWord === currentExercise.word;
    
    setIsCorrect(correct);
    setShowResult(true);

    setStats(prev => {
      const newStreak = correct ? prev.streak + 1 : 0;
      return {
        ...prev,
        correct: prev.correct + (correct ? 1 : 0),
        incorrect: prev.incorrect + (correct ? 0 : 1),
        streak: newStreak,
        maxStreak: Math.max(prev.maxStreak, newStreak)
      };
    });

    if (correct) {
      setCompletedWords(prev => new Set([...prev, currentWordIndex]));
      if (!completedWords.has(currentWordIndex)) {
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 2000);
      }
    }

    // Auto advance after 3 seconds
    setTimeout(() => {
      if (correct && currentWordIndex < filteredExercises.length - 1) {
        nextWord();
      }
      setShowResult(false);
    }, 3000);
  };

  const nextWord = () => {
    if (currentWordIndex < filteredExercises.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    }
  };

  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    }
  };

  const useHint = () => {
    setShowHint(true);
    setStats(prev => ({ ...prev, hintsUsed: prev.hintsUsed + 1 }));
  };

  const resetProgress = () => {
    setStats({ correct: 0, incorrect: 0, streak: 0, maxStreak: 0, hintsUsed: 0, shufflesUsed: 0 });
    setCompletedWords(new Set());
    setCurrentWordIndex(0);
  };

  const clearArrangement = () => {
    setArrangedLetters(new Array(currentExercise.word.length).fill(''));
    setAvailableLetters([...currentExercise.scrambled]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Link 
              href="/learning" 
              className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Kembali ke Modul</span>
            </Link>
            
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                🧩 Penyusunan Kata
              </h1>
              <p className="text-gray-600">
                Level {difficulty} - Kata {currentWordIndex + 1}/{filteredExercises.length}
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
                      updateWordProgress(childId, idx, difficulty, true, 0, 0)
                    );
                    await Promise.all(tasks);
                    alert('Progress kata berhasil disimpan!');
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
            <span>{completedWords.size}/{filteredExercises.length} kata</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className="h-3 bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${(completedWords.size / filteredExercises.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
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
          <div className="bg-white rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-indigo-600">{stats.shufflesUsed}</div>
            <div className="text-sm text-gray-600">Shuffle</div>
          </div>
        </div>

        {/* Difficulty Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-lg p-1 flex">
            {[1, 2, 3].map(level => (
              <button
                key={level}
                onClick={() => {
                  setDifficulty(level);
                  setCurrentWordIndex(0);
                }}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  difficulty === level 
                    ? 'bg-orange-500 text-white' 
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Level {level}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            {/* Word Display */}
            <div className="text-center mb-8">
              <div className="text-8xl mb-4">{currentExercise.image}</div>
              <div className="inline-flex items-center gap-3 mb-4">
                <button
                  onClick={playWordSound}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-600 p-2 rounded-full transition-colors"
                >
                  <Volume2 className="w-5 h-5" />
                </button>
              </div>
              <div className="text-gray-600 text-lg mb-4">
                Susunlah huruf-huruf berikut menjadi kata yang benar:
              </div>
              
              {/* Sentence with blank */}
              <div className="bg-blue-50 rounded-lg p-4 text-lg text-blue-800">
                {currentExercise.sentence}
              </div>
            </div>

            {/* Hint */}
            {showHint && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 text-yellow-800">
                  <Lightbulb className="w-5 h-5" />
                  <span className="font-medium">Petunjuk:</span>
                </div>
                <p className="text-yellow-700 mt-1">{currentExercise.hint}</p>
              </div>
            )}

            {/* Arranged Letters Area (Drop Zone) */}
            <div className="mb-8">
              <div className="text-center text-gray-600 mb-4 text-lg font-medium">
                Susun kata di sini:
              </div>
              <div className="flex justify-center gap-2 flex-wrap min-h-[80px] items-center border-2 border-dashed border-gray-300 rounded-lg p-4 bg-gray-50">
                {arrangedLetters.map((letter, index) => (
                  <div
                    key={index}
                    className="relative"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDropOnArranged(e, index)}
                  >
                    <button
                      className={`w-16 h-16 border-2 rounded-lg font-bold text-xl transition-all duration-200 ${
                        letter 
                          ? 'bg-orange-100 border-orange-300 text-orange-800 hover:bg-orange-200' 
                          : 'bg-white border-gray-300 border-dashed hover:bg-gray-100'
                      }`}
                      onClick={() => handleLetterClick(letter, index, 'arranged')}
                      disabled={showResult}
                    >
                      {letter || '?'}
                    </button>
                    <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-400">
                      {index + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Available Letters */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <div className="text-center text-gray-600 text-lg font-medium flex-1">
                  Huruf yang tersedia:
                </div>
                <button
                  onClick={shuffleAvailableLetters}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors flex items-center gap-2"
                  disabled={showResult}
                >
                  <Shuffle className="w-4 h-4" />
                  Acak
                </button>
              </div>
              <div 
                className="flex justify-center gap-2 flex-wrap p-4 border-2 border-gray-200 rounded-lg bg-blue-50 min-h-[80px] items-center"
                onDragOver={handleDragOver}
                onDrop={handleDropOnAvailable}
              >
                {availableLetters.map((letter, index) => (
                  <button
                    key={`${letter}-${index}`}
                    className="w-14 h-14 bg-blue-100 border-2 border-blue-300 rounded-lg font-bold text-xl text-blue-800 hover:bg-blue-200 transition-all duration-200 cursor-move"
                    draggable={!showResult}
                    onDragStart={(e) => handleDragStart(e, letter, index, 'available')}
                    onClick={() => handleLetterClick(letter, index, 'available')}
                    disabled={showResult}
                  >
                    {letter}
                  </button>
                ))}
                {availableLetters.length === 0 && (
                  <div className="text-gray-400 text-lg">
                    Semua huruf sudah digunakan
                  </div>
                )}
              </div>
            </div>

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
                    ? `Hebat! Kata "${currentExercise.word}" sudah tersusun dengan benar!`
                    : `Kata yang benar adalah "${currentExercise.word}"`
                  }
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-4 flex-wrap">
              <button
                onClick={prevWord}
                disabled={currentWordIndex === 0}
                className="bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed text-gray-800 px-6 py-3 rounded-lg font-medium transition-colors"
              >
                ← Sebelumnya
              </button>
              
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={clearArrangement}
                  disabled={showResult}
                  className="bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  🗑️ Bersihkan
                </button>
                
                <button
                  onClick={useHint}
                  disabled={showHint || showResult}
                  className="bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center gap-2"
                >
                  <Lightbulb className="w-4 h-4" />
                  Hint
                </button>
                
                <button
                  onClick={checkArrangement}
                  disabled={showResult || arrangedLetters.includes('')}
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-medium transition-colors"
                >
                  ✓ Cek Susunan
                </button>
              </div>
              
              <button
                onClick={nextWord}
                disabled={currentWordIndex === filteredExercises.length - 1}
                className="bg-blue-500 hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Selanjutnya →
              </button>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 max-w-4xl mx-auto">
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800 mb-3">📖 Cara Bermain:</h3>
            <ul className="text-blue-700 space-y-2">
              <li>• <strong>Klik</strong> huruf biru untuk memindahkannya ke area penyusunan</li>
              <li>• <strong>Drag & Drop</strong> huruf ke posisi yang diinginkan</li>
              <li>• <strong>Klik</strong> huruf yang sudah tersusun untuk mengembalikannya</li>
              <li>• Gunakan tombol <strong>"Acak"</strong> jika huruf sulit ditemukan</li>
              <li>• Gunakan <strong>"Hint"</strong> jika membutuhkan petunjuk</li>
            </ul>
          </div>
        </div>

        {/* Word Grid */}
        <div className="mt-12 max-w-6xl mx-auto">
          <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
            🧩 Daftar Kata Level {difficulty}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {filteredExercises.map((exercise, index) => (
              <button
                key={index}
                onClick={() => setCurrentWordIndex(index)}
                className={`
                  p-3 rounded-lg text-center transition-all duration-300 border-2
                  ${completedWords.has(index)
                    ? 'bg-green-100 border-green-300 text-green-800'
                    : currentWordIndex === index
                      ? 'bg-orange-100 border-orange-300 text-orange-800'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                  }
                `}
              >
                <div className="text-2xl mb-1">{exercise.image}</div>
                <div className="font-medium text-sm">{exercise.word}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {exercise.scrambled.join(' ')}
                </div>
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
                Susunan Sempurna!
              </h2>
              <p className="text-gray-600 mb-6">
                Kamu berhasil menyusun kata <strong>"{currentExercise.word}"</strong> dengan benar!
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