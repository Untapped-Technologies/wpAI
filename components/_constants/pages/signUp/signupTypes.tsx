import { Dispatch, SetStateAction } from 'react'

export type UserTypes = {
  id: string | null
  label: string | null
  description: string | null
}

export interface Preferences {
  country: string | null
  state: string | null
  postalCode: string | null
  email: string | null
  city: string | null
  latitude: number | null
  longitude: number | null
  emailNotifs: boolean | true
  smsNotifs: boolean | true
}

export type profileType = {
  formValues: {
    display_name: string
    email: string
    user_type_id: string
  }
  showSaveToast: () => void
  id: string
  value: string
  setOpen: (val: boolean) => void
  setFormValues: Dispatch<
    SetStateAction<{
      display_name: string
      email: string
      user_type_id: string
    }>
  >
  userTypes: UserTypes[]
}
