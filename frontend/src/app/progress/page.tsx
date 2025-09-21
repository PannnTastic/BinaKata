import CalendarHeatmap from '@/components/CalendarHeatmap'

export default function ProgressPage(){
  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Pencapaian dan Konsistensi</h1>
      <div className="card">
        <CalendarHeatmap />
      </div>
    </main>
  )
}