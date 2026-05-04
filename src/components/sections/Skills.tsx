type Skill = { name: string; lvl: number; label: string }
type Group = { title: string; count: string; skills: Skill[] }

const GROUPS: Group[] = [
  {
    title: 'Languages',
    count: '04',
    skills: [
      { name: 'Python', lvl: 0.95, label: 'Expert' },
      { name: 'SQL', lvl: 0.85, label: 'Advanced' },
      { name: 'Java', lvl: 0.7, label: 'Proficient' },
      { name: 'JavaScript', lvl: 0.6, label: 'Working' },
    ],
  },
  {
    title: 'Backend',
    count: '06',
    skills: [
      { name: 'Flask', lvl: 0.92, label: 'Expert' },
      { name: 'REST APIs', lvl: 0.9, label: 'Expert' },
      { name: 'Microservices', lvl: 0.78, label: 'Advanced' },
      { name: 'Spring Boot', lvl: 0.6, label: 'Working' },
      { name: 'Node / Express', lvl: 0.55, label: 'Working' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    count: '05',
    skills: [
      { name: 'AWS (EC2, S3, RDS)', lvl: 0.8, label: 'Advanced' },
      { name: 'Docker', lvl: 0.82, label: 'Advanced' },
      { name: 'Nginx', lvl: 0.65, label: 'Proficient' },
      { name: 'Jenkins CI/CD', lvl: 0.78, label: 'Advanced' },
      { name: 'Linux', lvl: 0.72, label: 'Proficient' },
    ],
  },
  {
    title: 'AI / ML',
    count: '04',
    skills: [
      { name: 'LLM integration', lvl: 0.82, label: 'Advanced' },
      { name: 'STT / TTS pipelines', lvl: 0.85, label: 'Advanced' },
      { name: 'Conversational AI', lvl: 0.75, label: 'Advanced' },
      { name: 'Prompt engineering', lvl: 0.72, label: 'Proficient' },
    ],
  },
  {
    title: 'Data',
    count: '03',
    skills: [
      { name: 'MySQL', lvl: 0.85, label: 'Advanced' },
      { name: 'MongoDB', lvl: 0.62, label: 'Proficient' },
      { name: 'Query optimization', lvl: 0.78, label: 'Advanced' },
    ],
  },
  {
    title: 'Testing',
    count: '05',
    skills: [
      { name: 'Playwright', lvl: 0.88, label: 'Advanced' },
      { name: 'API testing', lvl: 0.9, label: 'Expert' },
      { name: 'Flutter automation', lvl: 0.68, label: 'Proficient' },
      { name: 'Integration testing', lvl: 0.82, label: 'Advanced' },
      { name: 'JMeter', lvl: 0.6, label: 'Working' },
    ],
  },
]

export default function Skills() {
  return (
    <section id="skills">
      <div className="sec-label">
        <h2>
          Skills <span className="desc">— what I reach for, and how comfortable I am with each</span>
        </h2>
      </div>
      <div className="skills">
        <div className="mono">Stack &amp; tools</div>
        <div className="skills-grid">
          {GROUPS.map((g) => (
            <div key={g.title} className="skill-group reveal">
              <h4>
                {g.title} <span className="count">{g.count}</span>
              </h4>
              {g.skills.map((s) => (
                <div key={s.name} className="skill-row">
                  <span className="name">{s.name}</span>
                  <span className="bar">
                    <i style={{ ['--lvl' as string]: s.lvl } as React.CSSProperties}></i>
                  </span>
                  <span className="lvl">{s.label}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
