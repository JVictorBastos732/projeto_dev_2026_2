import { Routes, Route } from 'react-router-dom';
import Home from './pages/Public/Home';
import FormSubmission from './pages/Public/FormSubmission';
// import ConsultaProtocolo from './pages/Public/ConsultaProtocolo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submeter" element={<FormSubmission />} />
      {/* <Route path="/consultar" element={<ConsultaProtocolo />} /> */}
    </Routes>
  );
}