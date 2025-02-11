let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;

function loadAnswerKey() {
    let fileInput = document.getElementById("answerKey");
    let file = fileInput.files[0];

    if (!file) {
        alert("Please upload a .txt file.");
        return;
    }

    let reader = new FileReader();
    reader.onload = function (e) {
        answerKey = e.target.result.trim();
        startQuiz();
    };
    reader.readAsText(file);
}

function startQuiz() {
    document.getElementById("upload-section").style.display = "none";
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

        let scratchLayer = document.createElement("div");
        scratchLayer.className = "scratch";
        scratchLayer.onclick = () => revealScratch(scratchLayer);

        option.appendChild(scratchLayer);
        optionsContainer.appendChild(option);
    });

    attempts = 0;
    document.getElementById("next-btn").style.display = "none";
}

function revealScratch(scratchLayer) {
    scratchLayer.classList.add("revealed");
}

function checkAnswer(choice, option) {
    let correctAnswer = answerKey[currentQuestion];

    if (choice === correctAnswer) {
        let points = [2, 1, 0, -1][attempts] || -1;
        score += points;
        document.getElementById("score").textContent = score;

        playCorrectSound();
        showFireworks();
        document.getElementById("next-btn").style.display = "block";
    } else {
        attempts++;
    }
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}

function playCorrectSound() {
    let audio = new Audio("correct.mp3"); // Add a correct answer sound file
    audio.play();
}

function showFireworks() {
    alert("🎆 Fireworks! (Replace with animation)");
}
