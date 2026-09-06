import { Routes, Route } from 'react-router-dom';
import Home from './pages/Public/Home';
// import FormularioSubmissao from './pages/Public/FormularioSubmissao';
// import ConsultaProtocolo from './pages/Public/ConsultaProtocolo';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/submeter" element={<FormularioSubmissao />} />
      <Route path="/consultar" element={<ConsultaProtocolo />} /> */}
    </Routes>
  );
}