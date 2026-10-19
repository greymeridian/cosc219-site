/* COSC 219 — Lab 4 self-check
   Tests each function independently. Runs in the browser (open check.html)
   or under Node (node check.js) if you prefer a terminal. */

let pass = 0, fail = 0;
const results = [];

function is(label, thunk, expected) {
  // Each assertion is isolated: if one function throws, the remaining tests
  // still run. Without this, a single TypeError hides every later result.
  let actual, threw = null;
  try {
    actual = typeof thunk === "function" ? thunk() : thunk;
  } catch (err) {
    threw = err;
  }

  const e = JSON.stringify(expected);
  if (threw) {
    fail++;
    results.push({ ok: false, label,
                   detail: `threw ${threw.constructor.name}: ${threw.message}` });
    return;
  }

  const a = JSON.stringify(actual);
  const ok = a === e;
  ok ? pass++ : fail++;
  results.push({ ok, label, detail: ok ? "" : `expected ${e}, got ${a}` });
}

function group(name) { results.push({ group: name }); }

function runTests() {
  pass = 0; fail = 0; results.length = 0;

  group("1 · normalizeGuess");
  is('normalizeGuess("A")',        () => normalizeGuess("A"),        "a");
  is('normalizeGuess("  t  ")',    () => normalizeGuess("  t  "),    "t");
  is('normalizeGuess("cat")',      () => normalizeGuess("cat"),      "");
  is('normalizeGuess("")',         () => normalizeGuess(""),         "");
  is('normalizeGuess("3")',        () => normalizeGuess("3"),        "");

  group("2 · isValidGuess");
  is('isValidGuess("q")',          () => isValidGuess("q"),          true);
  is('isValidGuess("!")',          () => isValidGuess("!"),          false);
  is('isValidGuess("  ")',         () => isValidGuess("  "),         false);

  group("3 · alreadyGuessed");
  is('alreadyGuessed("a", "aet")', () => alreadyGuessed("a", "aet"), true);
  is('alreadyGuessed("z", "aet")', () => alreadyGuessed("z", "aet"), false);
  is('alreadyGuessed("A", "aet")', () => alreadyGuessed("A", "aet"), true);

  group("4 · isCorrect");
  is('isCorrect("o", "otter")',    () => isCorrect("o", "otter"),    true);
  is('isCorrect("z", "otter")',    () => isCorrect("z", "otter"),    false);
  is('isCorrect("O", "otter")',    () => isCorrect("O", "otter"),    true);
  is('isCorrect("!", "otter")',    () => isCorrect("!", "otter"),    false);

  group("5 · livesAfterGuess");
  is('livesAfterGuess(6, true)',   () => livesAfterGuess(6, true),   6);
  is('livesAfterGuess(6, false)',  () => livesAfterGuess(6, false),  5);
  is('livesAfterGuess(0, false)',  () => livesAfterGuess(0, false),  0);

  group("6 · scoreFor");
  is('scoreFor("otter", 6)',       () => scoreFor("otter", 6),       80);
  is('scoreFor("otter", 1)',       () => scoreFor("otter", 1),       55);
  is('scoreFor("otter")  [default]', () => scoreFor("otter"),        80);
  is('scoreFor("kelowna", 4)',     () => scoreFor("kelowna", 4),     90);

  group("7 · statusMessage");
  is('fresh game',   () => statusMessage("otter", "", 6),
     "6 lives left. Guessed: nothing yet");
  is('mid game',     () => statusMessage("otter", "ot", 3),
     "3 lives left. Guessed: ot");
  is('one life — singular', () => statusMessage("otter", "ot", 1),
     "1 life left. Guessed: ot");
  is('won',          () => statusMessage("otter", "otre", 4),
     'You got it! "otter" with 4 lives left.');
  is('lost',         () => statusMessage("otter", "xyz", 0),
     'Out of lives. The word was "otter".');

  group("8 · gradeFor");
  is('gradeFor(95)', () => gradeFor(95), "A");
  is('gradeFor(90)', () => gradeFor(90), "A");
  is('gradeFor(85)', () => gradeFor(85), "B");
  is('gradeFor(75)', () => gradeFor(75), "C");
  is('gradeFor(65)', () => gradeFor(65), "D");
  is('gradeFor(59)', () => gradeFor(59), "F");

  return { pass, fail, results };
}

/* ---- output ---- */
if (typeof document === "undefined") {
  const { pass, fail, results } = runTests();
  for (const r of results) {
    if (r.group) { console.log("\n" + r.group); continue; }
    console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.label}${r.detail ? "  — " + r.detail : ""}`);
  }
  console.log(`\n${pass} passed, ${fail} to fix.`);
} else {
  window.addEventListener("DOMContentLoaded", () => {
    const out = document.querySelector("#output");
    const { pass, fail, results } = runTests();
    for (const r of results) {
      if (r.group) {
        const h = document.createElement("h2");
        h.textContent = r.group;
        out.append(h);
        continue;
      }
      const li = document.createElement("p");
      li.className = "res " + (r.ok ? "pass" : "fail");
      li.textContent = `${r.ok ? "PASS" : "FAIL"}  ${r.label}` +
                       (r.detail ? `  — ${r.detail}` : "");
      out.append(li);
    }
    const s = document.createElement("p");
    s.className = "summary";
    s.textContent = `${pass} passed, ${fail} to fix.`;
    out.append(s);
  });
}
