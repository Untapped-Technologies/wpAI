export interface FieldInputTypes extends React.ComponentPropsWithoutRef<'div'> {
  label?: string
  value?: string
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  classes?: string
}
export interface TextareaTypes extends React.ComponentPropsWithoutRef<'div'> {
  label: string
  value: string
  handleChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  classes?: string
  maxLength?: number
  name: string
}
