/*
  COSC 219 — Lab 6 · registry.js
  A class that owns a collection of Trails.
*/

// import the two classes from ./trail.js — note the .js is required


export class TrailRegistry {

  /* The array is PRIVATE. Nothing outside may push to it, sort it or
     empty it — this class decides what happens to the collection. */
  // #trails = [];


  /* Accept an optional array of Trails and add each one. */
  constructor(trails = []) {

  }


  /* get size — how many trails. */
  get size() {

  }


  /* get all — a COPY of the array.

     Returning the private array itself would let a caller do
     registry.all.push("junk") and walk straight past every check in
     this class. One of the tests does exactly that.
     ---------------------------------------------------------------- */
  get all() {

  }


  /* add(trail) — reject anything that is not a Trail.

     Throw a TypeError if it is not, otherwise store it and return `this`.
     Use `instanceof`. Remember a BikeTrail IS a Trail.
     ---------------------------------------------------------------- */
  add(trail) {

  }


  /* find(name) — the matching Trail, ignoring case, or undefined. */
  find(name) {

  }


  /* byRating(rating) — every trail with that rating. */
  byRating(rating) {

  }


  /* get openTrails — every trail that is not closed. */
  get openTrails() {

  }


  /* get totalDistance — all the km added up, to one decimal place. */
  get totalDistance() {

  }


  /* get steepest — the trail with the largest steepness.
     undefined when there are none. */
  get steepest() {

  }


  /* describeAll() — an array of every trail's describe() string. */
  describeAll() {

  }


  /* static fromData(rows) — build a registry from plain objects.

     A row with a `surface` property becomes a BikeTrail; anything else
     becomes a Trail. Default a missing gain to 0.
     ---------------------------------------------------------------- */
  static fromData(rows) {

  }
}
