"""Database SQLite per prototipo autonoleggio."""

from __future__ import annotations

import sqlite3
from contextlib import contextmanager
from datetime import date, timedelta
from pathlib import Path
from typing import Generator

DB_PATH = Path(__file__).parent / "autonoleggio.db"

VEICOLI_SEED = [
    ("Furgone", "FORD TRANSIT 350M 2.2", "DV344HD", "Bianco", "Diesel"),
    ("Furgone", "MERCEDES VITO", "EG154AM", "Bianco", "Diesel"),
    ("Furgone", "IVECO DAILY", "EV840AM", "Bianco", "Diesel"),
    ("Furgone", "Citroen JUMPY CUSTOM 2.0TDCi", "FR523SW", "Bianco scuro", "Diesel"),
    ("Furgone", "FIAT DUCATO", "GA891BC", "Bianco", "Diesel"),
    ("Auto", "FIAT PANDA", "GH234DE", "Grigio", "Benzina"),
    ("Auto", "VOLKSWAGEN GOLF", "GL567FG", "Nero", "Diesel"),
    ("Furgone", "RENAULT TRAFIC", "GM890HI", "Bianco", "Diesel"),
]

CLIENTI_SEED = [
    ("Mario", "Rossi", "RSSMRA80A01L424X", "3331234567", "mario.rossi@email.it"),
    ("Laura", "Bianchi", "BNCLRA85D45F205Y", "3409876543", "laura.bianchi@email.it"),
    ("Giuseppe", "Verdi", "VRDGPP70C15H501Z", "3281122334", "giuseppe.verdi@email.it"),
    ("Alex", "Marchetti", "MRCLXA75L22Z133O", "3356677889", "alex.marchetti@email.it"),
]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


@contextmanager
def db_session() -> Generator[sqlite3.Connection, None, None]:
    conn = get_connection()
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
    finally:
        conn.close()


def init_db() -> None:
    with db_session() as conn:
        conn.executescript(
            """
            CREATE TABLE IF NOT EXISTS veicoli (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                tipo TEXT NOT NULL,
                marca_modello TEXT NOT NULL,
                targa TEXT NOT NULL UNIQUE,
                colore TEXT,
                alimentazione TEXT,
                attivo INTEGER NOT NULL DEFAULT 1
            );

            CREATE TABLE IF NOT EXISTS clienti (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                cognome TEXT NOT NULL,
                codice_fiscale TEXT,
                telefono TEXT,
                email TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime'))
            );

            CREATE TABLE IF NOT EXISTS prenotazioni (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                veicolo_id INTEGER NOT NULL,
                cliente_id INTEGER,
                data_ritiro TEXT NOT NULL,
                ora_ritiro TEXT NOT NULL DEFAULT '09:00',
                data_riconsegna TEXT NOT NULL,
                ora_riconsegna TEXT NOT NULL DEFAULT '18:00',
                stato TEXT NOT NULL DEFAULT 'prenotazione',
                note TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now','localtime')),
                FOREIGN KEY (veicolo_id) REFERENCES veicoli(id),
                FOREIGN KEY (cliente_id) REFERENCES clienti(id)
            );

            CREATE INDEX IF NOT EXISTS idx_prenotazioni_date
                ON prenotazioni(data_ritiro, data_riconsegna);

            CREATE TABLE IF NOT EXISTS impostazioni (
                chiave TEXT PRIMARY KEY,
                valore TEXT NOT NULL
            );
            """
        )

        count = conn.execute("SELECT COUNT(*) FROM veicoli").fetchone()[0]
        if count == 0:
            _seed(conn)

        if conn.execute("SELECT COUNT(*) FROM impostazioni").fetchone()[0] == 0:
            for k, v in {
                "ditta": "LILO S.R.L.",
                "sede": "VIALE CAMPI ELISI 38/B - TRIESTE",
                "luogo": "TRIESTE",
                "telefono": "0402471720",
            }.items():
                conn.execute("INSERT INTO impostazioni (chiave, valore) VALUES (?, ?)", (k, v))


def _seed(conn: sqlite3.Connection) -> None:
    for tipo, modello, targa, colore, alim in VEICOLI_SEED:
        conn.execute(
            "INSERT INTO veicoli (tipo, marca_modello, targa, colore, alimentazione) VALUES (?,?,?,?,?)",
            (tipo, modello, targa, colore, alim),
        )

    for nome, cognome, cf, tel, email in CLIENTI_SEED:
        conn.execute(
            "INSERT INTO clienti (nome, cognome, codice_fiscale, telefono, email) VALUES (?,?,?,?,?)",
            (nome, cognome, cf, tel, email),
        )

    oggi = date.today()
    esempi = [
        (1, 1, oggi + timedelta(days=1), oggi + timedelta(days=4), "contratto"),
        (2, 2, oggi + timedelta(days=2), oggi + timedelta(days=5), "prenotazione"),
        (4, 4, oggi - timedelta(days=1), oggi + timedelta(days=2), "contratto"),
        (3, 3, oggi + timedelta(days=7), oggi + timedelta(days=10), "prenotazione"),
    ]
    for veicolo_id, cliente_id, ritiro, riconsegna, stato in esempi:
        conn.execute(
            """
            INSERT INTO prenotazioni
                (veicolo_id, cliente_id, data_ritiro, data_riconsegna, stato)
            VALUES (?, ?, ?, ?, ?)
            """,
            (veicolo_id, cliente_id, ritiro.isoformat(), riconsegna.isoformat(), stato),
        )
