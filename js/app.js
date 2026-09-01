// ===== INIT AFTER DOM LOAD =====
document.addEventListener("DOMContentLoaded", () => {
  init();
});

function init() {
  document.body.addEventListener("input", handleInput);
  document.getElementById("clearBtn").addEventListener("click", clearAll);
  document.getElementById("shareBtn").addEventListener("click", shareCount);

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
  const rows = document.querySelectorAll(".cashCount");
  const lineTotals = document.querySelectorAll(".lineTotal");

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

  document.getElementById("cashTotal").innerText = total.toFixed(2);
}

// ===== SHARE =====
function buildShareText() {
  const dateVal = document.getElementById("date").value;
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

  let text = "Cash Till Count";
  if (dateVal) text += ` - ${dateVal}`;
  text += "\n";
  if (lines.length) text += lines.join("\n") + "\n";
  text += `Total: $${total}`;

  return text;
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

  const inputs = document.querySelectorAll("input");

  inputs.forEach(input => {
    if (input.type !== "date") {
      input.value = "";
    }
  });

  calculateAll();
}
