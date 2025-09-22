'use client'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { authHeaders } from '@/lib/api'
import CalendarHeatmap from '@/components/CalendarHeatmap'
import { Card, CardContent, CardHeader, CardTitle, Button, StatCard, Badge } from '@/components/ui'
import { Target, TrendingUp, Calendar, Award, Activity, BookOpen, Brain, Zap } from 'lucide-react'

export default function DashboardPage() {
  const [summary, setSummary] = useState<{total_assessments:number, average_risk:number|null}>({total_assessments:0, average_risk:null})
  const [isLoading, setIsLoading] = useState(true)

  useEffect(()=>{
    fetch('/api/dashboard/summary', { headers: authHeaders() })
      .then(r=>r.json())
      .then(setSummary)
      .catch(()=>{})
      .finally(() => setIsLoading(false))
  },[])

  const riskLevel = summary.average_risk === null ? 'Belum ada data' : 
    summary.average_risk >= 0.7 ? 'Tinggi' :
    summary.average_risk >= 0.4 ? 'Sedang' : 'Rendah'

  const getRiskVariant = () => {
    if (summary.average_risk === null) return 'default'
    if (summary.average_risk >= 0.7) return 'danger'
    if (summary.average_risk >= 0.4) return 'warning'
    return 'success'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center animate-fadeIn">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="animate-fadeIn">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">
                🏠 Dashboard Terapi
              </h1>
              <p className="text-gray-600 text-lg">
                Pantau perkembangan dan aktivitas anak Anda dengan mudah
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href="/learning">
                <Button variant="secondary" className="w-full sm:w-auto">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Mulai Belajar
                </Button>
              </Link>
              <Link href="/screening">
                <Button variant="primary" className="w-full sm:w-auto">
                  <Brain className="w-4 h-4 mr-2" />
                  Tes Skrining
                </Button>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 animate-slideIn">
          <StatCard
            title="Total Tes Selesai"
            value={summary.total_assessments}
            description="Tes yang sudah dilakukan"
            icon={Target}
            variant="primary"
          />
          
          <StatCard
            title="Rata-rata Risiko"
            value={summary.average_risk === null ? '-' : `${(summary.average_risk*100).toFixed(0)}%`}
            description={`Level: ${riskLevel}`}
            icon={TrendingUp}
            variant={getRiskVariant()}
          />
          
          <StatCard
            title="Konsistensi Mingguan"
            value="85%"
            description="Target tercapai"
            icon={Activity}
            variant="success"
            trend="up"
          />
          
          <StatCard
            title="Streak Belajar"
            value="7 hari"
            description="Beruntun tanpa putus"
            icon={Zap}
            variant="warning"
          />
        </div>
        
        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8 animate-fadeIn">
          {/* Calendar Heatmap */}
          <div className="lg:col-span-2">
            <Card variant="elevated" padding="lg">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Pencapaian dan Konsistensi
                  </CardTitle>
                  <Badge variant="primary">Oktober 2024</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <CalendarHeatmap />
                <div className="flex flex-wrap items-center gap-6 mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-success-500"></div>
                    <span className="text-sm text-gray-600 font-medium">Selesai</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-warning-500"></div>
                    <span className="text-sm text-gray-600 font-medium">Sedang Berlangsung</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-gray-200"></div>
                    <span className="text-sm text-gray-600 font-medium">Belum Dimulai</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Quick Actions & Achievement */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <Card variant="outlined" padding="lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Zap className="w-5 h-5 text-warning-500" />
                  Aksi Cepat
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/progress" className="block">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 transition-all duration-200 border border-blue-100 hover:border-blue-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-blue-900">Kalender Progress</div>
                        <div className="text-sm text-blue-600">Lihat konsistensi belajar</div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/achievements" className="block">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 hover:from-purple-100 hover:to-pink-100 transition-all duration-200 border border-purple-100 hover:border-purple-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500 flex items-center justify-center">
                        <Award className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-purple-900">Pencapaian</div>
                        <div className="text-sm text-purple-600">Lihat badge & reward</div>
                      </div>
                    </div>
                  </div>
                </Link>
                
                <Link href="/results" className="block">
                  <div className="p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 transition-all duration-200 border border-green-100 hover:border-green-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-green-900">Hasil & Analisis</div>
                        <div className="text-sm text-green-600">Detail perkembangan</div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
            
            {/* Recent Achievement */}
            <Card variant="gradient" padding="lg">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Pencapaian Terbaru
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-white">
                  <div className="text-4xl mb-3">🏆</div>
                  <div className="text-lg font-semibold mb-2">Konsisten 7 Hari!</div>
                  <div className="text-sm opacity-90 mb-4">
                    Selamat! Anda telah belajar secara konsisten selama 7 hari berturut-turut.
                  </div>
                  <Link href="/achievements">
                    <Button variant="outline" className="bg-white/10 border-white/30 text-white hover:bg-white/20">
                      Lihat Semua Badge
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
