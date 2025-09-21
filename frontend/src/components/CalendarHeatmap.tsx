'use client'
import React from 'react'

export default function CalendarHeatmap(){
  const days = Array.from({length: 30}, (_,i)=> ({ day: i+1, level: Math.floor(Math.random()*4) }))
  const colors = ['bg-gray-200','bg-green-200','bg-green-400','bg-green-600']
  return (
    <div className="grid grid-cols-10 gap-1">
      {days.map(d=> (
        <div key={d.day} className={`w-8 h-8 rounded ${colors[d.level]}`} title={`Hari ${d.day}`}></div>
      ))}
    </div>
  )
}