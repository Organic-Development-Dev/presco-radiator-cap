import Head from 'next/head';
import PropTypes from 'prop-types';

const SEO = ({ 
  title, 
  description, 
  ogType = 'website',
  ogImage = '/img/logo.png',
  canonicalUrl,
  structuredData,
}) => {
  // Default description if not provided
  const metaDescription = description || 'Presco Radiator Caps - Quality radiator caps and thermal management solutions';
  
  // Set the canonical URL to the current page URL if not provided
  const canonical = canonicalUrl || `https://www.presco-radiator-caps.com${typeof window !== 'undefined' ? window.location.pathname : ''}`;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={metaDescription} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Presco Radiator Caps" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonical} />
      
      {/* Structured Data / JSON-LD */}
      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
};

SEO.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  ogType: PropTypes.string,
  ogImage: PropTypes.string,
  canonicalUrl: PropTypes.string,
  structuredData: PropTypes.object,
};

export default SEO;