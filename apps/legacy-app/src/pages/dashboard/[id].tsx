import { GetStaticPropsContext } from 'next';
import React from 'react';

const DashboardId = ({ post }: { post: any }) => {
  return <div>DashboardId {JSON.stringify(post)}</div>;
};

export default DashboardId;

// This function gets called at build time
export async function getStaticPaths() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  const paths = posts.map((post: any) => ({
    // id here must match line 26
    params: { id: String(post.id) },
  }));

  return { paths, fallback: false };
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const params = context.params!;
  console.log('PARAMS', params);
  const postId = params.id as string;

  console.log('postId', postId);
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${String(postId)}`
  );
  const post = await res.json();

  console.log('POST', post);

  return {
    props: {
      post,
    },
  };
}
