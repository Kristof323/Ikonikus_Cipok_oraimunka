import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

type Cipo = { id: string | number; nev: string; marka: string; ar: number; kiadasDatuma: string; kollekcios: boolean };
const api = 'http://localhost:3000/cipok';
const ures = { nev: '', marka: '', ar: 0, kiadasDatuma: '', kollekcios: false };

export default function App() {
  const [cipok, setCipok] = useState<Cipo[]>([]);
  const [adat, setAdat] = useState(ures);
  const [id, setId] = useState<string | number | null>(null);
  const [hiba, setHiba] = useState('');
  const [mentes, setMentes] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    fetch(api, { signal: controller.signal })
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(setCipok)
      .catch(() => { if (!controller.signal.aborted) setHiba('Nem sikerült betölteni a cipőket. Fut a json-server?'); });
    return () => controller.abort();
  }, []);

  function alaphelyzet() { setAdat(ures); setId(null); }

  async function ment(esemeny: FormEvent<HTMLFormElement>) {
    esemeny.preventDefault();
    setMentes(true);
    setHiba('');
    try {
      const res = await fetch(id === null ? api : `${api}/${id}`, {
        method: id === null ? 'POST' : 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(adat),
      });
      if (!res.ok) throw new Error();
      const cipo: Cipo = await res.json();
      setCipok(elozo => id === null ? [...elozo, cipo] : elozo.map(elem => elem.id === id ? cipo : elem));
      alaphelyzet();
    } catch { setHiba('Nem sikerült menteni.'); }
    finally { setMentes(false); }
  }

  async function torol(cipo: Cipo) {
    if (!window.confirm(`Törlöd ezt a cipőt: ${cipo.nev}?`)) return;
    setHiba('');
    try {
      const res = await fetch(`${api}/${cipo.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setCipok(elozo => elozo.filter(elem => elem.id !== cipo.id));
      if (id === cipo.id) alaphelyzet();
    } catch { setHiba('Nem sikerült törölni.'); }
  }

  return (
    <main className="container py-4">
      <h1 className="mb-4">Ikonikus cipők</h1>
      {hiba && <p className="alert alert-danger" role="alert">{hiba}</p>}
      <div className="row g-4">
        <section className="col-lg-8" aria-label="Cipők">
          <div className="row g-3">
            {cipok.map(cipo => (
              <div className="col-md-6" key={cipo.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h2 className="h5 card-title">{cipo.nev}</h2>
                    <p>Márka: {cipo.marka}</p>
                    <p>Ár: {cipo.ar.toLocaleString('hu-HU')} Ft</p>
                    <p>Kiadás: {cipo.kiadasDatuma}</p>
                    <p>Kollekciós: {cipo.kollekcios ? 'Igen' : 'Nem'}</p>
                    <button className="btn btn-primary btn-sm me-2" onClick={() => { setId(cipo.id); setAdat({ nev: cipo.nev, marka: cipo.marka, ar: cipo.ar, kiadasDatuma: cipo.kiadasDatuma, kollekcios: cipo.kollekcios }); }}>Szerkesztés</button>
                    <button className="btn btn-danger btn-sm" onClick={() => torol(cipo)}>Törlés</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
        <section className="col-lg-4">
          <h2 className="h4">{id === null ? 'Új cipő' : 'Cipő szerkesztése'}</h2>
          <form onSubmit={ment}>
            <fieldset disabled={mentes}>
              <label htmlFor="nev" className="form-label">Név</label>
              <input id="nev" className="form-control mb-3" required value={adat.nev} onChange={e => setAdat({ ...adat, nev: e.target.value })} />
              <label htmlFor="marka" className="form-label">Márka</label>
              <input id="marka" className="form-control mb-3" required value={adat.marka} onChange={e => setAdat({ ...adat, marka: e.target.value })} />
              <label htmlFor="ar" className="form-label">Ár (Ft)</label>
              <input id="ar" type="number" min="0" step="1" className="form-control mb-3" required value={adat.ar} onChange={e => setAdat({ ...adat, ar: Number(e.target.value) })} />
              <label htmlFor="datum" className="form-label">Kiadás dátuma</label>
              <input id="datum" type="date" className="form-control mb-3" required value={adat.kiadasDatuma} onChange={e => setAdat({ ...adat, kiadasDatuma: e.target.value })} />
              <div className="form-check mb-3">
                <input id="kollekcios" type="checkbox" className="form-check-input" checked={adat.kollekcios} onChange={e => setAdat({ ...adat, kollekcios: e.target.checked })} />
                <label htmlFor="kollekcios" className="form-check-label">Kollekciós</label>
              </div>
              <button className="btn btn-success me-2" type="submit">{mentes ? 'Mentés...' : 'Mentés'}</button>
              {id !== null && <button className="btn btn-secondary" type="button" onClick={alaphelyzet}>Mégse</button>}
            </fieldset>
          </form>
        </section>
      </div>
    </main>
  );
}
