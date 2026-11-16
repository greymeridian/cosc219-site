/* COSC 219 — Lab 8 consolidation check.

   Eight faults are planted across index.html, styles.css and app.js.
   This file tells you WHICH remain, not where they are or how to fix them.
   Finding them is the exercise. */

import { TRAILS } from "./data.js";
import { matches, sortByDistance, render } from "./app.js";

let pass = 0, fail = 0;
const results = [];

function is(label, thunk, expected, hint) {
  let actual, threw = null;
  try { actual = typeof thunk === "function" ? thunk() : thunk; }
  catch (err) { threw = err; }
  const e = JSON.stringify(expected);
  if (threw) {
    fail++;
    results.push({ ok: false, label, hint,
                   detail: `threw ${threw.constructor.name}: ${threw.message}` });
    return;
  }
  const a = JSON.stringify(actual);
  const ok = a === e;
  ok ? pass++ : fail++;
  results.push({ ok, label, hint, detail: ok ? "" : `expected ${e}, got ${a}` });
}
function group(name) { results.push({ group: name }); }

async function readText(path) {
  try { const r = await fetch(path); return r.ok ? await r.text() : ""; }
  catch { return ""; }
}

export async function runTests() {
  pass = 0; fail = 0; results.length = 0;

  const css = await readText("./styles.css");
  const html = await readText("./index.html");
  const doc = new DOMParser().parseFromString(html, "text/html");

  group("HTML");
  is("heading levels are not skipped",
     () => {
       const lv = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => +h.tagName[1]);
       return lv.every((n, i) => i === 0 || n - lv[i - 1] <= 1);
     }, true, "Lecture 2 — one h1, then no jumps going down");

  is("every form control has a label",
     () => {
       const ids = new Set([...doc.querySelectorAll("label[for]")].map(l => l.getAttribute("for")));
       const controls = [...doc.querySelectorAll("input, select, textarea")];
       return controls.filter(c => !c.closest("label") && !ids.has(c.id)).length;
     }, 0, "Lecture 3 — a placeholder is a hint, not a name");

  group("CSS");
  is("box-sizing: border-box is set",
     () => /box-sizing\s*:\s*border-box/.test(css), true,
     "Lecture 4 — try the page at 400px wide and watch the search box");

  is("a visible focus style survives",
     () => {
       const blocks = css.match(/:focus[^{]*\{[^}]*\}/g) || [];
       if (blocks.length === 0) return false;
       const realOutline = (b) => {
         for (const m of b.matchAll(/outline\s*:\s*([^;}]+)/g)) {
           const v = m[1].trim();
           if (v !== "none" && v !== "0") return true;
         }
         return false;
       };
       return blocks.some(b => /box-shadow\s*:/.test(b) ||
                               /border[\w-]*\s*:/.test(b) || realOutline(b));
     }, true, "Lecture 4 — tab through the form and watch where you are");

  group("JavaScript");
  is("filtering compares without converting types",
     () => {
       const src = "" + matches;
       return !/[^=!<>]==[^=]/.test(src);
     }, true, "Lecture 7 — == converts, === does not");

  is("sorting actually orders by distance",
     () => sortByDistance([...TRAILS]).map(t => t.km),
     [2.8, 3.1, 4, 5.5, 6.4, 12, 16],
     "Lecture 9 — what does sort() compare when you give it no comparator?");

  // Work on an independent copy. Sorting TRAILS itself would leave the
  // data reordered for every later test and for a second run of this
  // page — a test that only works the first time is not a test.
  is("sorting does not reorder the array it was given",
     () => {
       const given = TRAILS.map((t) => ({ ...t }));
       const before = given.map((t) => t.name).join();
       sortByDistance(given);
       return given.map((t) => t.name).join() === before;
     }, true, "Lecture 9 — sort changes the array you call it on");

  group("The DOM");
  is("a trail name is put on the page as text",
     () => {
       render([{ name: '<img src=x onerror="alert(1)">', km: 1 }]);
       return document.querySelectorAll("#results img").length;
     }, 0, "Lecture 13 — which property parses markup, and which does not?");

  // Dispatch a real submit and ask the browser whether the default was
  // stopped. Reading the source for the word "preventDefault" would pass
  // on a call that never runs.
  is("submitting the form does not reload the page",
     () => {
       const ev = new Event("submit", { bubbles: true, cancelable: true });
       document.querySelector("#controls").dispatchEvent(ev);
       return ev.defaultPrevented;
     }, true, "Lecture 14 — what does a form do by default?");

  return { pass, fail, results };
}

/* ---- output ---- */
const out = document.querySelector("#check-output");
if (out) {
  runTests().then(({ pass, fail, results }) => {
    for (const r of results) {
      if (r.group) {
        const h = document.createElement("h2");
        h.textContent = r.group;
        out.append(h);
        continue;
      }
      const p = document.createElement("p");
      p.className = "res " + (r.ok ? "pass" : "fail");
      p.textContent = `${r.ok ? "FIXED" : "STILL BROKEN"}  ${r.label}`;
      out.append(p);
      if (!r.ok && r.hint) {
        const hint = document.createElement("p");
        hint.className = "hint";
        hint.textContent = "hint: " + r.hint;
        out.append(hint);
      }
    }
    const s = document.createElement("p");
    s.className = "summary";
    s.textContent = `${pass} fixed, ${fail} still to find.`;
    out.append(s);
  });
}
