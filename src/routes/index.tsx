import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '../layouts/MainLayout'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import Dashboard from '../pages/Dashboard'
import CreateLink from '../pages/CreateLink'
import LinkDetails from '../pages/LinkDetails'
import PatientHistory from '../pages/PatientHistory'
import Settings from '../pages/Settings'
import Payments from '../pages/Payments'
import HospitalLayout from '../layouts/HospitalLayout'
import PaymentPage from '../pages/PaymentPage'
import Track from '../pages/Track'
import Success from '../pages/Success'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Landing />} />
      </Route>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      
      <Route element={<HospitalLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-link" element={<CreateLink />} />
        <Route path="/payments" element={<Payments />} />
        <Route path="/payment-links/:id" element={<LinkDetails />} />
        <Route path="/patients/:contact?" element={<PatientHistory />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Patient-facing standalone pages */}
      <Route path="/pay/:id" element={<PaymentPage />} />
      <Route path="/track" element={<Track />} />
      <Route path="/pay/:id/verify" element={<Success />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
