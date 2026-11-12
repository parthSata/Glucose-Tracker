import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { HomeRedirect } from '@/components/features/auth/home-redirect'
import { ProtectedRoute } from '@/components/features/auth/protected-route'
import DashboardPage from '@/pages/dashboard-page'
import LoginPage from '@/pages/login-page'
import RegisterPage from '@/pages/register-page'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
        <Route path="*" element={<HomeRedirect />} />
      </Routes>
    </BrowserRouter>
  )
}
