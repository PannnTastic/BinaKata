'use client'
import React, { useState, useMemo } from 'react'
import { Card } from './ui/Card'

interface DayData {
  date: Date
  day: number
  level: number
  activities?: string[]
  streak?: boolean
}

interface CalendarHeatmapProps {
  data?: DayData[]
  year?: number
  month?: number
}

export default function CalendarHeatmap({ 
  data, 
  year = new Date().getFullYear(), 
  month = new Date().getMonth() 
}: CalendarHeatmapProps) {
  const [hoveredDay, setHoveredDay] = useState<DayData | null>(null)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })

  const monthData = useMemo(() => {
    if (data) return data
    
    // Generate mock data for current month
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const startDate = new Date(year, month, 1)
    
    return Array.from({ length: daysInMonth }, (_, i) => {
      const date = new Date(year, month, i + 1)
      const daysSinceStart = Math.floor((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
      
      // Simulate activity levels with some realistic patterns
      const weekday = date.getDay()
      const isWeekend = weekday === 0 || weekday === 6
      const baseLevel = isWeekend ? Math.random() * 2 : Math.random() * 4
      
      // Add some streak patterns
      const hasActivity = Math.random() > 0.2 // 80% chance of some activity
      const level = hasActivity ? Math.min(3, Math.floor(baseLevel)) : 0
      
      const activities = level > 0 ? [
        level >= 1 ? 'Pengenalan Huruf' : '',
        level >= 2 ? 'Pelatihan Ejaan' : '',
        level >= 3 ? 'Penyusunan Kata' : ''
      ].filter(Boolean) : []
      
      return {
        date,
        day: i + 1,
        level,
        activities,
        streak: level > 0 && i > 0 && Math.random() > 0.4
      }
    })
  }, [data, year, month])

  const handleMouseEnter = (day: DayData, event: React.MouseEvent) => {
    setHoveredDay(day)
    const rect = event.currentTarget.getBoundingClientRect()
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10
    })
  }

  const handleMouseLeave = () => {
    setHoveredDay(null)
  }

  const getColorClass = (level: number, isHovered: boolean = false) => {
    const colors = [
      'bg-gray-200 hover:bg-gray-300',
      'bg-green-200 hover:bg-green-300',
      'bg-green-400 hover:bg-green-500',
      'bg-green-600 hover:bg-green-700'
    ]
    
    const baseColor = colors[level] || colors[0]
    return `${baseColor} ${isHovered ? 'ring-2 ring-blue-400 ring-opacity-75' : ''}`
  }

  const getActivityEmoji = (level: number) => {
    const emojis = ['⚪', '🟢', '💚', '✨']
    return emojis[level] || '⚪'
  }

  const monthNames = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ]

  const weekDays = ['M', 'S', 'S', 'R', 'K', 'J', 'S']
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Calculate statistics
  const totalDays = monthData.length
  const activeDays = monthData.filter(d => d.level > 0).length
  const completionRate = Math.round((activeDays / totalDays) * 100)
  const longestStreak = monthData.reduce((maxStreak, day, index) => {
    let currentStreak = 0
    for (let i = index; i < monthData.length && monthData[i].level > 0; i++) {
      currentStreak++
    }
    return Math.max(maxStreak, currentStreak)
  }, 0)

  return (
    <div className="space-y-6">
      {/* Month Header with Stats */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {monthNames[month]} {year}
          </h3>
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
            <span>{activeDays}/{totalDays} hari aktif</span>
            <span>•</span>
            <span>{completionRate}% konsistensi</span>
            <span>•</span>
            <span>Streak terpanjang: {longestStreak} hari</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="space-y-2">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {weekDays.map(day => (
            <div key={day} className="text-center text-xs font-medium text-gray-500 h-6 flex items-center justify-center">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty cells for days before month starts */}
          {Array.from({ length: adjustedFirstDay }).map((_, i) => (
            <div key={`empty-${i}`} className="w-10 h-10" />
          ))}
          
          {/* Actual days */}
          {monthData.map((day) => (
            <div
              key={day.day}
              className={`
                w-10 h-10 rounded-lg cursor-pointer transition-all duration-200 transform
                ${getColorClass(day.level, hoveredDay?.day === day.day)}
                hover:scale-110 hover:shadow-md
                ${day.streak ? 'ring-2 ring-yellow-400 ring-opacity-50' : ''}
                relative group
              `}
              onMouseEnter={(e) => handleMouseEnter(day, e)}
              onMouseLeave={handleMouseLeave}
              title={`${day.date.toLocaleDateString('id-ID')} - Level ${day.level}`}
            >
              {/* Day number */}
              <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-gray-700">
                {day.day}
              </div>
              
              {/* Activity indicator */}
              <div className="absolute -top-1 -right-1 text-xs">
                {getActivityEmoji(day.level)}
              </div>
              
              {/* Streak indicator */}
              {day.streak && (
                <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border border-white" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tooltip */}
      {hoveredDay && (
        <div
          className="fixed z-50 pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltipPosition.x, top: tooltipPosition.y }}
        >
          <Card className="bg-gray-900 text-white text-sm p-3 shadow-xl border-0 max-w-xs">
            <div className="space-y-2">
              <div className="font-semibold">
                {hoveredDay.date.toLocaleDateString('id-ID', { 
                  weekday: 'long', 
                  day: 'numeric', 
                  month: 'long' 
                })}
              </div>
              
              {hoveredDay.level > 0 ? (
                <div className="space-y-1">
                  <div className="text-green-300">
                    ✅ {hoveredDay.activities?.length || 0} aktivitas selesai
                  </div>
                  {hoveredDay.activities?.map((activity, i) => (
                    <div key={i} className="text-gray-300 text-xs">
                      • {activity}
                    </div>
                  ))}
                  {hoveredDay.streak && (
                    <div className="text-yellow-300 text-xs">
                      🔥 Bagian dari streak
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-gray-400">
                  ⚪ Tidak ada aktivitas
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
