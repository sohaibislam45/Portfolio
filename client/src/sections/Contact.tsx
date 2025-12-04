import Section from '../components/Section';
import SectionTitle from '../components/SectionTitle';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  return (
    <Section id="contact">
      <div className="container mx-auto px-6">
        <SectionTitle label="Contact" title="Get In Touch" />
        <div className="max-w-2xl mx-auto text-center mb-12">
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Have a project in mind? Let's work together to bring your ideas to life.
          </p>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
};

export default Contact;

