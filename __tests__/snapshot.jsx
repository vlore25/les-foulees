import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import Home from '@/app/(external)/page'
import Header from '@/components/layout/header/Header'

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock the UserMenu component to avoid server-side issues
jest.mock('@/components/common/header/components/user-menu/UserMenu', () => {
  return function DummyUserMenu() {
    return <div data-testid="user-menu">UserMenu</div>
  }
})

// Mock auth functions that use iron-session
jest.mock('@/lib/auth', () => ({
  getSession: jest.fn(() => Promise.resolve({ user: null })),
}))

// Mock server actions
jest.mock('@/app/actions/auth', () => ({
  login: jest.fn(),
  register: jest.fn(),
}))

describe('Homepage Snapshot', () => {
  it('renders homepage unchanged', () => {
    const { container } = render(
      <>
        <Header />
        <Home />
      </>
    )
    expect(container).toMatchSnapshot()
  })
})