import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { HomeRedirect } from '@/components/features/auth/home-redirect'
import { ProtectedRoute } from '@/components/features/auth/protected-route'
import DashboardPage from '@/pages/dashboard-page'
import LoginPage from '@/pages/login-page'
import ReadingsPage from '@/pages/readings-page'
import RegisterPage from '@/pages/register-page'
import ReportsPage from '@/pages/reports-page'
import 'react-toastify/ReactToastify.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomeRedirect />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/readings" element={<ReadingsPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Route>
        <Route path="*" element={<HomeRedirect />} />
      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={3200}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="colored"
        toastClassName="!rounded-xl !font-sans !text-sm"
      />
    </BrowserRouter>
  )
}
