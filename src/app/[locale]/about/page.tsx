import AboutScreen from "@/screens/about-screen";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default function AboutPage(props: Readonly<AboutPageProps>) {
  return <AboutScreen params={props.params} />;
}
