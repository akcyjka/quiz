let currentQuestionIndex = 0;
let score = 0;
let selectedAnswer = null;
let userAnswers = [];

const gameImage = document.getElementById("game-image");
const optionsContainer = document.getElementById("options");
const confirmButton = document.getElementById("confirm-button");
const nextButton = document.getElementById("next-button");
const resultContainer = document.getElementById("result-container");
const finalScore = document.getElementById("final-score");
const reviewContainer = document.getElementById("review-container");
const showAnswersButton = document.getElementById("show-answers");
const reviewList = document.getElementById("review-list");

function loadQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const currentQuestion = questions[currentQuestionIndex];
    gameImage.src = currentQuestion.image;
    optionsContainer.innerHTML = "";
    confirmButton.style.display = "none";
    nextButton.style.display = "none";
    selectedAnswer = null;

    currentQuestion.options.forEach(option => {
        const button = document.createElement("button");
        button.textContent = option;
        button.classList.add("option-button");
        button.onclick = () => selectAnswer(button, option);
        optionsContainer.appendChild(button);
    });
}

function selectAnswer(button, selected) {
    optionsContainer.querySelectorAll(".option-button").forEach(btn => {
        btn.classList.remove("selected");
    });

    button.classList.add("selected");
    selectedAnswer = selected;
    confirmButton.style.display = "block";
}

function confirmAnswer() {
    if (!selectedAnswer) return;

    const currentQuestion = questions[currentQuestionIndex];
    const correctAnswer = currentQuestion.answer;

    userAnswers.push({
        questionImage: currentQuestion.image,
        selectedAnswer: selectedAnswer,
        correctAnswer: correctAnswer
    });

    optionsContainer.querySelectorAll(".option-button").forEach(button => {
        button.disabled = true;
        if (button.textContent === correctAnswer) {
            button.classList.add("correct");
        } 
        if (button.textContent === selectedAnswer && selectedAnswer !== correctAnswer) {
            button.classList.add("wrong");
        }
    });

    if (selectedAnswer === correctAnswer) {
        score++;
    }

    confirmButton.style.display = "none";
    nextButton.style.display = "block";
}

function showResults() {
    document.getElementById("quiz-container").classList.add("hidden");
    resultContainer.classList.remove("hidden");
    reviewContainer.classList.add("hidden");

    let percentage = Math.round((score / questions.length) * 100);
    finalScore.innerHTML = `Twój wynik: <b>${score} / ${questions.length}</b> (${percentage}%)`;
}

function showReview() {
    resultContainer.classList.add("hidden");
    reviewContainer.classList.remove("hidden");
    
    // Wyczyść listę przed dodaniem nowych elementów
    reviewList.innerHTML = "";
    
    userAnswers.forEach((answer, index) => {
        let isCorrect = answer.selectedAnswer === answer.correctAnswer;
        const reviewItem = document.createElement("div");
        reviewItem.className = "review-item";
        reviewItem.innerHTML = `
            <img src="${answer.questionImage}" alt="Pytanie ${index + 1}" class="review-img">
            <p><strong>Pytanie ${index + 1}:</strong></p>
            <p>Twoja odpowiedź: <span class="${isCorrect ? 'correct' : 'wrong'}">${answer.selectedAnswer}</span></p>
            <p>Poprawna odpowiedź: <span class="correct">${answer.correctAnswer}</span></p>
        `;
        reviewList.appendChild(reviewItem);
    });
}

nextButton.addEventListener("click", () => {
    currentQuestionIndex++;
    loadQuestion();
});

// Obsługa klawisza ENTER dla przechodzenia dalej
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (confirmButton.style.display === "block") {
            confirmAnswer();
        } else if (nextButton.style.display === "block") {
            currentQuestionIndex++;
            loadQuestion();
        }
    }
});

confirmButton.addEventListener("click", confirmAnswer);
showAnswersButton.addEventListener("click", showReview);
document.getElementById("restart-quiz").addEventListener("click", () => {
    location.reload();
});

document.getElementById("back-to-results").addEventListener("click", () => {
    reviewContainer.classList.add("hidden");
    resultContainer.classList.remove("hidden");
});
document.getElementById("choose-another-quiz").addEventListener("click", () => {
    window.location.href = "index.html";
});
// Załaduj pierwsze pytanie na start
loadQuestion();
