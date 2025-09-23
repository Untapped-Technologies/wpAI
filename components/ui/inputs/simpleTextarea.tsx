import { TextareaTypes } from './fieldInputTypes'

const SimpleTextarea = ({
  label,
  value,
  handleChange,
  classes,
  maxLength = 500,
  name
}: TextareaTypes) => {
  return (
    <label className="block text-sm text-left mt-5">
      {label}
      <textarea
        maxLength={maxLength}
        className={`w-full border border-gray-400 rounded p-2 mt-1 focus:outline-none focus:ring-[#254541] focus:ring-1 ${classes}`}
        value={value}
        rows={4}
        name={name}
        onChange={() => handleChange}
      />
    </label>
  )
}

export default SimpleTextarea
