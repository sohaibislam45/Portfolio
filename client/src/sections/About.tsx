import { useEffect, useRef } from 'react';
import { revealStaggerChildren } from '../animations/sectionReveal';
import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';
import myPhoto2 from '../assets/myPhoto2.jpg';

const About = () => {
  const skillsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (skillsRef.current) {
      revealStaggerChildren(skillsRef.current, '.skill-item', {
        stagger: 0.1,
      });
    }
  }, []);

  const skills = [
    'React & TypeScript',
    'Node.js & Express',
    'MongoDB & Mongoose',
    'GSAP Animations',
    'Tailwind CSS',
    'Three.js',
  ];

  return (
    <Section id="about">
      <div className="container mx-auto px-6">
        <SectionTitle label="About" title="Who I Am" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img
              src={myPhoto2}
              alt="Profile"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Full Stack Developer
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              I'm a passionate full-stack developer specializing in the MERN stack.
              I love building modern, performant web applications with beautiful
              animations and smooth user experiences. My expertise includes React,
              Node.js, MongoDB, and creating engaging front-end interactions with
              GSAP and Three.js.
            </p>
            <div ref={skillsRef}>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Key Skills
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="skill-item opacity-0 flex items-center space-x-2"
                  >
                    <span className="text-primary-600 dark:text-primary-400">▹</span>
                    <span className="text-gray-700 dark:text-gray-300">{skill}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Section>
  );
};

export default About;

