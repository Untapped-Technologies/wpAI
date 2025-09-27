export type PrefType = {
  city: string
  state: string
  country: string
  postalCode: string
  timezone: string
  smsNotifs: boolean
  emailNotifs: boolean
  avatar: string
}

export type UserType = {
  id: string
  setOpen: (val: boolean) => void
  setPrefs: (val: PrefType) => void
  prefs: PrefType
  userType: string
}
