'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Gamepad2, Type, Star, Trophy, Clock, Target, ArrowRight, Play } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, Button, StatCard, Badge, LoadingSpinner } from '@/components/ui';
import { authHeaders } from '@/lib/api';

interface Child {
  id: number;
  name: string;
  age: number;
}

interface Progress {
  letters_completed: number;
  words_completed: number;
  spelling_completed: number;
  total_sessions: number;
  streak_days: number;
  achievements_count: number;
}

export default function LearningModulesPage() {
  const [children, setChildren] = useState<Child[]>([]);
  const [selectedChild, setSelectedChild] = useState<Child | null>(null);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch children (authorized)
        const childrenRes = await fetch('/api/children', { headers: authHeaders() });
        if (childrenRes.ok) {
          const childrenData = await childrenRes.json();
          setChildren(childrenData);
          if (childrenData.length > 0) {
            setSelectedChild(childrenData[0]);
            // Persist selected child id for other modules/pages
            if (typeof window !== 'undefined') {
              localStorage.setItem('selectedChildId', String(childrenData[0].id));
            }
            
            // Fetch progress for first child
            const progressRes = await fetch(`/api/children/${childrenData[0].id}/progress`, { headers: authHeaders() });
            if (progressRes.ok) {
              const progressData = await progressRes.json();
              setProgress(progressData);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChildChange = async (child: Child) => {
    setSelectedChild(child);
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedChildId', String(child.id));
    }
    try {
      const progressRes = await fetch(`/api/children/${child.id}/progress`, { headers: authHeaders() });
      if (progressRes.ok) {
        const progressData = await progressRes.json();
        setProgress(progressData);
      }
    } catch (error) {
      console.error('Error fetching progress:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Memuat modul pembelajaran...</p>
        </div>
      </div>
    );
  }

  const modules = [
    {
      id: 'letters',
      title: 'Pengenalan Huruf',
      description: 'Belajar mengenal huruf A-Z dengan cara yang menyenangkan',
      icon: Type,
      color: 'bg-blue-500',
      route: '/learning/letters',
      progress: progress?.letters_completed || 0,
      total: 26
    },
    {
      id: 'spelling',
      title: 'Pelatihan Ejaan',
      description: 'Latihan mengeja kata dengan panduan visual dan audio',
      icon: BookOpen,
      color: 'bg-green-500',
      route: '/learning/spelling',
      progress: progress?.spelling_completed || 0,
      total: 50
    },
    {
      id: 'words',
      title: 'Penyusunan Kata',
      description: 'Susun huruf menjadi kata yang benar dengan drag & drop',
      icon: Gamepad2,
      color: 'bg-orange-500',
      route: '/learning/words',
      progress: progress?.words_completed || 0,
      total: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 animate-fadeIn">
          <Badge variant="secondary" size="lg" className="mb-6">
            <BookOpen className="w-4 h-4 mr-2" />
            Modul Pembelajaran
          </Badge>
          <h1 className="text-5xl font-bold gradient-text mb-6">
            🎓 Belajar dengan Menyenangkan
          </h1>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Pilih modul pembelajaran yang sesuai dengan kebutuhan dan mari mulai perjalanan belajar yang interaktif!
          </p>
        </div>

        {/* Child Selector */}
        {children.length > 1 && (
          <div className="animate-slideIn mb-8">
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-600" />
                  Pilih Anak untuk Belajar
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4 flex-wrap">
                  {children.map((child) => (
                    <Button
                      key={child.id}
                      onClick={() => handleChildChange(child)}
                      variant={selectedChild?.id === child.id ? 'primary' : 'outline'}
                      className="hover:scale-105 transform transition-all duration-200"
                    >
                      {child.name} ({child.age} tahun)
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Progress Summary */}
        {progress && selectedChild && (
          <div className="animate-slideIn mb-8" style={{animationDelay: '0.1s'}}>
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-600" />
                  Kemajuan {selectedChild.name}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard
                    title="Total Sesi"
                    value={progress.total_sessions}
                    icon={Clock}
                    variant="primary"
                  />
                  <StatCard
                    title="Streak Hari"
                    value={progress.streak_days}
                    icon={Target}
                    variant="success"
                  />
                  <StatCard
                    title="Achievement"
                    value={progress.achievements_count}
                    icon={Star}
                    variant="warning"
                  />
                  <StatCard
                    title="Total Selesai"
                    value={progress.letters_completed + progress.spelling_completed + progress.words_completed}
                    icon={Trophy}
                    variant="secondary"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Learning Modules */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {modules.map((module, index) => {
            const Icon = module.icon;
            const progressPercentage = Math.round((module.progress / module.total) * 100);
            
            return (
              <div 
                key={module.id} 
                className="animate-slideIn" 
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <Card 
                  variant="elevated" 
                  padding="lg" 
                  className="group hover:scale-105 transform transition-all duration-300 hover:shadow-2xl cursor-pointer h-full"
                >
                  <div className={`${module.color} h-24 -m-6 mb-6 rounded-t-xl flex items-center justify-center group-hover:scale-105 transition-transform duration-300`}>
                    <Icon className="w-12 h-12 text-white" />
                  </div>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <CardTitle className="text-xl mb-2">
                        {module.title}
                      </CardTitle>
                      <p className="text-gray-600 leading-relaxed">
                        {module.description}
                      </p>
                    </div>
                    
                    {/* Progress Section */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">
                            {module.progress}/{module.total}
                          </span>
                          <Badge 
                            variant={progressPercentage === 100 ? 'success' : 'primary'} 
                            size="sm"
                          >
                            {progressPercentage}%
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                        <div 
                          className={`h-3 rounded-full ${module.color} transition-all duration-500 ease-out`}
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>

                    <Link href={module.route}>
                      <Button 
                        variant={progressPercentage === 100 ? 'success' : 'primary'} 
                        className="w-full hover:scale-105 transform transition-all duration-200"
                      >
                        {progressPercentage === 100 ? (
                          <>
                            <Trophy className="w-4 h-4 mr-2" />
                            Selesai
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Mulai Belajar
                          </>
                        )}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <div className="animate-fadeIn" style={{animationDelay: '0.3s'}}>
          <Card variant="outlined" padding="lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-purple-600" />
                Aksi Cepat
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link href="/dashboard">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 transition-all duration-200 border border-purple-200 hover:border-purple-300 group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Trophy className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-purple-900">Dashboard</div>
                    </div>
                    <div className="text-sm text-purple-700 leading-relaxed">
                      Lihat progress lengkap dan statistik pembelajaran
                    </div>
                  </div>
                </Link>
                
                <Link href="/progress">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 transition-all duration-200 border border-blue-200 hover:border-blue-300 group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Target className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-blue-900">Konsistensi</div>
                    </div>
                    <div className="text-sm text-blue-700 leading-relaxed">
                      Pantau jadwal dan konsistensi belajar harian
                    </div>
                  </div>
                </Link>
                
                <Link href="/screening">
                  <div className="p-6 rounded-xl bg-gradient-to-r from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 transition-all duration-200 border border-green-200 hover:border-green-300 group">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div className="font-semibold text-green-900">Tes Skrining</div>
                    </div>
                    <div className="text-sm text-green-700 leading-relaxed">
                      Evaluasi kemampuan dengan tes komprehensif
                    </div>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}