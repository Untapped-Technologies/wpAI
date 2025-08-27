type CheckboxTypes = {
  checkValue: boolean
  setValue: (val: boolean) => void
  label: string
}

const SimpleCheckbox = ({ checkValue, setValue, label }: CheckboxTypes) => {
  return (
    <label className="flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        checked={checkValue}
        onChange={e => setValue(e.target.checked)}
        className="w-4 h-4 text-[#254541] bg-gray-100 border-gray-300 rounded-sm accent-[#254541] checked:bg-[#254541] focus:ring-transparent checked:border-transparent focus:outline-none dark:focus:ring-[#254541] dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
      />
      {label}
    </label>
  )
}

export default SimpleCheckbox
