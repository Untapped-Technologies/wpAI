import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { BarChart3, Clock, Globe, Shield, Users, Zap } from 'lucide-react'

const HomePlatform = () => {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
            <span className="block text-4xl lg:text-5xl text-[#203c39] mt-2">
              Intelligence Platform
            </span>
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Stay ahead of global political developments with our comprehensive
            platform
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#203c39]/10 rounded-lg flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-[#203c39]" />
              </div>
              <CardTitle className="text-xl">Global Coverage</CardTitle>
              <CardDescription className="text-base">
                Comprehensive analysis of political events from local to
                international levels
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#203c39]/10 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-[#203c39]" />
              </div>
              <CardTitle className="text-xl">Real-Time Analysis</CardTitle>
              <CardDescription className="text-base">
                AI-powered insights delivered instantly as political events
                unfold
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#203c39]/10 rounded-lg flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-[#203c39]" />
              </div>
              <CardTitle className="text-xl">Verified Sources</CardTitle>
              <CardDescription className="text-base">
                Trusted information from credible news outlets and official
                sources
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#203c39]/10 rounded-lg flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-[#203c39]" />
              </div>
              <CardTitle className="text-xl">Data Visualization</CardTitle>
              <CardDescription className="text-base">
                Interactive maps, charts, and timelines to understand political
                trends
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#203c39]/10 rounded-lg flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-[#203c39]" />
              </div>
              <CardTitle className="text-xl">Expert Insights</CardTitle>
              <CardDescription className="text-base">
                Analysis from political experts and policy researchers
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <div className="w-12 h-12 bg-[#203c39]/10 rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-[#203c39]" />
              </div>
              <CardTitle className="text-xl">24/7 Monitoring</CardTitle>
              <CardDescription className="text-base">
                Continuous tracking of political developments around the clock
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default HomePlatform
