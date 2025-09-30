import SimpleTextarea from '@/components/ui/inputs/simpleTextarea'

const responseInputs = [
  {
    id: 1,
    name: 'response_1',
    label:
      'Do you support changes to how law enforcement is funded or trained? If so, what changes?'
  },
  {
    id: 2,
    name: 'response_2',
    label:
      "What should be the government's role in regulating tech companies and protecting personal data privacy?"
  },
  {
    id: 3,
    name: 'response_3',
    label:
      'What is your plan to support veterans and military families in your jurisdiction?'
  },
  {
    id: 4,
    name: 'response_4',
    label:
      'How will you address water access, quality, and conservation efforts?'
  },
  {
    id: 5,
    name: 'response_5',
    label:
      'Which constitutional rights do you believe are under threat, and how will you protect them?'
  }
]

interface ResponseCandidateProps {
  formValues: { [key: string]: any }
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const ResponseCandidate = ({
  formValues,
  handleChange
}: ResponseCandidateProps) => {
  return (
    <div>
      <div className="flex flex-col justify-start ml-[-3px] pb-4 pl-4 pr-4">
        {responseInputs.map(item => (
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

export default ResponseCandidate
