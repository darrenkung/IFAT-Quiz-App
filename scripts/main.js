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
    document.getElementById("question-number").textContent = `Question ${currentQuestion + 1}`;
    document.getElementById("feedback").textContent = "";
    document.getElementById("next-question").style.display = "none";
    updateScoreDisplay();  // Update live score display
  
    // Optionally, you can dynamically display options here, but there's no need to have them clickable anymore
    // (since they are now automatically selected via scratching)
    // If you still want to display the option letters, you can do it like this:
    // Reset scratch canvases
    resetScratchCanvases();

    document.querySelectorAll(".option").forEach((btn, index) => {
        const optionLetter = btn.dataset.option;
        btn.querySelector(".answer").textContent = `Option ${optionLetter} Answer`;
    });
}

// Function to reset scratch canvases
function resetScratchCanvases() {
    const canvasElements = document.querySelectorAll('.scratch-canvas');
    
    canvasElements.forEach(canvas => {
        const ctx = canvas.getContext('2d');
        
        // Clear the canvas before starting a new question
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Reapply the gray scratchable area for the new question
        ctx.fillStyle = '#999';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
    });
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

// Check the selected answer
function checkAnswer(selectedOption) {
    attempts++;

    // If the student selects the correct answer
    if (selectedOption === answerKey[currentQuestion]) {    
        document.getElementById("feedback").textContent = "Correct!";
        
        // Update the score based on the attempt number (4, 2, 1, 0)
        if (attempts === 1) {
            score += 4; // First attempt
        } else if (attempts === 2) {
            score += 2; // Second attempt
        } else if (attempts === 3) {
            score += 1; // Third attempt
        } else if (attempts === 4) {
            score += 0; // Fourth attempt
        }

        updateScoreDisplay(); // Update live score display

        // Disable all options once the correct answer is selected
         disableAllScratchCanvases();

        // Show the Next Question button
        document.getElementById("next-question").style.display = "block";
    } else {
        if (attempts === 4) {
            document.getElementById("feedback").textContent = "Incorrect! Moving to next question.";
            score -= 1; // Deduct 1 mark if all attempts are used up
            updateScoreDisplay(); // Update live score display
            setTimeout(nextQuestion, 1000);
         } else {
         // Allow the user to retry the scratching on the same question
         document.getElementById("feedback").textContent = "Incorrect! Try again!";
        }
    }
}

// Initialize canvas for scratch effect
const canvasElements = document.querySelectorAll('.scratch-canvas');

// Add event listeners for both touch and mouse events
canvasElements.forEach(canvas => {
    const ctx = canvas.getContext('2d');
    let isScratching = false;
    let scratchedArea = 0; // Track how much has been scratched
    const threshold = 0.7; // Threshold to consider an option selected (70%)

    // Set canvas size (100x100 pixels)
    canvas.width = 100;
    canvas.height = 100;

    // Create the scratchable overlay (gray layer)
    ctx.fillStyle = '#999';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Function to handle the scratching
    const scratchHandler = (event) => {
        if (!isScratching) return;

        // Get position based on touch or mouse event
        let x, y;
        if (event.type.startsWith('touch')) {
            x = event.touches[0].clientX - canvas.offsetLeft;
            y = event.touches[0].clientY - canvas.offsetTop;
        } else {
            x = event.clientX - canvas.offsetLeft;
            y = event.clientY - canvas.offsetTop;
        }

        // Clear a small area where the user is "scratching"
        const scratchWidth = 20;
        ctx.clearRect(x - scratchWidth / 2, y - scratchWidth / 2, scratchWidth, scratchWidth);

        // Update the scratched area
        scratchedArea += scratchWidth * scratchWidth;

        // Check if the threshold is reached (70% of the canvas area)
        const totalArea = canvas.width * canvas.height;
        if (scratchedArea / totalArea >= threshold) {
            // Once the threshold is reached, trigger the checkAnswer function
            const option = canvas.closest('.option').dataset.option;  // Get the option (A, B, C, D)
            checkAnswer(option); // Pass the option to check if it's correct
        }
    };

    // Event listeners for mouse and touch events
    canvas.addEventListener('mousedown', (e) => {
        isScratching = true;
        scratchHandler(e);
    });
    canvas.addEventListener('mousemove', (e) => {
        if (isScratching) scratchHandler(e);
    });
    canvas.addEventListener('mouseup', () => {
        isScratching = false;
    });

    canvas.addEventListener('touchstart', (e) => {
        isScratching = true;
        scratchHandler(e);
    });
    canvas.addEventListener('touchmove', (e) => {
        if (isScratching) scratchHandler(e);
    });
    canvas.addEventListener('touchend', () => {
        isScratching = false;
    });

});

// Function to disable all scratch canvases
function disableAllScratchCanvases() {
    const canvasElements = document.querySelectorAll('.scratch-canvas');

    canvasElements.forEach(canvas => {
        // Remove event listeners so they cannot be scratched anymore
        canvas.removeEventListener('mousedown', scratchHandler);
        canvas.removeEventListener('mousemove', scratchHandler);
        canvas.removeEventListener('mouseup', stopScratching);
        canvas.removeEventListener('touchstart', scratchHandler);
        canvas.removeEventListener('touchmove', scratchHandler);
        canvas.removeEventListener('touchend', stopScratching);
    });
}
