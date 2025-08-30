import React from 'react'
import RootLayout from './layout/RootLayout'
import HomePage from './pages/HomePage'
import DonatePage from './pages/DonatePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'

const App = () => {
  const path = typeof window !== 'undefined' ? window.location.pathname : '/'

  let Page = HomePage
  if (path === '/donate') Page = DonatePage
  if (path === '/signup') Page = SignupPage
  if (path === '/login') Page = LoginPage

  // Show DonatePage and SignupPage without RootLayout (no Navbar). Other pages use RootLayout.
  if (path === '/donate') {
    return <DonationOnlyPage />
  }
  if (path === '/signup') {
    return <SignupOnlyPage />
  }
  if (path === '/login') {
    return <LoginOnlyPage />
  }

  return (
    <RootLayout>
      <Page />
    </RootLayout>
  )
}

function DonationOnlyPage() {
  return <DonatePage />
}
function SignupOnlyPage() {
  return <SignupPage />
}
function LoginOnlyPage() {
  return <LoginPage />
}

export default App