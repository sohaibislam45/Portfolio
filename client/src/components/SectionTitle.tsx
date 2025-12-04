interface SectionTitleProps {
  label: string;
  title: string;
  className?: string;
}

const SectionTitle = ({ label, title, className = '' }: SectionTitleProps) => {
  return (
    <div className={`text-center mb-16 ${className}`}>
      <span className="text-sm font-semibold text-primary-600 dark:text-primary-400 uppercase tracking-wider">
        {label}
      </span>
      <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-2">
        {title}
      </h2>
    </div>
  );
};

export default SectionTitle;

