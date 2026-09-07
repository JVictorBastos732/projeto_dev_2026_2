import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Home from './pages/Public/Home';
import FormSubmission from './pages/Public/FormSubmission';
import ConsulProtocol from './pages/Public/ConsultProtocol';
import AdminLogin from './pages/Admin/Login';

export default function App() {
  return (
    <AuthProvider>
       <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submeter" element={<FormSubmission />} />
      <Route path="/consultar" element={<ConsulProtocol />} />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminSubmissions />
            </ProtectedRoute>
          }
        />
    </Routes>
    </AuthProvider>
   
  );
}