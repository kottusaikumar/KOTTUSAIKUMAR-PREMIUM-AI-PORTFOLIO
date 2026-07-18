import type { Education, Experience, LinkItem, Project } from '../types/portfolio'

export const personal = {
  name: 'Kottu Saikumar',
  role: 'Full-Stack AI Developer',
  location: 'Hyderabad, India',
  email: 'kottusaikumar2003@gmail.com',
  heroLine: 'Engineering intelligence into usable systems.',
  heroNote: 'AI products, data systems, and interfaces - built end to end.',
  resume: 'https://drive.google.com/file/d/1dinXqMl82nn4RZt2OMEf1ajdir6K6NeH/view?usp=sharing',
  audio: 'audio/about-intro.mp3',
}

export const about = [
  "I'm a passionate Full-Stack AI Developer with a strong foundation in Python, Machine Learning, and AI Engineering. I enjoy combining data-driven intelligence with clean, user-friendly interfaces to build impactful and scalable applications.",
  "My journey began during my engineering studies, where I developed a deep interest in Data Science and Artificial Intelligence. Since then, I've continuously expanded my skills across Machine Learning, Deep Learning, NLP, and full-stack development.",
  'Beyond coding, I enjoy exploring AI research trends, experimenting with ML models, and building practical projects that solve real-world problems. I actively maintain my work on GitHub and continuously learn from the evolving tech ecosystem.',
]

export const roles = ['Data Scientist', 'AI/ML Engineer', 'Full-Stack AI Developer', 'Data Analyst']

export const experience: Experience[] = [
  {
    company: 'Vajra.ai', role: 'Data Science Intern', period: 'Nov 2024 - Feb 2025',
    logo: 'images/branding/vajra-logo.webp',
    contributions: [
      'Developed a full-stack AI chatbot application combining computer vision and NLP.',
      'Built a React frontend and Flask REST API for real-time image classification and conversational AI.',
      'Applied transfer learning, data augmentation, and fine-tuning to a custom food-image dataset.',
    ],
    technologies: ['VGG19', 'CNN', 'LSTM', 'TensorFlow', 'React', 'Flask'],
    verifiedResults: ['94% food-spoilage classification accuracy', '5,000+ food images', '1,000+ question-answer pairs'],
  },
  {
    company: 'Vajra.ai', role: 'Data Science Intern', period: 'Aug 2024 - Oct 2024',
    logo: 'images/branding/vajra-logo.webp',
    contributions: [
      'Built an end-to-end machine-learning pipeline to predict drug effectiveness.',
      'Prepared missing values, outliers, categorical variables, and scaled features, then applied cross-validation.',
      'Compared Linear Regression, Ridge, Lasso, XGBoost, and Random Forest and contributed to reports and SOP documentation.',
    ],
    technologies: ['Random Forest', 'XGBoost', 'Regression', 'Cross-validation'],
    verifiedResults: ['R-squared 0.81', 'RMSE 0.38', '10,000+ drug records'],
  },
]

export const education: Education[] = [
  {
    institution: 'University College of Engineering, Kakinada (JNTUK)',
    degree: 'B.Tech in Electronics and Communication Engineering',
    period: '2020 - 2024',
    result: 'CGPA: 7.2/10',
    location: 'Kakinada, India',
  },
  {
    institution: 'Narayana Junior College',
    degree: 'Intermediate (MPC)',
    period: '2018 - 2020',
    result: 'CGPA: 9.3/10',
  },
]

export const projects: Project[] = [
  {
    id: 'resume-screening', number: '01', book: 'NLP Book', title: 'AI Resume Screening System',
    focus: 'NLP Ranking', highlight: 'Semantic Candidate Match Scoring',
    description: 'A recruiter-focused screening engine that compares resumes with job descriptions using TF-IDF, BM25, cosine similarity, n-grams, fuzzy matching, synonym mapping, and missing-skill recommendations.',
    technologies: ['TF-IDF', 'BM25', 'Cosine similarity', 'N-grams', 'Fuzzy matching'],
    details: [
      { label: 'Architecture', items: [
        'React, TypeScript, Vite, Tailwind CSS, and TanStack Router interface connected to a FastAPI and Uvicorn backend.',
        'PDF and DOCX parsing feeds spaCy, Sentence Transformers, TF-IDF, BM25, cosine similarity, and skill-taxonomy analysis.',
        'The final score combines semantic similarity, BM25 overlap, TF-IDF similarity, and skill-keyword coverage with configurable weights.',
      ] },
      { label: 'Recruiter workflow', items: [
        'Returns matched and missing skills, mandatory gaps, recommendations, seniority, resume quality, and an alignment summary.',
        'Includes scan history, a searchable skills database, aggregate analytics, CSV export, and ReportLab PDF reports.',
        'Production safeguards include optional API-key auth, CORS allow-lists, rate limits, streamed upload limits, and health checks.',
      ] },
    ],
    video: 'projects/videos/resume-screening.mp4', poster: 'projects/posters/resume-screening.jpg',
    github: 'https://github.com/kottusaikumar/AI-Resume-Screening-System',
  },
  {
    id: 'rag-assistant', number: '02', book: 'RAG Book', title: 'Hybrid RAG Document Assistant',
    focus: 'RAG', highlight: 'Hybrid Semantic + Keyword Retrieval',
    description: 'A document assistant built around hybrid retrieval: dense semantic search plus sparse keyword matching, followed by answer synthesis over grounded context.',
    technologies: ['RAG', 'FAISS', 'BM25', 'LangChain'],
    details: [
      { label: 'Retrieval pipeline', items: [
        'PDF text is scrubbed for common PII, split into small semantic child chunks, and linked back to full parent paragraphs for context.',
        'Hugging Face embeddings feed a FAISS HNSW index; dense candidates are fused with BM25 results using reciprocal-rank fusion.',
        'A CrossEncoder reranks the fused candidates before the top grounded passages are sent to the local Ollama model.',
      ] },
      { label: 'Grounded experience', items: [
        'FastAPI streams status, early citations, answer tokens, confidence metadata, faithfulness, and relevance through NDJSON.',
        'Exact and semantic caches accelerate repeated questions while session memory supports follow-ups and detects topic shifts.',
        'Source-aware responses, citation excerpts, parent-chunk deduplication, and grounding warnings keep answers traceable.',
      ] },
    ],
    video: 'projects/videos/rag-assistant.mp4', poster: 'projects/posters/rag-assistant.jpg',
    github: 'https://github.com/kottusaikumar/Hybrid-RAG-Document-Assistant-Production-Chatbot-',
  },
  {
    id: 'food-spoilage', number: '03', book: 'Deep Learning Book', title: 'Food Spoilage Detection Chatbot',
    focus: 'Computer Vision + NLP', highlight: 'Dual-Model Customer Service Chatbot',
    description: 'An intelligent customer-service chatbot that combines a VGG19-based CNN for fresh-or-spoiled image classification with an attention-based encoder-decoder LSTM for natural-language queries and refund recommendations.',
    technologies: ['CNN', 'NLP', 'VGG19', 'Encoder-decoder LSTM', 'React', 'Flask'],
    details: [
      { label: 'Dual-model pipeline', items: [
        'A fine-tuned VGG19 model receives 224 × 224 RGB images and classifies uploaded food as fresh or spoiled.',
        'An encoder-decoder LSTM processes customer questions with tokenization, sequence generation, and attention-based context.',
        'Image classification results guide customer-facing analysis and automated refund recommendations inside the same conversation.',
      ] },
      { label: 'Full-stack delivery', items: [
        'React provides real-time chat, image previews, responsive layouts, loading states, and graceful error handling.',
        'Flask exposes separate chat and classification routes plus a health endpoint reporting CNN, NLP, and tokenizer readiness.',
        'The upload path validates files before inference, while the NLP model is trained from a curated food-support question set.',
      ] },
    ],
    video: 'projects/videos/food-spoilage-chatbot.mp4', poster: 'projects/posters/food-spoilage-chatbot.jpg',
    github: 'https://github.com/kottusaikumar/AI-Chatbot-Project-Intelligent-Food-Spoilage-Detector-CNN-NLP-',
  },
  {
    id: 'weapon-detection', number: '04', book: 'CNN Book', title: 'Weapon Detection System',
    focus: 'Computer Vision', highlight: 'VGG19 + Custom CNN Classifier',
    description: 'A computer-vision application for classifying weapon categories using VGG19 and a custom CNN, delivered through a Streamlit upload and classification workflow.',
    technologies: ['Computer Vision', 'VGG19', 'Custom CNN', 'Streamlit'],
    details: [
      { label: 'Model comparison', items: [
        'The Streamlit interface runs the same uploaded image through a pretrained VGG19 model and a lightweight custom CNN.',
        'VGG19 receives 224 × 224 input while the custom model receives 64 × 64 input; both paths normalize pixels before inference.',
        'Predictions are displayed side by side across nine weapon categories, making disagreement between models immediately visible.',
      ] },
      { label: 'Application flow', items: [
        'Users can upload PNG, JPG, or JPEG files, preview the selected image, and explicitly trigger classification.',
        'Missing model artifacts are downloaded from configured Google Drive IDs before TensorFlow loads them for inference.',
        'Grayscale inputs are converted to RGB and preprocessing errors are surfaced directly in the Streamlit interface.',
      ] },
    ],
    video: 'projects/videos/weapon-detection.mp4', poster: 'projects/posters/weapon-detection.jpg',
    github: 'https://github.com/kottusaikumar/weapons-Detection-identification-using-Image-Recognition',
  },
  {
    id: 'tradepro', number: '05', book: 'UI/UX Book', title: 'TradePro Analytics Dashboard',
    focus: 'Flask', highlight: 'OHLC Charting - VWAP - EMA - RSI',
    description: 'A trading analytics dashboard with interactive multi-pane charts, local CSV/RAR data handling, OHLC transformations, and technical indicators including VWAP, EMA, and RSI.',
    technologies: ['Flask', 'Plotly', 'OHLC', 'VWAP', 'EMA', 'RSI'],
    details: [
      { label: 'Data architecture', items: [
        'A Flask backend processes local symbol data from CSV and RAR sources rather than relying on an external live-market API.',
        'Charts_dataset.xlsx controls feature mapping through variable name, visibility, pane number, and source-file configuration.',
        'The React, Vite, and Tailwind single-page interface requests transformed datasets and renders them with Plotly.',
      ] },
      { label: 'Analytics workspace', items: [
        'Supports candlestick, line, area, and scatter visualizations across multiple synchronized analysis panes.',
        'Built-in calculations surface VWAP, EMA(20), and RSI(14) alongside price, volume, and configurable indicators.',
        'Dark and light themes, dynamic feature loading, and spreadsheet-driven configuration keep the dashboard adaptable.',
      ] },
    ],
    video: 'projects/videos/tradepro-dashboard.mp4', poster: 'projects/posters/tradepro-dashboard.jpg',
    github: 'https://github.com/kottusaikumar/Tradepro-Trading-Dashboard',
  },
]

export const process = [
  { number: '01', title: 'Research', body: 'Understand the problem, collect references, map user flows, and define the product direction before coding.' },
  { number: '02', title: 'Model', body: 'Build data, AI, and system logic with clear pipelines, reusable APIs, and measurable outputs.' },
  { number: '03', title: 'Build', body: 'Convert the idea into a polished full-stack interface with animation, responsive UI, and strong UX details.' },
  { number: '04', title: 'Deploy', body: 'Package, test, document, optimize performance, and prepare the project for real users or recruiters.' },
]

export const proof = [
  { value: '94%', label: 'CNN accuracy', detail: 'Food spoilage detection using VGG19' },
  { value: '0.81', label: 'R-squared score', detail: 'Drug effectiveness prediction model' },
  { value: '1,000+', label: 'QA pairs', detail: 'LSTM chatbot training dataset' },
  { value: '5', label: 'Selected projects', detail: 'NLP, RAG, CV, deep learning, and analytics' },
]

export const socialLinks: LinkItem[] = [
  { label: 'GitHub', href: 'https://github.com/kottusaikumar' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sai-kumar-10541b269' },
  { label: 'X', href: 'https://x.com/433Saikumar' },
]
