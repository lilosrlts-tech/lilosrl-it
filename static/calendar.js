/** Calendario flotta interattivo — modulo collegato al gestionale */
const Calendar = (() => {
  const MONTHS = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre",
  ];
  const WEEKDAYS = ["Dom", "Lun", "Mar", "Mer", "Gio", "Ven", "Sab"];

  let viewYear, viewMonth;
  let veicoli = [];
  let prenotazioni = [];
  let modalVeicoloId = null;
  let selecting = false;
  let selectVeicoloId = null;
  let selectStart = null;
  let selectEnd = null;

  function pad(n) { return String(n).padStart(2, "0"); }

  function isoDate(y, m, d) { return `${y}-${pad(m + 1)}-${pad(d)}`; }

  function daysInMonth(y, m) { return new Date(y, m + 1, 0).getDate(); }

  function parseISO(s) {
    const [y, m, d] = s.split("-").map(Number);
    return new Date(y, m - 1, d);
  }

  function eachDayISO(fromIso, toIso, fn) {
    const cur = parseISO(fromIso);
    const end = parseISO(toIso);
    while (cur <= end) {
      fn(`${cur.getFullYear()}-${pad(cur.getMonth() + 1)}-${pad(cur.getDate())}`);
      cur.setDate(cur.getDate() + 1);
    }
  }

  function monthRange() {
    return {
      first: isoDate(viewYear, viewMonth, 1),
      last: isoDate(viewYear, viewMonth, daysInMonth(viewYear, viewMonth)),
    };
  }

  function prenotazioniPerVeicolo(veicoloId) {
    return prenotazioni.filter((p) => p.veicolo_id === veicoloId);
  }

  function overlapsDay(p, dayIso) {
    return p.data_ritiro <= dayIso && p.data_riconsegna >= dayIso;
  }

  function findPrenotazioneAt(veicoloId, dayIso) {
    return prenotazioniPerVeicolo(veicoloId).find((p) => overlapsDay(p, dayIso));
  }

  function isWeekend(y, m, d) {
    const wd = new Date(y, m, d).getDay();
    return wd === 0 || wd === 6;
  }

  async function loadData() {
    const { first, last } = monthRange();
    [veicoli, prenotazioni] = await Promise.all([
      App.api("/api/veicoli"),
      App.api(`/api/prenotazioni?da=${first}&a=${last}`),
    ]);
  }

  function render(container) {
    const days = daysInMonth(viewYear, viewMonth);
    const today = App.todayISO();
    const monthLabel = container.querySelector("#month-label");

    if (monthLabel) monthLabel.textContent = `${MONTHS[viewMonth]} ${viewYear}`;

    let html = '<table class="cal-table"><thead><tr><th class="vehicle-col">Veicolo</th>';
    for (let d = 1; d <= days; d++) {
      const iso = isoDate(viewYear, viewMonth, d);
      const wd = new Date(viewYear, viewMonth, d).getDay();
      const cls = [isWeekend(viewYear, viewMonth, d) ? "weekend" : "", iso === today ? "today" : ""]
        .filter(Boolean).join(" ");
      html += `<th class="${cls}">${d}<br><small>${WEEKDAYS[wd]}</small></th>`;
    }
    html += "</tr></thead><tbody>";

    for (const v of veicoli) {
      html += "<tr>";
      html += `<td class="vehicle-cell" data-goto-flotta="${v.id}"><strong>${v.targa}</strong><small>${v.marca_modello}</small></td>`;
      let d = 1;
      while (d <= days) {
        const iso = isoDate(viewYear, viewMonth, d);
        const pren = findPrenotazioneAt(v.id, iso);
        if (pren && pren.data_ritiro === iso) {
          const end = parseISO(pren.data_riconsegna);
          const endDay = end.getMonth() === viewMonth && end.getFullYear() === viewYear
            ? Math.min(end.getDate(), days) : days;
          const span = endDay - d + 1;
          const label = pren.cliente_cognome
            ? `${pren.cliente_cognome} ${(pren.cliente_nome || "")[0] || ""}.` : "—";
          const barClass = pren.stato === "contratto" ? "contratto" : "prenotazione";
          html += `<td class="day-cell" colspan="${span}" data-veicolo="${v.id}" data-day="${iso}">`;
          html += `<div class="bar ${barClass}" data-id="${pren.id}">${label}</div></td>`;
          d = endDay + 1;
          continue;
        }
        if (pren) { d += 1; continue; }
        const cls = ["day-cell", isWeekend(viewYear, viewMonth, d) ? "weekend" : "", iso === today ? "today" : ""]
          .filter(Boolean).join(" ");
        html += `<td class="${cls}" data-veicolo="${v.id}" data-day="${iso}"></td>`;
        d += 1;
      }
      html += "</tr>";
    }
    html += "</tbody></table>";

    const cal = container.querySelector("#calendar");
    cal.innerHTML = html;
    cal.classList.remove("loading");
    bindEvents(container);
  }

  function bindEvents(container) {
    container.querySelectorAll(".day-cell").forEach((cell) => {
      cell.addEventListener("mousedown", onMouseDown);
      cell.addEventListener("mouseenter", onMouseEnter);
    });
    container.querySelectorAll(".bar").forEach((bar) => {
      bar.addEventListener("mousedown", (e) => e.stopPropagation());
      bar.addEventListener("click", (e) => {
        e.stopPropagation();
        App.openDettaglio(Number(bar.dataset.id));
      });
    });
    container.querySelectorAll("[data-goto-flotta]").forEach((cell) => {
      cell.addEventListener("click", (e) => {
        if (selecting) return;
        App.navigate("flotta", { veicoloId: Number(cell.dataset.gotoFlotta) });
      });
    });
    container.querySelector("#btn-prev")?.addEventListener("click", () => shiftMonth(-1, container));
    container.querySelector("#btn-next")?.addEventListener("click", () => shiftMonth(1, container));
    container.querySelector("#btn-today")?.addEventListener("click", () => goToday(container));
  }

  async function shiftMonth(delta, container) {
    viewMonth += delta;
    if (viewMonth < 0) { viewMonth = 11; viewYear -= 1; }
    if (viewMonth > 11) { viewMonth = 0; viewYear += 1; }
    await refresh(container);
  }

  async function goToday(container) {
    const n = new Date();
    viewYear = n.getFullYear();
    viewMonth = n.getMonth();
    await refresh(container);
  }

  function clearSelectionHighlight() {
    document.querySelectorAll(".day-cell.selecting").forEach((c) => c.classList.remove("selecting"));
  }

  function highlightSelection() {
    clearSelectionHighlight();
    if (!selectVeicoloId || !selectStart || !selectEnd) return;
    const a = selectStart <= selectEnd ? selectStart : selectEnd;
    const b = selectStart <= selectEnd ? selectEnd : selectStart;
    document.querySelectorAll(".day-cell").forEach((cell) => {
      if (Number(cell.dataset.veicolo) !== selectVeicoloId) return;
      const day = cell.dataset.day;
      if (day && day >= a && day <= b) cell.classList.add("selecting");
    });
  }

  function onMouseDown(e) {
    if (e.target.classList.contains("bar")) return;
    const cell = e.currentTarget;
    const veicoloId = Number(cell.dataset.veicolo);
    const day = cell.dataset.day;
    if (findPrenotazioneAt(veicoloId, day)) return;
    selecting = true;
    selectVeicoloId = veicoloId;
    selectStart = day;
    selectEnd = day;
    highlightSelection();
    e.preventDefault();
  }

  function onMouseEnter(e) {
    if (!selecting) return;
    const cell = e.currentTarget;
    if (Number(cell.dataset.veicolo) !== selectVeicoloId) return;
    if (findPrenotazioneAt(selectVeicoloId, cell.dataset.day)) return;
    selectEnd = cell.dataset.day;
    highlightSelection();
  }

  function onMouseUp() {
    if (!selecting) return;
    selecting = false;
    const a = selectStart <= selectEnd ? selectStart : selectEnd;
    const b = selectStart <= selectEnd ? selectEnd : selectStart;
    clearSelectionHighlight();
    if (!a || !b || !selectVeicoloId) return;
    let blocked = false;
    eachDayISO(a, b, (iso) => {
      if (findPrenotazioneAt(selectVeicoloId, iso)) blocked = true;
    });
    if (blocked) {
      App.showStatus("Selezione sovrapposta a un noleggio esistente", false);
      selectVeicoloId = selectStart = selectEnd = null;
      return;
    }
    App.openPrenotazione(selectVeicoloId, a, b);
    selectVeicoloId = selectStart = selectEnd = null;
  }

  async function refresh(container) {
    const cal = container.querySelector("#calendar");
    if (cal) { cal.classList.add("loading"); cal.textContent = "Caricamento..."; }
    await loadData();
    render(container);
  }

  async function mount(container, opts = {}) {
    const now = new Date();
    viewYear = now.getFullYear();
    viewMonth = now.getMonth();
    if (opts.veicoloId) modalVeicoloId = opts.veicoloId;
    await refresh(container);
  }

  function getModalVeicoloId() { return modalVeicoloId; }
  function setModalVeicoloId(id) { modalVeicoloId = id; }

  document.addEventListener("mouseup", onMouseUp);

  return { mount, refresh: () => refresh(document.getElementById("page-content")), getModalVeicoloId, setModalVeicoloId };
})();
