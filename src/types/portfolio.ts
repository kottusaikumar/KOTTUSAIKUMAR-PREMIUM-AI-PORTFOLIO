export interface LinkItem {
  label: string
  href: string
}

export interface Project {
  id: string
  number: string
  book: string
  title: string
  description: string
  focus: string
  highlight: string
  technologies: string[]
  details: Array<{
    label: string
    items: string[]
  }>
  video: string
  poster: string
  github: string
  live?: string
  placeholder?: boolean
}

export interface Experience {
  company: string
  role: string
  period: string
  logo: string
  contributions: string[]
  technologies: string[]
  verifiedResults: string[]
}

export interface Education {
  institution: string
  degree: string
  period: string
  result: string
  location?: string
}
