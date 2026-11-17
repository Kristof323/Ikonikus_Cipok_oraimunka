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
  const [szerkesztendoCipo, setSzerkesztendoCipo] = useState<Shoe | null>(null);
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
      setHiba(error instanceof Error ? error.message : "Váratlan hiba történt.");
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
    const ertek = type === "number" ? Number(value) : value;

    if (szerkesztendoCipo) {
      setSzerkesztendoCipo({ ...szerkesztendoCipo, [name]: ertek });
    } else {
      setUjCipo({ ...ujCipo, [name]: ertek });
    }
  };

  const cipoMentese = async (esemeny: FormEvent<HTMLFormElement>) => {
    esemeny.preventDefault();
    setHiba("");
    setSiker("");

    try {
      const valasz = await fetch(
        szerkesztendoCipo ? `${API_URL}/${szerkesztendoCipo.id}` : API_URL,
        {
          method: szerkesztendoCipo ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(szerkesztendoCipo ?? ujCipo),
        },
      );

      if (!valasz.ok) {
        throw new Error(
          szerkesztendoCipo
            ? "A cipő módosítása nem sikerült."
            : "Az új cipő mentése nem sikerült.",
        );
      }

      setSiker(
        szerkesztendoCipo
          ? "A cipő sikeresen módosítva!"
          : "A cipő sikeresen hozzáadva!",
      );

      setUjCipo(uresCipo);
      setSzerkesztendoCipo(null);
      await cipokBetoltese();
    } catch (error) {
      setHiba(error instanceof Error ? error.message : "Váratlan hiba történt.");
    }
  };

  const cipoTorlese = async (id: number) => {
    setHiba("");
    setSiker("");

    try {
      const valasz = await fetch(`${API_URL}/${id}`, { method: "DELETE" });

      if (!valasz.ok) {
        throw new Error("A cipő törlése nem sikerült.");
      }

      setSiker("A cipő sikeresen törölve!");
      await cipokBetoltese();
    } catch (error) {
      setHiba(error instanceof Error ? error.message : "Váratlan hiba történt.");
    }
  };

  const aktivCipo = szerkesztendoCipo ?? ujCipo;

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
        {hiba && <div className="alert alert-danger">{hiba}</div>}
        {siker && <div className="alert alert-success">{siker}</div>}

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
                      <img src={cipo.kep} alt={cipo.nev} className="card-img-top cipo-kep" />

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

                        <div className="d-flex gap-2 mt-3">
                          <button
                            className="btn btn-outline-primary btn-sm flex-grow-1"
                            onClick={() => setSzerkesztendoCipo(cipo)}
                          >
                            Szerkesztés
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm flex-grow-1"
                            onClick={() => cipoTorlese(cipo.id)}
                          >
                            Törlés
                          </button>
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
                <h2 className="h4 mb-4">
                  {szerkesztendoCipo ? "Cipő módosítása" : "Új cipő felvétele"}
                </h2>

                <form onSubmit={cipoMentese}>
                  <div className="mb-3">
                    <label className="form-label" htmlFor="nev">Név</label>
                    <input
                      id="nev"
                      name="nev"
                      className="form-control"
                      value={aktivCipo.nev}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="marka">Márka</label>
                    <input
                      id="marka"
                      name="marka"
                      className="form-control"
                      value={aktivCipo.marka}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="kiadasDatuma">Kiadás dátuma</label>
                    <input
                      id="kiadasDatuma"
                      name="kiadasDatuma"
                      type="date"
                      className="form-control"
                      value={aktivCipo.kiadasDatuma}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="ar">Ár (Ft)</label>
                    <input
                      id="ar"
                      name="ar"
                      type="number"
                      min="0"
                      className="form-control"
                      value={aktivCipo.ar}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="kep">Kép URL</label>
                    <input
                      id="kep"
                      name="kep"
                      type="url"
                      className="form-control"
                      value={aktivCipo.kep}
                      onChange={urlapValtozas}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label" htmlFor="leiras">Leírás</label>
                    <textarea
                      id="leiras"
                      name="leiras"
                      rows={3}
                      className="form-control"
                      value={aktivCipo.leiras}
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
                      checked={aktivCipo.kollekcios}
                      onChange={(esemeny) => {
                        const ertek = esemeny.target.checked;

                        if (szerkesztendoCipo) {
                          setSzerkesztendoCipo({ ...szerkesztendoCipo, kollekcios: ertek });
                        } else {
                          setUjCipo({ ...ujCipo, kollekcios: ertek });
                        }
                      }}
                    />
                    <label className="form-check-label" htmlFor="kollekcios">
                      Kollekciós darab
                    </label>
                  </div>

                  <div className="d-grid gap-2">
                    <button type="submit" className="btn btn-dark">
                      {szerkesztendoCipo ? "Módosítás mentése" : "Cipő hozzáadása"}
                    </button>

                    {szerkesztendoCipo && (
                      <button
                        type="button"
                        className="btn btn-outline-secondary"
                        onClick={() => setSzerkesztendoCipo(null)}
                      >
                        Mégse
                      </button>
                    )}
                  </div>
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
