import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  Clock,
  Globe,
  MapPin,
  Shield,
  Star,
  TrendingUp,
  Users,
  Zap
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="outline"
              className="mb-6 px-4 py-2 text-sm font-medium"
            >
              <Star className="w-4 h-4 mr-2 text-yellow-500" />
              The Truth Starts Here
            </Badge>

            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
              World Politics
              <span className="block text-4xl lg:text-5xl text-[#203c39] mt-2">
                Intelligence Platform
              </span>
            </h1>

            <p className="text-xl lg:text-2xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Navigate the complex world of global politics with AI-powered
              insights, real-time analysis, and comprehensive coverage of
              political events worldwide.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button
                asChild
                size="lg"
                className="bg-[#203c39] hover:bg-[#203c39]/90 text-white px-8 py-4 text-lg"
              >
                <Link href="/auth/sign-up" className="flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg border-2"
              >
                <Link
                  href="/trending-topics"
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-5 h-5" />
                  Explore Trending Topics
                </Link>
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-slate-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Free to start
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Real-time updates
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Global coverage
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Why Choose WorldPolitics.AI?
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
                  Interactive maps, charts, and timelines to understand
                  political trends
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

      {/* Trending Topics Preview */}
      <section className="py-20 bg-slate-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Stay Informed with Trending Topics
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto mb-8">
              Discover what's happening in politics across local, national, and
              international levels
            </p>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-[#203c39] text-[#203c39] hover:bg-[#203c39] hover:text-white"
            >
              <Link href="/trending-topics" className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                View All Trending Topics
              </Link>
            </Button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-lg">Local Politics</CardTitle>
                </div>
                <CardDescription>
                  Community-level political developments and local government
                  activities
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <CardTitle className="text-lg">National Politics</CardTitle>
                </div>
                <CardDescription>
                  Federal government, elections, and national policy
                  developments
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Globe className="w-5 h-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-lg">
                    International Politics
                  </CardTitle>
                </div>
                <CardDescription>
                  Global affairs, diplomacy, and international relations
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
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
                <CardDescription>
                  For serious political analysts
                </CardDescription>
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

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#203c39] to-slate-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">
            Ready to Navigate Global Politics?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Join thousands of users who rely on WorldPolitics.AI for accurate,
            timely, and comprehensive political intelligence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="bg-white text-[#203c39] hover:bg-slate-100 px-8 py-4 text-lg"
            >
              <Link href="/auth/sign-up" className="flex items-center gap-2">
                Start Your Free Account
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-[#203c39] px-8 py-4 text-lg"
            >
              <Link href="/trending-topics" className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Explore Trending Topics
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Image
                  src="/images/logos/icononly_transparent_nobuffer.png"
                  alt="World Politics Logo"
                  width={32}
                  height={32}
                />
                <span className="font-bold text-lg">WorldPolitics.AI</span>
              </div>
              <p className="text-slate-400 text-sm">
                The Truth Starts Here. Navigate global politics with AI-powered
                insights.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    href="/trending-topics"
                    className="hover:text-white transition-colors"
                  >
                    Trending Topics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/pricing"
                    className="hover:text-white transition-colors"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="hover:text-white transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/faqs"
                    className="hover:text-white transition-colors"
                  >
                    FAQs
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    href="/auth/sign-up"
                    className="hover:text-white transition-colors"
                  >
                    Sign Up
                  </Link>
                </li>
                <li>
                  <Link
                    href="/auth/login"
                    className="hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/profile"
                    className="hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    href="/privacy"
                    className="hover:text-white transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/code-of-conduct"
                    className="hover:text-white transition-colors"
                  >
                    Code of Conduct
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 WorldPolitics.AI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
