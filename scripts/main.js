let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;
let quizCode = "";

// Fetch and start the quiz
async function startQuiz() {
    quizCode = document.getElementById("quizCode").value.trim();
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

// Load the next question
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
    updateScoreDisplay();  // Update live score display

    // Enable buttons and reset styles
    document.querySelectorAll(".option").forEach(btn => {
        btn.disabled = false;
        btn.style.backgroundColor = "gray";
        btn.onclick = () => checkAnswer(btn.dataset.option, btn);
    });
}

// Check the selected answer
function checkAnswer(selectedOption, button) {
    attempts++;

    // If the student selects the correct answer
    if (selectedOption === answerKey[currentQuestion]) {
        button.style.backgroundColor = "green";
        document.getElementById("feedback").textContent = "Correct!";
        
        // Calculate the score based on the number of attempts
        score += attempts === 1 ? 2 : (attempts === 2 ? 1 : 0);
        updateScoreDisplay(); // Update live score display

        // Disable all options once the correct answer is selected
        document.querySelectorAll(".option").forEach(btn => {
            btn.disabled = true;
        });

        // Show the Next Question button
        document.getElementById("next-question").style.display = "block";
    } else {
        button.style.backgroundColor = "red";
        if (attempts === 4) {
            document.getElementById("feedback").textContent = "Incorrect! Moving to next question.";
            score -= 1;
            updateScoreDisplay(); // Update live score display
            setTimeout(nextQuestion, 1000);
        }
    }
}

// Update the live score display
function updateScoreDisplay() {
    document.getElementById("live-score").textContent = score;
}

// Move to the next question
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
