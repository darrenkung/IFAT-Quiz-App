let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;

async function startQuiz() {
    const quizCode = document.getElementById("quizCode").value.trim();
    if (!quizCode) {
        alert("Please enter a quiz code.");
        return;
    }

    answerKey = await fetchAnswerKey(quizCode);
    if (!answerKey) {
        alert("Quiz not found!");
        return;
    }

    document.getElementById("quiz-setup").style.display = "none";
    document.getElementById("quiz-container").style.display = "block";
    
    loadQuestion();
}

function loadQuestion() {
    if (currentQuestion >= answerKey.length) {
        alert(`Quiz completed! Your final score: ${score}`);
        location.reload();
        return;
    }

    attempts = 0;
    document.getElementById("question-number").textContent = currentQuestion + 1;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-question").style.display = "none";

    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "gray";
        btn.onclick = () => checkAnswer(btn.dataset.option, btn);
    });
}

function checkAnswer(selectedOption, button) {
    attempts++;

    if (selectedOption === answerKey[currentQuestion]) {
        button.style.backgroundColor = "green";
        document.getElementById("feedback").textContent = "Correct!";
        score += attempts === 1 ? 2 : (attempts === 2 ? 1 : 0);
        document.getElementById("next-question").style.display = "block";
    } else {
        button.style.backgroundColor = "red";
        if (attempts === 4) {
            document.getElementById("feedback").textContent = "Incorrect! Moving to next question.";
            score -= 1;
            setTimeout(nextQuestion, 1000);
        }
    }

    button.disabled = true;
}

function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
