import dynamic from 'next/dynamic';

const ContactUs = dynamic(() => import('/src/components/ContactUs.js'), {
  ssr: false,
});

function Index() {
  return <ContactUs />;
}

export default Index;
