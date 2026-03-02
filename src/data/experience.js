export const experience = [
  {
    start: 'Feb 2024',
    end: 'Present',
    title: 'DevOps Engineer',
    org: 'Oracle',
    description:
      'Lead release operations, service deployments, and platform reliability for GraalVM teams, improving delivery pace and stability across environments.',
    tags: ['OCI', 'Kubernetes', 'GitLab CI/CD', 'Helm', 'Ansible', 'ELK'],
  },
  {
    start: 'Jan 2022',
    end: 'Jan 2024',
    title: 'Freelance Web Developer (Part-time)',
    org: 'Independent',
    description:
      'Delivered client web products end-to-end, from requirement discovery to launch and continuous improvement.',
    tags: ['React', 'Django', 'Python', 'Docker', 'OVH'],
  },
]

export const education = [
  {
    start: 'Sep 2021',
    end: 'Aug 2024',
    title: 'Engineering Degree, Software Engineering',
    org: 'ENSIAS, Rabat',
    description:
      'Completed a software engineering curriculum with strong academic results and active student leadership experience.',
  },
  {
    start: 'Sep 2019',
    end: 'Jul 2021',
    title: 'Preparatory Classes, Mathematics & Physics',
    org: 'CPGE Mohammed VI, Kenitra',
    description:
      'Built a rigorous analytical foundation through intensive mathematics and physics preparatory studies.',
  },
]

export const skillCategories = [
  {
    category: 'Dev',
    skills: [
      { name: 'JavaScript', logo: '/skills/javascript.svg' },
      { name: 'Python', logo: '/skills/python.svg' },
      { name: 'Bash', logo: '/skills/gnubash.svg' },
      { name: 'React', logo: '/skills/react.svg' },
      { name: 'Django', logo: '/skills/django.svg' },
      { name: 'SQL', logo: '/skills/postgresql.svg' },
      { name: 'REST APIs', logo: '/skills/openapiinitiative.svg' },
    ],
  },
  {
    category: 'DevOps',
    skills: [
      { name: 'Docker', logo: '/skills/docker.svg' },
      { name: 'Kubernetes', logo: '/skills/kubernetes.svg' },
      { name: 'Helm', logo: '/skills/helm.svg' },
      { name: 'GitLab CI/CD', logo: '/skills/gitlab.svg' },
      { name: 'GitHub Actions', logo: '/skills/githubactions.svg' },
      { name: 'Ansible', logo: '/skills/ansible.svg' },
      { name: 'ELK Stack', logo: '/skills/elastic.svg' },
    ],
  },
  {
    category: 'Cloud & OS',
    skills: [
      { name: 'AWS', logo: '/skills/aws.svg' },
      { name: 'Azure', logo: '/skills/azure.svg' },
      { name: 'OCI', logo: '/skills/oracle.svg' },
      { name: 'OVH', logo: '/skills/ovh.svg' },
      { name: 'Linux', logo: '/skills/linux.svg' },
      { name: 'Darwin', logo: '/skills/apple.svg' },
    ],
  },
  {
    category: 'AI',
    skills: [
      { name: 'Claude Code', logo: '/skills/anthropic.svg' },
      { name: 'Codex', logo: '/skills/openai.svg' },
      { name: 'Figma MCP', logo: '/skills/figma.svg' },
    ],
  },
]

// Backward compatibility export if a flat list is needed elsewhere.
export const skills = skillCategories.flatMap((group) =>
  group.skills.map((skill) => skill.name)
)
