// ===== INIT AFTER DOM LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  document.body.addEventListener("input", handleInput);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("shareBtn").addEventListener("click", shareCount);

  updateDateTime();
  setInterval(updateDateTime, 1000); // keep the clock live

  calculateAll(); // initial
}

// ===== DATE / TIME (from the device clock) =====
function formatDateAU(d) {
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${d.getFullYear()}`;
}

function formatTimeAU(d) {
  let hours = d.getHours();
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const suffix = hours >= 12 ? "pm" : "am";

  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes} ${suffix}`;
}

function updateDateTime() {
  const now = new Date();
  document.getElementById("dateDisplay").innerText = formatDateAU(now);
  document.getElementById("timeDisplay").innerText = formatTimeAU(now);
}

// ===== HANDLE INPUT =====
function handleInput(e) {
  if (e.target.matches(".cashCount")) {
    calculateAll();
  }
}

// ===== MAIN =====
// Totals are summed in whole cents so coin values like 0.10 and 0.05
// can't accumulate binary floating-point error.
function calculateAll() {
  const rows = document.querySelectorAll(".cashCount");
  const lineTotals = document.querySelectorAll(".lineTotal");

  let totalCents = 0;

  rows.forEach((input, i) => {
    const count = parseInt(input.value) || 0;
    const cents = Math.round((parseFloat(input.dataset.value) || 0) * 100);

    const lineCents = count * cents;
    totalCents += lineCents;

    if (lineTotals[i]) {
      lineTotals[i].innerText = (lineCents / 100).toFixed(2);
    }
  });

  document.getElementById("cashTotal").innerText = (totalCents / 100).toFixed(2);
}

// ===== SHARE =====
function buildShareText() {
  const now = new Date();
  const lines = [];

  document.querySelectorAll(".cash-row").forEach(row => {
    const label = row.querySelector("label").innerText;
    const count = parseInt(row.querySelector(".cashCount").value) || 0;
    const lineTotal = row.querySelector(".lineTotal").innerText;

    if (count > 0) {
      lines.push(`${label} x ${count} = $${lineTotal}`);
    }
  });

  const total = document.getElementById("cashTotal").innerText;

  let text = `Cash Till Count - ${formatDateAU(now)} ${formatTimeAU(now)}\n`;
  if (lines.length) text += lines.join("\n") + "\n";
  text += `Total: $${total}`;

  const card = buildCardReconciliation();
  if (card) text += `\n\n${card}`;

  return text;
}

// ===== CARD RECONCILIATION =====
// Checks EFTPOS + Kiosk against "Card at shop". The result is reported
// only in the shared message, never shown in the app.
function buildCardReconciliation() {
  const fields = ["eftpos", "kiosk", "cardAtShop"];
  const raw = fields.map(id => document.getElementById(id).value.trim());

  // Nothing entered at all - leave the section out entirely rather than
  // reporting a meaningless 0 + 0 = 0 match.
  if (raw.every(v => v === "")) return "";

  const toCents = v => Math.round((parseFloat(v) || 0) * 100);
  const [eftposCents, kioskCents, shopCents] = raw.map(toCents);

  const sumCents = eftposCents + kioskCents;
  const diffCents = sumCents - shopCents;
  const money = cents => (cents / 100).toFixed(2);

  let out = "Card Reconciliation\n";
  out += `EFTPOS card: $${money(eftposCents)}\n`;
  out += `Kiosk: $${money(kioskCents)}\n`;
  out += `Card at shop: $${money(shopCents)}\n`;

  if (diffCents === 0) {
    out += "Result: TRUE";
  } else {
    const direction = diffCents > 0 ? "over" : "under";
    out += `Result: FALSE (EFTPOS + Kiosk ${direction} by $${money(Math.abs(diffCents))})`;
  }

  return out;
}

function shareCount() {
  const text = buildShareText();

  if (navigator.share) {
    navigator.share({ title: "Cash Till Count", text }).catch(() => {});
  } else {
    alert("Sharing isn't supported on this browser.\n\n" + text);
  }
}

function clearAll() {
  if (!confirm("Clear all data?")) return;

  document.querySelectorAll(".cashCount, .cardAmount").forEach(input => {
    input.value = "";
  });

  calculateAll();
}
