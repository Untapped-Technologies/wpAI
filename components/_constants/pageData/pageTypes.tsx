export type PrefType = {
  city: string
  state: string
  country: string
  postalCode: string
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
  showSaveToast: (val: string) => void
}

export type Feature = {
  fid: number
  feature: string
  description: string
}

export type DataType = {
  data: {
    id: number
    title: string
    subtitle: string
    price: string
    timeframe: string
    features: Feature[]
    url: string
    trial: boolean
    trialButton: boolean
  }
}
