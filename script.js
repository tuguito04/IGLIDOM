// Datos del juego (sin archivo JSON)
let gridData = {
    row1: ["Águilas Cibaeñas", "Tigres del Licey", "Estrellas Orientales"],
    row2: ["Gigantes del Cibao", "Leones del Escogido", "Toros del Este"],
    categories: ["Erick Almonte", "Pitcher del Año", "100+ Hits"]
};

let timer;
let attemptsLeft = 9;
let correctAnswers = 0;
let timeLeft = 120; // Tiempo en segundos (2 minutos)
let gameEnded = false;

// Inicializar el juego
document.addEventListener("DOMContentLoaded", () => {
    updateAttempts();
    setupGrid();
    setupTimer();
    updateHighScore();
    setupGiveUpButton();  // Configurar el botón Give Up
});

// Reiniciar juego
function resetGame() {
    attemptsLeft = 9;
    correctAnswers = 0;
    timeLeft = 120; // Tiempo en segundos (2 minutos)
    updateAttempts();
    setupGrid();  // Reconfigurar la cuadrícula
    setupTimer();  // Reiniciar el temporizador
    updateHighScore();
}

// Actualizar intentos restantes
function updateAttempts() {
    document.getElementById("attempts-left").textContent = attemptsLeft;
}

// Configurar el temporizador
function setupTimer() {
    const timerElement = document.getElementById("timer");
    timer = setInterval(() => {
        if (gameEnded) return; // Si el juego ya terminó, no actualizar el temporizador

        timeLeft--;
        timerElement.textContent = formatTime(timeLeft);

        if (timeLeft === 0) {
            endGame();
        }
    }, 1000);
}

// Formatear tiempo en minutos:segundos
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
}

// Configurar la cuadrícula
function setupGrid() {
    const cells = document.querySelectorAll(".grid-cell");

    cells.forEach(cell => {
        cell.addEventListener("click", () => {
            if (gameEnded || attemptsLeft <= 0 || cell.classList.contains("answered")) return;  // Evitar que se haga clic si el juego terminó o ya se contestó

            const userInput = prompt("Ingresa un equipo o categoría:");

            if (validateAnswer(userInput, cell)) {
                cell.textContent = userInput;
                cell.classList.add("answered", "correct");
                correctAnswers++;
            } else {
                cell.classList.add("answered", "wrong");
            }

            attemptsLeft--;
            updateAttempts();

            if (attemptsLeft === 0 || correctAnswers === 9) {
                endGame();
            }
        });
    });
}

// Validar respuestas
function validateAnswer(input, cell) {
    const row = cell.getAttribute("data-row");
    let validAnswers = [];

    if (row === "row1") {
        validAnswers = gridData.row1;
    } else if (row === "row2") {
        validAnswers = gridData.row2;
    } else {
        validAnswers = gridData.categories;
    }

    // Normalizar tanto la entrada del usuario como las respuestas válidas
    const normalizedInput = input.trim().toLowerCase();

    // Comparar las respuestas (sin distinción de mayúsculas/minúsculas)
    const valid = validAnswers.some(answer => answer.toLowerCase() === normalizedInput);

    return valid;
}

// Finalizar el juego
function endGame() {
    if (gameEnded) return; // Evitar que se ejecute varias veces
    gameEnded = true;  // Marcar que el juego ha terminado

    clearInterval(timer);

    const highScore = localStorage.getItem("highScore") || 0;
    if (correctAnswers > highScore) {
        localStorage.setItem("highScore", correctAnswers);
        alert(`¡Nuevo récord! Respuestas correctas: ${correctAnswers}`);
    } else {
        alert(`Juego terminado. Respuestas correctas: ${correctAnswers}.`);
    }

    updateHighScore(); // Actualizar puntaje más alto

    resetGame();  // Reiniciar el juego

}

// Actualizar el puntaje más alto
function updateHighScore() {
    const highScore = localStorage.getItem("highScore") || 0;
    document.getElementById("high-score").textContent = highScore;
}

// Configurar el botón "Give Up"
function setupGiveUpButton() {
    const giveUpButton = document.getElementById("give-up-button");

    giveUpButton.addEventListener("click", () => {
        const confirmGiveUp = confirm("¿Estás seguro de que quieres rendirte?");

        if (confirmGiveUp) {
            endGame(); // Terminar el juego si el jugador se rinde
        }
    });
}


