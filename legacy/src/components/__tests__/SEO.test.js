import { render } from '@testing-library/react';
import SEO from '../SEO';

// Mock next/head since it's not available in the test environment
jest.mock('next/head', () => {
  return {
    __esModule: true,
    default: ({ children }) => <div data-testid="head">{children}</div>,
  };
});

describe('SEO Component', () => {
  it('renders with required props only', () => {
    const { container } = render(<SEO title="Test Title" />);
    expect(container).toMatchSnapshot();
  });

  it('renders with all props', () => {
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': 'Test Page',
    };

    const { container } = render(
      <SEO
        title="Test Title"
        description="Test description"
        ogType="article"
        ogImage="/test-image.jpg"
        canonicalUrl="https://example.com/test"
        structuredData={structuredData}
      />
    );
    
    expect(container).toMatchSnapshot();
  });
});