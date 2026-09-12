import ProtectedRoute from './ProtectedRoute.jsx'
import AdminLayout from './AdminLayout.jsx'

// Composes the two wrappers every protected admin page needs, so App.jsx
// doesn't repeat the nesting for each /admin/* route.
function AdminRoute({ children }) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  )
}

export default AdminRoute
