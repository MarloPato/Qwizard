let currentQuestion = 0;
let score = 0;
let randomizer = [];
let timePerQuestion = 15;
let timeLeft;
let timerInterval;

function start(subject) {
  fetchQuestions(subject).then(() => {
    currentQuestion = 0;
    score = 0;
    document.getElementById("start-page").style.display = "none";
    document.getElementById("quiz-page").style.display = "flex";
    showQuestion();
  });
}

function fetchQuestions(subject) {
  let category = "";
  if (subject === "sports") {
    category = "21";
  } else if (subject === "general-knowledge") {
    category = "9";
  }

  const apiURL = `https://opentdb.com/api.php?amount=5&category=${category}&type=multiple&encode=url3986`;

  return fetch(apiURL)
    .then((response) => response.json())
    .then((data) => {
      randomizer = data.results.map((question) => {
        const decodedQuestion = decodeURIComponent(question.question);
        const decodedCorrectAnswer = decodeURIComponent(
          question.correct_answer
        );
        const decodedIncorrectAnswers = question.incorrect_answers.map((ans) =>
          decodeURIComponent(ans)
        );
        const options = [...decodedIncorrectAnswers, decodedCorrectAnswer];
        const randomOptions = options.sort(() => 0.5 - Math.random());
        return {
          question: decodedQuestion,
          options: randomOptions,
          correct: randomOptions.indexOf(decodedCorrectAnswer),
        };
      });
    })
    .catch((error) => {
      console.error("Error fetching questions:", error);
    });
}

function showQuestion() {
  const question = randomizer[currentQuestion];
  document.getElementById("question").textContent = question.question;

  const options = document.querySelectorAll(".alternative");
  options.forEach((btn, index) => {
    btn.textContent = question.options[index];
    btn.disabled = false;
  });

  document.getElementById("next").style.display = "none";

  startTimer();
}

function startTimer() {
  timeLeft = timePerQuestion;
  document.getElementById("time").textContent = timeLeft;

  timerInterval = setInterval(() => {
    timeLeft--;
    document.getElementById("time").textContent = timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      timeExpired();
    }
  }, 1000);
}

function timeExpired() {
  next();
}

function answer(alternative) {
  clearInterval(timerInterval);
  const question = randomizer[currentQuestion];
  const options = document.querySelectorAll(".alternative");

  options.forEach((btn) => (btn.disabled = true));

  if (alternative === question.correct) {
    score++;
  }

  document.getElementById("next").style.display = "flex";
}

function next() {
  clearInterval(timerInterval);
  currentQuestion++;
  if (currentQuestion < randomizer.length) {
    showQuestion();
  } else {
    result();
  }
}

function result() {
  clearInterval(timerInterval);
  document.getElementById("quiz-page").style.display = "none";
  document.getElementById("result").style.display = "flex";
  document.getElementById(
    "score"
  ).textContent = `You got ${score} out of ${randomizer.length} correct!`;
}

function restart() {
  document.getElementById("result").style.display = "none";
  document.getElementById("start-page").style.display = "flex";
  clearInterval(timerInterval);
}
