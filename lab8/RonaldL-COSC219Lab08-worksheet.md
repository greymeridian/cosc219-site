# Lab 8 — Debugging worksheet

Fill one block in for each fault you find. **The reasoning is what is marked**,
not the fix — a one-line correction with no explanation earns very little.

Copy the block as many times as you need.

**Ronald Lorette 300294189**

---

## Fault 1: Heading Order

**Symptom** — what did you see, or what did the checker say?

- Checker reported a skipped header level

**How I found it** — which tool, and what did it tell you?
(Console message? Elements panel? Reading the CSS? Tabbing through the page?)

- After the tests passed on W3C, I inspected `<main>` in "Elements" and found an `h1` followed by an `h3`

**Cause** — why did that happen? Name the concept, not just the line.

- Page skips a level in its header hierarchy, header ranks represent document outline. "Filter and sort" is directly under page title but `h3` gives it the rank of a subsection within an `h2` section.

**Fix** — what you changed.

- Used `h2` for Filter and sort

**Lecture** — which one covers this.

- Lecture 2


---

## Fault 2: Search Label

**Symptom**

- The search field's identifying text disappeared once I type.

**How I found it**

- After passing a W3C check, Inspected the search input in `Elements`. Showed that "Search by name" came from its `placeholder` and there was no label linked to `id="search"`

**Cause**

- Placeholder only appears when input empty, whereas a linked label gives the field a persistent name.

**Fix**

- Added the following line above the search input

```html
<label for="search">Search by name</label>
```

**Lecture**

- Lecture 3


---

## Fault 3: Search Overflow

**Symptom**

- Could not find any symptoms, when resizing the viewport, the search field's box scaled normally (even at or < 400px), but `check.js` is reporting **"STILL BROKEN box-sizing: border-box is set"**

**How I found it**

- Reviewed the following block inside `check.js`

  ```javascript
    group("CSS");
    is("box-sizing: border-box is set",
       () => /box-sizing\s*:\s*border-box/.test(css), true,
       "Lecture 4 — try the page at 400px wide and watch the search box");
  ```

**Cause**

- With `content-box`, `width: 100%` should fill the available width with the cotent box; the field's padding and borders add to that width, causing the search field to extend past the form's right edge at a narrow width (However this failed to appear when testing)

**Fix**

- Added the following line to `#search` inside `styles.css`
  ```css
  box-sizing: border-box;
  ```

- No noticeable difference on my end, but it resolved the error within `check.js`

**Lecture**

- Lecture 4


---

## Fault 4: Keyboard Focus

**Symptom**

- Improper focus when tabbing

**How I found it**

- I tabbed to the search input but it did not outline the search bar. Inspected it's `:focus` rule in "Styles" pane, and it applied `outline: none`.

**Cause**

- Stylesheet overrides the browser's focus outline and supplies no replacement

**Fix**

- Added the following lines to `:focus`
  ```css
   outline: 2px solid var(--brand);
   outline-offset: 2px;
  ```

**Lecture**

- Lecture 4


---

## Fault 5

**Symptom**


**How I found it**


**Cause**


**Fix**


**Lecture**


---

## Fault 6

**Symptom**


**How I found it**


**Cause**


**Fix**


**Lecture**


---

## Fault 7

**Symptom**


**How I found it**


**Cause**


**Fix**


**Lecture**


---

## Fault 8

**Symptom**


**How I found it**


**Cause**


**Fix**


**Lecture**


---

## One more thing

**Which fault took you longest, and why?**

- Fault #3, box-sizing in CSS, as it did not have any visible symptoms before and after the fix. Had to directly inspect the code for `check.js` to see what it was requiring.

**Which one would you never have found without the checker?**

- Also fault #3 for the above aforementioned reasons.

