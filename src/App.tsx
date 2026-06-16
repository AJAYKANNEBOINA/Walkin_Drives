import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/AuthContext'
import Home       from '@/pages/Home'
import Drives     from '@/pages/Drives'
import DriveDetail from '@/pages/DriveDetail'
import Login      from '@/pages/Login'
import Register   from '@/pages/Register'
import Dashboard  from '@/pages/Dashboard'
import PostDrive  from '@/pages/PostDrive'
import Blogs          from '@/pages/Blogs'
import BlogDetail     from '@/pages/BlogDetail'
import Profile        from '@/pages/Profile'
import NotFound       from '@/pages/NotFound'
import VerifyEmail    from '@/pages/VerifyEmail'
import AdminDashboard from '@/pages/AdminDashboard'
import JobAlerts      from '@/pages/JobAlerts'
import RoleSetup     from '@/pages/RoleSetup'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/"           element={<Home />} />
            <Route path="/drives"     element={<Drives />} />
            <Route path="/drives/:id" element={<DriveDetail />} />
            <Route path="/login"      element={<Login />} />
            <Route path="/register"   element={<Register />} />
            <Route path="/dashboard"  element={<Dashboard />} />
            <Route path="/post-drive" element={<PostDrive />} />
            <Route path="/blogs"        element={<Blogs />} />
            <Route path="/blogs/:id"    element={<BlogDetail />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/admin"        element={<AdminDashboard />} />
            <Route path="/job-alerts"   element={<JobAlerts />} />
            <Route path="/profile"      element={<Profile />} />
            <Route path="/setup-role"    element={<RoleSetup />} />
            <Route path="*"             element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
