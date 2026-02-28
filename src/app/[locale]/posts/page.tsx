import PostsScreen from "@/screens/posts-screen";

type PostsPageProps = {
  params: Promise<{ locale: string }>;
};

export default function PostsPage(props: Readonly<PostsPageProps>) {
  return <PostsScreen params={props.params} />;
}
