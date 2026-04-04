import SectionCard from '../components/SectionCard'
import LiverBlock from '../components/LiverBlock'
import bannerImg from '../assets/banner.png'
import { Link } from 'react-router-dom'
import { FaAsterisk } from 'react-icons/fa'
import { CgInsights } from 'react-icons/cg'
import { MdOutlinePendingActions } from 'react-icons/md'

export default function HomePage() {
  return (
    <SectionCard title="NAFLD Risk Prediction">
      <div className="grid gap-6 md:grid-cols-2">
        <div
          className="space-y-4 rounded-xl bg-cover bg-center bg-no-repeat p-6"
          style={{
            backgroundImage: `linear-gradient(rgba(224, 242, 254, 0.5)), url(${bannerImg})`,
          }}
        >
          <h2 className="page-title text-4xl font-bold text-blue-900">AI-Based NAFLD Prediction</h2>
          <p className="text-slate-600">Early detection of non-alcoholic fatty liver disease</p>
          <div className="flex gap-3">
            <Link to="/input" className="rounded-md bg-blue-700 px-5 py-2 font-semibold text-white">
              Get Started
            </Link>
            <Link to="/understanding" className="rounded-md border border-blue-200 bg-white px-5 py-2 font-semibold text-blue-700">
              Learn More
            </Link>
          </div>
        </div>
        <div className="space-y-3 rounded-xl bg-white p-5 shadow-inner">
          <p className="font-semibold text-slate-700">Healthy Liver vs Fatty Liver</p>
          <div className="grid grid-cols-2 gap-3">
            <LiverBlock label="Healthy Liver" healthy />
            <LiverBlock label="Fatty Liver" healthy={false} />
          </div>
        </div>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-[#eef2f8] shadow-sm">
        <div className="grid md:grid-cols-3">
          {[
            {
              title: 'Assess Your Risk',
              subtitle: 'Input key markers and get a quick estimate.',
              icon: FaAsterisk,
              circleClass: 'bg-gradient-to-b from-[#51b9df] to-[#1f84c8]',
            },
            {
              title: 'Get Insights',
              subtitle: 'Understand factors increasing liver fat risk.',
              icon: CgInsights,
              circleClass: 'bg-gradient-to-b from-[#65acec] to-[#2d78d3]',
            },
            {
              title: 'Take Action',
              subtitle: 'Review practical recommendations from results.',
              icon: MdOutlinePendingActions,
              circleClass: 'bg-gradient-to-b from-[#64cfae] to-[#2aa182]',
            },
          ].map(({ title, subtitle, icon: Icon, circleClass }, index) => (
            <div
              key={title}
              className={`px-6 py-6 text-center ${index !== 2 ? 'md:border-r md:border-slate-300/70' : ''}`}
            >
              <div className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full text-2xl text-white shadow ${circleClass}`}>
                <Icon />
              </div>
              <p className="text-3xl font-semibold text-blue-900 page-title">{title}</p>
              <p className="mx-auto mt-2 max-w-[240px] text-sm text-slate-500">{subtitle}</p>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  )
}
