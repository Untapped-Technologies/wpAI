interface SelectTypeProps {
  formValues: { user_type_id?: string | number }
  handleUserTypeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  userTypes: Array<{ id: string | number; label: string }>
}

const SelectType = ({
  formValues,
  handleUserTypeChange,
  userTypes
}: SelectTypeProps) => {
  return (
    <div className="flex flex-col gap-2 text-left">
      <label className="text-sm text-[#254541]">Account Type</label>
      <div className="bg-white text-[#254541]">
        <select
          name="user_type_id"
          value={formValues.user_type_id || ''}
          onChange={handleUserTypeChange}
          className="w-full rounded border p-2 bg-white text-[#254541] focus:outline-none focus:ring-2 focus:ring-[#254541]"
        >
          <option value="" disabled>
            Select account type
          </option>
          {userTypes.map(type => (
            <option key={type.id} value={type.id || ''}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SelectType
