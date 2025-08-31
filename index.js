const codeEl = document.getElementById("code");
const outEl = document.getElementById("out");
const qEl = document.getElementById("questions");
const resultEl = document.getElementById("result");

const QUESTIONS = [
  {
    id: 1,
    title: "Q1: Find maximum number from array",
    code: `const arr = [10, 22, 5, 19];\nconsole.log(Math.max(...arr));`,
    expected: "22",
  },
  {
    id: 2,
    title: "Q2: Reverse a string",
    code: `const str = 'JavaScript';\nconsole.log(str.split('').reverse().join(''));`,
    expected: "tpircSavaJ",
  },
  {
    id: 3,
    title: "Q3: Count vowels in a string",
    code: `const text = 'Hello World';\nconst count = (text.match(/[aeiou]/gi) || []).length;\nconsole.log(count);`,
    expected: "3",
  },
  {
    id: 4,
    title: "Q4: Filter even numbers from array",
    code: `const nums = [1,2,3,4,5,6];\nconst evens = nums.filter(n => n%2===0);\nconsole.log(evens);`,
    expected: "[2,4,6]",
  },
  {
    id: 5,
    title: "Q5: Create a button with click event",
    code: `const btn = document.createElement('button');\nbtn.textContent = 'Click Me';\nbtn.onclick = ()=> alert('Button Clicked!');\ndocument.body.appendChild(btn);\nconsole.log('Button created');`,
    expected: "Button created",
  },
];

let currentQuestion = null;
let lastOutput = "";

function renderQuestions() {
  qEl.innerHTML = "";
  QUESTIONS.forEach((q) => {
    const div = document.createElement("div");
    div.className = "question-item";
    div.textContent = q.title;
    div.onclick = () => {
      codeEl.value = q.code;
      currentQuestion = q;
      resultEl.textContent = "";
    };
    qEl.appendChild(div);
  });
}

function setDefault() {
  codeEl.value = "// Select a question or write your own code here";
}

function writeLine(...args) {
  const text = args
    .map((v) => {
      if (typeof v === "string") return v;
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    })
    .join(" ");
  outEl.textContent += text + "\n";
  lastOutput = text;
  outEl.scrollTop = outEl.scrollHeight;
}

const consoleShim = {
  log: (...args) => {
    writeLine(...args);
    console.logOriginal(...args);
  },
  error: (...args) => {
    writeLine("[Error]", ...args);
    console.errorOriginal(...args);
  },
  warn: (...args) => {
    writeLine("[Warn]", ...args);
    console.warnOriginal(...args);
  },
  info: (...args) => {
    writeLine("[Info]", ...args);
    console.infoOriginal(...args);
  },
  clear: () => {
    outEl.textContent = "";
  },
};

console.logOriginal = console.log.bind(console);
console.errorOriginal = console.error.bind(console);
console.warnOriginal = console.warn.bind(console);
console.infoOriginal = console.info.bind(console);

function runCode() {
  outEl.textContent = "";
  lastOutput = "";
  try {
    const userCode = codeEl.value;
    const fn = new Function("console", "document", "window", userCode);
    fn(consoleShim, document, window);

    if (currentQuestion) {
      if (lastOutput === currentQuestion.expected) {
        resultEl.textContent = "✅ Correct!";
        resultEl.className = "result correct";
      } else {
        resultEl.textContent = `❌ Wrong! Expected: ${currentQuestion.expected}`;
        resultEl.className = "result wrong";
      }
    }
  } catch (err) {
    writeLine("[Runtime Error]", err.message);
    resultEl.textContent = "❌ Runtime Error";
    resultEl.className = "result wrong";
  }
}

document.getElementById("run").onclick = runCode;
document.getElementById("clear").onclick = () => {
  outEl.textContent = "";
};
document.getElementById("reset").onclick = setDefault;

window.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    runCode();
  }
});

renderQuestions();
setDefault();
