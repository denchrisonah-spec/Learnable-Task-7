// ─── Quiz Data ───────────────────────────────────────────────────────────────
// Each question has:
//   q    - the question text
//   opts - array of 4 answer strings
//   ans  - index (0-3) of the correct answer

const questions = [
  {
    q: "What does HTML stand for?",
    opts: [
      "HyperText Markup Language",
      "HighText Machine Language",
      "Hyperlink and Text Markup Language",
      "HyperText Making Language",
    ],
    ans: 0,
  },
  {
    q: "Which keyword declares a variable that cannot be reassigned in JavaScript?",
    opts: ["var", "let", "const", "static"],
    ans: 2,
  },
  {
    q: "What is the output of `typeof null` in JavaScript?",
    opts: ["null", "undefined", "object", "string"],
    ans: 2,
  },
  {
    q: "Which data structure uses FIFO (First In, First Out) order?",
    opts: ["Stack", "Queue", "Tree", "Graph"],
    ans: 1,
  },
  {
    q: "What symbol is used for single-line comments in JavaScript?",
    opts: ["#", "//", "--", "/* */"],
    ans: 1,
  },
  {
    q: "Which array method adds an element to the end of an array?",
    opts: ["push()", "pop()", "shift()", "unshift()"],
    ans: 0,
  },
  {
    q: "In CSS, which property changes the text color?",
    opts: ["font-color", "text-color", "color", "foreground"],
    ans: 2,
  },
  {
    q: "What does CSS stand for?",
    opts: [
      "Creative Style Sheets",
      "Cascading Style Sheets",
      "Computer Style Sheets",
      "Colorful Style Sheets",
    ],
    ans: 1,
  },
  {
    q: "Which loop guarantees at least one execution of its body?",
    opts: ["for", "while", "do...while", "forEach"],
    ans: 2,
  },
  {
    q: "What is the correct syntax for a JavaScript arrow function?",
    opts: [
      "function myFunc => {}",
      "myFunc = > {}",
      "const myFunc = () => {}",
      "const myFunc => () {}",
    ],
    ans: 2,
  },
];

// ─── State ────────────────────────────────────────────────────────────────────
let currentIndex = 0;
let score = 0;
let selectedOption = null;
let hasAnswered = false;

// ─── Helpers ──────────────────────────────────────────────────────────────────
const LETTERS = ["A", "B", "C", "D"];

function getResultMessage(percentage) {
  if (percentage === 100) return "Perfect score! Excellent work!";
  if (percentage >= 80) return "Great job! You nailed it!";
  if (percentage >= 60) return "Good effort! Room to grow.";
  if (percentage >= 40) return "Keep practising — you're getting there!";
  return "Keep studying — you'll improve!";
}

// ─── Render ───────────────────────────────────────────────────────────────────
function render() {
  const app = document.getElementById("app");

  if (currentIndex >= questions.length) {
    renderResults(app);
  } else {
    renderQuestion(app);
  }
}

function renderQuestion(app) {
  const q = questions[currentIndex];
  const progressPct = (currentIndex / questions.length) * 100;

  // Build option buttons HTML
  const optionsHTML = q.opts
    .map(
      (opt, i) => `
      <button class="opt-btn" id="opt-${i}" onclick="chooseAnswer(${i})" ${hasAnswered ? "disabled" : ""}>
        <span class="opt-letter">${LETTERS[i]}</span>
        ${opt}
      </button>`
    )
    .join("");

  app.innerHTML = `
    <h1 class="app-title">Quizable</h1>

    <div class="q-card">
      <p class="q-meta">Question ${currentIndex + 1} of ${questions.length}</p>
      <p class="q-text">${q.q}</p>
      <div class="options">${optionsHTML}</div>
    </div>

    <div class="nav-row">
      <button class="next-btn" id="next-btn" onclick="goToNext()" ${hasAnswered ? "" : "disabled"}>
        ${currentIndex === questions.length - 1 ? "Finish Quiz" : "Next Question →"}
      </button>
    </div>
  `;

  // If the user already answered (re-render after state update), re-apply styles
  if (hasAnswered) {
    applyAnswerStyles();
  }
}

function renderResults(app) {
  const percentage = Math.round((score / questions.length) * 100);

  app.innerHTML = `
    <h1 class="app-title">Quizable</h1>
    <div class="results">
      <div class="score-circle">
        <span class="score-num">${score}</span>
        <span class="score-denom">of ${questions.length}</span>
      </div>
      <p class="result-title">${getResultMessage(percentage)}</p>
      <p class="result-sub">You scored ${percentage}% on this quiz.</p>

      <div class="stats-row">
        <div class="stat-box">
          <div class="stat-val correct-val">${score}</div>
          <div class="stat-lbl">Correct</div>
        </div>
        <div class="stat-box">
          <div class="stat-val wrong-val">${questions.length - score}</div>
          <div class="stat-lbl">Incorrect</div>
        </div>
        <div class="stat-box">
          <div class="stat-val pct-val">${percentage}%</div>
          <div class="stat-lbl">Score</div>
        </div>
      </div>

      <button class="restart-btn" onclick="restartQuiz()">Try Again</button>
    </div>
  `;
}

// ─── Event Handlers ───────────────────────────────────────────────────────────

/**
 * Called when the user clicks an answer option.
 * @param {number} index - The index of the chosen option (0–3)
 */
function chooseAnswer(index) {
  if (hasAnswered) return; // Ignore clicks after an answer is locked in

  selectedOption = index;
  hasAnswered = true;

  const correctIndex = questions[currentIndex].ans;
  if (index === correctIndex) {
    score++;
  }

  applyAnswerStyles();

  // Enable the Next button
  document.getElementById("next-btn").disabled = false;
}

/**
 * Applies correct/wrong CSS classes to option buttons after answering.
 */
function applyAnswerStyles() {
  const correctIndex = questions[currentIndex].ans;

  for (let i = 0; i < questions[currentIndex].opts.length; i++) {
    const btn = document.getElementById("opt-" + i);
    if (!btn) continue;

    btn.disabled = true;

    if (i === correctIndex) {
      btn.classList.add("correct");
    } else if (i === selectedOption) {
      btn.classList.add("wrong");
    }
  }
}

/**
 * Advances to the next question (or results screen).
 */
function goToNext() {
  currentIndex++;
  selectedOption = null;
  hasAnswered = false;
  render();
}

/**
 * Resets all state and restarts the quiz from the beginning.
 */
function restartQuiz() {
  currentIndex = 0;
  score = 0;
  selectedOption = null;
  hasAnswered = false;
  render();
}

// ─── Init ─────────────────────────────────────────────────────────────────────
render();
