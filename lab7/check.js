/* COSC 219 — Lab 7 self-check
   An ES module. Open check.html with Live Server, or run `node check.js`
   if you have set the folder up for it. */

import { saveTrails, loadTrails, clearTrails } from "./storage.js";
import { createTrailItem, renderTrails, summaryText } from "./render.js";
import { makeTrail, isValidTrail, addTrail, removeTrail, toggleTrail,
         findAction } from "./trails.js";

let pass = 0, fail = 0;
const results = [];

function is(label, thunk, expected) {
  let actual, threw = null;
  try { actual = typeof thunk === "function" ? thunk() : thunk; }
  catch (err) { threw = err; }
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

const sample = () => ([
  { id: "a1", name: "Knox", km: 2.8, closed: false },
  { id: "b2", name: "Myra", km: 12,  closed: true  },
]);

function runTests() {
  pass = 0; fail = 0; results.length = 0;

  group("1 · validation");
  is('isValidTrail("Knox", "2.8")', () => isValidTrail("Knox", "2.8"), true);
  is('empty name',                  () => isValidTrail("", "2.8"),     false);
  is('name of only spaces',         () => isValidTrail("   ", "2.8"),  false);
  is('empty km  (Number("") is 0)', () => isValidTrail("Knox", ""),    false);
  is('km "abc"  (NaN)',             () => isValidTrail("Knox", "abc"), false);
  is('km "0"',                      () => isValidTrail("Knox", "0"),   false);
  is('km "-3"',                     () => isValidTrail("Knox", "-3"),  false);

  group("2 · makeTrail");
  is("trims the name",  () => makeTrail("  Bear Creek  ", "5.5").name, "Bear Creek");
  is("km is a number",  () => typeof makeTrail("B", "5.5").km, "number");
  is("km value",        () => makeTrail("B", "5.5").km, 5.5);
  is("starts open",     () => makeTrail("B", "5.5").closed, false);
  is("has an id",       () => typeof makeTrail("B", "5.5").id, "string");
  is("ids differ",      () => makeTrail("B","1").id !== makeTrail("B","1").id, true);

  group("3 · pure data operations");
  is("addTrail returns a new array",
     () => { const t = sample(); return addTrail(t, { id: "c" }) !== t; }, true);
  is("addTrail does not grow the original",
     () => { const t = sample(); addTrail(t, { id: "c" }); return t.length; }, 2);
  is("removeTrail drops one",   () => removeTrail(sample(), "a1").length, 1);
  is("removeTrail keeps the other",
     () => removeTrail(sample(), "a1")[0].id, "b2");
  is("unknown id changes nothing", () => removeTrail(sample(), "zz").length, 2);
  is("toggleTrail flips closed", () => toggleTrail(sample(), "a1")[0].closed, true);
  is("toggleTrail does not mutate the original",
     () => { const t = sample(); toggleTrail(t, "a1"); return t[0].closed; }, false);
  is("toggleTrail makes a new object",
     () => { const t = sample(); return toggleTrail(t, "a1")[0] !== t[0]; }, true);

  group("4 · createTrailItem");
  const open = () => createTrailItem({ id: "x1", name: "Knox Mountain", km: 2.8, closed: false });
  is("returns an <li>",   () => open().tagName, "LI");
  is("data-id is set",    () => open().dataset.id, "x1");
  is("class is trail",    () => [...open().classList], ["trail"]);
  is("name text",         () => open().querySelector(".trail-name").textContent,
     "Knox Mountain");
  is("km text",           () => open().querySelector(".trail-km").textContent, "2.8 km");
  is("two action buttons",
     () => [...open().querySelectorAll("button[data-action]")].map(b => b.dataset.action),
     ["toggle", "delete"]);
  is("open row says Close",
     () => open().querySelector('[data-action="toggle"]').textContent, "Close");
  is("delete has an aria-label",
     () => open().querySelector('[data-action="delete"]').getAttribute("aria-label"),
     "Delete Knox Mountain");
  const shut = () => createTrailItem({ id: "x2", name: "Shut", km: 1, closed: true });
  is("closed row gets is-closed", () => [...shut().classList], ["trail", "is-closed"]);
  is("closed row says Reopen",
     () => shut().querySelector('[data-action="toggle"]').textContent, "Reopen");

  group("5 · the name is text, not markup");
  const evil = () => createTrailItem(
    { id: "x3", name: '<img src=x onerror="alert(1)">', km: 1, closed: false });
  is("no <img> is created",  () => evil().querySelectorAll("img").length, 0);
  is("the tag is shown as text",
     () => evil().querySelector(".trail-name").textContent,
     '<img src=x onerror="alert(1)">');

  group("6 · renderTrails");
  is("one item per trail", () => {
    const ul = document.createElement("ul");
    renderTrails(sample(), ul);
    return ul.children.length;
  }, 2);
  is("replaces what was there", () => {
    const ul = document.createElement("ul");
    ul.innerHTML = "<li>old</li>";
    renderTrails(sample(), ul);
    return ul.children.length;
  }, 2);
  is("empty list clears the container", () => {
    const ul = document.createElement("ul");
    renderTrails(sample(), ul);
    renderTrails([], ul);
    return ul.children.length;
  }, 0);

  group("7 · summaryText");
  is("empty",        () => summaryText([]), "No trails yet. Add one above.");
  is("one, singular",
     () => summaryText([{ name: "A", km: 2.8, closed: false }]),
     "1 trail, 1 open, 2.8 km total.");
  is("two, plural",  () => summaryText(sample()), "2 trails, 1 open, 14.8 km total.");

  group("8 · findAction — event delegation");
  const built = () => {
    const ul = document.createElement("ul");
    renderTrails(sample(), ul);
    return ul;
  };
  is("clicking Delete on row 2", () => {
    const ul = built();
    return findAction(ul.children[1].querySelector('[data-action="delete"]'));
  }, { action: "delete", id: "b2" });
  is("clicking Close on row 1", () => {
    const ul = built();
    return findAction(ul.children[0].querySelector('[data-action="toggle"]'));
  }, { action: "toggle", id: "a1" });
  is("clicking the LABEL inside a button still finds it", () => {
    const ul = built();
    const label = ul.children[1].querySelector('[data-action="delete"] .btn-label');
    return findAction(label);
  }, { action: "delete", id: "b2" });
  is("clicking the row itself → null",
     () => findAction(built().children[0]), null);
  is("clicking the empty list → null",
     () => findAction(built()), null);

  group("9 · storage");
  is("first visit gives []", () => { clearTrails(); return loadTrails(); }, []);
  is("round trip keeps two", () => { saveTrails(sample()); return loadTrails().length; }, 2);
  is("round trip keeps the values",
     () => { saveTrails(sample()); return loadTrails()[0]; },
     { id: "a1", name: "Knox", km: 2.8, closed: false });
  is("corrupt data gives []", () => {
    localStorage.setItem("cosc219.trails", "{not json");
    return loadTrails();
  }, []);
  is("wrong shape gives []", () => {
    localStorage.setItem("cosc219.trails", '{"a":1}');
    return loadTrails();
  }, []);
  is("clearTrails empties it", () => { saveTrails(sample()); clearTrails(); return loadTrails(); }, []);

  return { pass, fail, results };
}

/* ---- output ---- */
function report({ pass, fail, results }) {
  if (typeof document === "undefined" || !document.querySelector("#output")) {
    for (const r of results) {
      if (r.group) { console.log("\n" + r.group); continue; }
      console.log(`  ${r.ok ? "PASS" : "FAIL"}  ${r.label}` +
                  (r.detail ? "  — " + r.detail : ""));
    }
    console.log(`\n${pass} passed, ${fail} to fix.`);
    return;
  }
  const out = document.querySelector("#output");
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
}

report(runTests());
