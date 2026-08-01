const questionText = document.querySelector("[data-question-text]");
const questionSource = document.querySelector("[data-question-source]");
const questionCount = document.querySelector("[data-question-count]");
const optionsContainer = document.querySelector("[data-options]");
const feedback = document.querySelector("[data-feedback]");
const nextButton = document.querySelector("[data-next-question]");

let currentQuestion = null;
let answeredQuestions = 0;

function setFeedback(message, isCorrect) {
  feedback.textContent = message;
  feedback.className = `feedback ${isCorrect ? "is-correct" : "is-incorrect"}`;
  feedback.hidden = false;
}

function answerQuestion(selectedIndex, selectedButton) {
  const buttons = [...optionsContainer.querySelectorAll("button")];
  buttons.forEach((button) => {
    button.disabled = true;
  });

  const isCorrect = selectedIndex === currentQuestion.correcta;
  selectedButton.classList.add(isCorrect ? "is-correct" : "is-incorrect");

  if (isCorrect) {
    setFeedback(`Correcto. ${currentQuestion.explicacion ?? ""}`.trim(), true);
  } else {
    buttons[currentQuestion.correcta].classList.add("is-correct");
    setFeedback(`Incorrecto. La respuesta correcta era: ${currentQuestion.opciones[currentQuestion.correcta]}`, false);
  }

  nextButton.hidden = false;
}

function createOptionButton(option, index) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "option-button";
  button.textContent = option;
  button.addEventListener("click", () => answerQuestion(index, button));
  return button;
}

function loadQuestion() {
  if (!Array.isArray(bancoPreguntas) || bancoPreguntas.length === 0) {
    questionText.textContent = "El banco de preguntas no está disponible.";
    return;
  }

  currentQuestion = bancoPreguntas[Math.floor(Math.random() * bancoPreguntas.length)];
  answeredQuestions += 1;

  questionText.textContent = currentQuestion.pregunta;
  questionSource.textContent = `Fuente: ${currentQuestion.unidad}`;
  questionCount.textContent = `Pregunta ${answeredQuestions}`;
  feedback.hidden = true;
  feedback.className = "feedback";
  nextButton.hidden = true;
  optionsContainer.replaceChildren(...currentQuestion.opciones.map(createOptionButton));
}

nextButton.addEventListener("click", loadQuestion);
loadQuestion();
