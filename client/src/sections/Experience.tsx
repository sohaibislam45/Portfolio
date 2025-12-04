import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';

const Experience = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const items = timelineRef.current.querySelectorAll('.timeline-item');
      
      items.forEach((item, index) => {
        const direction = index % 2 === 0 ? 'left' : 'right';
        
        gsap.fromTo(
          item,
          {
            opacity: 0,
            x: direction === 'left' ? -100 : 100,
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: item,
              start: 'top 80%',
            },
          }
        );
      });
    }
  }, []);

  const experiences = [
    {
      title: 'Full Stack Developer',
      company: 'Tech Company',
      period: '2022 - Present',
      description:
        'Developing and maintaining web applications using React, Node.js, and MongoDB.',
    },
    {
      title: 'Frontend Developer',
      company: 'Startup Inc',
      period: '2020 - 2022',
      description:
        'Built responsive user interfaces and implemented complex animations with GSAP.',
    },
    {
      title: 'Web Developer Intern',
      company: 'Digital Agency',
      period: '2019 - 2020',
      description:
        'Assisted in building client websites and learned modern web development practices.',
    },
  ];

  return (
    <Section id="experience" className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <SectionTitle label="Experience" title="My Journey" />
        <div ref={timelineRef} className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <div
              key={index}
              className={`timeline-item mb-12 ${
                index % 2 === 0 ? 'text-left' : 'text-right md:text-left'
              }`}
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {exp.title}
                  </h3>
                  <span className="text-primary-600 dark:text-primary-400 font-semibold">
                    {exp.period}
                  </span>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-2">{exp.company}</p>
                <p className="text-gray-700 dark:text-gray-300">{exp.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Experience;

