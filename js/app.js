// ===== INIT AFTER DOM LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  // Use EVENT DELEGATION (more robust)
  document.body.addEventListener("input", handleInput);

  calculateAll(); // initial
}

// ===== HANDLE INPUT =====
function handleInput(e) {
  if (e.target.matches("input[type='number']")) {
    calculateAll();
  }
}

// ===== MAIN =====
function calculateAll() {
  updateSales();
  updateCashTill();
}

// ===== SALES =====
function updateSales() {
  const val = id => {
    const el = document.getElementById(id);
    return el ? parseFloat(el.value) || 0 : 0;
  };

  const total =
    val("cashout") +
    val("cashTaken") +
    val("eft") +
    val("online") +
    val("kiosk") +
    val("doordash") +
    val("uber");

  document.getElementById("totalSale").innerText = total.toFixed(2);
}

// ===== CASH TILL =====
function updateCashTill() {
  const rows = document.querySelectorAll(".cashCount");
  const lineTotals = document.querySelectorAll(".lineTotal");

  let total = 0;

  rows.forEach((input, i) => {
    const count = parseInt(input.value) || 0;
    const value = parseInt(input.dataset.value);

    const line = count * value;
    total += line;

    if (lineTotals[i]) {
      lineTotals[i].innerText = line.toFixed(2);
    }
  });

  document.getElementById("cashTotal").innerText = total.toFixed(2);
}

document.getElementById("clearBtn").addEventListener("click", clearAll);

function clearAll() {
  if (!confirm("Clear all data?")) return;

  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.type !== "date") {
      input.value = "";
    }
  });

  calculateAll();
}