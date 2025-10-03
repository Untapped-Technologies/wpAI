import { ButtonTypes } from './buttonTypes'

const SimpleButton = ({ handleClick, label, classes }: ButtonTypes) => {
  return (
    <button
      onClick={handleClick}
      className={`rounded border border-[#254541] bg-[#254541] px-4 py-2 text-white hover:text-[#254541] hover:border-[#254541] hover:bg-white ${classes} rounded-md`}
    >
      {label}
    </button>
  )
}

export default SimpleButton
