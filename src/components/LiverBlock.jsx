import fattyLiverImg from '../assets/fatty_liver.png'
import healthyLiverImg from '../assets/healthy_liver.png'

export default function LiverBlock({ healthy, label }) {
  const imageSrc = healthy ? healthyLiverImg : fattyLiverImg

  return (
    <div className="rounded-lg bg-slate-50 p-3 text-center">
      <div className="mx-auto h-20 w-32 overflow-hidden rounded-md">
        <img src={imageSrc} alt={label} className="h-full w-full object-cover" />
      </div>
      <p className="mt-1 text-sm font-semibold text-slate-700">{label}</p>
    </div>
  )
}
