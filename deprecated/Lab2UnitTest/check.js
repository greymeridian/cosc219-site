/* COSC 219 — Lab 2 self-check
   Fetches each page and the stylesheet, then reports on the requirements. */

const PAGES = ["index.html", "about.html", "projects.html", "contact.html"];

document.querySelector("#run").addEventListener("click", async () => {
  const btn = document.querySelector("#run");
  const out = document.querySelector("#output");
  let base = document.querySelector("#base").value.trim();

  if (!base) base = "./";
  if (!base.endsWith("/")) base += "/";

  btn.disabled = true; btn.textContent = "Checking…"; out.innerHTML = "";
  let pass = 0, fail = 0;
  const sheetHrefs = new Set();

  const render = (box, results) => {
    const ul = document.createElement("ul");
    ul.className = "res";
    for (const r of results) {
      r.ok ? pass++ : fail++;
      const li = document.createElement("li");
      const m = document.createElement("span");
      m.className = "mark " + (r.ok ? "pass" : "fail");
      m.textContent = r.ok ? "PASS" : "FAIL";
      li.append(m);
      li.append(document.createTextNode(r.label + (!r.ok && r.hint ? ` — ${r.hint}` : "")));
      ul.append(li);
    }
    box.append(ul);
  };

  // ---------- pages ----------
  for (const page of PAGES) {
    const box = document.createElement("div");
    box.className = "page";
    box.innerHTML = `<h2>${page}</h2>`;
    out.append(box);

    let html;
    try {
      const res = await fetch(base + page);
      if (!res.ok) {
        box.innerHTML += `<p class="fail">Could not load — HTTP ${res.status}.
          Check the filename's capitalisation.</p>`;
        fail++; continue;
      }
      html = await res.text();
    } catch {
      box.innerHTML += `<p class="fail">Could not fetch. Is the repository public?</p>`;
      fail++; continue;
    }

    const doc = new DOMParser().parseFromString(html, "text/html");
    const R = [];
    const check = (label, ok, hint = "") => R.push({ label, ok, hint });

    // stylesheet linked, and no inline styling
    const links = [...doc.querySelectorAll('link[rel="stylesheet"]')];
    check("external stylesheet linked", links.length > 0);
    links.forEach(l => sheetHrefs.add(l.getAttribute("href")));
    check("no <style> block", doc.querySelectorAll("style").length === 0);
    const inline = doc.querySelectorAll("[style]").length;
    check("no inline style attributes", inline === 0, inline ? `${inline} found` : "");

    // nav includes all four pages
    const nav = doc.querySelector("nav");
    check("has a nav", !!nav);
    if (nav) {
      const hrefs = [...nav.querySelectorAll("a")].map(a => a.getAttribute("href") || "");
      const all = PAGES.every(p => hrefs.some(h => h.includes(p)));
      check("nav links to all four pages", all,
            all ? "" : "contact.html must be in the nav on every page");
    }

    // document basics carried over from Lab 1
    check("exactly one h1", doc.querySelectorAll("h1").length === 1);
    const lv = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")].map(h => +h.tagName[1]);
    let skip = null;
    for (let i = 1; i < lv.length; i++)
      if (lv[i] - lv[i - 1] > 1) { skip = [lv[i - 1], lv[i]]; break; }
    check("no skipped heading levels", skip === null,
          skip ? `jumps from h${skip[0]} to h${skip[1]}` : "");

    // ---- the form ----
    if (page === "contact.html") {
      const form = doc.querySelector("form");
      check("has a form", !!form);
      if (form) {
        const controls = [...form.querySelectorAll("input, select, textarea")];
        const named = controls.filter(c => c.hasAttribute("name"));
        check(`every control has a name (${named.length}/${controls.length})`,
              named.length === controls.length);

        // label association
        const ids = new Set([...form.querySelectorAll("label[for]")]
                            .map(l => l.getAttribute("for")));
        const unlabelled = controls.filter(c => {
          if (c.type === "submit" || c.type === "hidden") return false;
          if (c.closest("label")) return false;
          return !(c.id && ids.has(c.id));
        });
        check(`every control is labelled (${unlabelled.length} missing)`,
              unlabelled.length === 0,
              unlabelled.map(c => c.name || c.type).join(", "));

        check("has a required text input",
              !!form.querySelector('input[type="text"][required], input:not([type])[required]'));
        check('has a required type="email" input',
              !!form.querySelector('input[type="email"][required]'));

        const sel = form.querySelector("select");
        check("has a select", !!sel);
        if (sel) check("select has 3+ options",
                       sel.querySelectorAll("option").length >= 3);

        const radios = [...form.querySelectorAll('input[type="radio"]')];
        check(`has radio buttons (${radios.length})`, radios.length >= 2);
        if (radios.length) {
          const names = new Set(radios.map(r => r.getAttribute("name")));
          check("radios share one name attribute", names.size === 1,
                names.size > 1 ? `found ${names.size} different names` : "");
          check("radios are inside a fieldset",
                radios.every(r => !!r.closest("fieldset")));
          const fs = radios[0].closest("fieldset");
          check("that fieldset has a legend", !!(fs && fs.querySelector("legend")));
        }
        check("has a checkbox", !!form.querySelector('input[type="checkbox"]'));
        check("has a textarea", !!form.querySelector("textarea"));
        check("has a submit button",
              !!form.querySelector('button[type="submit"], button:not([type]), input[type="submit"]'));

        const ph = controls.filter(c => c.hasAttribute("placeholder") &&
                                        !(c.id && ids.has(c.id)) && !c.closest("label"));
        check("no placeholder used in place of a label", ph.length === 0);
      }
    }

    // ---- the table ----
    if (page === "projects.html") {
      const table = doc.querySelector("table");
      check("has a table", !!table);
      if (table) {
        check("table has a caption", !!table.querySelector("caption"));
        check("table has a thead", !!table.querySelector("thead"));
        check("table has a tbody", !!table.querySelector("tbody"));
        const ths = [...table.querySelectorAll("th")];
        check("header cells use scope",
              ths.length > 0 && ths.every(t => t.hasAttribute("scope")));
      }
    }

    render(box, R);
  }

  // ---------- the stylesheet ----------
  const box = document.createElement("div");
  box.className = "page";
  box.innerHTML = `<h2>stylesheet</h2>`;
  out.append(box);

  const R = [];
  const check = (label, ok, hint = "") => R.push({ label, ok, hint });

  check("all pages link the same single stylesheet", sheetHrefs.size === 1,
        sheetHrefs.size > 1 ? `found ${sheetHrefs.size}: ${[...sheetHrefs].join(", ")}` : "");

  let css = "";
  for (const href of sheetHrefs) {
    try {
      const res = await fetch(new URL(href, new URL(base, location.href)).href);
      if (res.ok) css += "\n" + await res.text();
    } catch { /* ignore */ }
  }

  if (!css.trim()) {
    check("stylesheet could be fetched", false, "check the href path");
  } else {
    check("stylesheet could be fetched", true);

    // strip comments so commented-out code doesn't count
    const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");

    // custom properties
    const defined = [...clean.matchAll(/(--[\w-]+)\s*:/g)].map(m => m[1]);
    const uniqueDefs = [...new Set(defined)];
    check(`four or more custom properties defined (${uniqueDefs.length})`,
          uniqueDefs.length >= 4);
    const usedTwice = uniqueDefs.filter(n =>
      (clean.match(new RegExp(`var\\(\\s*${n}\\b`, "g")) || []).length >= 2);
    check(`each used at least twice (${usedTwice.length} of ${uniqueDefs.length})`,
          uniqueDefs.length > 0 && usedTwice.length === uniqueDefs.length,
          uniqueDefs.filter(n => !usedTwice.includes(n)).join(", "));

    // box model
    check("box-sizing: border-box is set", /box-sizing\s*:\s*border-box/.test(clean));
    check("a max-width is used", /max-width\s*:/.test(clean));
    check("a border-radius is used", /border-radius\s*:/.test(clean));

    // selectors
    check("descendant selector used", /\b[a-z]+\s+[a-z.#\[][\w.\-\[\]="']*\s*\{/i.test(clean));
    check("class selector used", /\.[a-zA-Z][\w-]*\s*(\{|,|\s)/.test(clean));
    check("attribute selector used", /\[[a-zA-Z-]+\s*[~^$*|]?=/.test(clean));
    check(":hover style present", /:hover/.test(clean));
    check(":focus style present", /:focus/.test(clean),
          /:focus/.test(clean) ? "" : "keyboard users need this");

    // If the outline is removed, something visible must replace it. Careful:
    // "outline: none" itself contains the word "outline", so a naive search
    // for a replacement passes on the very code it should catch.
    const killedOutline = /outline\s*:\s*(none|0)\b/.test(clean);
    if (killedOutline) {
      const focusBlocks = clean.match(/:focus[^{]*\{[^}]*\}/g) || [];
      const hasRealOutline = (block) => {
        // Read the VALUE rather than pattern-matching around it. A lookahead
        // after \s* can slide past the space and match "outline: none"
        // as though it were a real value.
        for (const m of block.matchAll(/outline\s*:\s*([^;}]+)/g)) {
          const value = m[1].trim();
          if (value !== "none" && value !== "0") return true;
        }
        return false;
      };
      const replaced = focusBlocks.some(b =>
        /box-shadow\s*:/.test(b) ||
        /border[\w-]*\s*:/.test(b) ||
        /background[\w-]*\s*:/.test(b) ||
        hasRealOutline(b));
      check("outline removed, but something visible replaces it", replaced,
            "outline: none with no replacement leaves keyboard users lost");
    }

    // typography
    check("font-family declared", /font-family\s*:/.test(clean));
    check("line-height declared", /line-height\s*:/.test(clean));
    const remCount = (clean.match(/\d*\.?\d+rem/g) || []).length;
    check(`rem units used (${remCount})`, remCount >= 3);
    const pxFont = (clean.match(/font-size\s*:\s*\d+px/g) || []);
    check("font-size not set in px", pxFont.length === 0,
          pxFont.length ? `${pxFont.length} px font-size${pxFont.length > 1 ? "s" : ""}` : "");

    // THE constraint
    const flex = /display\s*:\s*(inline-)?flex/.test(clean);
    const grid = /display\s*:\s*(inline-)?grid/.test(clean);
    check("no display: flex (that's Lab 3)", !flex);
    check("no display: grid (that's Lab 3)", !grid);
  }

  render(box, R);

  const s = document.createElement("div");
  s.className = "summary";
  s.innerHTML = `<p><b>${pass} passed, ${fail} to fix.</b></p>
    <p style="color:#6B7885">Still to do by hand: run both W3C validators, tab
    through every page, and check your form at a narrow window width.</p>`;
  out.append(s);

  btn.disabled = false; btn.textContent = "Run the checks";
});
