import { FieldInputTypes } from './fieldInputTypes'

interface SimpleInputProps extends FieldInputTypes {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  value?: string
  classes?: string
}

const SimpleInput = ({
  label,
  value,
  handleChange,
  classes,
  ...props
}: SimpleInputProps) => {
  return (
    <div className="flex flex-col justify-start">
      <label className="pt-4 text-left block mb-1 text-sm">{label}</label>
      <input
        className={`border rounded w-10/12 p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 ${classes}`}
        value={value}
        onChange={handleChange}
        {...props}
      />
    </div>
  )
}

export default SimpleInput
