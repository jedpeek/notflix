import "@/styles/globals.css";
// import { useRouter } from "next/router";
import { useEffect, useState } from "react";
// import { magic } from "@/lib/magic-client";
import Loading from "@/components/loading/loading";
export default function App({ Component, pageProps }) {
  const [isLoading, setIsLoading] = useState(false);

  return isLoading ? <Loading /> : <Component {...pageProps} />;
}
