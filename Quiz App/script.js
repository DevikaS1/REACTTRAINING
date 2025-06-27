
const welcomeScreen = document.getElementById("welcome-screen");
const quizBox = document.getElementById("quiz-box");
const startBtn = document.getElementById("start-btn");

startBtn.onclick = () => {
  welcomeScreen.classList.add("hidden");
  quizBox.classList.remove("hidden");
  loadQuestions();
};
const reviewPopup = document.getElementById("review-popup");
const reviewDiv = document.getElementById("score-review");
const reviewBtn = document.getElementById("review-btn");
const closeReviewBtn = document.getElementById("close-review");

let questions = [];
let current = 0;
let score = 0;
let time = 10;
let timer;
let selectedAnswers = [];

const qBox = document.getElementById("question");
const optBox = document.getElementById("options");
const timerText = document.getElementById("timer");
const nextBtn = document.getElementById("next-btn");
const resultBox = document.getElementById("result-box");
const scoreSummary = document.getElementById("score-summary");



function loadQuestions() {
  fetch("questions.json")
    .then(res => res.json())
    .then(data => {
      questions = data;
      showQuestion();
    })
    .catch(err => {
      qBox.textContent = "Failed to load questions.";
      console.error("Error loading JSON:", err);
    });
}

function showQuestion() {
  clearInterval(timer);
  time = 10;
  timerText.textContent = "Time: " + time;
  timer = setInterval(countDown, 1000);

  const q = questions[current];
  qBox.textContent = "Q" + (current + 1) + ". " + q.question;
  optBox.innerHTML = "";

  q.options.forEach(opt => {
    const btn = document.createElement("button");
    btn.textContent = opt;
    btn.className = "block w-full text-left bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400";
    btn.setAttribute("tabindex", "0");

    btn.onclick = () => selectOption(opt, btn);
    btn.onkeydown = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(opt, btn);
      }
    };

    optBox.appendChild(btn);
  });
}

function selectOption(optionText, button) {
  selectedAnswers[current] = optionText;
  Array.from(optBox.children).forEach(btn => btn.classList.remove("bg-blue-200"));
  button.classList.add("bg-blue-200");
}

function countDown() {
  time--;
  timerText.textContent = "Time: " + time;
  if (time === 0) {
    clearInterval(timer);
    selectedAnswers[current] = selectedAnswers[current] || null;
    goToNext();
  }
}

function goToNext() {
  current++;
  if (current < questions.length) {
    showQuestion();
  } else {
    showResult();
  }
}

nextBtn.onclick = () => {
  selectedAnswers[current] = selectedAnswers[current] || null;
  clearInterval(timer);
  goToNext();
};


function showResult() {
  document.getElementById("quiz-box").style.display = "none";
  resultBox.classList.remove("hidden");
  resultBox.classList.add("flex");

  let correctCount = 0;
  questions.forEach((q, i) => {
    const userAnswer = selectedAnswers[i] || "No Answer";
    if (userAnswer === q.answer) correctCount++;
  });

  scoreSummary.innerHTML = `You got <span class="text-blue-600">${correctCount}</span> out of <span class="text-blue-600">${questions.length}</span> correct.`;

  reviewBtn.onclick = () => {
    reviewPopup.classList.remove("hidden");
    reviewPopup.classList.add("flex");

    reviewDiv.innerHTML = ""; 

    questions.forEach((q, i) => {
      const userAnswer = selectedAnswers[i] || "No Answer";
      const isCorrect = userAnswer === q.answer;

      const reviewBlock = `
        <div class="p-4 border rounded bg-gray-50">
          <p class="font-semibold text-gray-800 mb-1">Q${i + 1}: ${q.question}</p>
          <p>Your Answer: <span class="${isCorrect ? 'text-green-600' : 'text-red-600'}">${userAnswer}</span></p>
          <p>Correct Answer: <span class="text-green-600">${q.answer}</span></p>
        </div>
      `;
      reviewDiv.innerHTML += reviewBlock;
    });
  };

  closeReviewBtn.onclick = () => {
    reviewPopup.classList.add("hidden");
  };
}



