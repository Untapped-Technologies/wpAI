import SimpleTextarea from '@/components/ui/inputs/simpleTextarea'

const policyInputs = [
  {
    id: 1,
    name: 'policy_1',
    label:
      'What is your position on reproductive rights and access to abortion services?'
  },
  {
    id: 2,
    name: 'policy_2',
    label:
      'How should your jurisdiction respond to immigration and refugee resettlement?'
  },
  {
    id: 3,
    name: 'policy_3',
    label:
      'What specific laws or programs do you support to address gun violence?'
  },
  {
    id: 4,
    name: 'policy_4',
    label: 'How will you ensure transparency and accountability in government?'
  },
  {
    id: 5,
    name: 'policy_5',
    label:
      'What is your stance on transportation and infrastructure development?'
  },
  {
    id: 6,
    name: 'policy_6',
    label:
      'What actions will you take to support small businesses and local entrepreneurs?'
  },
  {
    id: 7,
    name: 'policy_7',
    label:
      'Do you support any changes to the minimum wage in your jurisdiction? Why or why not?'
  },
  {
    id: 8,
    name: 'policy_8',
    label:
      'How do you plan to address the opioid crisis and mental health services?'
  },
  {
    id: 9,
    name: 'policy_9',
    label:
      'What is your position on LGBTQ+ rights and protections under the law?'
  },
  {
    id: 10,
    name: 'policy_10',
    label:
      'How do you propose to balance development with preserving community character and history?'
  }
]

interface PoliciesCandidateProps {
  formValues: { [key: string]: any }
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}

const PolicyCandidate = ({
  formValues,
  handleChange
}: PoliciesCandidateProps) => {
  return (
    <div>
      <div className="flex flex-col justify-start ml-[-3px] pb-4 pl-4 pr-4">
        {policyInputs.map(item => (
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

export default PolicyCandidate
