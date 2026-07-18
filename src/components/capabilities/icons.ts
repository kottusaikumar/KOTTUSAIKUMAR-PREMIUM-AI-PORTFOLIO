import {
  siCplusplus,
  siDocker,
  siFastapi,
  siFlask,
  siGit,
  siGithub,
  siHtml5,
  siKeras,
  siLangchain,
  siMysql,
  siNumpy,
  siOpencv,
  siPandas,
  siPython,
  siReact,
  siScikitlearn,
  siSqlite,
  siTensorflow,
  type SimpleIcon,
} from 'simple-icons'

export interface BrandIcon {
  title: string
  hex: string
  path: string
}

// simple-icons ships one named export per brand (e.g. `siPython`). Skill
// data only stores the slug string, so we look it up dynamically instead of
// importing every brand by name — this keeps capabilities.ts as the single
// source of truth and means an unrecognised or renamed slug degrades to the
// text glyph fallback instead of breaking the build.
const iconLibrary: Record<string, SimpleIcon | undefined> = {
  siCplusplus,
  siDocker,
  siFastapi,
  siFlask,
  siGit,
  siGithub,
  siHtml5,
  siKeras,
  siLangchain,
  siMysql,
  siNumpy,
  siOpencv,
  siPandas,
  siPython,
  siReact,
  siScikitlearn,
  siSqlite,
  siTensorflow,
}

export function getBrandIcon(slug?: string): BrandIcon | undefined {
  if (!slug) return undefined
  const icon = iconLibrary[slug]
  if (!icon || typeof icon.path !== 'string') return undefined
  return icon
}
