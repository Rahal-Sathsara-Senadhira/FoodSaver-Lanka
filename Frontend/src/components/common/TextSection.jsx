// src/components/common/TextSection.jsx
import Container from './Container';
import Section from './Section';

export default function TextSection({ title, content, className = '' }) {
  return (
    <Section className={`bg-gray-50 ${className}`}>
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          {title && (
            <h2 className="mb-6 text-3xl font-bold text-gray-900 sm:text-4xl">
              {title}
            </h2>
          )}
          {content && (
            <div
              className="text-[22px] leading-[100%] tracking-[0px] font-normal text-gray-600"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            >
              {content}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
