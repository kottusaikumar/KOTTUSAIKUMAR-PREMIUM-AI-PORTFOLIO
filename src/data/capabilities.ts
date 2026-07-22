// Verified skill + role data for the 02 / CAPABILITIES section.
// Source of truth for role-to-skill mapping — do not duplicate this
// mapping inside components.

export type RoleId = 'full-stack-ai' | 'ai-ml' | 'data-scientist' | 'data-analyst'

export type IconKind = 'brand' | 'glyph'

export interface Skill {
  id: string
  label: string
  /** Kind of icon to render. 'brand' looks up a simple-icons slug at
   * runtime (falls back to `glyph` automatically if not found). */
  iconKind: IconKind
  /** simple-icons export key, e.g. 'siPython'. Only used when iconKind === 'brand'. */
  iconSlug?: string
  /** Short text badge shown when no brand icon is available. */
  glyph: string
  roles: RoleId[]
}

export interface CapabilityRole {
  id: RoleId
  label: string
  featuredSkillIds: string[]
  /** Accent color used for the role's active and featured skill highlights. */
  accent: string
  accentSoft: string
}

export const roles: CapabilityRole[] = [
  {
    id: 'full-stack-ai',
    label: 'Full Stack AI Developer',
    featuredSkillIds: ['react', 'fastapi', 'python', 'docker'],
    accent: '#5EEAC0',
    accentSoft: 'rgba(94, 234, 192, 0.18)',
  },
  {
    id: 'ai-ml',
    label: 'AI/ML Engineer',
    featuredSkillIds: ['tensorflow', 'scikit-learn', 'deep-learning', 'python'],
    accent: '#3FA9F5',
    accentSoft: 'rgba(63, 169, 245, 0.18)',
  },
  {
    id: 'data-scientist',
    label: 'Data Scientist',
    featuredSkillIds: ['pandas', 'scikit-learn', 'tableau', 'python'],
    accent: '#E8C468',
    accentSoft: 'rgba(232, 196, 104, 0.18)',
  },
  {
    id: 'data-analyst',
    label: 'Data Analyst',
    featuredSkillIds: ['tableau', 'power-bi', 'sql', 'advanced-excel'],
    accent: '#FF8A5B',
    accentSoft: 'rgba(255, 138, 91, 0.18)',
  },
]

// Grid order is fixed and must never be reshuffled between role changes.
export const skills: Skill[] = [
  { id: 'python', label: 'Python', iconKind: 'brand', iconSlug: 'siPython', glyph: 'Py', roles: ['full-stack-ai', 'ai-ml', 'data-scientist', 'data-analyst'] },
  { id: 'cpp', label: 'C++', iconKind: 'brand', iconSlug: 'siCplusplus', glyph: 'C++', roles: [] },
  { id: 'sql', label: 'SQL', iconKind: 'glyph', glyph: 'SQL', roles: ['data-scientist', 'data-analyst'] },
  { id: 'machine-learning', label: 'Machine Learning', iconKind: 'glyph', glyph: 'ML', roles: ['ai-ml', 'data-scientist'] },
  { id: 'deep-learning', label: 'Deep Learning', iconKind: 'glyph', glyph: 'DL', roles: ['ai-ml'] },
  { id: 'nlp', label: 'NLP', iconKind: 'glyph', glyph: 'NLP', roles: ['ai-ml'] },
  { id: 'react', label: 'React.js', iconKind: 'brand', iconSlug: 'siReact', glyph: 'Rx', roles: ['full-stack-ai'] },
  { id: 'html5', label: 'HTML5', iconKind: 'brand', iconSlug: 'siHtml5', glyph: 'H5', roles: ['full-stack-ai'] },
  { id: 'css3', label: 'CSS3', iconKind: 'brand', iconSlug: 'siCss3', glyph: 'C3', roles: ['full-stack-ai'] },
  { id: 'tensorflow', label: 'TensorFlow', iconKind: 'brand', iconSlug: 'siTensorflow', glyph: 'TF', roles: ['ai-ml', 'data-scientist'] },
  { id: 'keras', label: 'Keras', iconKind: 'brand', iconSlug: 'siKeras', glyph: 'Kr', roles: ['ai-ml'] },
  { id: 'pandas', label: 'Pandas', iconKind: 'brand', iconSlug: 'siPandas', glyph: 'Pd', roles: ['ai-ml', 'data-scientist', 'data-analyst'] },
  { id: 'numpy', label: 'NumPy', iconKind: 'brand', iconSlug: 'siNumpy', glyph: 'Np', roles: ['ai-ml', 'data-scientist', 'data-analyst'] },
  { id: 'scikit-learn', label: 'Scikit-learn', iconKind: 'brand', iconSlug: 'siScikitlearn', glyph: 'SK', roles: ['ai-ml', 'data-scientist'] },
  { id: 'langchain', label: 'LangChain', iconKind: 'brand', iconSlug: 'siLangchain', glyph: 'LC', roles: [] },
  { id: 'faiss', label: 'FAISS', iconKind: 'glyph', glyph: 'FS', roles: [] },
  { id: 'fastapi', label: 'FastAPI', iconKind: 'brand', iconSlug: 'siFastapi', glyph: 'FA', roles: ['full-stack-ai'] },
  { id: 'flask', label: 'Flask', iconKind: 'brand', iconSlug: 'siFlask', glyph: 'Fl', roles: ['full-stack-ai'] },
  { id: 'opencv', label: 'OpenCV', iconKind: 'brand', iconSlug: 'siOpencv', glyph: 'CV', roles: ['ai-ml'] },
  { id: 'mysql', label: 'MySQL', iconKind: 'brand', iconSlug: 'siMysql', glyph: 'My', roles: ['full-stack-ai'] },
  { id: 'sqlite', label: 'SQLite', iconKind: 'brand', iconSlug: 'siSqlite', glyph: 'Sq', roles: ['full-stack-ai'] },
  { id: 'tableau', label: 'Tableau', iconKind: 'brand', iconSlug: 'siTableau', glyph: 'Tb', roles: ['data-scientist', 'data-analyst'] },
  { id: 'power-bi', label: 'Power BI', iconKind: 'brand', iconSlug: 'siPowerbi', glyph: 'BI', roles: ['data-scientist', 'data-analyst'] },
  { id: 'advanced-excel', label: 'Advanced Excel', iconKind: 'brand', iconSlug: 'siMicrosoftexcel', glyph: 'Xl', roles: ['data-analyst'] },
  { id: 'docker', label: 'Docker', iconKind: 'brand', iconSlug: 'siDocker', glyph: 'Dk', roles: ['full-stack-ai'] },
  { id: 'git', label: 'Git', iconKind: 'brand', iconSlug: 'siGit', glyph: 'Gt', roles: ['full-stack-ai'] },
  { id: 'github', label: 'GitHub', iconKind: 'brand', iconSlug: 'siGithub', glyph: 'Gh', roles: ['full-stack-ai'] },
  { id: 'vscode', label: 'VS Code', iconKind: 'brand', iconSlug: 'siVisualstudiocode', glyph: 'VS', roles: ['full-stack-ai'] },
  { id: 'matplotlib', label: 'Matplotlib', iconKind: 'glyph', glyph: 'Mp', roles: ['data-scientist', 'data-analyst'] },
  { id: 'seaborn', label: 'Seaborn', iconKind: 'glyph', glyph: 'Sb', roles: ['data-scientist', 'data-analyst'] },
  { id: 'bm25', label: 'BM25', iconKind: 'glyph', glyph: 'BM', roles: [] },
  { id: 'rest-apis', label: 'REST APIs', iconKind: 'glyph', glyph: 'API', roles: ['full-stack-ai'] },
]

export const certifications = [
  { title: 'Data Science with AI Internship', issuer: 'Vajra.ai', href: undefined as string | undefined },
  { title: 'Data Science BootCamp', issuer: 'GeeksforGeeks', href: undefined as string | undefined },
]

export function skillsForRole(roleId: RoleId): Set<string> {
  const set = new Set<string>()
  for (const skill of skills) {
    if (skill.roles.includes(roleId)) set.add(skill.id)
  }
  return set
}
