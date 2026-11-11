import React, { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery, gql } from '@apollo/client';
import TextArea from 'antd/es/input/TextArea';
import { Avatar, Button, Form, Input, Rate, Spin, message } from 'antd';
import { AppContext } from '../../context/AppContext';
import { CheckCircleTwoTone, HeartTwoTone, SmileTwoTone } from '@ant-design/icons';

const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: ID!) {
    product(id: $productId) {
      name
    reviews {
      averageRating
      edges {
        rating
        node {
          content
          id
          date
          databaseId
          approved
          type
          author {
            node {
              name
              avatar {
                url
              }
              id
            }
          }
        }
      }
    }
    reviewCount
    }
  }
`;

const ADD_PRODUCT_REVIEW = gql`
  mutation ADD_PRODUCT_REVIEW($input: WriteReviewInput!) {
    writeReview(input: $input) {
      rating
    }
  }
`;

const VERIFY_USER_BOUGHT_PRODUCT = gql`
query VERIFY_USER_BOUGHT_PRODUCT($where: RootQueryToOrderConnectionWhereArgs!) {
  orders(where: $where) {
    nodes {
      status
    }
  }
}
`
const ProductReviews = ({ productInfo }) => {
  const { userInfo: { user, setUser } } = useContext(AppContext);
  const [form] = Form.useForm()

  const { loading, error, data: dataProductReviews } = useQuery(GET_PRODUCT_REVIEWS, {
    variables: { productId: productInfo.id },
  });
  const { data: dataVerifyUserBoughtProduct } = useQuery(VERIFY_USER_BOUGHT_PRODUCT, {
    variables: {
      where: {
        customerId: user?.databaseId,
        productId: productInfo.productId,
        statuses: "COMPLETED"
      }
    }
  });
  const [addReview, { loading: loadingSendReview }] = useMutation(ADD_PRODUCT_REVIEW, {
    onCompleted: () => {
      message.success("Send review success!", 1);
    },
    onError: () => {
      message.error("Please try again!", 1)
    }
  });
  const handleSubmit = (values) => {
    addReview({
      variables: {
        input: {
          clientMutationId: Date.now().toString(),
          commentOn: productInfo.productId,
          ...values,
          author: user.name,
          authorEmail: user.email
        },
      },
      refetchQueries: [{ query: GET_PRODUCT_REVIEWS, variables: { productId: productInfo.id } }],
    });
    form.resetFields();
  };

  if (loading) return <div className='mx-4'><Spin /></div>;
  if (error) return <p>Error loading reviews.</p>;
  return (
    <div id='reviews'>
      {dataProductReviews?.product.reviewCount === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <div>
          <h3>{dataProductReviews?.product.reviewCount} review for {dataProductReviews?.product.name} </h3>
          <br />
          <ul>
            {dataProductReviews?.product.reviews.edges.map((review) => {
              return (
                <li key={review.node.id} className='mb-10'>
                  <div className='flex space-x-4'>
                    <Avatar shape="square" size={64} src={review.node.author.node.avatar?.url} />
                    {/* <div>

                    </div> */}
                    <div className='flex'>
                      <div className='flex flex-col'>
                        <strong className='flex items-center'>{review.node.author.node.name}&nbsp;{review.node.approved && <CheckCircleTwoTone twoToneColor="#52c41a" />}</strong>
                        <span>{review.node.date}</span>
                        <div className='mt-8' dangerouslySetInnerHTML={{ __html: review.node.content }} />
                      </div>
                    </div>
                    <Rate style={{ paddingLeft: 100, color: '#7f54b3' }} value={review.rating} disabled />
                  </div>
                </li>
              )
            })}
            {
              (user && dataVerifyUserBoughtProduct?.orders.nodes.length) ? (
                <>
                  <h3>Add a Review</h3>
                  <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    onFinish={handleSubmit}
                  >
                    <Form.Item
                      label="Your rating"
                      name="rating"
                      rules={[{ required: true, message: 'Please select your rating!' }]}
                    >
                      <Rate style={{ color: '#7f54b3' }} />
                    </Form.Item>

                    <Form.Item
                      label="Your review"
                      name="content"
                      rules={[{ required: true, message: 'Please input your review!' }]}
                    >
                      <Input.TextArea />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                      <Button type="primary" htmlType="submit" loading={loadingSendReview}>
                        Submit
                      </Button>
                    </Form.Item>
                  </Form>
                </>
              ) : <p>Only logged in customers who have purchased this product may leave a review.</p>
            }
          </ul>
        </div>
      )}
    </div>
  );
};

export default ProductReviews;