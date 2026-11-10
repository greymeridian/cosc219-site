/*
  COSC 219 — Lab 6 · trail.js
  Two classes. Export both.

  This file is an ES MODULE. It only works over http:// — open the page
  with Live Server, not by double-clicking.
*/


export class Trail {

  /* A truly private field. The # is part of the name; nothing outside this
     class body can read or write it. Start it as false. */
  // #closed = false;

  /* A static property belongs to the CLASS, not to any instance.
     Count how many Trails have been created. */
  // static count = 0;


  constructor(name, km, rating, gain) {
    // store the four values on `this`, and increase Trail.count
  }


  /* get steepness — metres of climb per kilometre, rounded to a whole number.

       new Trail("Knox Mountain", 2.8, "moderate", 250).steepness  →  89

     A getter is READ like a property: trail.steepness, with no ().
     Use one when the value is worked out from the object rather than
     stored on it.
     ---------------------------------------------------------------- */
  get steepness() {

  }


  /* get isClosed — read the private field.
     This is how the outside world is allowed to see #closed. */
  get isClosed() {

  }


  /* close() and open() — set the private field.
     Return `this` from both, so calls can be chained:
         trail.close().describe()
     ---------------------------------------------------------------- */
  close() {

  }

  open() {

  }


  /* describe()  →  "Knox Mountain — 2.8 km, moderate"
     Note the em dash and the comma. Use a template literal. */
  describe() {

  }


  /* toJSON() — called automatically by JSON.stringify.

     Return a plain object with name, km, rating, gain and closed.
     Without this method, stringify sees only ordinary properties, so the
     private field would silently vanish from the output.

       JSON.parse(JSON.stringify(trail))
         →  { name: "...", km: 2.8, rating: "...", gain: 250, closed: false }
     ---------------------------------------------------------------- */
  toJSON() {

  }


  /* static fromObject(obj) — a factory.

     Turn a plain object (say, one that came from JSON) into a real Trail.
     Destructure the properties out, defaulting gain to 0 if it is missing.

       Trail.fromObject({ name: "Z", km: 3, rating: "easy" }).gain  →  0
     ---------------------------------------------------------------- */
  static fromObject(obj) {

  }
}


export class BikeTrail extends Trail {

  /* Take the same four values plus a surface, defaulting to "gravel".

     Call super(...) FIRST. It runs the parent constructor and creates
     `this` — touch `this` before that line and you get a ReferenceError,
     because the instance does not exist yet.
     ---------------------------------------------------------------- */
  constructor(name, km, rating, gain, surface) {

  }


  /* describe() — override the parent, and reuse it rather than repeating it.

       "Myra Canyon — 12 km, easy — gravel"

     super.describe() gives you the first part.
     ---------------------------------------------------------------- */
  describe() {

  }


  /* toJSON() — everything the parent returns, plus surface.
     Spread super.toJSON() rather than listing the fields again. */
  toJSON() {

  }
}
