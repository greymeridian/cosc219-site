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

- The search field's identifying text disappeared once I began typing.

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

- With `content-box`, `width: 100%` should fill the available width with the cotent box; The field's padding and borders add to that width, which can cause the search field to extend past the form's right edge at a narrow width (However this failed to appear when testing)

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

## Fault 5: Equality Coercion

**Symptom**

- Checker flags the rating comparisons, but the supplied rating strings can still filter correctly.

**How I found it**

- Inspected `matches()` in `app.js` and found that `const byRating` used `==` as a comparator.

**Cause**

- Loose eqaulity can convert values of different types before comparing them. The rating is meant to compare <u>exact</u> `String` values.

**Fix**

- Changed the following line
  ```javascript
  const byRating = rating == "all" || trail.rating == rating;
  ```

  to

  ```javascript
  const byRating = rating === "all" || trail.rating === rating;
  ```

**Lecture**

- Lecture 7


---

## Fault 6: Distance Sorting

**Symptom**

- Trail distances appeared to stay in their original order, for example, the `16km Mission Creek` trail always appears before the `12km Myra Canyon` trail.

**How I found it**

- Inspected `sortByDistance()` in `app.js` and saw that it calls `trails.sort()` ithout a comparator. Tried to add a comparator with the following line:
  ```javascript
    return trails.sort((a, b) => a.km - b.km);
  ```

- This resulted in the distance order check passing, but the array throwing the following error in the checker:
  **STILL BROKEN sorting does not reorder the array it was given**

**Cause**

- By default, `sort()` will compare the `String` representations of the trail objects The representations are identical for these objects , so their order always retains. Adding a numeric comparator makes `sort()` reorder the array it receives, so it needs to be copied first.

**Fix**

- Changed `sortByDistance()` to the following operand:
  ```javascript
    return [...trails].sort((a, b) => a.km - b.km);
  ```

**Lecture**

- Lecture 9


---

## Fault 7: Trail Name rendered as HTML

**Symptom**

- The starter `render()` function treats markup in a trail name as HTML. The normal names in `data.js` display as intended, so the issue is hidden with the supplied trail list.

**How I found it**

- Inspected `render()` in `app.js` and followed `trail.name` into the string assigned to `li.innerHTML`

**Cause**

- Browser parses the string assigned to `li.innerHTML` as markup. Trail names containing HTML can create DOM elements instead of appearing as literal text.

**Fix**

- Inside the loop `trails.forEach()` in the function `render()` I replaced the `li.innerHTML` assignmentt with two spans, set t eh trail name using `textContent`, and appended both spans to the list. I replaced the following block:

  ```javascript
  trails.forEach((trail) => {
      const li = document.createElement("li");
      li.className = "trail";
      li.innerHTML =
        '<span class="trail-name">' + trail.name + '</span>' +
        '<span class="trail-km">' + trail.km + ' km</span>';
      results.append(li);
    });
  ```

  with
  ```javascript
  trails.forEach((trail) => {
      const li = document.createElement("li");
      li.className = "trail";
      const name = document.createElement("span");
      name.className = "trail-name";
      name.textContent = trail.name;
  
      const distance = document.createElement("span");
      distance.className = "trail-km";
      distance.textContent = `${trail.km} km`;
  
      li.append(name, distance);
      results.append(li);
    });
  ```

**Lecture**

- Lecture 13


---

## Fault 8: Form Submission Reloads the Page

**Symptom**

- Pressing `Apply` reloads the page, thus resetting the filter settings.

**How I found it**

- This was a hard rubric requirement on labs, as well as heavily covered in lecture, and on the midterm; I simply checked the listener on `form` in `app.js` and as suspected, it called `apply()` without canceling the submit event.

**Cause**

- A form submission triggers browser navigation by default; The handler updated the results with `apply()`, then the default submission reloaded the page, thus discarding that update.

**Fix**

- Added an `event` parameter to the existing `submit` listener and called `preventDefault()` immediately before `apply()`. Changing the function from:
  ```javascript
  form.addEventListener("submit", () => {
    apply();
  });
  ```

  to
  ```javascript
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    apply();
  });
  ```

**Lecture**

- Lecture 14


---

## One more thing

**Which fault took you longest, and why?**

- Fault #3, box-sizing in CSS, as it did not have any visible symptoms before and after the fix. Had to directly inspect the code for `check.js` to see what it was requiring.

**Which one would you never have found without the checker?**

- Also fault #3 for the above aforementioned reasons.

