type TypeTitle = {
  title: string
}

const TabHeaderTitle = ({ title }: TypeTitle) => {
  return (
    <h2 className="text-lg font-semibold text-left text-[#254541] mt-4">
      {title}
    </h2>
  )
}

export default TabHeaderTitle
