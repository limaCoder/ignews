import { GetServerSideProps } from "next"
import Head from "next/head"
import { getSession } from "next-auth/client"
import { RichText } from "prismic-dom"

import { getPrismicClient } from "../../services/prismic"

import styles from './post.module.scss'

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function Post({ post }: PostProps) {
  return(
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent} 
            dangerouslySetInnerHTML={{__html: post.content}} 
          />
        </article>
      </main>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => { // req = de onde vai puxar os cookies se o usuário está logado ou não
  const session = await getSession({ req }) // recuperar sessão do usuário
  const { slug } = params; // obtendo acesso ao slug do post que é carregado

  console.log(session)

  if (!session?.activeSubscription) { // se a inscrição do usuário for falsa, redirecionar o user
    return {
      redirect: {
        destination: `/posts/preview/${slug}`,
        permanent: false,
      },
    }
  }

  const prismic = getPrismicClient(req)

  const response = await prismic.getByUID('post', String(slug), {}) // permitir que o slug seja uma string não várias (array)

  //Post não encontrado
  if (!response) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  const post = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  };

  return {
    props: {
      post,
    }
  }
}