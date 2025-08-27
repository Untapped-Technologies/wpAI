import { ButtonTypes } from './buttonTypes'

const TextButton = ({ handleClick, label, classes }: ButtonTypes) => {
  return (
    <button
      className={`mt-4 text-sm underline ${classes}`}
      onClick={handleClick}
    >
      {label}
    </button>
  )
}

export default TextButton
