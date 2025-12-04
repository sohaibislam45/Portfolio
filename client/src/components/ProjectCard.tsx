import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { Project } from '../types';
import Card from './Card';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  const imageRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseEnter = () => {
    if (imageRef.current && cardRef.current) {
      gsap.to(imageRef.current, {
        scale: 1.1,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(cardRef.current, {
        y: -8,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = () => {
    if (imageRef.current && cardRef.current) {
      gsap.to(imageRef.current, {
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
      });
      gsap.to(cardRef.current, {
        y: 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className="overflow-hidden rounded-lg"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Card className="p-0">
        <div className="relative overflow-hidden h-48 bg-gradient-to-br from-primary-400 to-primary-600">
          <div
            ref={imageRef}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: project.thumbnail
                ? `url(${project.thumbnail})`
                : 'none',
            }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
            <div className="text-white text-center">
              {project.liveUrl && (
                <a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-2 hover:underline"
                >
                  View Live
                </a>
              )}
              {project.repoUrl && (
                <a
                  href={project.repoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block hover:underline"
                >
                  View Code
                </a>
              )}
            </div>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {project.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
            {project.description}
          </p>
          <div className="flex flex-wrap gap-2">
            {project.techStack.slice(0, 3).map((tech, index) => (
              <span
                key={index}
                className="text-xs px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProjectCard;

