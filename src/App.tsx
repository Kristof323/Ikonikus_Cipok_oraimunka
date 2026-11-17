import { FormEvent, useEffect, useState } from "react";
import { NewShoe, Shoe } from "./types/Shoe";
import "./App.css";

const API_URL = "http://localhost:3000/cipok";

const uresCipo: NewShoe = {
  nev: "",
  marka: "",
  kiadasDatuma: "",
  ar: 0,
  kollekcios: false,
  kep: "",
  leiras: "",
};

function App() {
  const [cipok, setCipok] = useState<Shoe[]>([]);
  const [ujCipo, setUjCipo] = useState<NewShoe>(uresCipo);
  const [betoltes, setBetoltes] = useState(true);
  const [hiba, setHiba] = useState("");
  const [siker, setSiker] = useState("");

  const cipokBetoltese = async () => {
    try {
      setBetoltes(true);
      setHiba("");

      const valasz = await fetch(API_URL);

      if (!valasz.ok) {
        throw new Error("A cipők betöltése nem sikerült.");
      }

      const adatok: Shoe[] = await valasz.json();
      setCipok(adatok);
    } catch (error) {
      setHiba(
        error instanceof Error
          ? error.message
          : "Váratlan hiba történt az adatok betöltése közben.",
      );
    } finally {
      setBetoltes(false);
    }
  };

  useEffect(() => {
    cipokBetoltese();
  }, []);

  const urlapValtozas = (
    esemeny: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = esemeny.target;

    setUjCipo((elozo) => ({
      ...elozo,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  const cipoMentese = async (esemeny: FormEvent<HTMLFormElement>) => {
    esemeny.preventDefault();
    setHiba("");
    setSiker("");

    try {
      const valasz = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ujCipo),
      });

      if (!valasz.ok) {
        throw new Error("Az új cipő mentése nem sikerült.");
      }

      setUjCipo(uresCipo);
      setSiker("A cipő sikeresen hozzáadva!");
      await cipokBetoltese();
    } catch (error) {
      setHiba(
        error instanceof Error
          ? error.message
          : "Váratlan hiba történt a mentés közben.",
      );
    }
  };

  return (
    <div className="alkalmazas">
      <header className="fejlec text-center text-white py-5">
        <div className="container">
          <h1 className="display-4 fw-bold">Ikonikus cipők</h1>
          <p className="lead mb-0">
            Legendás modellek, történetek és stílusok egy helyen.
          </p>
        </div>
      </header>

      <main className="container py-5">
        {hiba && (
          <div className="alert alert-danger" role="alert">
            {hiba}
          </div>
        )}

        {siker && (
          <div className="alert alert-success" role="alert">
            {siker}
          </div>
        )}

        <section className="row g-4">
          <div className="col-lg-8">
            <h2 className="h3 mb-4">Cipők listája</h2>

            {betoltes ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Betöltés...</span>
                </div>
              </div>
            ) : (
              <div className="row g-4">
                {cipok.map((cipo) => (
                  <div className="col-md-6" key={cipo.id}>
                    <article className="card cipo-kartya h-100 shadow-sm">
                      <img
                        src={cipo.kep}
                        alt={`${cipo.marka} ${cipo.nev}`}
                        className="card-img-top cipo-kep"
                      />

                      <div className="card-body d-flex flex-column">
                        <div className="d-flex justify-content-between align-items-start">
                          <h3 className="h5 mb-1">{cipo.nev}</h3>
                          {cipo.kollekcios && (
                            <span className="badge kollekcios-jel">Kollekciós</span>
                          )}
                        </div>

                        <p className="text-muted small mb-2">{cipo.marka}</p>
                        <p className="flex-grow-1">{cipo.leiras}</p>

                        <div className="d-flex justify-content-between align-items-center mt-3">
                          <strong>{cipo.ar.toLocaleString("hu-HU")} Ft</strong>
                          <span className="text-muted small">
                            {new Date(cipo.kiadasDatuma).toLocaleDateString("hu-HU")}
                          </span>
                        </div>
                      </div>
                    </article>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card shadow-sm h-100">
              <div className="card-body">
                <h2 className="h4 mb-4">Új cipő felvétele</h2>

                <form onSubmit={cipoMentese}>
                  <div className="mb-3">
                    <label htmlFor="nev" className="form-label">
                      Név
                    </label>
                    <input
                      id="nev"
                      name="nev"
                      type="text"
                      className="form-control"
                      value={ujCipo.nev}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="marka" className="form-label">
                      Márka
                    </label>
                    <input
                      id="marka"
                      name="marka"
                      type="text"
                      className="form-control"
                      value={ujCipo.marka}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="kiadasDatuma" className="form-label">
                      Kiadás dátuma
                    </label>
                    <input
                      id="kiadasDatuma"
                      name="kiadasDatuma"
                      type="date"
                      className="form-control"
                      value={ujCipo.kiadasDatuma}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="ar" className="form-label">
                      Ár (Ft)
                    </label>
                    <input
                      id="ar"
                      name="ar"
                      type="number"
                      min="0"
                      className="form-control"
                      value={ujCipo.ar}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="kep" className="form-label">
                      Kép URL
                    </label>
                    <input
                      id="kep"
                      name="kep"
                      type="url"
                      className="form-control"
                      value={ujCipo.kep}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="leiras" className="form-label">
                      Leírás
                    </label>
                    <textarea
                      id="leiras"
                      name="leiras"
                      className="form-control"
                      rows={3}
                      value={ujCipo.leiras}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="form-check form-switch mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      role="switch"
                      id="kollekcios"
                      name="kollekcios"
                      checked={ujCipo.kollekcios}
                      onChange={(esemeny) =>
                        setUjCipo((elozo) => ({
                          ...elozo,
                          kollekcios: esemeny.target.checked,
                        }))
                      }
                    />
                    <label className="form-check-label" htmlFor="kollekcios">
                      Kollekciós darab
                    </label>
                  </div>

                  <button type="submit" className="btn btn-dark w-100">
                    Cipő hozzáadása
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="lablec text-center text-white py-4 mt-auto">
        <div className="container">
          <p className="mb-0">Ikonikus cipők – React, json-server és Bootstrap</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
