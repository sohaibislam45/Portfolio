import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';
import ServiceCard from '../components/ServiceCard';

const Services = () => {
  const services = [
    {
      icon: '💻',
      title: 'Web Development',
      description:
        'Building responsive and performant web applications using modern frameworks and best practices.',
    },
    {
      icon: '⚛️',
      title: 'Frontend Development',
      description:
        'Creating engaging user interfaces with React, TypeScript, and advanced animation libraries.',
    },
    {
      icon: '🔧',
      title: 'Backend Development',
      description:
        'Developing robust server-side applications with Node.js, Express, and MongoDB.',
    },
    {
      icon: '🔌',
      title: 'API Integration',
      description:
        'Designing and integrating RESTful APIs with proper authentication and error handling.',
    },
    {
      icon: '🎨',
      title: 'UI Implementation',
      description:
        'Transforming designs into pixel-perfect, interactive user interfaces.',
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description:
        'Ensuring applications work seamlessly across all devices and screen sizes.',
    },
  ];

  return (
    <Section id="services" className="bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-6">
        <SectionTitle label="Services" title="What I Do" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              icon={service.icon}
              title={service.title}
              description={service.description}
            />
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Services;

