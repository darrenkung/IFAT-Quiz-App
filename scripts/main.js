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

// Fetch the answer key based on the quiz code
async function fetchAnswerKey(quizCode) {
    // Replace with your actual API or backend call to fetch the answer key
    const response = await fetch(`https://your-server.com/answerkeys/${quizCode}.txt`);
    if (response.ok) {
        return await response.text();
    }
    return null;
}

// Load the next question
function loadQuestion() {
    if (currentQuestion >= answerKey.length) {
        alert(`Quiz completed! Your final score: ${score}`);
        location.reload();
        return;
    }

    attempts = 0;
    document.getElementById("question-number").textContent = `Question ${currentQuestion + 1}`;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-question").style.display = "none";
    updateScoreDisplay();  // Update live score display

    // Enable buttons and reset styles
    document.querySelectorAll(".scratch-card").forEach(card => {
        card.classList.remove("revealed");
        enableScratch(card);
    });
}

// Enable the scratch card interaction
function enableScratch(card) {
    const canvas = card.querySelector(".scratch-canvas");
    const context = canvas.getContext("2d");
    const answerDiv = card.querySelector(".answer");
    
    // Set up canvas size and background (scratchable layer)
    canvas.width = card.offsetWidth;
    canvas.height = card.offsetHeight;
    context.fillStyle = "gray";
    context.fillRect(0, 0, canvas.width, canvas.height);

    // Handle mouse or stylus events to scratch off the layer
    let isScratching = false;
    canvas.addEventListener("mousedown", () => isScratching = true);
    canvas.addEventListener("mouseup", () => isScratching = false);
    canvas.addEventListener("mousemove", (e) => {
        if (isScratching) {
            const rect = canvas.getBoundingClientRect();
            context.clearRect(e.clientX - rect.left - 10, e.clientY - rect.top - 10, 20, 20); // Scratch effect
        }
    });
    
    // When the card is revealed, show the answer
    canvas.addEventListener("mouseleave", () => {
        if (context.getImageData(0, 0, canvas.width, canvas.height).data.filter(pixel => pixel < 100).length < 100) {
            card.classList.add("revealed");
        }
    });
}

// Check the selected answer
function checkAnswer(selectedOption) {
    attempts++;

    // If the user scratched off enough of the answer
    const selectedCard = document.querySelector(`.option[data-option="${selectedOption}"] .scratch-card`);
    if (selectedCard.classList.contains("revealed")) {
        const answer = selectedCard.querySelector(".answer").textContent;
        if (answer === answerKey[currentQuestion]) {
            document.getElementById("feedback").textContent = "Correct!";
            score += attempts === 1 ? 4 : (attempts === 2 ? 2 : (attempts === 3 ? 1 : 0));
            updateScoreDisplay();

            // Disable all cards once the answer is revealed
            document.querySelectorAll(".scratch-card").forEach(card => {
                card.removeEventListener("mousedown", enableScratch);
            });

            document.getElementById("next-question").style.display = "block";
        }
    }
}

// Update the live score display
function updateScoreDisplay() {
    document.getElementById("live-score").textContent = `Score: ${score}`;
}

// Move to the next question
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
