import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import styles from "../../styles/login.module.css";
import { useEffect, useLayoutEffect, useState } from "react";
import { useRouter } from "next/router";
import { magic } from "../../lib/magic-client";
import { redirect } from "next/navigation";
const Login = () => {
  const [email, setEmail] = useState("");
  const [userMsg, setUserMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  useEffect(() => {
    const handleComplete = () => {
      setIsLoading(false);
    };
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);
    return () => {
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  const handleOnChangeEmail = (e) => {
    setUserMsg("");

    const email = e.target.value;
    setEmail(email);
  };

  const handleLoginWithEmail = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const didToken = await magic.auth.loginWithMagicLink({ email: email });

      if (didToken) {
        const response = await fetch("/api/login", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${didToken}`,
            "Content-Type": "application/json",
          },
        });
        const loggedInResponse = await response.json();
        if (loggedInResponse) {
          router.push("/");
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log("ERROR IN MAGIC: ", error);
    }
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Netflix SignIn</title>
      </Head>

      <header className={styles.header}>
        <div className={styles.headerWrapper}>
          <Link className={styles.logoLink} href="/">
            <div className={styles.logoWrapper}>
              <Image
                src="/static/netflix.svg"
                alt="Netflix logo"
                width={128}
                height={34}
              />
            </div>
          </Link>
        </div>
      </header>

      <main className={styles.main}>
        <div className={styles.mainWrapper}>
          <h1 className={styles.signinHeader}>Sign In</h1>

          <input
            type="email"
            id="email"
            pattern=".+@example\.com"
            size="30"
            required
            placeholder="Email address"
            className={styles.emailInput}
            onChange={handleOnChangeEmail}
          />

          <p className={styles.userMsg}>{userMsg}</p>
          <button onClick={handleLoginWithEmail} className={styles.loginBtn}>
            {isLoading ? "Loading..." : "Sign In"}
          </button>
        </div>
      </main>
    </div>
  );
};

export default Login;
