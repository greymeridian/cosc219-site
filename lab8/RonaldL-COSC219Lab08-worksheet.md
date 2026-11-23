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

- Inspected `<main>` in `Elements` and found an `h1` followed by an `h3`

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

- Inspected the search input in `Elements`. Showed that "Search by name" came from its `placeholder` and there was no label linked to `id="search"`

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

## Fault 3

**Symptom**


**How I found it**


**Cause**


**Fix**


**Lecture**


---

## Fault 4

**Symptom**


**How I found it**


**Cause**


**Fix**


**Lecture**


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


**Which one would you never have found without the checker?**

