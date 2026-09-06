import { useState } from 'react'
import heroImg from './assets/hero.png'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import './App.css'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/submeter" element={<FormularioSubmissao />} />
      <Route path="/consultar" element={<ConsultaProtocolo />} />
    </Routes>
  );
}