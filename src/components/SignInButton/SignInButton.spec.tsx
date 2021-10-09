import { render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { useSession } from 'next-auth/client'
import { SignInButton } from '.'

jest.mock('next-auth/client')

const useSessionMocked = mocked(useSession) // mockando as funcionalidades e tipagem

describe('SignInButton component', () => {
  it('renders correctly when user is not authenticated', () => {

    // mockando apenas o primeiro retorno da função, ou seja, a partir dessa linha, a primeira e única
    // vez que a função useSession for chamada, retorne null e false
    useSessionMocked.mockReturnValueOnce([null, false])

    render(<SignInButton />)

    expect(screen.getByText('Sign in with Github')).toBeInTheDocument()
  })

  it('renders correctly when user is authenticated', () => {
    useSessionMocked.mockReturnValueOnce([
      {
        user: {name: 'John Doe', email: 'johndoe@example.com'},
        expires: 'fakes-expires'
      },
      false
    ])

    render(<SignInButton />)

    expect(screen.getByText('John Doe')).toBeInTheDocument()
  })
})