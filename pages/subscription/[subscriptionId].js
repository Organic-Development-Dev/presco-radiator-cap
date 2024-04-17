/**
 * Internal Dependencies.
 */
import { getSubscriptionsData, getSubscriptionsById } from '../../src/utils/functions';
import Layout from '../../src/components/Layout';
import SubscriptionDetail from '../../src/components/customer-account/subscriptions/subscriptions-details';

/**
 * External Dependencies.
 */
import { useRouter } from 'next/router';
import { Breadcrumb, Spin } from 'antd';
import usePageAuth from '../../src/hook/usePageAuth';

export default function Subscriptions({ subscription }) {

    console.log('hey', subscription);

    usePageAuth()

    const router = useRouter();

    // If the page is not yet generated, this will be displayed
    // initially until getStaticProps() finishes running
    if (router.isFallback) {
        return <div className='text-center pt-10'><Spin size="large" /></div>;
    }
    return (
        <>
            <div className='container mx-auto'>
                <Breadcrumb style={{ margin: '16px 0' }}>
                    <Breadcrumb.Item>Home</Breadcrumb.Item>
                    <Breadcrumb.Item>Subscription</Breadcrumb.Item>
                    <Breadcrumb.Item>Subscription #{subscription.id}</Breadcrumb.Item>
                </Breadcrumb>
                <SubscriptionDetail subscription={subscription} />
            </div>

        </>
    );
}

export async function getStaticProps({ params }) {
    const response = await getSubscriptionsById(params.subscriptionId);
    const subscription = response.data;
    return {
        props: {
            subscription: subscription,
        },
        revalidate: 1,
    };

}

export async function getStaticPaths() {
    const { data: subscriptions } = await getSubscriptionsData();

    // Expected Data Shape: [{ params: { slug: 'pendant' } }, { params: { slug: 'shirt' } }],
    const pathsData = [];

    subscriptions.length && subscriptions.map((subscription) => {
        if (subscription.id) {
            pathsData.push({ params: { subscriptionId: subscription.id.toString() } });
        }
    });

    return {
        paths: pathsData,
        fallback: true,
    };


}
