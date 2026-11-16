import { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import './App.css'
import type { Cipo } from './types/cipok';

function App() {
  const [cipo, setCipo] = useState<Cipo[]>([])
useEffect(() => {
  async function fetchCipo() {
    try {
    const response = await fetch('http://localhost:3000/cipok');
    const data = await response.json();
    setCipo(data);
    }
  
  catch (error) {
    console.error('Hiba a cipok lekérésekor:', error);
  }}
  fetchCipo();
}, [] );


  return (
    <>
      <h1>Ikonikus Cipok</h1>
      {
        cipo.map((cipo) => (
          <div key={cipo.nev}>
            <h2>{cipo.nev}</h2>
            <p>Kiadas: {new Date(cipo.kiadas).toLocaleDateString()}</p>
            <p>Eladva: {cipo.eladva}</p>
            <p>Elerheto: {cipo.elerheto ? 'Igen' : 'Nem'}</p>
          </div>
        ))
      }
    </>
    
  )
}

export default App
