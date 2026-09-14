/* COSC 219 — Lab 1 self-check
   Fetches each page, parses it, and reports on the structural requirements.
   Runs entirely in your browser. */

const PAGES = ["index.html", "about.html", "projects.html"];

document.querySelector("#run").addEventListener("click", async () => {
  const btn = document.querySelector("#run");
  const out = document.querySelector("#output");
  let base = document.querySelector("#base").value.trim();

  if (!base) base = "./";
  if (!base.endsWith("/")) base += "/";

  btn.disabled = true;
  btn.textContent = "Checking…";
  out.innerHTML = "";

  let totalPass = 0, totalFail = 0;
  const titles = [];

  for (const page of PAGES) {
    const url = base + page;
    const box = document.createElement("div");
    box.className = "page";
    box.innerHTML = `<h2>${page}</h2>`;
    out.append(box);

    let html;
    try {
      const res = await fetch(url);
      if (!res.ok) {
        box.innerHTML += `<p class="fail">Could not load — HTTP ${res.status}.
          Check the filename's capitalisation; GitHub Pages is case-sensitive.</p>`;
        totalFail++;
        continue;
      }
      html = await res.text();
    } catch (err) {
      box.innerHTML += `<p class="fail">Could not fetch this page.
        Is the URL right, and is the repository public?</p>`;
      totalFail++;
      continue;
    }

    const doc = new DOMParser().parseFromString(html, "text/html");
    const results = [];
    const check = (label, ok, hint = "") =>
      results.push({ label, ok, hint });

    // --- document basics ---
    check("Doctype present", /^\s*<!doctype html>/i.test(html));
    check("html has lang attribute", doc.documentElement.hasAttribute("lang"));
    check("charset declared", !!doc.querySelector("meta[charset]"));
    check("viewport meta tag present", !!doc.querySelector('meta[name="viewport"]'));

    const title = (doc.querySelector("title")?.textContent || "").trim();
    check("title is present and non-empty", title.length > 0);
    titles.push(title);

    // --- headings ---
    const h1s = doc.querySelectorAll("h1");
    check(`exactly one h1 (found ${h1s.length})`, h1s.length === 1);

    const levels = [...doc.querySelectorAll("h1,h2,h3,h4,h5,h6")]
      .map(h => Number(h.tagName[1]));
    let skipped = null;
    for (let i = 1; i < levels.length; i++) {
      if (levels[i] - levels[i - 1] > 1) { skipped = [levels[i - 1], levels[i]]; break; }
    }
    check("no skipped heading levels", skipped === null,
          skipped ? `jumps from h${skipped[0]} to h${skipped[1]}` : "");

    // --- landmarks ---
    check("has a header", !!doc.querySelector("header"));
    check("has a main", !!doc.querySelector("main"));
    check("has a footer", !!doc.querySelector("footer"));

    const nav = doc.querySelector("nav");
    check("has a nav", !!nav);
    if (nav) {
      const hrefs = [...nav.querySelectorAll("a")].map(a => a.getAttribute("href") || "");
      const linksAll = PAGES.every(p => hrefs.some(h => h.includes(p)));
      check("nav links to all three pages", linksAll,
            linksAll ? "" : `found: ${hrefs.join(", ") || "no links"}`);
    }

    // --- images ---
    const imgs = [...doc.querySelectorAll("img")];
    if (page === "index.html") {
      check("at least one image", imgs.length > 0);
    }
    const missingAlt = imgs.filter(i => !i.hasAttribute("alt"));
    check(`every image has alt (${imgs.length} image${imgs.length === 1 ? "" : "s"})`,
          missingAlt.length === 0,
          missingAlt.length ? `${missingAlt.length} missing` : "");
    const lazyAlt = imgs.filter(i => /^(image|photo|picture|img)\.?$/i
                                       .test((i.getAttribute("alt") || "").trim()));
    if (imgs.length && lazyAlt.length === 0) {
      check("alt text is not a placeholder word", true);
    } else if (lazyAlt.length) {
      check("alt text is not a placeholder word", false,
            "alt=\"image\" or similar describes nothing");
    }

    // --- NO CSS ---
    const styleBlocks = doc.querySelectorAll("style").length;
    const styleAttrs  = doc.querySelectorAll("[style]").length;
    const cssLinks    = doc.querySelectorAll('link[rel="stylesheet"]').length;
    check("no <style> block", styleBlocks === 0);
    check("no inline style attributes", styleAttrs === 0,
          styleAttrs ? `${styleAttrs} found` : "");
    check("no stylesheet linked (Lab 1 is structure only)", cssLinks === 0);

    // --- per-page requirements ---
    if (page === "index.html") {
      check("has a list (ul or ol)", !!doc.querySelector("ul, ol"));
    }

    if (page === "about.html") {
      const secs = doc.querySelectorAll("section").length;
      check(`at least two sections (found ${secs})`, secs >= 2);
      const fig = doc.querySelector("figure");
      check("has a figure", !!fig);
      check("that figure has a figcaption", !!(fig && fig.querySelector("figcaption")));
      const blankTargets = [...doc.querySelectorAll('a[target="_blank"]')];
      check("has an external link opening in a new tab", blankTargets.length > 0);
      const unsafe = blankTargets.filter(a => !(a.getAttribute("rel") || "").includes("noopener"));
      if (blankTargets.length) {
        check('those links use rel="noopener"', unsafe.length === 0);
      }
    }

    if (page === "projects.html") {
      const arts = doc.querySelectorAll("article").length;
      check(`three articles (found ${arts})`, arts === 3);
      const table = doc.querySelector("table");
      check("has a table", !!table);
      if (table) {
        check("table has a caption", !!table.querySelector("caption"));
        check("table has a thead", !!table.querySelector("thead"));
        const ths = [...table.querySelectorAll("th")];
        check("header cells use scope",
              ths.length > 0 && ths.every(th => th.hasAttribute("scope")));
      }
    }

    // --- render ---
    const ul = document.createElement("ul");
    ul.className = "res";
    for (const r of results) {
      if (r.ok) totalPass++; else totalFail++;
      const li = document.createElement("li");
      const mark = document.createElement("span");
      mark.className = "mark " + (r.ok ? "pass" : "fail");
      mark.textContent = r.ok ? "PASS" : "FAIL";
      li.append(mark);
      li.append(document.createTextNode(r.label + (!r.ok && r.hint ? ` — ${r.hint}` : "")));
      ul.append(li);
    }
    box.append(ul);
  }

  // --- cross-page check ---
  const unique = new Set(titles.filter(Boolean));
  const summary = document.createElement("div");
  summary.className = "summary";
  const distinct = unique.size === titles.filter(Boolean).length && titles.length > 0;
  if (!distinct) totalFail++; else totalPass++;

  summary.innerHTML =
    `<p><b>${totalPass} passed, ${totalFail} to fix.</b></p>
     <p class="${distinct ? "pass" : "fail"}">
       ${distinct ? "PASS" : "FAIL"} — each page has a distinct &lt;title&gt;</p>
     <p style="color:#6B7885">Still to do by hand: run the W3C validator,
     check every nav link from every page, confirm your commit history, and make
     sure your alt text actually describes the image.</p>`;
  out.append(summary);

  btn.disabled = false;
  btn.textContent = "Run the checks";
});
