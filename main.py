"""Gestionale autonoleggio LILO — dashboard e moduli collegati."""

from __future__ import annotations

from datetime import date, timedelta
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

import database as db

app = FastAPI(title="Autonoleggio LILO")

STATIC_DIR = Path(__file__).parent / "static"
app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")

PRENOTAZIONE_SELECT = """
    SELECT p.*,
           v.targa, v.marca_modello, v.tipo AS veicolo_tipo,
           c.nome AS cliente_nome, c.cognome AS cliente_cognome,
           c.telefono AS cliente_telefono, c.codice_fiscale AS cliente_cf
    FROM prenotazioni p
    JOIN veicoli v ON v.id = p.veicolo_id
    LEFT JOIN clienti c ON c.id = p.cliente_id
"""


class PrenotazioneCreate(BaseModel):
    veicolo_id: int
    cliente_id: Optional[int] = None
    data_ritiro: str
    ora_ritiro: str = "09:00"
    data_riconsegna: str
    ora_riconsegna: str = "18:00"
    note: str = ""


class ClienteCreate(BaseModel):
    nome: str = Field(..., min_length=1)
    cognome: str = Field(..., min_length=1)
    codice_fiscale: str = ""
    telefono: str = ""
    email: str = ""


class StatoUpdate(BaseModel):
    stato: str = Field(..., pattern="^(prenotazione|contratto)$")


@app.on_event("startup")
def startup() -> None:
    db.init_db()


@app.get("/")
async def index():
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/dashboard")
async def dashboard():
    oggi = date.today().isoformat()
    with db.db_session() as conn:
        veicoli = conn.execute("SELECT COUNT(*) FROM veicoli WHERE attivo = 1").fetchone()[0]
        clienti = conn.execute("SELECT COUNT(*) FROM clienti").fetchone()[0]
        contratti = conn.execute(
            "SELECT COUNT(*) FROM prenotazioni WHERE stato = 'contratto' AND data_ritiro <= ? AND data_riconsegna >= ?",
            (oggi, oggi),
        ).fetchone()[0]
        prenotazioni = conn.execute(
            "SELECT COUNT(*) FROM prenotazioni WHERE stato = 'prenotazione' AND data_riconsegna >= ?",
            (oggi,),
        ).fetchone()[0]
        ritiri_oggi = conn.execute(
            "SELECT COUNT(*) FROM prenotazioni WHERE data_ritiro = ?", (oggi,)
        ).fetchone()[0]
        riconsegne_oggi = conn.execute(
            "SELECT COUNT(*) FROM prenotazioni WHERE data_riconsegna = ?", (oggi,)
        ).fetchone()[0]
        prossimi = conn.execute(
            f"""
            {PRENOTAZIONE_SELECT}
            WHERE p.data_riconsegna >= ?
            ORDER BY p.data_ritiro, p.ora_ritiro
            LIMIT 8
            """,
            (oggi,),
        ).fetchall()
        impostazioni = {
            r["chiave"]: r["valore"]
            for r in conn.execute("SELECT chiave, valore FROM impostazioni").fetchall()
        }
    return {
        "oggi": oggi,
        "veicoli": veicoli,
        "clienti": clienti,
        "contratti_attivi": contratti,
        "prenotazioni_aperte": prenotazioni,
        "ritiri_oggi": ritiri_oggi,
        "riconsegne_oggi": riconsegne_oggi,
        "prossimi_noleggi": [dict(r) for r in prossimi],
        "impostazioni": impostazioni,
    }


@app.get("/api/veicoli")
async def list_veicoli():
    with db.db_session() as conn:
        rows = conn.execute(
            "SELECT * FROM veicoli WHERE attivo = 1 ORDER BY tipo, marca_modello"
        ).fetchall()
    return [dict(r) for r in rows]


@app.get("/api/veicoli/{veicolo_id}")
async def get_veicolo(veicolo_id: int):
    with db.db_session() as conn:
        row = conn.execute("SELECT * FROM veicoli WHERE id = ?", (veicolo_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Veicolo non trovato")
        noleggi = conn.execute(
            f"{PRENOTAZIONE_SELECT} WHERE p.veicolo_id = ? ORDER BY p.data_ritiro DESC LIMIT 20",
            (veicolo_id,),
        ).fetchall()
    return {"veicolo": dict(row), "noleggi": [dict(r) for r in noleggi]}


@app.get("/api/clienti")
async def list_clienti(q: str = Query("", max_length=80), limit: int = Query(50, ge=1, le=500)):
    with db.db_session() as conn:
        if q.strip():
            like = f"%{q.strip()}%"
            rows = conn.execute(
                """
                SELECT c.*,
                       (SELECT COUNT(*) FROM prenotazioni p WHERE p.cliente_id = c.id) AS noleggi_count
                FROM clienti c
                WHERE c.nome LIKE ? OR c.cognome LIKE ? OR c.codice_fiscale LIKE ?
                   OR c.telefono LIKE ?
                ORDER BY c.cognome, c.nome
                LIMIT ?
                """,
                (like, like, like, like, limit),
            ).fetchall()
        else:
            rows = conn.execute(
                """
                SELECT c.*,
                       (SELECT COUNT(*) FROM prenotazioni p WHERE p.cliente_id = c.id) AS noleggi_count
                FROM clienti c
                ORDER BY c.cognome, c.nome
                LIMIT ?
                """,
                (limit,),
            ).fetchall()
    return [dict(r) for r in rows]


@app.get("/api/clienti/{cliente_id}")
async def get_cliente(cliente_id: int):
    with db.db_session() as conn:
        row = conn.execute("SELECT * FROM clienti WHERE id = ?", (cliente_id,)).fetchone()
        if not row:
            raise HTTPException(status_code=404, detail="Cliente non trovato")
        noleggi = conn.execute(
            f"{PRENOTAZIONE_SELECT} WHERE p.cliente_id = ? ORDER BY p.data_ritiro DESC",
            (cliente_id,),
        ).fetchall()
    return {"cliente": dict(row), "noleggi": [dict(r) for r in noleggi]}


@app.post("/api/clienti")
async def create_cliente(body: ClienteCreate):
    with db.db_session() as conn:
        cur = conn.execute(
            """
            INSERT INTO clienti (nome, cognome, codice_fiscale, telefono, email)
            VALUES (?, ?, ?, ?, ?)
            """,
            (body.nome.strip(), body.cognome.strip(), body.codice_fiscale.strip(),
             body.telefono.strip(), body.email.strip()),
        )
        row = conn.execute("SELECT * FROM clienti WHERE id = ?", (cur.lastrowid,)).fetchone()
    return dict(row)


@app.get("/api/prenotazioni")
async def list_prenotazioni(
    da: str = Query(..., description="Data inizio YYYY-MM-DD"),
    a: str = Query(..., description="Data fine YYYY-MM-DD"),
):
    with db.db_session() as conn:
        rows = conn.execute(
            f"""
            {PRENOTAZIONE_SELECT}
            WHERE p.data_ritiro <= ? AND p.data_riconsegna >= ?
            ORDER BY p.data_ritiro
            """,
            (a, da),
        ).fetchall()
    return [dict(r) for r in rows]


@app.get("/api/prenotazioni/elenco")
async def elenco_prenotazioni(
    stato: str = Query("", max_length=20),
    q: str = Query("", max_length=80),
):
    with db.db_session() as conn:
        sql = f"{PRENOTAZIONE_SELECT} WHERE 1=1"
        params: list = []
        if stato in ("prenotazione", "contratto"):
            sql += " AND p.stato = ?"
            params.append(stato)
        if q.strip():
            like = f"%{q.strip()}%"
            sql += " AND (v.targa LIKE ? OR c.cognome LIKE ? OR c.nome LIKE ?)"
            params.extend([like, like, like])
        sql += " ORDER BY p.data_ritiro DESC LIMIT 100"
        rows = conn.execute(sql, params).fetchall()
    return [dict(r) for r in rows]


@app.get("/api/prenotazioni/{prenotazione_id}")
async def get_prenotazione(prenotazione_id: int):
    with db.db_session() as conn:
        row = conn.execute(
            f"{PRENOTAZIONE_SELECT} WHERE p.id = ?",
            (prenotazione_id,),
        ).fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Prenotazione non trovata")
    return dict(row)


@app.post("/api/prenotazioni")
async def create_prenotazione(body: PrenotazioneCreate):
    if body.data_riconsegna < body.data_ritiro:
        raise HTTPException(status_code=400, detail="La riconsegna deve essere dopo il ritiro")

    with db.db_session() as conn:
        overlap = conn.execute(
            """
            SELECT COUNT(*) FROM prenotazioni
            WHERE veicolo_id = ?
              AND data_ritiro <= ? AND data_riconsegna >= ?
            """,
            (body.veicolo_id, body.data_riconsegna, body.data_ritiro),
        ).fetchone()[0]
        if overlap:
            raise HTTPException(status_code=409, detail="Veicolo già occupato in queste date")

        cur = conn.execute(
            """
            INSERT INTO prenotazioni
                (veicolo_id, cliente_id, data_ritiro, ora_ritiro,
                 data_riconsegna, ora_riconsegna, note, stato)
            VALUES (?, ?, ?, ?, ?, ?, ?, 'prenotazione')
            """,
            (
                body.veicolo_id, body.cliente_id, body.data_ritiro, body.ora_ritiro,
                body.data_riconsegna, body.ora_riconsegna, body.note.strip(),
            ),
        )
        row = conn.execute(
            f"{PRENOTAZIONE_SELECT} WHERE p.id = ?",
            (cur.lastrowid,),
        ).fetchone()
    return dict(row)


@app.patch("/api/prenotazioni/{prenotazione_id}/stato")
async def update_stato(prenotazione_id: int, body: StatoUpdate):
    with db.db_session() as conn:
        cur = conn.execute(
            "UPDATE prenotazioni SET stato = ? WHERE id = ?",
            (body.stato, prenotazione_id),
        )
        if cur.rowcount == 0:
            raise HTTPException(status_code=404, detail="Prenotazione non trovata")
        row = conn.execute(
            f"{PRENOTAZIONE_SELECT} WHERE p.id = ?",
            (prenotazione_id,),
        ).fetchone()
    return dict(row)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8765, reload=True)
