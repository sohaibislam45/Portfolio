import { useState } from 'react';
import { useProjects } from '../services/projects';
import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';
import ProjectCard from '../components/ProjectCard';
import { revealStaggerChildren } from '../animations/sectionReveal';
import { useEffect, useRef } from 'react';

const Projects = () => {
  const { projects, loading } = useProjects();
  const [filter, setFilter] = useState<string>('all');
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (projectsRef.current && projects.length > 0) {
      revealStaggerChildren(projectsRef.current, '.project-item', {
        stagger: 0.15,
      });
    }
  }, [projects]);

  const filteredProjects =
    filter === 'all'
      ? projects
      : projects.filter((p) => p.category === filter);

  const categories = ['all', 'frontend', 'backend', 'full-stack'];

  return (
    <Section id="projects">
      <div className="container mx-auto px-6">
        <SectionTitle label="Portfolio" title="My Projects" />
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-6 py-2 rounded-full font-semibold transition-all ${
                filter === cat
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1).replace('-', ' ')}
            </button>
          ))}
        </div>
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600 dark:text-gray-400">Loading projects...</p>
          </div>
        ) : (
          <div
            ref={projectsRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProjects.map((project) => (
              <div key={project._id} className="project-item opacity-0">
                <ProjectCard project={project} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default Projects;

