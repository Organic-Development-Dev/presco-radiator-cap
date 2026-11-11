import dynamic from 'next/dynamic';
import client from '../../src/components/ApolloClient';
import GET_PAGE_BY_ID from '../../src/queries/get-page-by-title';

const ContactUs = dynamic(() => import('/src/components/ContactUs.js'), {
  ssr: false,
});

function Index({ data }) {
  return <ContactUs data={data} />;
}

export async function getStaticProps(context) {
  const { data } = await client.query({
    query: GET_PAGE_BY_ID,
    variables: { id: 'cG9zdDo3Ng==' },
  });

  if (data) {
    return {
      props: {
        data: data.page,
      },
    };
  }
}

export default Index;
