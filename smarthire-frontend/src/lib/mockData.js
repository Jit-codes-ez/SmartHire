export const jobs = [
  {
    id: 'tcs-se',
    title: 'Software Engineer',
    company: 'Tata Consultancy Services',
    skills: ['Java', 'Spring Boot', 'SQL', 'REST APIs'],
    cgpaCutoff: 7.5,
    deadline: '20 Aug 2025',
    openings: 25,
    location: 'Kolkata / Remote',
    status: 'Open',
    description:
      'We are looking for a Software Engineer to join our enterprise applications team, building and maintaining REST APIs on Spring Boot with a MySQL backend.',
  },
  {
    id: 'wipro-fe',
    title: 'Frontend Developer',
    company: 'Wipro',
    skills: ['React', 'TypeScript', 'Tailwind'],
    cgpaCutoff: 7.0,
    deadline: '15 Aug 2025',
    openings: 12,
    location: 'Bengaluru',
    status: 'Open',
    description: 'Build customer-facing dashboards in React and TypeScript for our enterprise clients.',
  },
  {
    id: 'infosys-ds',
    title: 'Data Analyst',
    company: 'Infosys',
    skills: ['Python', 'SQL', 'Power BI'],
    cgpaCutoff: 7.5,
    deadline: '05 Aug 2025',
    openings: 8,
    location: 'Pune',
    status: 'Closed',
    description: 'Analyze operational datasets and build reporting dashboards for internal stakeholders.',
  },
]

export const applications = [
  { id: 1, jobId: 'tcs-se', job: 'Software Engineer — TCS', status: 'Shortlisted', appliedOn: '28 Jul 2025' },
  { id: 2, jobId: 'wipro-fe', job: 'Frontend Developer — Wipro', status: 'Under Review', appliedOn: '25 Jul 2025' },
  { id: 3, jobId: 'infosys-ds', job: 'Data Analyst — Infosys', status: 'Rejected', appliedOn: '10 Jul 2025' },
]

export const applicants = [
  { id: 1, name: 'Rohan Sharma', college: 'Techno College', degree: 'MCA', score: 82, cgpa: 9.16, appliedOn: '28 Jul 2025', status: 'Shortlisted', skills: ['Java', 'Spring Boot', 'MySQL', 'React'] },
  { id: 2, name: 'Priya Nair', college: 'NIT Trichy', degree: 'B.Tech CSE', score: 76, cgpa: 8.7, appliedOn: '27 Jul 2025', status: 'Under Review', skills: ['Java', 'SQL', 'REST APIs'] },
  { id: 3, name: 'Jit Hazra', college: 'Techno Hooghly', degree: 'MCA', score: 91, cgpa: 9.3, appliedOn: '26 Jul 2025', status: 'Shortlisted', skills: ['Spring Boot', 'MySQL', 'Java'] },
  { id: 4, name: 'Ananya Iyer', college: 'VIT Vellore', degree: 'B.Tech IT', score: 58, cgpa: 7.9, appliedOn: '29 Jul 2025', status: 'Applied', skills: ['Java', 'SQL'] },
]

export const drives = [
  { id: 'tcs-se', title: 'Software Engineer', company: 'TCS', deadline: '20 Aug 2025', applicants: 48, status: 'Open' },
  { id: 'wipro-fe', title: 'Frontend Developer', company: 'Wipro', deadline: '15 Aug 2025', applicants: 22, status: 'Open' },
  { id: 'infosys-ds', title: 'Data Analyst', company: 'Infosys', deadline: '05 Aug 2025', applicants: 31, status: 'Closed' },
]

export const students = [
  { id: 1, name: 'Jit Hazra', branch: 'MCA', batch: '2025–2027', college: 'Techno Hooghly', cgpa: 9.16, applications: 3, shortlisted: 2, status: 'Placed', offer: 'Software Engineer at TCS' },
  { id: 2, name: 'Rohan Sharma', branch: 'MCA', batch: '2025–2027', college: 'Techno College', cgpa: 9.16, applications: 4, shortlisted: 2, status: 'Placed', offer: 'Frontend Developer at Wipro' },
  { id: 3, name: 'Ananya Iyer', branch: 'CSE', batch: '2024–2028', college: 'VIT Vellore', cgpa: 7.9, applications: 2, shortlisted: 0, status: 'Applied', offer: null },
]

export const pendingRecruiters = [
  { id: 1, name: 'Meera Kulkarni', company: 'Zoho Corporation', email: 'meera@zoho.com', requestedOn: '30 Jul 2025' },
  { id: 2, name: 'Arjun Rao', company: 'Freshworks', email: 'arjun@freshworks.com', requestedOn: '29 Jul 2025' },
]

export const activityFeed = [
  'TCS posted a new drive',
  'Rohan shortlisted for Frontend Developer',
  'New recruiter pending approval: Zoho Corporation',
  'Drive closed: Wipro — Data Analyst',
]

export const branchPlacement = [
  { branch: 'CSE', rate: 78 },
  { branch: 'MCA', rate: 74 },
  { branch: 'ECE', rate: 65 },
  { branch: 'ME', rate: 52 },
  { branch: 'EE', rate: 60 },
]
