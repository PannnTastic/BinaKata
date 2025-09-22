'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trophy, Star, Medal, Award, Crown, Target, Zap, Heart, BookOpen, CheckCircle, Lock } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string;
  bgColor: string;
  category: 'learning' | 'streak' | 'mastery' | 'special';
  requirement: number;
  currentProgress: number;
  unlocked: boolean;
  unlockedAt?: string;
  reward: string;
}

interface AchievementCategory {
  id: string;
  name: string;
  icon: any;
  color: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [categories] = useState<AchievementCategory[]>([
    { id: 'learning', name: 'Pembelajaran', icon: BookOpen, color: 'blue' },
    { id: 'streak', name: 'Konsistensi', icon: Zap, color: 'orange' },
    { id: 'mastery', name: 'Penguasaan', icon: Crown, color: 'purple' },
    { id: 'special', name: 'Spesial', icon: Star, color: 'yellow' }
  ]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showCelebration, setShowCelebration] = useState(false);
  const [newUnlocked, setNewUnlocked] = useState<Achievement | null>(null);

  useEffect(() => {
    // Initialize achievements with mock data
    const mockAchievements: Achievement[] = [
      // Learning Achievements
      {
        id: 'first_letter',
        title: 'Huruf Pertama',
        description: 'Menyelesaikan pembelajaran huruf pertama',
        icon: BookOpen,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        category: 'learning',
        requirement: 1,
        currentProgress: 1,
        unlocked: true,
        unlockedAt: '2024-01-15',
        reward: '🌟 10 Bintang'
      },
      {
        id: 'letter_explorer',
        title: 'Penjelajah Huruf',
        description: 'Menguasai 10 huruf alphabet',
        icon: Target,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        category: 'learning',
        requirement: 10,
        currentProgress: 8,
        unlocked: false,
        reward: '🏆 Trophy Huruf'
      },
      {
        id: 'alphabet_master',
        title: 'Master Alphabet',
        description: 'Menguasai semua 26 huruf alphabet',
        icon: Crown,
        color: 'text-blue-600',
        bgColor: 'bg-blue-100',
        category: 'learning',
        requirement: 26,
        currentProgress: 15,
        unlocked: false,
        reward: '👑 Mahkota Alphabet'
      },

      // Streak Achievements
      {
        id: 'first_streak',
        title: 'Mulai Konsisten',
        description: 'Belajar 3 hari berturut-turut',
        icon: Zap,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        category: 'streak',
        requirement: 3,
        currentProgress: 3,
        unlocked: true,
        unlockedAt: '2024-01-18',
        reward: '⚡ Power Boost'
      },
      {
        id: 'week_warrior',
        title: 'Pejuang Seminggu',
        description: 'Belajar 7 hari berturut-turut',
        icon: Medal,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        category: 'streak',
        requirement: 7,
        currentProgress: 7,
        unlocked: true,
        unlockedAt: '2024-01-22',
        reward: '🥇 Medali Emas'
      },
      {
        id: 'dedication_master',
        title: 'Master Dedikasi',
        description: 'Belajar 30 hari berturut-turut',
        icon: Trophy,
        color: 'text-orange-600',
        bgColor: 'bg-orange-100',
        category: 'streak',
        requirement: 30,
        currentProgress: 12,
        unlocked: false,
        reward: '🏆 Trophy Dedikasi'
      },

      // Mastery Achievements
      {
        id: 'spelling_novice',
        title: 'Pemula Ejaan',
        description: 'Mengeja 10 kata dengan benar',
        icon: Award,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        category: 'mastery',
        requirement: 10,
        currentProgress: 12,
        unlocked: true,
        unlockedAt: '2024-01-20',
        reward: '📝 Sertifikat Ejaan'
      },
      {
        id: 'word_builder',
        title: 'Pembangun Kata',
        description: 'Menyusun 20 kata dengan benar',
        icon: Target,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        category: 'mastery',
        requirement: 20,
        currentProgress: 8,
        unlocked: false,
        reward: '🧩 Puzzle Master'
      },
      {
        id: 'perfect_scorer',
        title: 'Skor Sempurna',
        description: 'Mendapat skor 100% dalam 5 sesi',
        icon: Star,
        color: 'text-purple-600',
        bgColor: 'bg-purple-100',
        category: 'mastery',
        requirement: 5,
        currentProgress: 2,
        unlocked: false,
        reward: '⭐ Bintang Sempurna'
      },

      // Special Achievements
      {
        id: 'first_day',
        title: 'Hari Pertama',
        description: 'Menyelesaikan sesi pembelajaran pertama',
        icon: Heart,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        category: 'special',
        requirement: 1,
        currentProgress: 1,
        unlocked: true,
        unlockedAt: '2024-01-15',
        reward: '❤️ Selamat Datang'
      },
      {
        id: 'speed_learner',
        title: 'Pembelajar Cepat',
        description: 'Menyelesaikan 10 aktivitas dalam 1 hari',
        icon: Zap,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        category: 'special',
        requirement: 10,
        currentProgress: 6,
        unlocked: false,
        reward: '🚀 Roket Kecepatan'
      },
      {
        id: 'helper',
        title: 'Penolong',
        description: 'Membantu teman belajar (fitur akan datang)',
        icon: Heart,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-100',
        category: 'special',
        requirement: 1,
        currentProgress: 0,
        unlocked: false,
        reward: '🤝 Badge Penolong'
      }
    ];

    setAchievements(mockAchievements);

    // Check for new achievements (simulate)
    const checkNewAchievements = () => {
      const newlyUnlocked = mockAchievements.find(a => 
        !a.unlocked && a.currentProgress >= a.requirement
      );
      
      if (newlyUnlocked) {
        setNewUnlocked(newlyUnlocked);
        setShowCelebration(true);
        setTimeout(() => setShowCelebration(false), 3000);
      }
    };

    const timer = setTimeout(checkNewAchievements, 1000);
    return () => clearTimeout(timer);
  }, []);

  const filteredAchievements = selectedCategory === 'all' 
    ? achievements 
    : achievements.filter(a => a.category === selectedCategory);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  const getProgressColor = (category: string) => {
    switch (category) {
      case 'learning': return 'bg-blue-500';
      case 'streak': return 'bg-orange-500';
      case 'mastery': return 'bg-purple-500';
      case 'special': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-2 text-orange-600 hover:text-orange-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Kembali ke Dashboard</span>
          </Link>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">
              🏆 Achievement Center
            </h1>
            <p className="text-gray-600">
              Koleksi pencapaian dan penghargaan
            </p>
          </div>

          <div className="text-right">
            <div className="text-2xl font-bold text-orange-600">{unlockedCount}/{totalCount}</div>
            <div className="text-sm text-gray-600">Terbuka</div>
          </div>
        </div>

        {/* Progress Overview */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full mb-4">
              <Trophy className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Progress Keseluruhan
            </h2>
            <p className="text-gray-600">
              Kamu sudah membuka {unlockedCount} dari {totalCount} achievement
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Tingkat Pencapaian</span>
              <span>{completionPercentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div 
                className="h-4 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full transition-all duration-1000"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Category Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map(category => {
              const categoryAchievements = achievements.filter(a => a.category === category.id);
              const unlockedInCategory = categoryAchievements.filter(a => a.unlocked).length;
              const CategoryIcon = category.icon;
              
              return (
                <div key={category.id} className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className={`inline-flex items-center justify-center w-12 h-12 bg-${category.color}-100 rounded-lg mb-2`}>
                    <CategoryIcon className={`w-6 h-6 text-${category.color}-600`} />
                  </div>
                  <div className="font-bold text-gray-900">
                    {unlockedInCategory}/{categoryAchievements.length}
                  </div>
                  <div className="text-sm text-gray-600">{category.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-1 flex flex-wrap gap-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === 'all' 
                  ? 'bg-orange-500 text-white' 
                  : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
              }`}
            >
              Semua
            </button>
            {categories.map(category => {
              const CategoryIcon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
                    selectedCategory === category.id 
                      ? `bg-${category.color}-500 text-white` 
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                >
                  <CategoryIcon className="w-4 h-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => {
            const AchievementIcon = achievement.icon;
            const progress = Math.min(100, (achievement.currentProgress / achievement.requirement) * 100);
            
            return (
              <div
                key={achievement.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden ${
                  achievement.unlocked ? 'ring-2 ring-yellow-200' : ''
                }`}
              >
                <div className={`h-2 ${achievement.unlocked ? 'bg-gradient-to-r from-yellow-400 to-orange-500' : 'bg-gray-200'}`}>
                  {!achievement.unlocked && (
                    <div 
                      className="h-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-500"
                      style={{ width: `${progress}%` }}
                    ></div>
                  )}
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 ${achievement.bgColor} rounded-xl ${achievement.unlocked ? '' : 'opacity-50'}`}>
                      {achievement.unlocked ? (
                        <AchievementIcon className={`w-6 h-6 ${achievement.color}`} />
                      ) : (
                        <Lock className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    {achievement.unlocked && (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    )}
                  </div>

                  <h3 className={`text-lg font-bold mb-2 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                    {achievement.title}
                  </h3>
                  
                  <p className={`text-sm mb-4 ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                    {achievement.description}
                  </p>

                  {/* Progress Bar */}
                  {!achievement.unlocked && (
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span>{achievement.currentProgress}/{achievement.requirement}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(achievement.category)}`}
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className={`text-sm font-medium ${achievement.unlocked ? 'text-orange-600' : 'text-gray-400'}`}>
                      {achievement.reward}
                    </div>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <div className="text-xs text-gray-400">
                        {new Date(achievement.unlockedAt).toLocaleDateString('id-ID')}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Belum Ada Achievement
            </h3>
            <p className="text-gray-600">
              Mulai belajar untuk membuka achievement pertama!
            </p>
          </div>
        )}

        {/* Achievement Celebration Modal */}
        {showCelebration && newUnlocked && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 text-center max-w-md mx-4 animate-pulse">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Achievement Baru!
              </h2>
              <div className="inline-flex items-center justify-center w-16 h-16 bg-yellow-100 rounded-xl mb-4">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {newUnlocked.title}
              </h3>
              <p className="text-gray-600 mb-4">
                {newUnlocked.description}
              </p>
              <div className="text-lg font-bold text-orange-600">
                {newUnlocked.reward}
              </div>
              <div className="flex justify-center gap-4 mt-6">
                <Star className="w-8 h-8 text-yellow-500" />
                <Trophy className="w-8 h-8 text-yellow-500" />
                <Star className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mt-12 text-center">
          <Link 
            href="/learning" 
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            🎯 Lanjut Belajar
          </Link>
        </div>
      </div>
    </div>
  );
}