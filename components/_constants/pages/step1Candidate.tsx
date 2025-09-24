import SimpleButton from '@/components/ui/buttons/simpleButton'
import TextButton from '@/components/ui/buttons/textButton'
import PlainCard from '@/components/ui/cards/plainCard'
import SimpleInput from '@/components/ui/inputs/simpleInput'
import SimpleTextarea from '@/components/ui/inputs/simpleTextarea'
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

type UserType = 'Citizen' | 'Candidate'

type Step1Types = {
  bio: string
  campaignWebsite: string
  district: string
  fullName: string
  handleNext: () => void
  handlePhotoChange: () => void
  jurisdiction: string[]
  officeTitle: string
  partyAffiliation: string
  router: AppRouterInstance
  setBio: (val: string) => void
  setCampaignWebsite: (val: string) => void
  setDistrict: (val: string) => void
  setFullName: (val: string) => void
  setOfficeTitle: (val: string) => void
  setPartyAffiliation: (val: string) => void
  setSocialMedia: (val: string) => void
  setType: React.Dispatch<React.SetStateAction<UserType>>
  socialMedia: string
  toggleJurisdiction: (val: string) => void
  type: string
}

const Step1Candidate = ({
  bio,
  campaignWebsite,
  district,
  fullName,
  handleNext,
  handlePhotoChange,
  jurisdiction,
  officeTitle,
  partyAffiliation,
  router,
  setBio,
  setCampaignWebsite,
  setDistrict,
  setFullName,
  setOfficeTitle,
  setPartyAffiliation,
  setSocialMedia,
  setType,
  socialMedia,
  toggleJurisdiction,
  type
}: Step1Types) => {
  return (
    <PlainCard
      classes="w-[800px] h-96"
      header={'Step 1: Candidate Details'}
      footer={
        <div className="flex justify-between mt-4">
          <TextButton
            label="Skip for now"
            handleClick={() => router.push('/')}
          />
          <SimpleButton handleClick={handleNext} label="Next" />
        </div>
      }
    >
      <div className="ml-1">
        <label className="pt-4 text-left block mb-1 text-sm">Type</label>
        <div className="flex gap-2">
          {['Citizen', 'Candidate'].map(t => (
            <button
              key={t}
              onClick={() => setType(t as any)}
              className={`px-3 py-1 rounded border ${
                type === t
                  ? 'rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white'
                  : 'text-gray-700'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <SimpleInput
          label="Full Name"
          value={fullName}
          handleChange={e => setFullName(e.target.value)}
        />
        <SimpleInput
          label="Office Sought (Title)"
          value={officeTitle}
          handleChange={e => setOfficeTitle(e.target.value)}
        />

        <div>
          <label className="pt-4 text-left block mb-1 text-sm">
            Jurisdiction
          </label>
          <div className="flex gap-3">
            {['Local', 'State', 'Federal'].map(j => (
              <label key={j} className="flex items-center gap-1">
                <input
                  type="checkbox"
                  checked={jurisdiction.includes(j)}
                  onChange={() => toggleJurisdiction(j)}
                />
                {j}
              </label>
            ))}
          </div>
        </div>

        <SimpleInput
          label="District / Area Represented"
          value={district}
          handleChange={e => setDistrict(e.target.value)}
        />

        <SimpleInput
          label="Campaign Website"
          value={campaignWebsite}
          handleChange={e => setCampaignWebsite(e.target.value)}
        />

        <SimpleInput
          label="Social Media Handles"
          value={socialMedia}
          handleChange={e => setSocialMedia(e.target.value)}
        />

        <SimpleInput
          label="Political Party Affiliation"
          value={partyAffiliation}
          handleChange={e => setPartyAffiliation(e.target.value)}
        />

        <div>
          <label className="pt-4 text-left block mb-1 text-sm">
            Photo Upload
          </label>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className="flex flex-col justify-start ml-[-3px]">
          <SimpleTextarea
            label="Short Bio (150 words max)"
            value={bio}
            name="bio"
            handleChange={e => setBio(e.target.value)}
            maxLength={150}
          />
        </div>
      </div>
    </PlainCard>
  )
}

export default Step1Candidate
