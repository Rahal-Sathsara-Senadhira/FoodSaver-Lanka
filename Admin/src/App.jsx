import React from 'react'
import BaseLayout from './components/layout/BaseLayout'
import AppRoutes from './routes'

export default function App() {
  return (
    <BaseLayout>
      <AppRoutes />
    </BaseLayout>
  )
}
