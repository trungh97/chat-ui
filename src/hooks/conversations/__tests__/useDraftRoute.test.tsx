import '@testing-library/jest-dom'
import { useDraftConversationStore } from '@store/draftConversation'
import { act, render, screen } from '@testing-library/react'
import React from 'react'
import {
  MemoryRouter,
  Navigate,
  NavigateFunction,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom'
import { useDraftRoute } from '../useDraftRoute'

let navigateRef: NavigateFunction = () => {}

/** Behaves like ChatWindow: redirects home only for a draft that was missing on open. */
const DraftPage = () => {
  const { draft, isMissing } = useDraftRoute()
  navigateRef = useNavigate()
  if (isMissing) return <Navigate to="/" replace />
  return <span>{draft ? `draft:${draft.name}` : 'replacing'}</span>
}

const Location = () => (
  <div data-testid="location">{useLocation().pathname}</div>
)

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/new/:userId" element={<DraftPage />} />
        <Route path="*" element={null} />
      </Routes>
      <Location />
    </MemoryRouter>,
  )

const addDraft = () =>
  useDraftConversationStore.getState().addDraft({
    userId: 'u2',
    name: 'Ann Lee',
    avatar: null,
    createdAt: '2026-11-08T10:00:00.000Z',
  })

describe('useDraftRoute', () => {
  beforeEach(() => {
    useDraftConversationStore.setState({ drafts: {} })
  })

  it('shows the draft of the route', () => {
    addDraft()
    renderAt('/new/u2')

    expect(screen.getByText('draft:Ann Lee')).toBeInTheDocument()
  })

  it('redirects home when the draft is gone on open, e.g. after a reload', () => {
    renderAt('/new/u2')

    expect(screen.getByTestId('location')).toHaveTextContent(/^\/$/)
  })

  it('does not redirect when the draft is replaced by its conversation', async () => {
    addDraft()
    renderAt('/new/u2')

    // Same order as the send flow, after an await: navigate, then remove the draft. The
    // removal may render first; that render must not send the user home.
    await act(async () => {
      await Promise.resolve()
      useDraftConversationStore.getState().removeDraft('u2')
    })
    expect(screen.getByTestId('location')).toHaveTextContent('/new/u2')
    expect(screen.getByText('replacing')).toBeInTheDocument()

    await act(async () => {
      navigateRef('/c-new', { replace: true })
    })
    expect(screen.getByTestId('location')).toHaveTextContent('/c-new')
  })
})
