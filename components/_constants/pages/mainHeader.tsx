import Image from 'next/image'

type MainType = {
  title: string
}

const MainHeader = ({ title }: MainType) => {
  return (
    <section className="relative overflow-hidden">
      <div className="container mx-auto px-0 py-10 lg:py-10">
        <div className="mx-auto">
          <Image
            src="/images/logos/logo.png"
            alt="World Politics logo"
            className="m-auto mb-8"
            height={263}
            width={537}
          />

          <p className="text-xl lg:text-2xl text-slate-600 leading-relaxed uppercase">
            {title}
          </p>
        </div>
      </div>
    </section>
  )
}

export default MainHeader
