import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import { session } from 'next-auth/client'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna'

export default NextAuth({
  providers: [
    Providers.GitHub({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      scope: 'read:user'
    }),
  ],
  jwt: {
    signingKey: process.env.SIGNIN_KEY,
  },
  callbacks: {
    async session(session) { // callback que permite modificar os dados da session e retornar esses dados modificados
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([ // busca condicional a dois índices, se a subscription é de tal usuário e se o status dela está ativa
              q.Match(
                q.Index('subscription_by_user_ref'), // buscar a subscription de um usuário especifico
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'), // selecionando a ref do usuário que bata com o email
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match( // buscar se a subscription está ativa ou não
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
  
        return {
          ...session,
          activeSubscription: userActiveSubscription
        }
      } catch {
        return {
          ...session,
          activeSubscription: null
        }
      }
    },

    async signIn(user, acount, profile) {
      const { email } = user

      try {
        await fauna.query(
          q.If( // se
            q.Not( // não
              q.Exists( // existe
                q.Match( // um usuário por email que dê match com o que foi autenticado
                  q.Index('user_by_email'),
                  q.Casefold(user.email) // não case-sensitive
                )
              )
            ),
            q.Create( // crie um usuário na collection users e faça inserção no campo email
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get( // se existir, busque o usuário pelo email autenticado
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true
      } catch (err) {
        console.log(err)

        return false
      }
    }
  }
})