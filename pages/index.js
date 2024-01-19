import Head from "next/head";
import NavBar from "@/components/nav/navbar";
import { Roboto_Slab } from "next/font/google";
import styles from "@/styles/Home.module.css";
import Banner from "@/components/banner/banner";
import { getVideos, getPopularVideos, watchAgainVideos } from "../lib/videos";
import SectionCards from "@/components/card/section-cards";

import RedirectUser from "@/utils/redirect";
const inter = Roboto_Slab({ subsets: ["latin"] });

export async function getServerSideProps(context) {
  const { userId, token } = await RedirectUser(context);
  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  const watchItAgainVideos = await watchAgainVideos(userId, token);
  const disneyVideos = await getVideos("disney trailer");
  const productivityVideos = await getVideos("productivity");
  const travelVideos = await getVideos("travel");
  const popularVideos = await getPopularVideos();

  return {
    props: {
      disneyVideos,
      productivityVideos,
      travelVideos,
      popularVideos,
      watchItAgainVideos,
    },
  };
}
export default function Home({
  disneyVideos,
  travelVideos,
  productivityVideos,
  popularVideos,
  watchItAgainVideos,
}) {
  return (
    <>
      <Head>
        <title>Notflix</title>
        <meta name="description" content="Fake Netflix" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`${styles.main} ${inter.className}`}>
        <NavBar username="Jed Peek" />
        <Banner
          videoId="YoHD9XEInc0"
          title="Inception"
          subtitle="Was it was all a dream"
          imgUrl="/static/inception.jpeg"
        />
        <div className={styles.sectionWrapper}>
          <SectionCards title="Disney" videos={disneyVideos} size="large" />
          <SectionCards
            title="Watch Again"
            videos={watchItAgainVideos}
            size="small"
          />
          <SectionCards title="Travel" videos={travelVideos} size="small" />
          <SectionCards
            title="Productivity"
            videos={productivityVideos}
            size="medium"
          />
          <SectionCards title="Popular" videos={popularVideos} size="small" />
        </div>
      </main>
    </>
  );
}
