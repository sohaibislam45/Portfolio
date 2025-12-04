import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';
import Card from '../components/Card';

const Testimonials = () => {
  const testimonials = [
    {
      name: 'John Doe',
      role: 'CEO, Company Inc',
      content:
        'Outstanding work! The project was delivered on time and exceeded our expectations. Highly recommended.',
    },
    {
      name: 'Jane Smith',
      role: 'Product Manager',
      content:
        'Professional, creative, and detail-oriented. The animations and user experience are top-notch.',
    },
    {
      name: 'Mike Johnson',
      role: 'CTO, Startup Co',
      content:
        'Great communication and technical skills. The code quality is excellent and the application is performant.',
    },
  ];

  return (
    <Section id="testimonials">
      <div className="container mx-auto px-6">
        <SectionTitle label="Testimonials" title="What Clients Say" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index}>
              <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                "{testimonial.content}"
              </p>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">
                  {testimonial.name}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {testimonial.role}
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </Section>
  );
};

export default Testimonials;

