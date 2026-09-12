import { AnimatePresence } from 'framer-motion'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Events from './pages/Events.jsx'
import Team from './pages/Team.jsx'
import MemberProfile from './pages/MemberProfile.jsx'
import Achievements from './pages/Achievements.jsx'
import Gallery from './pages/Gallery.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './admin/AdminLogin.jsx'
import AdminDashboard from './admin/AdminDashboard.jsx'
import AdminRoute from './admin/AdminRoute.jsx'
import MembersList from './admin/members/MembersList.jsx'
import MemberForm from './admin/members/MemberForm.jsx'
import EventsList from './admin/events/EventsList.jsx'
import EventForm from './admin/events/EventForm.jsx'
import AchievementsList from './admin/achievements/AchievementsList.jsx'
import AchievementForm from './admin/achievements/AchievementForm.jsx'
import GalleryList from './admin/gallery/GalleryList.jsx'
import GalleryForm from './admin/gallery/GalleryForm.jsx'

function PublicLayout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  )
}

function App() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
        <Route path="/team" element={<PublicLayout><Team /></PublicLayout>} />
        <Route path="/team/:memberId" element={<PublicLayout><MemberProfile /></PublicLayout>} />
        <Route path="/achievements" element={<PublicLayout><Achievements /></PublicLayout>} />
        <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
        <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />

        {/* Admin route group — every route but /admin/login is gated by AdminRoute */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members"
          element={
            <AdminRoute>
              <MembersList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members/new"
          element={
            <AdminRoute>
              <MemberForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/members/:memberId/edit"
          element={
            <AdminRoute>
              <MemberForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events"
          element={
            <AdminRoute>
              <EventsList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events/new"
          element={
            <AdminRoute>
              <EventForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/events/:eventId/edit"
          element={
            <AdminRoute>
              <EventForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/achievements"
          element={
            <AdminRoute>
              <AchievementsList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/achievements/new"
          element={
            <AdminRoute>
              <AchievementForm />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <AdminRoute>
              <GalleryList />
            </AdminRoute>
          }
        />
        <Route
          path="/admin/gallery/new"
          element={
            <AdminRoute>
              <GalleryForm />
            </AdminRoute>
          }
        />
      </Routes>
    </AnimatePresence>
  )
}

export default App
