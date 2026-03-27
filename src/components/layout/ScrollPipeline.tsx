import { useCallback, useEffect, useState } from 'react';

const STAGES = [
  { id: 'home', label: 'INIT' },
  { id: 'about', label: 'PROFILE' },
  { id: 'experience', label: 'EXP' },
  { id: 'certifications', label: 'CERTS' },
  { id: 'skills', label: 'SKILLS' },
  { id: 'architecture', label: 'ARCH' },
  { id: 'projects', label: 'PROJECTS' },
  { id: 'blog', label: 'BLOG' },
  { id: 'contact', label: 'DEPLOY' },
] as const;

export default function ScrollPipeline() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      let activeIdx = 0;

      for (let i = 0; i < STAGES.length; i++) {
        const el = document.getElementById(STAGES[i].id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 200) {
            activeIdx = i;
          }
        }
      }

      setCurrentIndex(activeIdx);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = useCallback((sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  return (
    <div className="scroll-pipeline">
      {STAGES.map((stage, index) => {
        let stageClass = 'pipeline-stage';
        if (index === currentIndex) {
          stageClass += ' active';
        } else if (index < currentIndex) {
          stageClass += ' completed';
        }

        const isLast = index === STAGES.length - 1;
        const connectorFilled = index < currentIndex;

        return (
          <div key={stage.id}>
            <div
              className={stageClass}
              data-section={stage.id}
              onClick={() => scrollToSection(stage.id)}
            >
              <div className="pipeline-node" />
              <span className="pipeline-label">{stage.label}</span>
            </div>
            {!isLast && (
              <div
                className={`pipeline-connector${connectorFilled ? ' filled' : ''}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
