import { TextareaTypes } from './fieldInputTypes'

const SimpleTextarea = ({
  label,
  value,
  handleChange,
  classes,
  maxLength = 500
}: TextareaTypes) => {
  return (
    <label className="block text-sm text-left mt-5">
      {label}
      <textarea
        maxLength={maxLength}
        className={`border rounded w-10/12 p-2 mt-1 focus:outline-none focus:ring-[#254541] focus:ring-1 ${classes}`}
        value={value}
        rows={4}
        onChange={() => handleChange}
      />
    </label>
  )
}

export default SimpleTextarea
