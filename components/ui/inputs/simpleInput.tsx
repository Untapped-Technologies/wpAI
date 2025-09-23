import { FieldInputTypes } from './fieldInputTypes'

interface SimpleInputProps extends FieldInputTypes {
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  value?: string
  classes?: string
  name?: string
}

const SimpleInput = ({
  label,
  name,
  value,
  handleChange,
  classes,
  ...props
}: SimpleInputProps) => {
  return (
    <div className="flex flex-col justify-start">
      <label className="pt-4 text-left block mb-1 text-sm">{label}</label>
      <input
        className={`border rounded border-gray-400 w-10/12 p-2 focus:outline-none focus:ring-[#254541] focus:ring-1 bg-white ${classes}`}
        value={value}
        onChange={handleChange}
        name={name}
        {...props}
      />
    </div>
  )
}

export default SimpleInput
