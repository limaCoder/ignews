import { render, screen } from '@testing-library/react';
import { mocked } from 'ts-jest/utils';

import { stripe } from '../../services/stripe';
import Home, { getStaticProps } from '../../pages/index';

jest.mock('next/router')
jest.mock('next-auth/client', () => {
  return {
    useSession: () => [null, false]
  }
})
jest.mock('../../services/stripe')

describe('Home Page', () => {
  it('should renders correctly', () => {
    render(<Home product={{priceId: 'false-price-id', amount: 'R$10, 00'}} />)

    expect(screen.getByText('for R$10, 00 month')).toBeInTheDocument()
  });

  it('loads initial data', async () => {
    const retriveStripepricesMocked = mocked(stripe.prices.retrieve)

    retriveStripepricesMocked.mockResolvedValueOnce({
      id: 'fake-price-id',
      unit_amount: 1000,
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      // espera-se que o objeto tenha ALGUMAS das informações abaixo. e não que seja estritamente igual
      expect.objectContaining({ 
        props: {
          product: {
            priceId: 'fake-price-id',
            amount: '$10.00'
          }
        }
      })
    )

  })
})