/*
  COSC 219 — Lab 7 · app.js
  The only file that touches the page. Open index.html with Live Server.
*/

// import from ./storage.js, ./render.js and ./trails.js
import {
   addTrail,
   findAction,
   isValidTrail,
   makeTrail,
   removeTrail,
   toggleTrail
} from "./trails.js";
import { renderTrails, summaryText } from "./render.js";
import { clearTrails, loadTrails, saveTrails } from "./storage.js";

const form = document.querySelector("#add-form");
const nameInput = form.querySelector("#name");
const kmInput = form.querySelector("#km");
const error = document.querySelector("#error");
const summary = document.querySelector("#summary");
const list = document.querySelector("#trail-list");

/* Load the saved trails into a `let` — the array is replaced, not edited,
   every time something changes. */
let trails = loadTrails();

/* update() — redraw the list, rewrite the summary, and save.
   Call it whenever the data changes, and once at the very bottom of this
   file so the page is not blank on load. */
function update(save = true) {
   renderTrails(trails, list);
   summary.textContent = summaryText(trails);
   if (save) {
      saveTrails(trails);
   }
}

/* The add form.

   A submit reloads the page by default, throwing away everything in
   memory. Stop that first, then validate, then add.

   When the input is invalid: put a message in #error, focus the name
   field, and return without changing anything.
   When it is valid: clear #error, add the trail, reset the form. */
form.noValidate = true;

form.addEventListener("submit", event => {
   event.preventDefault();

   const name = nameInput.value;
   const km = kmInput.value;

   if (!isValidTrail(name, km)) {
      error.textContent = "Give the trail a name and a distance above zero.";
      nameInput.focus();
      return;
   }

   error.textContent = "";
   trails = addTrail(trails, makeTrail(name, km));
   form.reset();
   update();
});

/* The list.

   ONE listener on #trail-list — not one per button. The buttons are
   destroyed and rebuilt on every render, so a listener on a button would
   not survive the first redraw.

   Use findAction(event.target) to work out what was clicked.

   Clear #error here too — once the user clicks something in the list they
   have moved on from the form, and a stale validation message left on
   screen is just noise. */
list.addEventListener("click", event => {
   error.textContent = "";
   const clicked = findAction(event.target);
   if (!clicked) return;
   if (clicked.action === "toggle") {
      trails = toggleTrail(trails, clicked.id);
   } else if (clicked.action === "delete") {
      trails = removeTrail(trails, clicked.id);
   } else {
      return;
   }
   update();
});

/* The Clear all button: empty the array, clear storage, update. */
document.querySelector("#clear").addEventListener("click", () => {
   trails = [];
   clearTrails();
   update(false);
});

update(false);
