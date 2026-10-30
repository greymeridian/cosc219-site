/* COSC 219 — Lab 5 self-check
   Runs in the browser (open check.html) or under Node. */

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

  // snapshot, so we can prove nothing mutated the data
  const snapshot = JSON.stringify(TRAILS);

  group("A · revealWord / hasWon");
  is('revealWord("otter","")',      () => revealWord("otter", ""),      "_____");
  is('revealWord("otter","ot")',    () => revealWord("otter", "ot"),    "ott__");
  is('revealWord("otter","otre")',  () => revealWord("otter", "otre"),  "otter");
  is('hasWon("otter","ot")',        () => hasWon("otter", "ot"),        false);
  is('hasWon("otter","otre")',      () => hasWon("otter", "otre"),      true);

  group("B1 · trailNames");
  is("length is 10",                () => trailNames(TRAILS).length,    10);
  is("first is Knox Mountain",      () => trailNames(TRAILS)[0],        "Knox Mountain");
  is("last is Paul's Tomb",         () => trailNames(TRAILS)[9],        "Paul's Tomb");

  group("B2 · openTrails");
  is("8 are open",                  () => openTrails(TRAILS).length,    8);
  is("none of them closed",         () => openTrails(TRAILS).some(t => t.closed), false);

  group("B3 · findByName");
  is('"Bear Creek" → 5.5 km',       () => findByName(TRAILS, "Bear Creek").km, 5.5);
  is('"bear creek" → 5.5 km',       () => findByName(TRAILS, "bear creek").km, 5.5);
  is('"Nowhere" → undefined',       () => findByName(TRAILS, "Nowhere"), undefined);

  group("B4 · sortedByDistance");
  is("shortest first",              () => sortedByDistance(TRAILS)[0].name, "Knox Mountain");
  is("longest last",                () => sortedByDistance(TRAILS)[9].name, "Mission Creek");
  is("numeric, not text order",     () => sortedByDistance(TRAILS)[8].name, "Myra Canyon");
  is("returns a new array",         () => sortedByDistance(TRAILS) === TRAILS, false);

  group("C1 · anyClosed");
  is("some are closed",             () => anyClosed(TRAILS),            true);
  is("none of the open ones",       () => anyClosed(openTrails(TRAILS)), false);

  group("C2 · allUnder");
  is("all under 20 km",             () => allUnder(TRAILS, 20),         true);
  is("not all under 10 km",         () => allUnder(TRAILS, 10),         false);
  is("empty array is true",         () => allUnder([], 5),              true);

  group("C3 · totalDistance");
  is("71.3 km total",               () => totalDistance(TRAILS),        71.3);
  is("empty array is 0",            () => totalDistance([]),            0);

  group("C4 · longestTrail");
  is("Mission Creek",               () => longestTrail(TRAILS).name,    "Mission Creek");
  is("empty array → undefined",     () => longestTrail([]),             undefined);

  group("C5 · countByRating");
  is("counts by rating",            () => countByRating(TRAILS),
     { moderate: 3, easy: 4, hard: 3 });
  is("empty array → {}",            () => countByRating([]),            {});

  group("D1 · openDistance");
  is("54.6 km open",                () => openDistance(TRAILS),         54.6);

  group("D2 · summaryLines");
  is("10 lines",                    () => summaryLines(TRAILS).length,  10);
  is("first line",                  () => summaryLines(TRAILS)[0],
     "Knox Mountain — 2.8 km, moderate");
  is("closed trail is marked",      () => summaryLines(TRAILS)[4],
     "Rose Valley — 7.2 km, moderate (closed)");

  group("D3 · report");
  is("the whole report",            () => report(TRAILS), {
    total: 10, open: 8, closed: 2, openKm: 54.6,
    longestOpen: "Mission Creek",
    byRating: { moderate: 3, easy: 4, hard: 3 }
  });
  is("empty array → longestOpen null", report([]).longestOpen, null);

  group("Nothing was mutated");
  // Comparing the whole data set would print two screens of JSON on failure.
  // The order of the names is what actually changes, so report just that.
  is("TRAILS is still in its original order",
     () => TRAILS.map((t) => t.name).join(", "),
     JSON.parse(snapshot).map((t) => t.name).join(", "));

  return { pass, fail, results };
}

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
      const p = document.createElement("p");
      p.className = "res " + (r.ok ? "pass" : "fail");
      p.textContent = `${r.ok ? "PASS" : "FAIL"}  ${r.label}` +
                      (r.detail ? `  — ${r.detail}` : "");
      out.append(p);
    }
    const s = document.createElement("p");
    s.className = "summary";
    s.textContent = `${pass} passed, ${fail} to fix.`;
    out.append(s);
  });
}
