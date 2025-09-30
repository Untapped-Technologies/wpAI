import SimpleTextarea from '@/components/ui/inputs/simpleTextarea'

const coreInputs = [
  {
    id: 1,
    label:
      'How do you plan to improve economic opportunity and job growth in your district/state/country?',
    name: 'core_1'
  },
  {
    id: 2,
    label:
      'How do you propose to protect voting rights and ensure fair elections?',
    name: 'core_2'
  },
  {
    id: 3,
    label:
      'How will you address rising housing costs and homelessness in your jurisdiction?',
    name: 'core_3'
  },
  {
    id: 4,
    label:
      'How will you promote equity and inclusion for historically marginalized communities?',
    name: 'core_4'
  },
  {
    id: 5,
    label: 'What are your top three policy priorities, and why?',
    name: 'core_5'
  },
  {
    id: 6,
    label:
      'What are your views on environmental protection and climate change policy?',
    name: 'core_6'
  },
  {
    id: 7,
    label:
      'What is your healthcare policy—how will you ensure affordability and access?',
    name: 'core_7'
  },
  {
    id: 8,
    label:
      'What is your position on public safety and criminal justice reform?',
    name: 'core_8'
  },
  {
    id: 9,
    label:
      'What is your stance on taxes and how will you manage the public budget?',
    name: 'core_9'
  },
  {
    id: 10,
    label: 'Where do you stand on funding and reforming public education?',
    name: 'core_10'
  }
]

interface CoreCandidateProps {
  formValues: { [key: string]: any }
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const CoreCandidate = ({ formValues, handleChange }: CoreCandidateProps) => {
  return (
    <div>
      <div className="flex flex-col justify-start ml-[-3px] pb-4 pl-4 pr-4">
        {coreInputs.map(item => (
          <SimpleTextarea
            classes="bg-white"
            handleChange={handleChange}
            key={item.id}
            label={item.label}
            maxLength={150}
            name={item.name}
            value={formValues[item.name]}
          />
        ))}
      </div>
    </div>
  )
}

export default CoreCandidate
