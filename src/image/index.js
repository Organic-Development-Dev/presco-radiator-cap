import Img from 'next/image';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { DEFAULT_IMG_URL } from "../constants/urls";

/**
 * Optimized Next.js image loader
 * This custom loader prioritizes LCP images and provides optimal image formats
 * @param {Object} params Image loader parameters
 * @returns {string} The optimized image URL
 */
export default function customImageLoader({ src, width, quality }) {
  // Detect if the image is an LCP priority image (from optimized directory)
  const isLCPImage = src.includes('/optimized/');
  
  // Set quality based on whether this is a priority LCP image
  const imageQuality = isLCPImage ? (quality || 75) : (quality || 70);
  
  // Handle external URLs (keep them as is)
  if (src.startsWith('http')) {
    return src;
  }
  
  // Use Next.js image optimization endpoint
  if (src.startsWith('/')) {
    // Add a higher priority for LCP images
    const priority = isLCPImage ? '&priority=high' : '';
    
    return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${imageQuality}${priority}`;
  }
  
  return src;
}

/**
 * Image Component with enhanced LCP optimization.
 * This component handles both regular images and LCP-critical images.
 * 
 * @see https://nextjs.org/docs/api-reference/next/image#other-props
 * @see https://nextjs.org/docs/basic-features/image-optimization#device-sizes
 *
 * @param {Object} props Component props.
 * @return {jsx}
 */
const Image = (props) => {
  const {
    altText, 
    title, 
    width, 
    height, 
    sourceUrl, 
    className, 
    layout, 
    objectFit, 
    containerClassNames, 
    showDefault, 
    defaultImgUrl,
    isLCP, // New prop to indicate if this is an LCP image
    ...rest
  } = props;

  if (!sourceUrl && !showDefault) {
    return null;
  }

  // Determine if this is potentially an LCP image
  const isPotentiallyLCP = isLCP || 
                          (sourceUrl && sourceUrl.includes('/optimized/')) || 
                          (rest.priority === true);
  
  // Set appropriate loading attributes for LCP images
  const lcpProps = isPotentiallyLCP ? {
    priority: true,
    loading: 'eager',
    fetchPriority: 'high',
    quality: 80, // Higher quality for LCP images
  } : {};

  /**
   * If we use layout = fill then, width and height of the image cannot be used.
   * and the image fills on the entire width and the height of its parent container.
   */
  if ('fill' === layout) {
    const attributes = {
      alt: altText || title,
      src: sourceUrl || (showDefault ? (defaultImgUrl || DEFAULT_IMG_URL) : ''),
      layout: 'fill',
      className: cx('object-cover', className),
      ...lcpProps,
      ...rest
    };

    return (
      <div className={cx('relative', containerClassNames)}>
        <Img {...attributes} />
      </div>
    );
  } else {
    const attributes = {
      alt: altText || title,
      src: sourceUrl || (showDefault ? DEFAULT_IMG_URL : ''),
      width: width || 'auto',
      height: height || 'auto',
      className,
      ...lcpProps,
      ...rest
    };
    
    return <Img {...attributes} />;
  }
};

Image.propTypes = {
  altText: PropTypes.string,
  title: PropTypes.string,
  sourceUrl: PropTypes.string,
  layout: PropTypes.string,
  showDefault: PropTypes.bool,
  defaultImgUrl: PropTypes.string,
  containerClassName: PropTypes.string,
  className: PropTypes.string,
  isLCP: PropTypes.bool,
};

Image.defaultProps = {
  altText: '',
  title: '',
  sourceUrl: '',
  showDefault: true,
  defaultImgUrl: '',
  containerClassNames: '',
  className: 'post__image',
  isLCP: false,
};

export { Image };
