import MainHeader from '@/components/_constants/pages/mainHeader'
import AuthAwareFooter from '@/components/auth-aware-footer'
import AuthAwareNavigation from '@/components/auth-aware-navigation'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      <AuthAwareNavigation />
      <div className="max-w-4xl mx-auto mb-8">
        <MainHeader title="About Us" />
        <div className="text-2xl text-left text-[#203c39] mb-2">
          Empowering Political Understanding, Worldwide
        </div>
        <div className="text-left space-y-4 text-[#203c39]">
          <p>
            <span className="font-bold">WorldPolitics.ai</span> is a technology
            platform designed to change the way people connect with
            politics—whether in their local community, across the country, or
            around the world. Using advanced artificial intelligence, we provide
            up-to-the-minute, fact-based political information that’s simple to
            understand for voters, teachers, journalists, researchers, and
            decision-makers.
          </p>

          <p>
            In the United States, our platform explains what’s happening in
            Congress, shares updates on state laws, breaks down political
            viewpoints, and makes sense of policy changes. We take complex
            government language and turn it into clear, easy-to-read
            information.
          </p>

          <p>
            Around the globe, WorldPolitics.ai tracks major events, official
            government statements, diplomatic reports, and trustworthy news
            sources. We then deliver short summaries, analyze the tone and
            meaning, and highlight trends that may affect the future.
          </p>

          <p>
            We believe the best decisions are made when people have clear,
            honest, and trustworthy information. Our goal is to give everyone
            the tools they need to understand the political world around them.
          </p>

          <div>
            <h2 className="text-lg font-semibold mt-6 mb-2">Key Features:</h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                AI-generated summaries of legislation, debates, and political
                events
              </li>
              <li>
                Sentiment and stance analysis of political figures and policy
                proposals
              </li>
              <li>Side-by-side comparisons of political positions</li>
              <li>Educator-friendly tools for civic and global awareness</li>
              <li>Journalist dashboards for source-backed narratives</li>
              <li>
                Predictive trend modeling based on geopolitical developments
              </li>
            </ul>
          </div>
        </div>
      </div>
      <AuthAwareFooter />
    </div>
  )
}
