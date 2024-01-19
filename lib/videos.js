import videoTestData from "../data/travel.json";
import { getMyListVideos, getWatchedVideos } from "./db/hasura";

const fetchVideos = async (url) => {
  const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY_TRAVEL;
  const BASE_URL = "youtube.googleapis.com/youtube/v3";

  const repsonse = await fetch(
    `https://${BASE_URL}/${url}key=${YOUTUBE_API_KEY}`
  );

  return await repsonse.json();
};
export const getCommonVideos = async (url) => {
  try {
    const isDev = process.env.DEVELOPMENT;
    // console.log({ isDev });
    const data = isDev ? videoTestData : await fetchVideos(url);
    if (data?.error) {
      console.error("NOT AGAIN!!! ERROR", data.error);
      return [];
    }

    return data.items.map((item) => {
      const id = item?.id?.videoId || item?.id?.channelId || item?.id || null;
      const snippet = item.snippet;
      return {
        title: snippet?.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error("ERROR fetching data: ", error);
  }
};
export const getVideos = (query) => {
  const URL = `search?part=snippet&maxResults=25&q=${query}&type=video&`;
  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    "videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&maxResults=25&regionCode=US&";
  return getCommonVideos(URL);
};

export const getYoutubeVideoById = (videoId) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}&`;
  return getCommonVideos(URL);
};

export const watchAgainVideos = async (userId, token) => {
  const videos = await getWatchedVideos(userId, token);
  if (videos) {
    return videos.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    });
  }
  return [];
};

export const getMyList = async (userId, token) => {
  const videos = await getMyListVideos(userId, token);
  if (videos) {
    return videos.map((video) => {
      return {
        id: video.videoId,
        imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
      };
    });
  }
  return [];
};
