/** Gestionale autonoleggio — router e moduli collegati */
const App = (() => {
  const PAGES = {
    dashboard: { title: "Dashboard", subtitle: "Panoramica operativa del noleggio" },
    calendario: { title: "Calendario flotta", subtitle: "Seleziona i giorni e crea la prenotazione" },
    prenotazioni: { title: "Prenotazioni e contratti", subtitle: "Elenco noleggi collegati a clienti e veicoli" },
    clienti: { title: "Clienti", subtitle: "Anagrafica clienti e storico noleggi" },
    flotta: { title: "Flotta veicoli", subtitle: "Veicoli disponibili e loro occupazione" },
    tariffario: { title: "Tariffario", subtitle: "Listini e tariffe di noleggio" },
    cargos: { title: "CARGOS", subtitle: "Invio dati alla Polizia di Stato" },
    impostazioni: { title: "Impostazioni", subtitle: "Dati azienda e configurazione" },
  };

  const ctx = { clienteId: null, veicoloId: null, prenotazioneId: null };

  const $ = (sel, root = document) => root.querySelector(sel);

  function todayISO() { return new Date().toISOString().slice(0, 10); }

  function pad(n) { return String(n).padStart(2, "0"); }

  function formatIT(iso) {
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  function badgeStato(stato) {
    const cls = stato === "contratto" ? "badge-contratto" : "badge-prenotazione";
    const label = stato === "contratto" ? "Contratto" : "Prenotazione";
    return `<span class="badge ${cls}">${label}</span>`;
  }

  function showStatus(msg, ok = true) {
    const el = $("#status");
    el.textContent = msg;
    el.className = `status ${ok ? "ok" : "err"}`;
    setTimeout(() => el.classList.add("hidden"), 4000);
  }

  async function api(path, opts = {}) {
    const res = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      ...opts,
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
      throw new Error(detail || res.statusText);
    }
    return data;
  }

  function navigate(page, params = {}) {
    if (params.clienteId != null) ctx.clienteId = params.clienteId;
    if (params.veicoloId != null) ctx.veicoloId = params.veicoloId;
    if (params.prenotazioneId != null) ctx.prenotazioneId = params.prenotazioneId;
    location.hash = page;
    renderPage(page);
  }

  function setActiveNav(page) {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.page === page);
    });
  }

  function setHeader(page, actionsHtml = "") {
    const info = PAGES[page] || PAGES.dashboard;
    $("#page-title").textContent = info.title;
    $("#page-subtitle").textContent = info.subtitle;
    $("#page-actions").innerHTML = actionsHtml;
  }

  // ─── DASHBOARD ───
  async function renderDashboard() {
    setHeader("dashboard");
    const d = await api("/api/dashboard");
    if (d.impostazioni?.ditta) $("#sidebar-ditta").textContent = d.impostazioni.ditta;

    const ritiri = d.prossimi_noleggi.filter((p) => p.data_ritiro === d.oggi);
    const riconsegne = d.prossimi_noleggi.filter((p) => p.data_riconsegna === d.oggi);

    $("#page-content").innerHTML = `
      <div class="metrics">
        <div class="metric-card"><strong>${d.veicoli}</strong><span>Veicoli in flotta</span></div>
        <div class="metric-card"><strong>${d.clienti}</strong><span>Clienti in anagrafica</span></div>
        <div class="metric-card"><strong>${d.contratti_attivi}</strong><span>Contratti attivi oggi</span></div>
        <div class="metric-card"><strong>${d.prenotazioni_aperte}</strong><span>Prenotazioni aperte</span></div>
        <div class="metric-card"><strong>${d.ritiri_oggi}</strong><span>Ritiri oggi</span></div>
        <div class="metric-card"><strong>${d.riconsegne_oggi}</strong><span>Riconsegne oggi</span></div>
      </div>

      <div class="quick-grid">
        <button class="quick-card" data-goto="calendario">
          <strong>Calendario flotta</strong>
          <small>Seleziona giorni e crea prenotazione</small>
        </button>
        <button class="quick-card" data-goto="prenotazioni">
          <strong>Prenotazioni e contratti</strong>
          <small>Elenco completo noleggi</small>
        </button>
        <button class="quick-card" data-goto="clienti">
          <strong>Anagrafica clienti</strong>
          <small>Cerca cliente e storico</small>
        </button>
        <button class="quick-card" data-goto="flotta">
          <strong>Flotta veicoli</strong>
          <small>Stato e disponibilità auto</small>
        </button>
      </div>

      <div class="detail-grid">
        <div class="panel">
          <div class="panel-header">Prossimi noleggi</div>
          ${tableNoleggi(d.prossimi_noleggi, true)}
        </div>
        <div class="panel">
          <div class="panel-header">Oggi — ritiri e riconsegne</div>
          ${ritiri.length || riconsegne.length
            ? tableNoleggi([...ritiri, ...riconsegne.filter((r) => !ritiri.find((x) => x.id === r.id))], true)
            : '<p class="placeholder-box">Nessun ritiro o riconsegna programmato per oggi.</p>'}
        </div>
      </div>
    `;

    $("#page-content").querySelectorAll("[data-goto]").forEach((el) => {
      el.addEventListener("click", () => navigate(el.dataset.goto));
    });
    bindNoleggiClick();
  }

  function tableNoleggi(rows, compact = false) {
    if (!rows.length) return '<p class="placeholder-box">Nessun noleggio.</p>';
    return `<table class="data-table">
      <thead><tr>
        <th>Cliente</th><th>Veicolo</th><th>Ritiro</th>${compact ? "" : "<th>Riconsegna</th>"}<th>Stato</th>
      </tr></thead>
      <tbody>
        ${rows.map((p) => `<tr data-prenotazione="${p.id}">
          <td class="clickable">${p.cliente_cognome || "—"} ${p.cliente_nome || ""}</td>
          <td class="clickable" data-goto-veicolo="${p.veicolo_id}">${p.targa}</td>
          <td>${formatIT(p.data_ritiro)}</td>
          ${compact ? "" : `<td>${formatIT(p.data_riconsegna)}</td>`}
          <td>${badgeStato(p.stato)}</td>
        </tr>`).join("")}
      </tbody>
    </table>`;
  }

  function bindNoleggiClick() {
    $("#page-content").querySelectorAll("[data-prenotazione]").forEach((row) => {
      row.addEventListener("click", (e) => {
        if (e.target.dataset.gotoVeicolo) {
          navigate("flotta", { veicoloId: Number(e.target.dataset.gotoVeicolo) });
          return;
        }
        openDettaglio(Number(row.dataset.prenotazione));
      });
    });
  }

  // ─── CALENDARIO ───
  async function renderCalendario() {
    setHeader("calendario", `
      <button class="btn btn-primary" id="btn-nuova-da-cal">+ Nuova prenotazione</button>
    `);
    $("#page-content").innerHTML = `
      <div class="legend">
        <span><i class="dot free"></i> Libero — trascina per prenotare</span>
        <span><i class="dot booked"></i> Prenotazione</span>
        <span><i class="dot contract"></i> Contratto</span>
        <span><i class="dot selected"></i> Selezione</span>
      </div>
      <div class="cal-toolbar">
        <button id="btn-prev" class="btn btn-ghost">◀</button>
        <strong id="month-label"></strong>
        <button id="btn-next" class="btn btn-ghost">▶</button>
        <button id="btn-today" class="btn btn-ghost">Oggi</button>
      </div>
      <div id="calendar" class="calendar loading">Caricamento...</div>
    `;
    await Calendar.mount($("#page-content"), { veicoloId: ctx.veicoloId });
    ctx.veicoloId = null;
    $("#btn-nuova-da-cal")?.addEventListener("click", () => {
      showStatus("Seleziona i giorni sul calendario oppure clicca su un veicolo in Flotta", false);
      navigate("calendario");
    });
  }

  // ─── PRENOTAZIONI ───
  async function renderPrenotazioni() {
    setHeader("prenotazioni", `<button class="btn btn-primary" id="btn-vai-cal">Vai al calendario</button>`);
    $("#page-content").innerHTML = `
      <div class="toolbar-inline">
        <input type="search" id="filtro-pren" placeholder="Cerca targa o cliente...">
        <select id="filtro-stato">
          <option value="">Tutti gli stati</option>
          <option value="prenotazione">Solo prenotazioni</option>
          <option value="contratto">Solo contratti</option>
        </select>
      </div>
      <div class="panel" id="lista-prenotazioni">Caricamento...</div>
    `;
    const load = async () => {
      const q = $("#filtro-pren").value;
      const stato = $("#filtro-stato").value;
      const rows = await api(`/api/prenotazioni/elenco?q=${encodeURIComponent(q)}&stato=${stato}`);
      $("#lista-prenotazioni").innerHTML = tableNoleggiFull(rows);
      bindPrenotazioniTableActions();
    };
    $("#filtro-pren").addEventListener("input", debounce(load, 300));
    $("#filtro-stato").addEventListener("change", load);
    $("#btn-vai-cal").addEventListener("click", () => navigate("calendario"));
    await load();
  }

  function tableNoleggiFull(rows) {
    if (!rows.length) return '<p class="placeholder-box">Nessun noleggio trovato.</p>';
    return `<table class="data-table">
      <thead><tr>
        <th>#</th><th>Cliente</th><th>Veicolo</th><th>Ritiro</th><th>Riconsegna</th><th>Stato</th><th>Azioni</th>
      </tr></thead>
      <tbody>
        ${rows.map((p) => `<tr>
          <td>${p.id}</td>
          <td class="clickable" data-goto-cliente="${p.cliente_id || ""}">${p.cliente_cognome || "—"} ${p.cliente_nome || ""}</td>
          <td class="clickable" data-goto-veicolo="${p.veicolo_id}">${p.targa}</td>
          <td>${formatIT(p.data_ritiro)} ${p.ora_ritiro}</td>
          <td>${formatIT(p.data_riconsegna)} ${p.ora_riconsegna}</td>
          <td>${badgeStato(p.stato)}</td>
          <td><button class="btn btn-ghost btn-sm" data-dettaglio="${p.id}">Apri</button></td>
        </tr>`).join("")}
      </tbody>
    </table>`;
  }

  // ─── CLIENTI ───
  async function renderClienti() {
    setHeader("clienti", `<button class="btn btn-primary" id="btn-nuovo-cli">+ Nuovo cliente</button>`);

    if (ctx.clienteId) {
      await renderClienteDettaglio(ctx.clienteId);
      return;
    }

    $("#page-content").innerHTML = `
      <div class="toolbar-inline">
        <input type="search" id="filtro-clienti" placeholder="Cerca nome, cognome, CF, telefono...">
      </div>
      <div class="panel" id="lista-clienti">Caricamento...</div>
    `;
    const load = async () => {
      const q = $("#filtro-clienti").value;
      const rows = await api(`/api/clienti?q=${encodeURIComponent(q)}&limit=200`);
      $("#lista-clienti").innerHTML = rows.length ? `<table class="data-table">
        <thead><tr><th>Cognome</th><th>Nome</th><th>CF</th><th>Telefono</th><th>Noleggi</th></tr></thead>
        <tbody>${rows.map((c) => `<tr class="clickable" data-cliente="${c.id}">
          <td>${c.cognome}</td><td>${c.nome}</td><td>${c.codice_fiscale || "—"}</td>
          <td>${c.telefono || "—"}</td><td>${c.noleggi_count || 0}</td>
        </tr>`).join("")}</tbody>
      </table>` : '<p class="placeholder-box">Nessun cliente trovato.</p>';
      $("#lista-clienti").querySelectorAll("[data-cliente]").forEach((row) => {
        row.addEventListener("click", () => navigate("clienti", { clienteId: Number(row.dataset.cliente) }));
      });
    };
    $("#filtro-clienti").addEventListener("input", debounce(load, 300));
    $("#btn-nuovo-cli").addEventListener("click", () => {
      $("#nuovo-cliente-panel").classList.remove("hidden");
      $("#nc-nome").focus();
      showStatus("Compila il form rapido nel pannello prenotazione o usa i campi sotto", false);
      openNuovoClienteInline();
    });
    await load();
  }

  function openNuovoClienteInline() {
    const panel = document.createElement("div");
    panel.className = "panel";
    panel.innerHTML = `
      <div class="panel-header">Nuovo cliente</div>
      <div style="padding:1rem">
        <div class="grid-2">
          <label>Nome <input type="text" id="inline-nome"></label>
          <label>Cognome <input type="text" id="inline-cognome"></label>
          <label>CF <input type="text" id="inline-cf"></label>
          <label>Telefono <input type="tel" id="inline-tel"></label>
        </div>
        <button class="btn btn-primary" id="inline-salva">Salva e apri scheda</button>
      </div>`;
    $("#page-content").prepend(panel);
    $("#inline-salva").addEventListener("click", async () => {
      try {
        const c = await api("/api/clienti", {
          method: "POST",
          body: JSON.stringify({
            nome: $("#inline-nome").value,
            cognome: $("#inline-cognome").value,
            codice_fiscale: $("#inline-cf").value,
            telefono: $("#inline-tel").value,
          }),
        });
        showStatus(`Cliente ${c.cognome} ${c.nome} creato`);
        navigate("clienti", { clienteId: c.id });
      } catch (err) { showStatus(err.message, false); }
    });
  }

  async function renderClienteDettaglio(id) {
    const data = await api(`/api/clienti/${id}`);
    const c = data.cliente;
    setHeader("clienti", `
      <button class="btn btn-secondary" id="btn-indietro-cli">← Elenco clienti</button>
      <button class="btn btn-primary" id="btn-pren-cli">+ Prenotazione per questo cliente</button>
    `);
    $("#page-content").innerHTML = `
      <div class="detail-grid">
        <div class="detail-card">
          <h3>${c.cognome} ${c.nome}</h3>
          <p><strong>CF:</strong> ${c.codice_fiscale || "—"}</p>
          <p><strong>Telefono:</strong> ${c.telefono || "—"}</p>
          <p><strong>Email:</strong> ${c.email || "—"}</p>
        </div>
        <div class="detail-card">
          <h3>Collegamenti</h3>
          <p>Da qui puoi creare una prenotazione già associata a questo cliente, oppure consultare lo storico noleggi.</p>
        </div>
      </div>
      <div class="panel">
        <div class="panel-header">Storico noleggi (${data.noleggi.length})</div>
        ${tableNoleggiFull(data.noleggi)}
      </div>
    `;
    ctx.clienteId = null;
    $("#btn-indietro-cli").addEventListener("click", () => navigate("clienti"));
    $("#btn-pren-cli").addEventListener("click", () => {
      ctx.clienteId = c.id;
      navigate("calendario");
      setTimeout(() => prefillCliente(c.id), 500);
    });
    bindPrenotazioniTableActions();
  }

  // ─── FLOTTA ───
  async function renderFlotta() {
    if (ctx.veicoloId) {
      await renderVeicoloDettaglio(ctx.veicoloId);
      return;
    }
    setHeader("flotta");
    const veicoli = await api("/api/veicoli");
    $("#page-content").innerHTML = `
      <div class="panel">
        <div class="panel-header">Veicoli attivi (${veicoli.length})</div>
        <table class="data-table">
          <thead><tr><th>Targa</th><th>Tipo</th><th>Modello</th><th>Colore</th><th>Alimentazione</th></tr></thead>
          <tbody>
            ${veicoli.map((v) => `<tr class="clickable" data-veicolo="${v.id}">
              <td><strong>${v.targa}</strong></td>
              <td>${v.tipo}</td><td>${v.marca_modello}</td>
              <td>${v.colore || "—"}</td><td>${v.alimentazione || "—"}</td>
            </tr>`).join("")}
          </tbody>
        </table>
      </div>
      <p style="color:var(--muted);font-size:0.9rem">Clicca su un veicolo per vedere i noleggi e aprire il calendario filtrato.</p>
    `;
    $("#page-content").querySelectorAll("[data-veicolo]").forEach((row) => {
      row.addEventListener("click", () => navigate("flotta", { veicoloId: Number(row.dataset.veicolo) }));
    });
  }

  async function renderVeicoloDettaglio(id) {
    const data = await api(`/api/veicoli/${id}`);
    const v = data.veicolo;
    setHeader("flotta", `
      <button class="btn btn-secondary" id="btn-indietro-vei">← Elenco veicoli</button>
      <button class="btn btn-primary" id="btn-cal-vei">Prenota su calendario</button>
    `);
    $("#page-content").innerHTML = `
      <div class="detail-card" style="margin-bottom:1rem">
        <h3>${v.targa} — ${v.marca_modello}</h3>
        <p>${v.tipo} · ${v.colore || ""} · ${v.alimentazione || ""}</p>
      </div>
      <div class="panel">
        <div class="panel-header">Noleggi di questo veicolo</div>
        ${tableNoleggiFull(data.noleggi)}
      </div>
    `;
    const vid = id;
    ctx.veicoloId = null;
    $("#btn-indietro-vei").addEventListener("click", () => navigate("flotta"));
    $("#btn-cal-vei").addEventListener("click", () => navigate("calendario", { veicoloId: vid }));
    bindPrenotazioniTableActions();
  }

  // ─── PLACEHOLDER ───
  function renderPlaceholder(page, desc) {
    setHeader(page);
    $("#page-content").innerHTML = `
      <div class="panel placeholder-box">
        <strong>Modulo in sviluppo</strong>
        <p>${desc}</p>
        <p>Il calendario, clienti, flotta e prenotazioni sono già collegati tra loro.<br>
        Questo modulo verrà integrato nel passo successivo.</p>
        <button class="btn btn-primary" data-goto="dashboard" style="margin-top:1rem">Torna alla dashboard</button>
      </div>`;
    $("#page-content").querySelector("[data-goto]")?.addEventListener("click", () => navigate("dashboard"));
  }

  async function renderImpostazioni() {
    const d = await api("/api/dashboard");
    setHeader("impostazioni");
    const i = d.impostazioni;
    $("#page-content").innerHTML = `
      <div class="panel" style="padding:1rem">
        <div class="grid-2">
          <p><strong>Ditta</strong><br>${i.ditta || "—"}</p>
          <p><strong>Sede</strong><br>${i.sede || "—"}</p>
          <p><strong>Luogo contratti</strong><br>${i.luogo || "—"}</p>
          <p><strong>Telefono</strong><br>${i.telefono || "—"}</p>
        </div>
        <p style="color:var(--muted);font-size:0.9rem;margin-top:1rem">
          In versione completa qui modifichi i dati come nel vecchio Autonoleggio.ini
        </p>
      </div>`;
  }

  // ─── MODALI ───
  async function loadClientiSelect(q = "", selectedId = null) {
    const clienti = await api(`/api/clienti?q=${encodeURIComponent(q)}`);
    const sel = $("#cliente-id");
    sel.innerHTML = clienti.map(
      (c) => `<option value="${c.id}">${c.cognome} ${c.nome} — ${c.telefono || c.codice_fiscale || ""}</option>`
    ).join("");
    if (selectedId) sel.value = selectedId;
    else if (clienti.length) sel.value = clienti[0].id;
  }

  function prefillCliente(clienteId) {
    loadClientiSelect("", clienteId);
    ctx.clienteId = null;
  }

  function openPrenotazione(veicoloId, dataRitiro, dataRiconsegna) {
    Calendar.setModalVeicoloId(veicoloId);
    api("/api/veicoli").then((veicoli) => {
      const v = veicoli.find((x) => x.id === veicoloId);
      $("#prenota-summary").innerHTML = `
        <strong>${v.targa}</strong> — ${v.marca_modello}<br>
        Periodo: <strong>${formatIT(dataRitiro)}</strong> → <strong>${formatIT(dataRiconsegna)}</strong>`;
      $("#data-ritiro").value = dataRitiro;
      $("#data-riconsegna").value = dataRiconsegna;
      $("#ora-ritiro").value = "09:00";
      $("#ora-riconsegna").value = "18:00";
      $("#note").value = "";
      $("#cliente-search").value = "";
      $("#nuovo-cliente-panel").classList.add("hidden");
      loadClientiSelect("", ctx.clienteId);
      $("#modal-prenota").showModal();
    });
  }

  async function openDettaglio(id) {
    const p = await api(`/api/prenotazioni/${id}`);
    $("#dettaglio-body").innerHTML = `
      <p><strong>Veicolo:</strong>
        <span class="clickable" id="det-veicolo">${p.targa} — ${p.marca_modello}</span></p>
      <p><strong>Cliente:</strong>
        <span class="clickable" id="det-cliente">${p.cliente_cognome || "—"} ${p.cliente_nome || ""}</span></p>
      <p><strong>Ritiro:</strong> ${formatIT(p.data_ritiro)} ore ${p.ora_ritiro}</p>
      <p><strong>Riconsegna:</strong> ${formatIT(p.data_riconsegna)} ore ${p.ora_riconsegna}</p>
      <p><strong>Stato:</strong> ${badgeStato(p.stato)}</p>
      ${p.note ? `<p><strong>Note:</strong> ${p.note}</p>` : ""}
      <div class="link-row">
        <button class="btn btn-secondary" id="det-vai-cal">Vedi su calendario</button>
        ${p.stato === "prenotazione"
          ? '<button class="btn btn-primary" id="det-contratto">Passa a contratto</button>' : ""}
      </div>`;
    $("#dettaglio-footer").innerHTML = `<button class="btn btn-secondary" data-close>Chiudi</button>`;
    $("#modal-dettaglio").showModal();

    $("#det-veicolo").addEventListener("click", () => {
      $("#modal-dettaglio").close();
      navigate("flotta", { veicoloId: p.veicolo_id });
    });
    $("#det-cliente").addEventListener("click", () => {
      if (!p.cliente_id) return;
      $("#modal-dettaglio").close();
      navigate("clienti", { clienteId: p.cliente_id });
    });
    $("#det-vai-cal").addEventListener("click", () => {
      $("#modal-dettaglio").close();
      navigate("calendario", { veicoloId: p.veicolo_id });
    });
    $("#det-contratto")?.addEventListener("click", async () => {
      try {
        await api(`/api/prenotazioni/${p.id}/stato`, {
          method: "PATCH",
          body: JSON.stringify({ stato: "contratto" }),
        });
        $("#modal-dettaglio").close();
        showStatus("Prenotazione convertita in contratto");
        renderPage(location.hash.slice(1) || "dashboard");
      } catch (err) { showStatus(err.message, false); }
    });
  }

  function bindPrenotazioniTableActions() {
    $("#page-content").querySelectorAll("[data-dettaglio]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openDettaglio(Number(btn.dataset.dettaglio));
      });
    });
    $("#page-content").querySelectorAll("[data-goto-cliente]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        const id = Number(el.dataset.gotoCliente);
        if (id) navigate("clienti", { clienteId: id });
      });
    });
    $("#page-content").querySelectorAll("[data-goto-veicolo]").forEach((el) => {
      el.addEventListener("click", (e) => {
        e.stopPropagation();
        navigate("flotta", { veicoloId: Number(el.dataset.gotoVeicolo) });
      });
    });
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
  }

  function setupModals() {
    document.querySelectorAll("[data-close]").forEach((btn) => {
      btn.addEventListener("click", () => btn.closest("dialog")?.close());
    });

    $("#form-prenota").addEventListener("submit", async (e) => {
      e.preventDefault();
      try {
        await api("/api/prenotazioni", {
          method: "POST",
          body: JSON.stringify({
            veicolo_id: Calendar.getModalVeicoloId(),
            cliente_id: Number($("#cliente-id").value) || null,
            data_ritiro: $("#data-ritiro").value,
            ora_ritiro: $("#ora-ritiro").value,
            data_riconsegna: $("#data-riconsegna").value,
            ora_riconsegna: $("#ora-riconsegna").value,
            note: $("#note").value,
          }),
        });
        $("#modal-prenota").close();
        showStatus("Prenotazione creata — visibile in calendario e in elenco");
        const page = location.hash.slice(1) || "dashboard";
        if (page === "calendario") await Calendar.refresh();
        else renderPage(page);
      } catch (err) { showStatus(err.message, false); }
    });

    let searchTimer;
    $("#cliente-search").addEventListener("input", () => {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => loadClientiSelect($("#cliente-search").value), 250);
    });
    $("#btn-nuovo-cliente").addEventListener("click", () => {
      $("#nuovo-cliente-panel").classList.toggle("hidden");
    });
    $("#btn-salva-cliente").addEventListener("click", async () => {
      try {
        const c = await api("/api/clienti", {
          method: "POST",
          body: JSON.stringify({
            nome: $("#nc-nome").value,
            cognome: $("#nc-cognome").value,
            codice_fiscale: $("#nc-cf").value,
            telefono: $("#nc-tel").value,
          }),
        });
        await loadClientiSelect("", c.id);
        $("#nuovo-cliente-panel").classList.add("hidden");
        showStatus(`Cliente ${c.cognome} ${c.nome} salvato`);
      } catch (err) { showStatus(err.message, false); }
    });
  }

  async function renderPage(page) {
    page = PAGES[page] ? page : "dashboard";
    setActiveNav(page);
    try {
      if (page === "dashboard") await renderDashboard();
      else if (page === "calendario") await renderCalendario();
      else if (page === "prenotazioni") await renderPrenotazioni();
      else if (page === "clienti") await renderClienti();
      else if (page === "flotta") await renderFlotta();
      else if (page === "tariffario") renderPlaceholder("tariffario", "Listini giornalieri, km inclusi, franchigie — come nel vecchio Tariffario.pro.");
      else if (page === "cargos") renderPlaceholder("cargos", "Invio automatico contratti al portale Polizia di Stato.");
      else if (page === "impostazioni") await renderImpostazioni();
    } catch (err) {
      $("#page-content").innerHTML = `<p class="placeholder-box">Errore: ${err.message}</p>`;
      showStatus(err.message, false);
    }
  }

  function init() {
    document.querySelectorAll(".nav-item").forEach((btn) => {
      btn.addEventListener("click", () => {
        ctx.clienteId = ctx.veicoloId = null;
        navigate(btn.dataset.page);
      });
    });
    setupModals();
    window.addEventListener("hashchange", () => renderPage(location.hash.slice(1) || "dashboard"));
    if (!location.hash) location.hash = "dashboard";
    else renderPage(location.hash.slice(1));
  }

  document.addEventListener("DOMContentLoaded", init);

  return { api, showStatus, navigate, openDettaglio, openPrenotazione, todayISO, formatIT };
})();
