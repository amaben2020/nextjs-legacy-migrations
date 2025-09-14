import Link from 'next/link';
import React from 'react';

const DashboardPage = ({ posts }: { posts: any }) => {
  return (
    <div>
      DashboardPage
      <div>
        <ul>
          {posts.map((post: any) => (
            <li key={post.id} className="bg-gray-600 p-2 m-2">
              <Link href={`/dashboard/${post.id}`} className="text-white">
                {post.id} -- {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;

export async function getServerSideProps() {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts');
  const posts = await res.json();

  return {
    props: {
      posts,
    },
  };
}
