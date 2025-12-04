import { ReactNode } from 'react';
import Card from './Card';

interface ServiceCardProps {
  icon: ReactNode;
  title: string;
  description: string;
}

const ServiceCard = ({ icon, title, description }: ServiceCardProps) => {
  return (
    <Card>
      <div className="text-primary-600 dark:text-primary-400 mb-4 text-4xl">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">{description}</p>
    </Card>
  );
};

export default ServiceCard;

