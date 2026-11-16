/*
  COSC 219 — Lab 7 · trails.js
  The data operations. No DOM in this file at all.

  Every function here is PURE: it takes the current list and returns a NEW
  one. Nothing may change the array it was given — the tests check.
*/


/* makeTrail(name, km) — build one trail object.

     makeTrail("  Bear Creek  ", "5.5")
       →  { id: "...", name: "Bear Creek", km: 5.5, closed: false }

   Trim the name. Convert km to a real number — a form field hands you a
   string even when the input is type="number".

   For the id, anything unique is fine. This works:
     String(Date.now()) + Math.random().toString(16).slice(2, 8)
   ---------------------------------------------------------------------- */

export function makeTrail(name, km) {

}


/* isValidTrail(name, km) — true or false.

   A name must have something in it once trimmed. A distance must be a
   real number greater than zero.

     isValidTrail("Knox", "2.8")   →  true
     isValidTrail("   ", "2.8")    →  false
     isValidTrail("Knox", "")      →  false     ← careful: Number("") is 0
     isValidTrail("Knox", "abc")   →  false     ← Number("abc") is NaN
     isValidTrail("Knox", "0")     →  false

   Number.isFinite() rejects NaN and Infinity in one go.
   ---------------------------------------------------------------------- */

export function isValidTrail(name, km) {

}


/* addTrail(trails, trail) — a NEW array with the trail on the end.
   Spread, do not push. */

export function addTrail(trails, trail) {

}


/* removeTrail(trails, id) — a NEW array without that trail.
   An id that is not there simply changes nothing. */

export function removeTrail(trails, id) {

}


/* toggleTrail(trails, id) — flip `closed` on the matching trail.

   Return a new array AND a new object for the one that changed — do not
   edit the existing object. Spread it and override the one property.
   ---------------------------------------------------------------------- */

export function toggleTrail(trails, id) {

}


/* findAction(target) — which button was clicked, and on which row?

   You attach ONE listener to the list, not one per button, because the
   buttons are destroyed and rebuilt every time the list redraws.

   `target` is whatever was actually clicked. Use closest() to walk up to
   the button, then again to the row.

     clicking a Delete button  →  { action: "delete", id: "b2" }
     clicking a Close button   →  { action: "toggle", id: "a1" }
     clicking the row padding  →  null
     clicking the empty list   →  null

   The buttons carry data-action; the rows carry data-id and the class
   "trail".
   ---------------------------------------------------------------------- */

export function findAction(target) {

}
