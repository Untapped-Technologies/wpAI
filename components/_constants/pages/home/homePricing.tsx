import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { ArrowRight, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function HomePricing() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Choose Your Plan
          </h2>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
            Start free and upgrade as your needs grow
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#203c39] hover:bg-[#203c39]/90 text-white"
          >
            <Link href="/pricing" className="flex items-center gap-2">
              View All Pricing Plans
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="border-2 border-slate-200 hover:border-[#203c39] transition-colors duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Free Tier</CardTitle>
              <div className="text-4xl font-bold text-[#203c39] mb-2">$0</div>
              <CardDescription>Perfect for getting started</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">20 queries per day</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Basic political analysis</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Core personalization</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link href="/auth/sign-up">Get Started</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#203c39] relative">
            <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-[#203c39] text-white">
              Most Popular
            </Badge>
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Plus Tier</CardTitle>
              <div className="text-4xl font-bold text-[#203c39] mb-2">
                $20<span className="text-lg font-normal">/month</span>
              </div>
              <CardDescription>For serious political analysts</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Unlimited queries</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Advanced AI models</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Real-time monitoring</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Interactive visualizations</span>
                </li>
              </ul>
              <Button
                asChild
                className="w-full bg-[#203c39] hover:bg-[#203c39]/90 text-white"
              >
                <Link href="/pricing">Upgrade to Plus</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 border-slate-200 hover:border-[#203c39] transition-colors duration-300">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Pro Tier</CardTitle>
              <div className="text-4xl font-bold text-[#203c39] mb-2">
                $50<span className="text-lg font-normal">/month</span>
              </div>
              <CardDescription>For teams and organizations</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Everything in Plus</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Collaboration tools</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Data export & API</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Advanced analytics</span>
                </li>
              </ul>
              <Button asChild className="w-full" variant="outline">
                <Link href="/pricing">Learn More</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}
