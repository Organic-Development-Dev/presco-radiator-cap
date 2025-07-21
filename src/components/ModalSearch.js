import Search from 'antd/es/input/Search';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

function ModalSearch(props) {
  const { open, onClose } = props;
  const router = useRouter();
  
  console.log('ModalSearch rendered with open:', open);

  // Close modal on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [open, onClose]);

  if (!open) return null;
  
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{ zIndex: 9999 }}
    >
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
        style={{ zIndex: 9998 }}
      />
      
      {/* Modal Content */}
      <div 
        className="relative bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
        style={{ zIndex: 9999 }}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Search product by name</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <Search
          size='large'
          placeholder='Search product'
          autoFocus
          onSearch={(value, _e, info) => {
            if (value && value.trim()) {
              router.push(`/search?name=${encodeURIComponent(value.trim())}`);
              onClose();
            }
          }}
        />
      </div>
    </div>
  );
}

export default ModalSearch;
