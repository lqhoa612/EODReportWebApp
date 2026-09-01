// ===== INIT AFTER DOM LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  document.body.addEventListener("input", handleInput);
  document.getElementById("clearBtn").addEventListener("click", clearAll);

  calculateAll(); // initial
}

// ===== HANDLE INPUT =====
function handleInput(e) {
  if (e.target.matches(".cashCount")) {
    calculateAll();
  }
}

// ===== MAIN =====
function calculateAll() {
  const notesTotal = sumGroup("notesGroup");
  const coinsTotal = sumGroup("coinsGroup");

  document.getElementById("notesTotal").innerText = notesTotal.toFixed(2);
  document.getElementById("coinsTotal").innerText = coinsTotal.toFixed(2);
  document.getElementById("cashTotal").innerText = (notesTotal + coinsTotal).toFixed(2);
}

// ===== SUM A DENOMINATION GROUP (Notes / Coins) =====
function sumGroup(groupId) {
  const group = document.getElementById(groupId);
  const rows = group.querySelectorAll(".cashCount");
  const lineTotals = group.querySelectorAll(".lineTotal");

  let total = 0;

  rows.forEach((input, i) => {
    const count = parseInt(input.value) || 0;
    const value = parseFloat(input.dataset.value) || 0;

    const line = count * value;
    total += line;

    if (lineTotals[i]) {
      lineTotals[i].innerText = line.toFixed(2);
    }
  });

  return total;
}

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
