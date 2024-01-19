import SectionCards from "@/components/card/section-cards";
import NavBar from "@/components/nav/navbar";
import Head from "next/head";
import styles from "../../styles/my-list.module.css";
import RedirectUser from "@/utils/redirect";
import { getMyList } from "@/lib/videos";
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
  const myListVideos = await getMyList(userId, token);

  return {
    props: {
      myListVideos,
    },
  };
}

const MyList = ({ myListVideos }) => {
  return (
    <div>
      <Head>
        <title>My List</title>
      </Head>
      <main className={styles.main}>
        <NavBar />
        <div className={styles.sectionWrapper}>
          <SectionCards
            shouldWrap={true}
            videos={myListVideos}
            title="My List"
            size="small"
          />
        </div>
      </main>
    </div>
  );
};

export default MyList;
