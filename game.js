/*
  COSC 219 — Lab 4
  Variables, conditionals and functions.

  Write the eight functions below. Each one is small, and each is tested
  independently — open check.html to see which pass.

  NO ARRAYS AND NO LOOPS. You have not been taught them yet, and you do not
  need them here. Everything can be done with string methods, conditionals
  and arithmetic. (revealWord and hasWon at the bottom are provided for
  exactly that reason — read them, but you are not expected to write them.)
*/

const STARTING_LIVES = 6;


/* ---------- 1. normalizeGuess(input) -----------------------------------

   Tidy whatever the user typed and return a single lowercase letter.
   Return the empty string "" for anything that is not exactly one letter
   from a to z.

   normalizeGuess("A")       →  "a"
   normalizeGuess("  t  ")   →  "t"
   normalizeGuess("cat")     →  ""
   normalizeGuess("3")       →  ""

   Useful: .trim()  .toLowerCase()  .length  and comparison operators.
   ---------------------------------------------------------------------- */

function normalizeGuess(input) {

}


/* ---------- 2. isValidGuess(input) -------------------------------------

   Return true or false — a real boolean, not the letter.
   Hint: you already wrote the hard part in question 1.

   isValidGuess("q")   →  true
   isValidGuess("!")   →  false
   ---------------------------------------------------------------------- */

function isValidGuess(input) {

}


/* ---------- 3. alreadyGuessed(letter, guessedLetters) -------------------

   guessedLetters is a single string of the letters tried so far, e.g. "aet".
   Return true if this letter is in it. Capital letters count as the same
   letter.

   alreadyGuessed("a", "aet")  →  true
   alreadyGuessed("A", "aet")  →  true
   alreadyGuessed("z", "aet")  →  false
   ---------------------------------------------------------------------- */

function alreadyGuessed(letter, guessedLetters) {

}


/* ---------- 4. isCorrect(letter, word) ---------------------------------

   Is the letter in the word? Case should not matter, and an invalid guess
   is never correct.

   isCorrect("o", "otter")  →  true
   isCorrect("O", "otter")  →  true
   isCorrect("z", "otter")  →  false
   ---------------------------------------------------------------------- */

function isCorrect(letter, word) {

}


/* ---------- 5. livesAfterGuess(lives, correct) -------------------------

   Return the number of lives after a guess. A correct guess costs nothing;
   a wrong one costs 1. Lives must never go below zero.

   livesAfterGuess(6, true)   →  6
   livesAfterGuess(6, false)  →  5
   livesAfterGuess(0, false)  →  0
   ---------------------------------------------------------------------- */

function livesAfterGuess(lives, correct) {

}


/* ---------- 6. scoreFor(word, lives) -----------------------------------

   10 points per letter in the word, plus 5 per remaining life.

   Give `lives` a DEFAULT of STARTING_LIVES so scoreFor("otter") works.

   scoreFor("otter", 6)  →  80
   scoreFor("otter", 1)  →  55
   scoreFor("otter")     →  80
   ---------------------------------------------------------------------- */

function scoreFor(word, lives) {

}


/* ---------- 7. statusMessage(word, guessedLetters, lives) --------------

   One sentence describing the current state. Three cases, in this order:

     lives is 0 or less   →  Out of lives. The word was "otter".
     the word is complete →  You got it! "otter" with 4 lives left.
     otherwise            →  3 lives left. Guessed: ot

   Two details the tests check:
     · "1 life left", not "1 lives left"
     · when nothing has been guessed yet, say "Guessed: nothing yet"

   You may call hasWon(word, guessedLetters) — it is provided below.
   Use template literals.
   ---------------------------------------------------------------------- */

function statusMessage(word, guessedLetters, lives) {

}


/* ---------- 8. gradeFor(score) -----------------------------------------

   90+ → "A"   80+ → "B"   70+ → "C"   60+ → "D"   below 60 → "F"
   ---------------------------------------------------------------------- */

function gradeFor(score) {

}


/* ======================================================================
   PROVIDED — read these, do not change them.

   Both need to look at every letter of the word, which needs a loop. That
   is Lecture 9. After Lab 5 you will be able to write them yourself.
   ====================================================================== */

function revealWord(word, guessedLetters) {
  return word
    .toLowerCase()
    .replace(/[a-z]/g, (letter) =>
      guessedLetters.includes(letter) ? letter : "_");
}

function hasWon(word, guessedLetters) {
  return !revealWord(word, guessedLetters).includes("_");
}
