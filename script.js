const GITHUB_RAW_URL = "https://raw.githubusercontent.com/darrenkung/grat/main/answer/";

let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;
let scratchedOptions = []; // Array to track which options have been fully scratched

// Function to load the quiz based on the entered quiz code
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

// Function to start the quiz
function startQuiz() {
    document.getElementById("intro-section").style.display = "none";
    document.getElementById("quiz-section").style.display = "block";
    loadQuestion();
}

// Function to load a question and its options
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
        let optionWrapper = document.createElement("div");
        optionWrapper.classList.add("option-wrapper");

        let option = document.createElement("div");
        option.textContent = choice;
        option.classList.add("option");
        
        let scratchOverlay = document.createElement("canvas"); // Use canvas for scratch effect
        scratchOverlay.classList.add("scratch");
        scratchOverlay.width = 150;  // Ensure canvas matches the size of the option box
        scratchOverlay.height = 150;
        
        let context = scratchOverlay.getContext("2d");
        context.fillStyle = "#999";  // Grey background to start
        context.fillRect(0, 0, scratchOverlay.width, scratchOverlay.height); // Draw grey background

        optionWrapper.appendChild(option);
        optionWrapper.appendChild(scratchOverlay);

        enableScratchEffect(optionWrapper, scratchOverlay, option);

        optionWrapper.onclick = () => checkAnswer(choice, optionWrapper, scratchOverlay);
        optionsContainer.appendChild(optionWrapper);
    });

    attempts = 0;
    document.getElementById("next-btn").style.display = "none";
}

// Function to handle the scratch effect
function enableScratchEffect(optionWrapper, scratchOverlay, option) {
    let isScratching = false;
    let scratchAmount = 0;  // Track how much has been scratched
    let context = scratchOverlay.getContext("2d");

    optionWrapper.addEventListener("mousedown", (e) => {
        isScratching = true;
        scratch(e);
    });

    optionWrapper.addEventListener("mousemove", (e) => {
        if (isScratching) {
            scratch(e);
        }
    });

    optionWrapper.addEventListener("mouseup", () => {
        isScratching = false;
    });

    optionWrapper.addEventListener("touchstart", (e) => {
        isScratching = true;
        scratch(e);
    });

    optionWrapper.addEventListener("touchmove", (e) => {
        if (isScratching) {
            scratch(e);
        }
    });

    optionWrapper.addEventListener("touchend", () => {
        isScratching = false;
    });

    // Function to apply the scratch effect
    function scratch(e) {
        let rect = scratchOverlay.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        context.globalCompositeOperation = "destination-out"; // Erase part of the grey background
        context.beginPath();
        context.arc(x, y, 20, 0, Math.PI * 2);
        context.fill();

        scratchAmount = calculateScratchAmount(scratchOverlay, context);

        if (scratchAmount >= 75 && !scratchedOptions.includes(optionWrapper)) {
            scratchedOptions.push(optionWrapper);
            optionWrapper.style.backgroundColor = "#ccc"; // Grey when fully scratched
        }
    }

    function calculateScratchAmount(scratchOverlay, context) {
        let imageData = context.getImageData(0, 0, scratchOverlay.width, scratchOverlay.height);
        let scratchedPixels = 0;
        let totalPixels = imageData.width * imageData.height;

        for (let i = 0; i < totalPixels; i++) {
            let alpha = imageData.data[i * 4 + 3]; // Alpha channel
            if (alpha === 0) {
                scratchedPixels++;
            }
        }

        return (scratchedPixels / totalPixels) * 100;
    }
}

// Function to check the answer and update the score
function checkAnswer(choice, optionWrapper, scratchOverlay) {
    let correctAnswer = answerKey[currentQuestion];
    let option = optionWrapper.querySelector(".option");

    if (!scratchedOptions.includes(optionWrapper)) {
        return;
    }

    if (choice === correctAnswer) {
        optionWrapper.style.backgroundColor = "green";  // Correct answer
        let points = [2, 1, 0, -1][attempts] || -1;
        score += points;
        document.getElementById("score").textContent = score;
        document.getElementById("next-btn").style.display = "block";
    } else {
        optionWrapper.style.backgroundColor = "red";  // Wrong answer
    }

    optionWrapper.style.pointerEvents = "none"; // Disable further interaction
}

// Function to move to the next question
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
