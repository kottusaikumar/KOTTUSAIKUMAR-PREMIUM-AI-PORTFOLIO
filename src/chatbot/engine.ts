import knowledge from '../data/chatbotKnowledge.json'
import type { ChatbotReply, IntentRule } from './types'

interface Project {
  id: string
  name: string
  focus: string
  summary: string
  technologies: string[]
  features?: string[]
  github?: string
}

interface Education {
  qualification: string
  institution: string
  period: string
  grade: string
  status: string
}

const PROFESSIONAL_SCOPE =
  'I can answer questions about Kottu Saikumar’s professional background, skills, projects, education, experience, availability, and public contact details.'

const UNKNOWN_PROFESSIONAL =
  'That information is not included in my verified profile. You can ask about my skills, projects, education, experience, availability, or contact details.'

const normalize = (value: string): string => {
  const base = value
    .toLowerCase()
    .replace(/[’']/g, '')
    .replace(/[^a-z0-9+#./\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  const replacements: Array<[RegExp, string]> = [
    [/\bwhr\b/g, 'where'],
    [/\bur\b/g, 'your'],
    [/\bu\b/g, 'you'],
    [/\babt\b/g, 'about'],
    [/\bknw\b/g, 'know'],
    [/\btel\b/g, 'tell'],
    [/\bprojct\b/g, 'project'],
    [/\bproj\b/g, 'project'],
    [/\bexp\b/g, 'experience'],
    [/\bexperiance\b/g, 'experience'],
    [/\byer\b/g, 'year'],
    [/\byrs\b/g, 'years'],
    [/\bskils\b/g, 'skills'],
    [/\bwat\b/g, 'what'],
    [/\br\b/g, 'are'],
  ]

  return replacements.reduce((acc, [pattern, replacement]) => acc.replace(pattern, replacement), base).replace(/\s+/g, ' ').trim()
}

const tokens = (value: string): string[] => normalize(value).split(' ').filter(Boolean)

const levenshtein = (a: string, b: string): number => {
  if (a === b) return 0
  if (!a.length) return b.length
  if (!b.length) return a.length
  const previous = Array.from({ length: b.length + 1 }, (_, index) => index)
  const current = new Array<number>(b.length + 1)
  for (let i = 1; i <= a.length; i += 1) {
    current[0] = i
    for (let j = 1; j <= b.length; j += 1) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      current[j] = Math.min(current[j - 1] + 1, previous[j] + 1, previous[j - 1] + cost)
    }
    for (let j = 0; j <= b.length; j += 1) previous[j] = current[j]
  }
  return previous[b.length]
}

const similarity = (a: string, b: string): number => {
  const left = normalize(a)
  const right = normalize(b)
  if (!left || !right) return 0
  if (left === right) return 1
  if (left.includes(right) || right.includes(left)) {
    return Math.min(left.length, right.length) / Math.max(left.length, right.length) + 0.2
  }
  return 1 - levenshtein(left, right) / Math.max(left.length, right.length)
}

const hasAny = (query: string, values: string[]): boolean => {
  const q = normalize(query)
  return values.some((value) => q.includes(normalize(value)))
}

const formatList = (items: string[]): string => items.join(', ')

const allSkills = (): string[] => Object.values(knowledge.skills).flatMap((value) => value as string[])

const technologiesAnswer = (): string => {
  const highlights = [
    'Python',
    'React.js',
    'TypeScript',
    'Vite',
    'FastAPI',
    'Flask',
    'TensorFlow',
    'Keras',
    'OpenCV',
    'Pandas',
    'NumPy',
    'Scikit-learn',
    'LangChain',
    'FAISS',
    'BM25',
    'SQL',
    'Streamlit',
    'Plotly',
    'Tableau',
    'Power BI',
    'Docker',
  ].filter((technology) => allSkills().includes(technology))

  return `Across my verified projects, I have used ${formatList(highlights)}. Ask me about a specific project if you would like its exact technology stack.`
}

const profileSummary = (): string => knowledge.candidate.professional_summary.join(' ')

const educationAnswer = (): string =>
  (knowledge.education as Education[])
    .filter((item) => item.status === 'confirmed')
    .map((item) => `${item.qualification} from ${item.institution} (${item.period}) with ${item.grade}.`)
    .join(' ')

const experienceAnswer = (): string =>
  `I have approximately ${knowledge.verified_metrics.internship_experience} of Data Science internship experience at Vajra.ai. For full-time roles, I am a fresher with hands-on project and internship experience.`

const projectsAnswer = (): string => {
  const projects = knowledge.projects as Project[]
  const selected = projects.slice(0, 5).map((project) => project.name).join(', ')
  const additional = projects.slice(5).map((project) => project.name).join(', ')
  return `I have completed many projects. This portfolio highlights five selected projects: ${selected}. I can also discuss additional work, including ${additional}.`
}

const projectAnswer = (project: Project): string => {
  const features = project.features?.slice(0, 3).join(' ') ?? ''
  const github = project.github ? ` GitHub: ${project.github}` : ''
  return `${project.name}: ${project.summary} Key technologies include ${formatList(
    project.technologies.slice(0, 10),
  )}. ${features}${github}`.trim()
}

const skillAliases: Record<string, string[]> = {
  python: ['python', 'pythn'],
  sql: ['sql', 'mysql'],
  react: ['react', 'reactjs', 'react.js'],
  typescript: ['typescript', 'ts'],
  javascript: ['javascript', 'js'],
  fastapi: ['fastapi', 'fast api'],
  flask: ['flask'],
  docker: ['docker', 'container'],
  github: ['github', 'git hub'],
  powerbi: ['power bi', 'powerbi'],
  excel: ['excel', 'advanced excel'],
  machinelearning: ['machine learning', 'ml'],
  deeplearning: ['deep learning', 'dl'],
  nlp: ['nlp', 'natural language processing'],
  rag: ['rag', 'retrieval augmented generation', 'retrieval-augmented generation'],
  llm: ['llm', 'large language model', 'generative ai', 'genai'],
  computerVision: ['computer vision', 'cv', 'image classification'],
  tableau: ['tableau'],
  oop: ['oop', 'object oriented programming'],
}

const detectSkill = (query: string): string | null => {
  const q = normalize(query)
  for (const aliases of Object.values(skillAliases)) {
    const exact = aliases.find((alias) => q.includes(normalize(alias)))
    if (exact) {
      const canonical = allSkills().find((skill) =>
        aliases.some((alias) => normalize(skill).includes(normalize(alias))),
      )
      return canonical ?? aliases[0]
    }
  }
  let bestSkill: string | null = null
  let bestScore = 0
  for (const skill of allSkills()) {
    for (const token of tokens(q)) {
      const score = similarity(token, skill)
      if (score > bestScore) {
        bestScore = score
        bestSkill = skill
      }
    }
  }
  return bestScore >= 0.82 ? bestSkill : null
}

const skillAnswer = (skill: string): string => {
  const normalizedSkill = normalize(skill)
  const projectMatches = (knowledge.projects as Project[]).filter((project) =>
    project.technologies.some(
      (technology) =>
        normalize(technology).includes(normalizedSkill) ||
        normalizedSkill.includes(normalize(technology)),
    ),
  )
  const evidence = projectMatches.length
    ? `I used it in projects including ${projectMatches
        .slice(0, 3)
        .map((project) => project.name)
        .join(', ')}.`
    : 'It is included in my verified technical skill set.'
  return `Yes, I have experience with ${skill}. ${evidence}`
}

const findProject = (query: string): Project | null => {
  const q = normalize(query)
  const aliases: Record<string, string[]> = {
    ai_resume_screening_system: ['resume screening', 'resume scanner', 'ai resume'],
    hybrid_rag_document_assistant: ['hybrid rag', 'document assistant', 'rag project', 'rag chatbot'],
    food_spoilage_detection_chatbot: ['food spoilage', 'food chatbot', 'spoiled food'],
    weapon_detection_identification: ['weapon detection', 'weapon identification'],
    tradepro_trading_dashboard: ['tradepro', 'trading dashboard', 'stock dashboard'],
    instagram_engagement_analysis: ['instagram', 'engagement analysis', 'content performance'],
    drug_effectiveness_predictor: ['drug effectiveness', 'drug prediction'],
    ocr_multilingual_audio: ['ocr', 'optical text', 'multilingual audio', 'text to speech'],
  }

  for (const project of knowledge.projects as Project[]) {
    const candidates = [project.name, ...(aliases[project.id] ?? [])]
    if (candidates.some((candidate) => q.includes(normalize(candidate)))) return project
  }

  let bestProject: Project | null = null
  let bestScore = 0
  for (const project of knowledge.projects as Project[]) {
    const score = similarity(q, project.name)
    if (score > bestScore) {
      bestScore = score
      bestProject = project
    }
  }
  return bestScore >= 0.72 ? bestProject : null
}

const faqRules: IntentRule[] = knowledge.faq
  .filter((item) => item.id !== 'unknown_skill')
  .map((item, index) => ({
    id: item.id,
    patterns: item.question_patterns,
    answer: item.answer ?? UNKNOWN_PROFESSIONAL,
    priority: 500 - index,
  }))

const behavioralRules: IntentRule[] = [
  ...knowledge.behavioral_answers.map((item, index) => ({
    id: `behavior_${index}`,
    patterns: [item.question],
    answer: item.answer,
    priority: 420 - index,
  })),
  {
    id: 'feedback',
    patterns: ['how do you receive feedback', 'how do you handle feedback', 'are you open to feedback'],
    answer:
      'I receive feedback positively and treat it as an opportunity to improve. I listen carefully, ask questions when clarification is needed, apply the feedback to my work, and use it to avoid repeating the same mistakes.',
    priority: 470,
  },
  {
    id: 'team_disagreement',
    patterns: ['how do you resolve disagreements in a team', 'how do you handle conflict', 'team disagreement'],
    answer:
      'I resolve disagreements by first understanding each person’s viewpoint and keeping the discussion focused on the project goal. I prefer using facts, testing options when possible, and agreeing on the solution that best supports the team and the final result.',
    priority: 469,
  },
  {
    id: 'learn_new_technology',
    patterns: ['how do you learn a new technology', 'how do you learn new tools', 'learning a new technology'],
    answer:
      'I learn a new technology by first understanding its core concepts and official documentation, then building a small practical example. After that, I apply it to a real project, test different cases, fix mistakes, and gradually improve my understanding through hands-on use.',
    priority: 468,
  },
  {
    id: 'multiple_tasks',
    patterns: ['how do you manage multiple tasks', 'how do you multitask', 'manage priorities'],
    answer:
      'I manage multiple tasks by listing them clearly, prioritizing them based on urgency and impact, and breaking larger work into smaller steps. I track progress, avoid switching unnecessarily between tasks, and communicate early if priorities or timelines need adjustment.',
    priority: 467,
  },
  {
    id: 'technical_problem',
    patterns: ['how do you solve a technical problem', 'technical problem solving', 'debug a problem'],
    answer:
      'I solve a technical problem by first reproducing it clearly, checking logs or errors, and breaking the issue into smaller parts. Then I test possible causes one by one, verify the fix, and document what changed so the same issue is easier to handle later.',
    priority: 466,
  },
  {
    id: 'teamwork',
    patterns: ['how do you work in a team', 'teamwork', 'work with a team', 'team player'],
    answer:
      'I work well in a team by communicating clearly, understanding responsibilities, sharing progress, and helping solve problems collaboratively. I am open to feedback, comfortable learning from others, and focused on completing the shared goal.',
    priority: 464,
  },
]

const directRules: IntentRule[] = [
  { id: 'name', patterns: ['what is your name', 'your name', 'who is kottu saikumar', 'name'], answer: `My name is ${knowledge.candidate.full_name}.`, priority: 1000 },
  { id: 'portfolio_url', patterns: ['portfolio url', 'portfolio link', 'show portfolio', 'your website'], answer: `My portfolio is available at: ${knowledge.candidate.public_links.portfolio}`, priority: 990 },
  { id: 'contact', patterns: ['contact details', 'how can i contact you', 'contact you', 'email and phone', 'contact information'], answer: `Email: ${knowledge.candidate.email}. Phone: ${knowledge.candidate.phone}. LinkedIn: ${knowledge.candidate.public_links.linkedin}. GitHub: ${knowledge.candidate.public_links.github}.`, priority: 980 },
  { id: 'email', patterns: ['email address', 'your email', 'mail id'], answer: `My email address is ${knowledge.candidate.email}.`, priority: 979 },
  { id: 'phone', patterns: ['phone number', 'your phone', 'mobile number'], answer: `My public contact number is ${knowledge.candidate.phone}.`, priority: 978 },
  { id: 'linkedin', patterns: ['linkedin profile', 'your linkedin', 'linkedin url'], answer: `My LinkedIn profile is ${knowledge.candidate.public_links.linkedin}`, priority: 977 },
  { id: 'github', patterns: ['github profile', 'your github', 'github url', 'repositories'], answer: `My GitHub profile is ${knowledge.candidate.public_links.github}`, priority: 976 },
  { id: 'leetcode', patterns: ['leetcode profile', 'your leetcode', 'leetcode url'], answer: `My LeetCode profile is ${knowledge.candidate.public_links.leetcode}`, priority: 975 },
  { id: 'location', patterns: ['where are you located', 'current location', 'your location', 'based in', 'where do you live', 'where are you based'], answer: `I am currently based in ${knowledge.candidate.location}.`, priority: 970 },
  { id: 'education', patterns: ['education', 'academic background', 'qualification', 'studies'], answer: educationAnswer, priority: 960 },
  { id: 'experience', patterns: ['work experience', 'professional experience', 'internship experience', 'what experience do you have', 'what is your experience', 'what is your work experience', 'how much experience', 'how many years experience', 'experience at vajra', 'vajra.ai'], answer: experienceAnswer, priority: 950 },
  { id: 'availability', patterns: ['when can you join', 'available to join', 'immediate joiner', 'notice period'], answer: `I am an ${knowledge.career_preferences.availability.toLowerCase()} and my notice period is ${knowledge.career_preferences.notice_period.toLowerCase()}.`, priority: 940 },
  { id: 'relocation', patterns: ['willing to relocate', 'can you relocate', 'open to relocation'], answer: knowledge.career_preferences.relocation, priority: 939 },
  { id: 'roles', patterns: ['what roles are you looking for', 'preferred roles', 'job roles', 'career roles'], answer: `My preferred roles, in order, are ${formatList(knowledge.career_preferences.preferred_role_order)}.`, priority: 938 },
  { id: 'salary', patterns: ['salary expectation', 'expected salary', 'expected ctc', 'compensation expectation'], answer: `My compensation expectations are ${knowledge.career_preferences.compensation.toLowerCase()}.`, priority: 937 },
  { id: 'summary', patterns: ['tell me about yourself', 'introduce yourself', 'professional summary', 'about you'], answer: profileSummary, priority: 930 },
  { id: 'technologies', patterns: ['what technologies did you use', 'which technologies did you use', 'what technology did you use', 'technologies used', 'technology stack', 'tech stack', 'tools and technologies'], answer: technologiesAnswer, priority: 921 },
  { id: 'skills', patterns: ['what are your skills', 'strongest skills', 'technical skills', 'skill set', 'technologies you know', 'wat r ur skils'], answer: `My core skills include ${formatList(allSkills())}.`, priority: 920 },
  { id: 'certifications', patterns: ['certifications', 'certificates', 'courses completed'], answer: `My certifications include ${knowledge.certifications.map((item) => `${item.name} by ${item.issuer}`).join('; ')}.`, priority: 910 },
  { id: 'projects', patterns: ['show me your projects', 'list your projects', 'what projects have you built', 'project list'], answer: projectsAnswer, priority: 700 },
]

const rules = [...directRules, ...faqRules, ...behavioralRules].sort((left, right) => right.priority - left.priority)

const privatePatterns = ['father', 'mother', 'wife', 'husband', 'family phone', 'home address', 'aadhaar', 'aadhar', 'pan card', 'bank account', 'password', 'otp', 'private number']
const greetingPatterns = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening']

const scoreRule = (query: string, rule: IntentRule): number => {
  const q = normalize(query)
  let score = 0
  for (const pattern of rule.patterns) {
    const p = normalize(pattern)
    if (q === p) score = Math.max(score, 1)
    else if (q.includes(p)) score = Math.max(score, 0.96)
    else {
      const stopWords = new Set(['what', 'is', 'your', 'how', 'do', 'you', 'are', 'a', 'an', 'the', 'in', 'to', 'me', 'about', 'can', 'tell', 'of', 'with'])
      const queryWords = new Set(tokens(q).filter((word) => !stopWords.has(word)))
      const patternWords = tokens(p).filter((word) => !stopWords.has(word))
      const overlap = patternWords.filter((word) => queryWords.has(word)).length
      const overlapScore = overlap / Math.max(patternWords.length, 1)
      const fuzzyScore = similarity(q, p)
      score = Math.max(score, overlapScore * 0.84 + fuzzyScore * 0.16)
    }
  }
  return Math.min(score, 1)
}

const suggestionsFor = (intent: string): string[] => {
  if (intent.startsWith('project')) return ['What technologies did you use?', 'Show all projects', 'What is your GitHub?']
  if (intent === 'skills') return ['Do you know FastAPI?', 'Tell me about your RAG project', 'What are your strongest skills?']
  return ['Tell me about yourself', 'What are your skills?', 'What projects have you built?']
}

export const getChatbotReply = (input: string): ChatbotReply => {
  const query = normalize(input)

  if (!query) return { text: 'Please enter a question about my professional profile.', intent: 'empty', confidence: 1, suggestions: suggestionsFor('empty') }

  if (privatePatterns.some((pattern) => query.includes(normalize(pattern)))) {
    return { text: PROFESSIONAL_SCOPE, intent: 'professional_scope', confidence: 1, suggestions: suggestionsFor('professional_scope') }
  }

  if (greetingPatterns.some((pattern) => query === normalize(pattern))) {
    return { text: `Hello! I’m ${knowledge.candidate.full_name}’s portfolio assistant. Ask me about his skills, projects, education, experience, availability, or public contact details.`, intent: 'greeting', confidence: 1, suggestions: suggestionsFor('greeting') }
  }

  const project = findProject(query)
  const projectQuestion = hasAny(query, ['project', 'built', 'developed', 'github', 'about']) || project !== null
  if (project && projectQuestion && !hasAny(query, ['all projects', 'list projects', 'show projects'])) {
    return { text: projectAnswer(project), intent: `project_${project.id}`, confidence: 0.98, suggestions: suggestionsFor('project') }
  }

  const skill = detectSkill(query)
  const asksAboutSkill = hasAny(query, ['do you know', 'experience with', 'skill', 'worked with', 'proficient', 'familiar with'])
  if (skill && asksAboutSkill) {
    return { text: skillAnswer(skill), intent: `skill_${normalize(skill).replace(/\s+/g, '_')}`, confidence: 0.95, suggestions: suggestionsFor('skills') }
  }

  let winner: IntentRule | null = null
  let bestScore = 0
  for (const rule of rules) {
    const score = scoreRule(query, rule)
    if (score > bestScore) {
      bestScore = score
      winner = rule
    }
  }

  if (winner && bestScore >= 0.57) {
    const answer = typeof winner.answer === 'function' ? winner.answer() : winner.answer
    return { text: answer, intent: winner.id, confidence: Number(bestScore.toFixed(3)), suggestions: suggestionsFor(winner.id) }
  }

  const broadSkill = detectSkill(query)
  if (broadSkill) {
    return { text: skillAnswer(broadSkill), intent: `skill_${normalize(broadSkill).replace(/\s+/g, '_')}`, confidence: 0.84, suggestions: suggestionsFor('skills') }
  }

  return { text: UNKNOWN_PROFESSIONAL, intent: 'fallback', confidence: 0, suggestions: suggestionsFor('fallback') }
}
