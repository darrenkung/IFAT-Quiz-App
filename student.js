let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;

async function loadQuiz() {
    let quizCode = document.getElementById("quizCode").value.trim();
    if (!quizCode) {
        alert("Please enter a quiz code.");
        return;
    }
    let url = `${GITHUB_RAW_URL}${quizCode}.txt`;
    let response = await fetch(url);
    if (response.ok) {
        answerKey = await response.text();
        startQuiz();
    } else {
        alert("Quiz not found. Check the code and try again.");
    }
}

function startQuiz() {
    document.getElementById("quiz-section").style.display = "block";
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= answerKey.length) {
        alert("Quiz complete! Final Score: " + score);
        return;
    }
    document.getElementById("question-number").textContent = currentQuestion + 1;
    let optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    let choices = ["A", "B", "C", "D"];
    choices.forEach(choice => {
        let option = document.createElement("div");
        option.textContent = choice;
        option.onclick = () => checkAnswer(choice, option);
        optionsContainer.appendChild(option);
    });
    attempts = 0;
    document.getElementById("next-btn").style.display = "none";
}

function checkAnswer(choice) {
    let correctAnswer = answerKey[currentQuestion];
    if (choice === correctAnswer) {
        let points = [2, 1, 0, -1][attempts] || -1;
        score += points;
        document.getElementById("score").textContent = score;
        document.getElementById("next-btn").style.display = "block";
    } else {
        attempts++;
    }
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
