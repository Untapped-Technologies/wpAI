import { ToggleGroup } from 'radix-ui'
import { ReactNode } from 'react'

const toggleGroupItemClasses =
  'flex size-20 items-center justify-center bg-white border-2 border-gray-300 rounded px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-50 data-[state=on]:bg-[#203c39] data-[state=on]:text-white data-[state=on]:border-[#203c39] focus:shadow-[0_0_0_2px] focus:shadow-black focus:outline-none'

type TypeGroup = {
  groupTitle: string
  defaultValue: string
  groupData: {
    value: string
    label: string
    icon?: ReactNode
  }[]
  onValueChange?: (value: string) => void
}

const ButtonGroup = ({
  groupTitle,
  groupData,
  defaultValue,
  onValueChange
}: TypeGroup) => (
  <ToggleGroup.Root
    className="inline-flex text-black rounded-lg justify-center gap-2 p-1"
    type="single"
    defaultValue={defaultValue}
    onValueChange={onValueChange}
    aria-label={groupTitle}
  >
    {groupData.map((gd, ndx) => (
      <ToggleGroup.Item
        className={toggleGroupItemClasses}
        key={ndx}
        value={gd.value}
        aria-label={gd.label}
      >
        {gd.label}
      </ToggleGroup.Item>
    ))}
  </ToggleGroup.Root>
)

export default ButtonGroup
