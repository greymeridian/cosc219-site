/* COSC 219 — Lab 6 self-check
   An ES module: open check.html with Live Server, or run `node check.js`. */

import { TRAIL_DATA } from "./data.js";
import { Trail, BikeTrail } from "./trail.js";
import { TrailRegistry } from "./registry.js";

let pass = 0, fail = 0;
const results = [];

function is(label, thunk, expected) {
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

export function runTests() {
  pass = 0; fail = 0; results.length = 0;

  group("1 · Trail — basics");
  const knox = () => new Trail("Knox Mountain", 2.8, "moderate", 250);
  is("name is stored",            () => knox().name,        "Knox Mountain");
  is("describe()",                () => knox().describe(),
     "Knox Mountain — 2.8 km, moderate");
  is("steepness getter → 89",     () => knox().steepness,   89);
  is("steepness is a getter, not a method",
     () => typeof Object.getOwnPropertyDescriptor(
       Trail.prototype, "steepness")?.get, "function");

  group("2 · Trail — private state");
  is("starts open",               () => knox().isClosed,    false);
  is("close() sets it",           () => knox().close().isClosed, true);
  is("close() returns this",      () => { const t = knox(); return t.close() === t; },
     true);
  is("open() reopens",            () => knox().close().open().isClosed, false);
  is("#closed is not an own property",
     () => Object.keys(knox()),   ["name", "km", "rating", "gain"]);

  group("3 · Trail — static");
  is("Trail.count increases",
     () => { const before = Trail.count; new Trail("A", 1, "easy", 10);
             return Trail.count - before; }, 1);
  is("fromObject builds a Trail",
     () => Trail.fromObject({ name: "Z", km: 3, rating: "easy" }) instanceof Trail,
     true);
  is("fromObject defaults gain to 0",
     () => Trail.fromObject({ name: "Z", km: 3, rating: "easy" }).gain, 0);

  group("4 · Trail — JSON");
  is("toJSON includes closed",
     () => JSON.parse(JSON.stringify(knox())),
     { name: "Knox Mountain", km: 2.8, rating: "moderate", gain: 250, closed: false });
  is("closed survives the round trip",
     () => JSON.parse(JSON.stringify(knox().close())).closed, true);

  group("5 · BikeTrail — inheritance");
  const myra = () => new BikeTrail("Myra Canyon", 12, "easy", 120, "gravel");
  is("describe() is overridden",  () => myra().describe(),
     "Myra Canyon — 12 km, easy — gravel");
  is("steepness is inherited",    () => myra().steepness,   10);
  is("surface defaults to gravel",
     () => new BikeTrail("Q", 5, "easy", 50).surface, "gravel");
  is("instanceof BikeTrail",      () => myra() instanceof BikeTrail, true);
  is("instanceof Trail too",      () => myra() instanceof Trail,     true);
  is("toJSON adds surface",       () => JSON.parse(JSON.stringify(myra())).surface,
     "gravel");
  is("toJSON keeps the parent fields",
     () => JSON.parse(JSON.stringify(myra())).gain, 120);

  group("6 · TrailRegistry — building");
  const reg = () => TrailRegistry.fromData(TRAIL_DATA);
  is("six trails",                () => reg().size,          6);
  is("empty registry is 0",       () => new TrailRegistry().size, 0);
  is("rows with a surface become BikeTrails",
     () => reg().find("Myra Canyon") instanceof BikeTrail, true);
  is("rows without one stay Trails",
     () => reg().find("Knox Mountain") instanceof BikeTrail, false);

  group("7 · TrailRegistry — questions");
  is("totalDistance",             () => reg().totalDistance, 46.7);
  is("byRating('hard')",          () => reg().byRating("hard").length, 2);
  is("find ignores case",         () => reg().find("bear creek").km, 5.5);
  is("find misses → undefined",   () => reg().find("Nowhere"), undefined);
  is("steepest is Pincushion Peak",
     () => reg().steepest.name,   "Pincushion Peak");
  is("steepest's steepness",      () => reg().steepest.steepness, 115);
  is("describeAll uses the override",
     () => reg().describeAll()[2], "Myra Canyon — 12 km, easy — gravel");
  is("openTrails after closing one",
     () => { const r = reg(); r.find("Bear Creek").close();
             return r.openTrails.length; }, 5);

  group("8 · TrailRegistry — the collection is protected");
  is("add() rejects a plain object",
     () => { try { new TrailRegistry().add({ name: "x" }); return "no throw"; }
             catch (e) { return e.constructor.name; } }, "TypeError");
  is("add() accepts a BikeTrail",
     () => new TrailRegistry().add(myra()).size, 1);
  is("all returns a copy, not the array",
     () => { const r = reg(); r.all.push("junk"); return r.size; }, 6);

  return { pass, fail, results };
}

/* ---- output ---- */
function report({ pass, fail, results }) {
  if (typeof document === "undefined") {
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
