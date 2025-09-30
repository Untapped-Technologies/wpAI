import SimpleInput from '@/components/ui/inputs/simpleInput'
import SimpleTextarea from '@/components/ui/inputs/simpleTextarea'

const jurisdiction = ['Local', 'State', 'Federal']
interface GeneralProps {
  formValues: {
    affiliation: string
    bio: string
    district: string
    fullname: string
    jurisdiction: string[]
    office: string
    photo: string
    socialMedia: {}
    user_type: string
    website: string
  }
  handleChange: (
    e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => void
}
const General = ({ formValues, handleChange }: GeneralProps) => {
  return (
    <div className="pb-4 pl-4 pr-4">
      <SimpleInput
        label="Full Name"
        name="fullname"
        value={formValues.fullname}
        handleChange={handleChange}
      />
      <SimpleInput
        label="Office Sought (Title)"
        value={formValues.office}
        name="office"
        handleChange={handleChange}
      />
      <div>
        <label className="pt-4 text-left block mb-1 text-sm">
          Jurisdiction
        </label>
        <div className="flex gap-3">
          {jurisdiction.map(j => (
            <label key={j} className="flex items-center gap-1">
              <input
                type="checkbox"
                name="jurisdiction"
                value={j}
                checked={formValues.jurisdiction.includes(j)}
                onChange={handleChange}
              />
              {j}
            </label>
          ))}
        </div>
      </div>
      <SimpleInput
        label="District / Area Represented"
        value={formValues.district}
        name="district"
        handleChange={handleChange}
      />

      <SimpleInput
        label="Campaign Website"
        value={formValues.website}
        name="website"
        handleChange={handleChange}
      />
      <SimpleInput
        label="Political Party Affiliation"
        value={formValues.affiliation}
        name="affiliation"
        handleChange={handleChange}
      />
      <div className="flex flex-col justify-start ml-[-3px]">
        <SimpleTextarea
          label="Short Bio (150 words max)"
          value={formValues.bio}
          handleChange={handleChange}
          maxLength={150}
          name="bio"
          classes="bg-white"
        />
      </div>
    </div>
  )
}

export default General
