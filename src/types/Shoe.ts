export interface Shoe {
  id: number;
  nev: string;
  marka: string;
  kiadasDatuma: string;
  ar: number;
  kollekcios: boolean;
  kep: string;
  leiras: string;
}

export type NewShoe = Omit<Shoe, "id">;
