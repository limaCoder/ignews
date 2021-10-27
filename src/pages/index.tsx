import { GetStaticProps } from "next";
import Image from "next/image";

import Head from "next/head";
import { SubscribeButton } from "../components/SubscribeButton";
import { stripe } from "../services/stripe";

import styles from "./home.module.scss";

export default function Home() {
  return (
    <>
      <Head>
        <title>Home | learnToCode</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Olá meu amor, seja bem-vinda!</span>
          <h1>
            Fique por dentro da notícias da <span>Boiola</span> World.
          </h1>
          <p>
            Tenha acesso a todas as publicações boiolas por
            <br />
            <span> mil beijinhos</span>
          </p>
        </section>

        <Image src="/images/avatar.svg" width={608} height={260.42} />
      </main>
    </>
  );
}
