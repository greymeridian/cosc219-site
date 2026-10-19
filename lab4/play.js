/*
  Provided — the wiring that turns your functions into a playable game.

  Read it. Every line calls something you wrote in game.js, and it uses
  addEventListener, which is Lecture 14. You are not asked to change it,
  but Part C asks you to answer two questions about it.
*/

const WORDS = "otter kelowna gravel summit trestle canyon";

let word = "";
let guessedLetters = "";
let lives = STARTING_LIVES;
let over = false;

function pickWord() {
  // No arrays yet, so the words live in one string and we slice one out.
  const count = 6;
  const n = Math.floor(Math.random() * count);
  let start = 0;
  let index = 0;
  while (index < n) {              // a loop — Lecture 9. Read, don't copy yet.
    start = WORDS.indexOf(" ", start) + 1;
    index++;
  }
  const end = WORDS.indexOf(" ", start);
  return end === -1 ? WORDS.slice(start) : WORDS.slice(start, end);
}

function render() {
  document.querySelector("#word").textContent = revealWord(word, guessedLetters);
  document.querySelector("#status").textContent =
    statusMessage(word, guessedLetters, lives);

  const result = document.querySelector("#result");
  if (!over) { result.textContent = ""; return; }

  if (hasWon(word, guessedLetters)) {
    const score = scoreFor(word, lives);
    result.textContent = `Score ${score} — grade ${gradeFor(score)}.`;
  } else {
    result.textContent = "Better luck next time.";
  }
}

function newGame() {
  word = pickWord();
  guessedLetters = "";
  lives = STARTING_LIVES;
  over = false;
  document.querySelector("#guess").value = "";
  render();
}

function submitGuess(raw) {
  if (over) return;

  if (!isValidGuess(raw)) {
    document.querySelector("#result").textContent = "Enter a single letter.";
    return;
  }

  const letter = normalizeGuess(raw);

  if (alreadyGuessed(letter, guessedLetters)) {
    document.querySelector("#result").textContent = `You already tried "${letter}".`;
    return;
  }

  const correct = isCorrect(letter, word);
  guessedLetters = guessedLetters + letter;
  lives = livesAfterGuess(lives, correct);
  over = lives <= 0 || hasWon(word, guessedLetters);

  render();
}

document.querySelector("#guess-form").addEventListener("submit", (e) => {
  e.preventDefault();
  submitGuess(document.querySelector("#guess").value);
  document.querySelector("#guess").value = "";
  document.querySelector("#guess").focus();
});

document.querySelector("#new-game").addEventListener("click", newGame);

newGame();
