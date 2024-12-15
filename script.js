const quizData = [
  {
    question: "Which encryption key is used in SSH to sign the packet?",
    answers: [
      { text: "Client's public key", correct: false },
      { text: "Client's private key", correct: true },
      { text: "Server's private key", correct: false }
    ]
  },
  {
    question: "Which command shows the number of active Linux kernel threads?",
    answers: [
      { text: "top | grep threads", correct: false },
      { text: "cat /proc/threads", correct: false },
      { text: "ps -eLf | wc -l", correct: true }
    ]
  },
  {
    question: "How do you check the file open limit in a Docker container?",
    answers: [
      { text: "ulimit -n", correct: true },
      { text: "docker stats --files", correct: false },
      { text: "sysctl -n fs.file-max", correct: false }
    ]
  },
  {
    question: "Which component schedules Pods in Kubernetes?",
    answers: [
      { text: "kubelet", correct: false },
      { text: "kube-scheduler", correct: true },
      { text: "kubectl-schedule", correct: false }
    ]
  },
  {
    question: "What is CRI in the context of Kubernetes?",
    answers: [
      { text: "Critical Resource Index", correct: false },
      { text: "Cluster Resource Implementation", correct: false },
      { text: "Container Runtime Interface", correct: true }
    ]
  },
  {
    question: "How do you configure memory allocation with a reservation (request) in a Pod?",
    answers: [
      { text: "requests.memory in the manifest", correct: true },
      { text: "memory.limit-request", correct: false },
      { text: "kubectl memory-reserve", correct: false }
    ]
  },
  {
    question: "Which command shows missing dependencies in a Helm Chart?",
    answers: [
      { text: "helm dep-missing", correct: false },
      { text: "helm dependency list", correct: true },
      { text: "helm verify dependencies", correct: false }
    ]
  },
  {
    question: "Which command shows all running kernel modules?",
    answers: [
      { text: "modprobe -l", correct: false },
      { text: "lsmod", correct: true },
      { text: "modules-info", correct: false }
    ]
  },
  {
    question: "How do you find out the Docker container's network type?",
    answers: [
      { text: "docker container info --network", correct: false },
      { text: "docker inspect --format='{{.HostConfig.NetworkMode}}'", correct: true },
      { text: "docker network get-type", correct: false }
    ]
  },
  {
    question: "How do you determine the minimum logical block size of a file system?",
    answers: [
      { text: "stat -f <file>", correct: true },
      { text: "df -h | grep block", correct: false },
      { text: "lsblk -s", correct: false }
    ]
  }
];

const quizContainer = document.getElementById("quiz");
const floatingText = document.getElementById("floating-text");

let currentQuestionIndex = 0;
let score = 0;
let results = [];

function shuffleAnswers(answers) {
  for (let i = answers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [answers[i], answers[j]] = [answers[j], answers[i]];
  }
  return answers;
}

let shuffledAnswers = [];

function loadQuestion() {
  const questionData = quizData[currentQuestionIndex];
  shuffledAnswers = shuffleAnswers([...questionData.answers]);

  quizContainer.innerHTML = `
    <div class="question">${questionData.question}</div>
    <div class="answers">
      ${shuffledAnswers
        .map(
          (answer, index) =>
            `<button class="answer" onclick="handleAnswer(${index})">${answer.text}</button>`
        )
        .join("")}
    </div>
    <div class="result-feedback" id="feedback"></div>
  `;
}

function handleAnswer(selectedIndex) {
  const isCorrect = shuffledAnswers[selectedIndex].correct;
  const feedback = document.getElementById("feedback");
  const answerButtons = document.querySelectorAll(".answer");

  answerButtons.forEach((btn) => btn.classList.add("disabled"));

  shuffledAnswers.forEach((answer, index) => {
    const button = answerButtons[index];
    if (answer.correct) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("incorrect");
    }
  });

  const resultText = isCorrect ? "Correct" : "Incorrect";
  feedback.textContent = resultText;
  feedback.classList.toggle("incorrect", !isCorrect);
  results.push(`${currentQuestionIndex + 1}. ${quizData[currentQuestionIndex].question} - ${resultText}`);
  score += isCorrect ? 1 : 0;

  setTimeout(() => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
      loadQuestion();
    } else {
      showResults();
    }
  }, 2000);
}

function showResults() {
  const resultText = `Your score: ${score} out of ${quizData.length}`;
  quizContainer.innerHTML = `
    <div class="results">${resultText}</div>
    <button class="answer" onclick="restartQuiz()">Restart</button>
    <button class="answer" onclick="downloadResults()">Save Results</button>
  `;
}

function restartQuiz() {
  currentQuestionIndex = 0;
  score = 0;
  results = [];
  loadQuestion();
}

function downloadResults() {
  const text = results.join("\n");
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "quiz-results.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

loadQuestion();
