const GITHUB_RAW_URL = "https://raw.githubusercontent.com/darrenkung/grat/main/answer/";

// Variables to track the quiz progress
let answerKey = "";
let currentQuestion = 0;
let attempts = 0;
let score = 0;

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
    document.getElementById("upload-section").style.display = "none";
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
        scratchOverlay.width = 100;  // Adjust width/height based on size of options
        scratchOverlay.height = 100;

        optionWrapper.appendChild(option);
        optionWrapper.appendChild(scratchOverlay);

        enableScratchEffect(optionWrapper, scratchOverlay); // Enable the scratch effect
        
        optionWrapper.onclick = () => checkAnswer(choice, option);
        optionsContainer.appendChild(optionWrapper);
    });

    attempts = 0;
    document.getElementById("next-btn").style.display = "none";
}

// Function to handle the scratch effect
function enableScratchEffect(optionWrapper, scratchOverlay) {
    let isScratching = false;

    // Handle mouse/touch start (when the user starts scratching)
    optionWrapper.addEventListener("mousedown", (e) => {
        isScratching = true;
        scratch(e);
    });

    // Handle mouse move (during scratching)
    optionWrapper.addEventListener("mousemove", (e) => {
        if (isScratching) {
            scratch(e);
        }
    });

    // Handle mouse/touch end (when the user stops scratching)
    optionWrapper.addEventListener("mouseup", () => {
        isScratching = false;
    });

    // Handle touch events for mobile
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
        // Get the position of the scratch event
        let rect = scratchOverlay.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;

        // Create a circular mask to simulate the scratching
        let context = scratchOverlay.getContext("2d");
        context.globalCompositeOperation = "destination-out"; // Create a "cut out" effect
        context.beginPath();
        context.arc(x, y, 20, 0, Math.PI * 2);
        context.fill();
        if (context.getImageData(x, y, 1, 1).data[3] === 0) {
            scratchOverlay.classList.add("revealed");
            optionWrapper.querySelector(".option").style.color = "white"; // Reveal the option text
        }
    }
}

// Function to check the answer and update the score
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

// Function to move to the next question
function nextQuestion() {
    currentQuestion++;
    loadQuestion();
}
