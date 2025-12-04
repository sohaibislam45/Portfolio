import { useEffect, useRef, ReactNode } from 'react';
import { revealSection } from '../animations/sectionReveal';

interface SectionProps {
  id: string;
  children: ReactNode;
  className?: string;
}

const Section = ({ id, children, className = '' }: SectionProps) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (sectionRef.current) {
      revealSection(sectionRef.current);
    }
  }, []);

  return (
    <section
      id={id}
      ref={sectionRef}
      className={`py-24 ${className}`}
    >
      {children}
    </section>
  );
};

export default Section;

