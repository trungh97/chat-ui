import '@testing-library/jest-dom'
import { fireEvent, render, screen } from '@testing-library/react'
import type { ContactUser } from '@hooks/user/useSearchUsers'
import React from 'react'
import { ContactRow } from '../ContactRow'

const ann: ContactUser = {
  __typename: 'UserContactDTO',
  id: 'u2',
  email: 'ann@example.com',
  firstName: 'Ann',
  lastName: 'Lee',
  avatar: null,
  isOnline: true,
}

describe('ContactRow', () => {
  it('shows the name, email and online status', () => {
    render(<ContactRow user={ann} isOnline onMessage={jest.fn()} />)

    expect(screen.getByText('Ann Lee')).toBeInTheDocument()
    expect(screen.getByText('ann@example.com')).toBeInTheDocument()
    expect(screen.getByText('Online')).toBeInTheDocument()
  })

  it('shows offline from the isOnline prop, not the snapshot', () => {
    render(<ContactRow user={ann} isOnline={false} onMessage={jest.fn()} />)

    expect(screen.getByText('Offline')).toBeInTheDocument()
  })

  it('calls onMessage with the user', () => {
    const onMessage = jest.fn()
    render(<ContactRow user={ann} isOnline onMessage={onMessage} />)

    fireEvent.click(screen.getByRole('button', { name: 'Message Ann Lee' }))

    expect(onMessage).toHaveBeenCalledWith(ann)
  })

  it('disables Message while the conversation opens', () => {
    render(<ContactRow user={ann} isOnline onMessage={jest.fn()} isOpening />)

    expect(
      screen.getByRole('button', { name: 'Message Ann Lee' }),
    ).toBeDisabled()
  })
})
