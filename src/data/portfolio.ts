export type Project = {
  title: string
  type: string
  role?: string
  category: string
  description: string
  tags: string[]
}

export const projects: Project[] = [
  {
    title: 'Class Scheduling System',
    type: 'Thesis project',
    role: 'Backend Developer',
    category: 'ACADEMIC · 2026',
    description:
      'A web-based class scheduling system built for Ateneo de Naga University’s College of Science, Engineering, and Architecture. MySQL stores course, instructor, room, and time-slot data, while the backend uses Answer Set Programming and Linear Programming to generate schedules based on the stored data and defined constraints.',
    tags: ['MySQL', 'Python', 'Answer Set Programming', 'Linear Programming'],
  },
  {
    title: 'AI Companion Discord Bot',
    type: 'Personal project',
    role: 'AI Chatbot Developer',
    category: 'AI · DISCORD',
    description:
      'A conversational AI bot for Discord, powered by the Qwen 2.5 language model through Ollama. It responds to server prompts with helpful explanations, code examples, and creative replies in a playful chatbot personality. Built-in safety filtering screens harmful requests, moderation controls give server admins more control, and persistent memory helps keep conversations in context.',
    tags: ['Qwen 2.5', 'Ollama', 'Python', 'Safety & Moderation', 'Persistent Memory'],
  },
]

export const skills = [
  {
    number: '01',
    category: 'Backend',
    items: ['C++','Python','Java','Node.js', 'Kotlin'],
  },
  {
    number: '02',
    category: 'Frontend',
    items: ['React', 'TypeScript', 'JavaScript', 'HTML & CSS', 'Tailwind CSS'],
  },
  {
    number: '03',
    category: 'Database',
    items: ['MySQL'],
  },
  {
    number: '04',
    category: 'Tools',
    items: ['Git', 'Github','Gitlab','VS Code','Vite', 'Microsoft Office Suite','Docker'],
  },
  {
    number: '05',
    category: 'Technical skills',
    items: ['Troubleshooting', 'Debugging', 'Software Testing', 'Data Analysis', 'User Support'],
  },
  {
    number: '06',
    category: 'Soft Skills',
    items: ['Problem-solving', 'Time Management', 'Continuous Learning', 'Adaptability'],
  },
]
