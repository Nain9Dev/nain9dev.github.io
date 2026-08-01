const state = {
  mode: "loading", // "local" | "static"
  blocks: [],
  topics: [],
  questions: [],
  answersKey: {}, // Maps question id strings to correct option ids.
  currentTest: null,
  answers: new Map() // Maps question ids to selected option ids.
};

const els = {
  blockSelect: document.getElementById("blockSelect"),
  topicSelect: document.getElementById("topicSelect"),
  difficultySelect: document.getElementById("difficultySelect"),
  countSelect: document.getElementById("countSelect"),
  generateBtn: document.getElementById("generateBtn"),
  finishBtn: document.getElementById("finishBtn"),
  modeBadge: document.getElementById("modeBadge"),
  testSection: document.getElementById("testSection"),
  testTitle: document.getElementById("testTitle"),
  questionHost: document.getElementById("questionHost"),
  scoreText: document.getElementById("scoreText")
};

async function tryLocalApi() {
  if (location.protocol === "https:") return false;
  if (location.hostname !== "localhost") return false;
  try {
    const r = await fetch("http://localhost:5298/api/health/db", { mode: "cors" });
    if (!r.ok) return false;
    const j = await r.json();
    return j && j.ok === true;
  } catch {
    return false;
  }
}

async function loadStaticData() {
  const [blocks, topics, questions, answersKey] = await Promise.all([
    fetch("./data/blocks.json").then(r => r.json()),
    fetch("./data/topics.json").then(r => r.json()),
    fetch("./data/questions.json").then(r => r.json()),
    fetch("./data/answers.json").then(r => r.json())
  ]);

  state.blocks = blocks;
  state.topics = topics;
  state.questions = questions;
  state.answersKey = answersKey;
}
async function loadLocalData() {
  const blocks = await fetch("http://localhost:5298/api/syllabus/blocks").then(r => r.json());
  state.blocks = blocks;

}

function setMode(mode) {
  state.mode = mode;
  els.modeBadge.textContent = `modo: ${mode === "local" ? "local API" : "demo estática"}`;
}

function fillBlocks() {
  els.blockSelect.replaceChildren(new Option("Todos", "0"));
  for (const b of state.blocks) {
    els.blockSelect.append(new Option(`${b.code} - ${b.name}`, String(b.id)));
  }
}

function getTopicsForBlock(blockId) {
  if (blockId === 0) return state.topics;
  return state.topics.filter(t => t.blockId === blockId);
}

function fillTopics() {
  const blockId = Number(els.blockSelect.value);
  const topics = getTopicsForBlock(blockId);

  els.topicSelect.replaceChildren(new Option("Todos", "0"));
  for (const t of topics) {
    els.topicSelect.append(new Option(`${t.topicNumber}. ${t.title}`, String(t.id)));
  }
}

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function createQuestionElement(question, questionNumber, questionId) {
  const wrapper = document.createElement("div");
  wrapper.className = "question";

  const title = document.createElement("div");
  const number = document.createElement("strong");
  number.textContent = `${questionNumber}.`;
  title.append(number, document.createTextNode(` ${question.statement}`));
  wrapper.appendChild(title);

  const options = document.createElement("div");
  options.className = "options";

  for (const option of question.options) {
    const row = document.createElement("label");
    row.className = "option";

    const input = document.createElement("input");
    input.type = "radio";
    input.name = `q_${questionId}`;
    input.value = String(option.id);
    input.addEventListener("change", () => {
      state.answers.set(questionId, option.id);
    });

    row.append(input, document.createTextNode(` ${option.sortOrder}. ${option.text}`));
    options.appendChild(row);
  }

  wrapper.appendChild(options);
  return wrapper;
}

function renderQuestions(questions, getQuestionId) {
  state.answers.clear();
  els.scoreText.textContent = "";
  els.questionHost.replaceChildren();

  questions.forEach((question, index) => {
    const questionId = getQuestionId(question);
    els.questionHost.appendChild(createQuestionElement(question, index + 1, questionId));
  });
}

function filterQuestionsStatic() {
  const blockId = Number(els.blockSelect.value);
  const topicId = Number(els.topicSelect.value);
  const difficulty = Number(els.difficultySelect.value);
  const count = Number(els.countSelect.value);

  let topicIds = [];

  if (topicId !== 0) {
    topicIds = [topicId];
  } else if (blockId !== 0) {
    topicIds = state.topics.filter(t => t.blockId === blockId).map(t => t.id);
  } else {
    topicIds = state.topics.map(t => t.id);
  }

  let qs = state.questions.filter(q => topicIds.includes(q.topicId));

  if (difficulty !== 0) {
    qs = qs.filter(q => q.difficulty === difficulty);
  }

  qs = shuffle(qs).slice(0, count);

  return qs;
}

function renderTestStatic(questions) {
  renderQuestions(questions, question => question.id);

  els.testTitle.textContent = "Simulacro (demo estática)";
  els.testSection.classList.remove("hidden");
}

function finishStatic(questions) {
  let correct = 0;

  for (const q of questions) {
    const chosen = state.answers.get(q.id);
    const correctId = state.answersKey[String(q.id)];

    if (chosen && correctId && chosen === correctId) {
      correct++;
    }
  }

  const score = questions.length ? (100 * correct / questions.length) : 0;
  els.scoreText.textContent = `Resultado: ${correct}/${questions.length} (${score.toFixed(2)}%)`;
}

async function generate() {
  if (state.mode === "static") {
    const questions = filterQuestionsStatic();
    state.currentTest = { questions };
    renderTestStatic(questions);
    return;
  }

  // Local mode currently supports one selected topic.
  const topicId = Number(els.topicSelect.value);
  if (topicId === 0) {
    alert("En modo local, selecciona un tema concreto (por simplicidad).");
    return;
  }

  const difficulty = Number(els.difficultySelect.value) || 1;
  const totalQuestions = Number(els.countSelect.value);

  const body = {
    title: "Simulacro Local",
    syllabusTopicId: topicId,
    difficulty,
    totalQuestions
  };

  const r = await fetch("http://localhost:5298/api/tests/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  });
  const j = await r.json();

  const test = await fetch(`http://localhost:5298/api/tests/${j.testId}`).then(x => x.json());
  state.currentTest = test;

  renderQuestions(test.questions, question => question.questionId);

  els.testTitle.textContent = `Simulacro (local) testId=${j.testId}`;
  els.testSection.classList.remove("hidden");
}

async function finish() {
  if (!state.currentTest) return;

  if (state.mode === "static") {
    finishStatic(state.currentTest.questions);
    return;
  }

  // Local mode: start, answer, finish.
  const startBody = { testId: state.currentTest.testId, userName: "demo" };
  const start = await fetch("http://localhost:5298/api/attempts/start", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(startBody)
  }).then(r => r.json());

  for (const q of state.currentTest.questions) {
    const chosen = state.answers.get(q.questionId);
    if (!chosen) continue;

    await fetch(`http://localhost:5298/api/attempts/${start.attemptId}/answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ questionId: q.questionId, answerOptionId: chosen })
    });
  }

  const result = await fetch(`http://localhost:5298/api/attempts/${start.attemptId}/finish`, {
    method: "POST"
  }).then(r => r.json());

  els.scoreText.textContent = `Resultado local: ${result.score}% (attemptId=${result.attemptId})`;
}

async function init() {
  const local = await tryLocalApi();
  if (local) {
    setMode("local");
    await loadLocalData();

    els.blockSelect.addEventListener("change", async () => {
      const blockId = Number(els.blockSelect.value);
      if (blockId === 0) {
        alert("En modo local, selecciona un bloque específico (por simplicidad).");
        return;
      }
      const topics = await fetch(`http://localhost:5298/api/syllabus/topics?blockId=${blockId}`).then(r => r.json());
      state.topics = topics;
      fillTopics();
    });

  } else {
    setMode("static");
    await loadStaticData();
    els.blockSelect.addEventListener("change", fillTopics);
  }

  fillBlocks();
  fillTopics();

  els.generateBtn.addEventListener("click", generate);
  els.finishBtn.addEventListener("click", finish);
}

init();
