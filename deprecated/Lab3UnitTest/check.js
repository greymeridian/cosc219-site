/* COSC 219 — Lab 3 self-check
   Two kinds of check:
     1. reads the stylesheet as text — layout techniques, media queries, units
     2. renders each page in an off-screen iframe at three widths and measures
        whether anything overflows horizontally
   Must be served from the same folder as your pages. */

const PAGES = ["index.html", "about.html", "projects.html", "contact.html"];
const WIDTHS = [320, 768, 1280];

const $ = (s) => document.querySelector(s);

function renderResults(box, results, counters) {
  const ul = document.createElement("ul");
  ul.className = "res";
  for (const r of results) {
    r.ok ? counters.pass++ : counters.fail++;
    const li = document.createElement("li");
    const m = document.createElement("span");
    m.className = "mark " + (r.ok ? "pass" : "fail");
    m.textContent = r.ok ? "PASS" : "FAIL";
    li.append(m);
    li.append(document.createTextNode(r.label + (!r.ok && r.hint ? ` — ${r.hint}` : "")));
    ul.append(li);
  }
  box.append(ul);
}

/* Decide whether a measurement counts as overflow, and phrase the report.
   Kept as a pure function so it can be tested without a browser: the
   measuring is the browser's job, the judgement is ours. A tolerance of
   1px absorbs sub-pixel rounding, which otherwise reports false failures
   on perfectly fine layouts. */
function judgeOverflow({ width, scrollW, clientW, culprit }) {
  const overflow = scrollW - clientW;
  const bad = overflow > 1;
  return {
    label: `no horizontal overflow at ${width}px`,
    ok: !bad,
    hint: bad
      ? `content is ${scrollW}px wide in a ${clientW}px viewport` +
        (culprit ? ` — widest offender: <${culprit}>` : "")
      : ""
  };
}

/* Load a page in an off-screen iframe at a fixed width and measure it. */
function measure(url, width) {
  return new Promise((resolve) => {
    const frame = document.createElement("iframe");
    frame.style.width = width + "px";
    frame.src = url;
    $("#stage").append(frame);

    const done = (result) => {
      frame.remove();
      resolve(result);
    };

    frame.addEventListener("load", () => {
      // give layout and any images a moment to settle
      setTimeout(() => {
        try {
          const d = frame.contentDocument;
          const scrollW = d.documentElement.scrollWidth;
          const clientW = d.documentElement.clientWidth;
          const overflow = scrollW - clientW;

          // find the widest offender, so the report is actionable
          let culprit = null;
          if (overflow > 1) {
            let widest = 0;
            for (const el of d.body.querySelectorAll("*")) {
              const r = el.getBoundingClientRect();
              if (r.right > clientW + 1 && r.width > widest) {
                widest = r.width;
                culprit = el.tagName.toLowerCase() +
                          (el.className && typeof el.className === "string" && el.className.trim()
                            ? "." + el.className.trim().split(/\s+/)[0] : "");
              }
            }
          }
          done({ ok: true, culprit, scrollW, clientW });
        } catch (err) {
          done({ ok: false, error: "could not measure (different origin?)" });
        }
      }, 350);
    });

    setTimeout(() => done({ ok: false, error: "page did not load" }), 8000);
  });
}

$("#run").addEventListener("click", async () => {
  const btn = $("#run");
  const out = $("#output");
  let base = $("#base").value.trim() || "./";
  if (!base.endsWith("/")) base += "/";

  btn.disabled = true;
  btn.textContent = "Checking…";
  out.innerHTML = "";
  const counters = { pass: 0, fail: 0 };

  /* ---------- 1 · the stylesheet ---------- */
  const cssBox = document.createElement("div");
  cssBox.className = "page";
  cssBox.innerHTML = "<h2>stylesheet</h2>";
  out.append(cssBox);

  const R = [];
  const check = (label, ok, hint = "") => R.push({ label, ok, hint });

  let css = "";
  let sheetHref = null;
  try {
    const home = await (await fetch(base + "index.html")).text();
    const doc = new DOMParser().parseFromString(home, "text/html");
    const link = doc.querySelector('link[rel="stylesheet"]');
    sheetHref = link && link.getAttribute("href");
    if (sheetHref) {
      const res = await fetch(new URL(sheetHref, new URL(base, location.href)).href);
      if (res.ok) css = await res.text();
    }
  } catch { /* reported below */ }

  if (!css.trim()) {
    check("stylesheet found and fetched", false,
          "could not read the stylesheet linked from index.html");
    renderResults(cssBox, R, counters);
  } else {
    check("stylesheet found and fetched", true, sheetHref);
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // Break the stylesheet into { selector, body } pairs so the checks can
    // ask about a SPECIFIC component. Checking the whole file globally lets
    // flex used anywhere satisfy "the nav uses flex", which is not the same
    // claim at all.
    const rules = [];
    for (const m of clean.matchAll(/([^{}]+)\{([^{}]*)\}/g)) {
      rules.push({ sel: m[1].trim(), body: m[2] });
    }
    const rulesMatching = (re) => rules.filter(r => re.test(r.sel));
    const anyRule = (selRe, declRe) => rulesMatching(selRe).some(r => declRe.test(r.body));

    // layout techniques, asked of the right components
    check("Flexbox used somewhere", /display\s*:\s*(inline-)?flex/.test(clean));
    check("the navigation uses Flexbox",
          anyRule(/\bnav\b|\.nav/i, /display\s*:\s*(inline-)?flex/),
          "a flex rule elsewhere doesn't lay out the nav");

    check("CSS Grid used somewhere", /display\s*:\s*(inline-)?grid/.test(clean));
    const gridRules = rules.filter(r => /display\s*:\s*(inline-)?grid/.test(r.body));
    check("a grid defines its columns",
          gridRules.some(r => /grid-template-columns\s*:/.test(r.body)) ||
          rules.some(r => /grid-template-columns\s*:/.test(r.body)));
    const gridsWithoutGap = gridRules.filter(r => !/(^|[\s;])gap\s*:/.test(r.body));
    check("every grid container uses gap rather than margins",
          gridRules.length > 0 && gridsWithoutGap.length === 0,
          gridsWithoutGap.length
            ? `missing on: ${gridsWithoutGap.map(r => r.sel).join(", ")}`
            : "no grid container found");

    check("justify-content or align-items used",
          /justify-content\s*:|align-items\s*:/.test(clean));

    // media queries
    const queries = clean.match(/@media[^{]+/g) || [];
    check(`two or more media queries (${queries.length})`, queries.length >= 2);

    const minW = queries.filter(q => /min-width/.test(q)).length;
    const maxW = queries.filter(q => /max-width/.test(q)).length;
    check(`mobile-first: min-width queries (${minW} min / ${maxW} max)`,
          minW > 0 && minW >= maxW,
          maxW > minW ? "mostly max-width means desktop-first" : "");

    const remBp = queries.filter(q => /\d*\.?\d+\s*rem/.test(q)).length;
    const pxBp = queries.filter(q => /\d+\s*px/.test(q)).length;
    check(`breakpoints in rem (${remBp} rem / ${pxBp} px)`, remBp >= pxBp,
          pxBp > remBp ? "rem breakpoints respond to the reader's text size too" : "");

    // common device-width copy-paste
    const deviceish = queries.filter(q => /\b(768|1024|480|375|414)px\b/.test(q));
    check("breakpoints not copied device widths", deviceish.length === 0,
          deviceish.length ? "768px / 1024px etc. are device sizes, not your content's" : "");

    // responsive images
    check("images constrained with max-width",
          /img[^{]*\{[^}]*max-width\s*:\s*100%/.test(clean) ||
          /max-width\s*:\s*100%/.test(clean));

    // no inline styling carried over
    check("no fixed px width on a layout container",
          !/\b(main|nav|header|footer|\.container|\.cards)\s*\{[^}]*[^-]width\s*:\s*\d+px/.test(clean),
          "use %, fr, or max-width instead");

    renderResults(cssBox, R, counters);
  }

  /* ---------- 2 · rendered width tests ---------- */
  for (const page of PAGES) {
    const box = document.createElement("div");
    box.className = "page";
    box.innerHTML = `<h2>${page}</h2>`;
    out.append(box);

    const pageResults = [];
    for (const w of WIDTHS) {
      const m = await measure(base + page, w);
      if (!m.ok) {
        pageResults.push({ label: `renders at ${w}px`, ok: false, hint: m.error });
        continue;
      }
      pageResults.push(judgeOverflow({
        width: w, scrollW: m.scrollW, clientW: m.clientW, culprit: m.culprit
      }));
    }
    renderResults(box, pageResults, counters);
  }

  const s = document.createElement("div");
  s.className = "summary";
  s.innerHTML = `<p><b>${counters.pass} passed, ${counters.fail} to fix.</b></p>
    <p style="color:#6B7885">Still to do by hand: resize a real browser slowly and
    watch for the point your layout stops looking right, tab through every page,
    and run both W3C validators.</p>`;
  out.append(s);

  btn.disabled = false;
  btn.textContent = "Run the checks";
});

/* Exported for the test harness; harmless in a browser. */
if (typeof module !== "undefined") module.exports = { judgeOverflow };
