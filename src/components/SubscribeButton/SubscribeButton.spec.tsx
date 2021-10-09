import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';
import { signIn, useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { SubscribeButton } from '.';

jest.mock('next-auth/client')
jest.mock('next/router')

const useSessionMocked = mocked(useSession)
const useRouterMocked = mocked(useRouter)

describe('SubscribeButton component', () => {
  it('renders correctly', () => {
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)
  
    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('redirects user to sign in when not authenticated', () => {
    const signInMocked = mocked(signIn)

    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SubscribeButton />)

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    // espera-se que a função de SignIn tenha sido chamada após o click
    expect(signInMocked).toHaveBeenCalled()
  })

  it('redirects to posts when user already has a subscription', () => {
    const pushMocked = jest.fn() // função sem retorno nenhum

    useSessionMocked.mockReturnValueOnce([
      {
        user: {name: 'John Doe', email: 'john.doe@example.com'}, 
        activeSubscription: 'fake-active-subscription',
        expires: 'fake-expires'
      }, 
      false
    ])

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(<SubscribeButton />)

    // pegando o botão através do texto
    const subscribeButton = screen.getByText('Subscribe now')

    // disparando eventos, no caso o evento de click
    fireEvent.click(subscribeButton)

    // espera-se que a função de SignIn tenha sido chamada após o click com o parâmetro posts
    expect(pushMocked).toHaveBeenCalledWith('/posts')
  })
})