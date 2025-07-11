// Variables globales
let timer;
let minutes = 25;
let seconds = 0;
let isRunning = false;
let isWorkTime = true;
let cyclesCompleted = 0;

// Éléments DOM
const minutesDisplay = document.getElementById('minutes');
const secondsDisplay = document.getElementById('seconds');
const startButton = document.getElementById('start-btn');
const pauseButton = document.getElementById('pause-btn');
const resetButton = document.getElementById('reset-btn');
const progressBar = document.getElementById('progress-bar');
const cycleCountDisplay = document.getElementById('cycle-count');
const body = document.body;

// Initialisation
updateDisplay();

// Événements
startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Fonctions
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        timer = setInterval(updateTimer, 1000);
        
        // Changement visuel
        if (isWorkTime) {
            body.classList.remove('break-time');
            body.classList.add('work-time');
        } else {
            body.classList.remove('work-time');
            body.classList.add('break-time');
        }
    }
}

function pauseTimer() {
    clearInterval(timer);
    isRunning = false;
}

function resetTimer() {
    clearInterval(timer);
    isRunning = false;
    minutes = isWorkTime ? 25 : 5;
    seconds = 0;
    updateDisplay();
    progressBar.style.width = '100%';
    body.classList.remove('work-time', 'break-time');
}

function updateTimer() {
    if (seconds === 0) {
        if (minutes === 0) {
            // Temps écoulé
            clearInterval(timer);
            isRunning = false;
            switchMode();
            return;
        }
        minutes--;
        seconds = 59;
    } else {
        seconds--;
    }
    
    updateDisplay();
    updateProgressBar();
}

function updateDisplay() {
    minutesDisplay.textContent = minutes.toString().padStart(2, '0');
    secondsDisplay.textContent = seconds.toString().padStart(2, '0');
}

function updateProgressBar() {
    const totalSeconds = isWorkTime ? 25 * 60 : 5 * 60;
    const currentSeconds = minutes * 60 + seconds;
    const percentage = (currentSeconds / totalSeconds) * 100;
    progressBar.style.width = `${percentage}%`;
}

function switchMode() {
    isWorkTime = !isWorkTime;
    
    if (isWorkTime) {
        minutes = 25;
        cyclesCompleted++;
        cycleCountDisplay.textContent = cyclesCompleted;
        
        // Notification
        if (Notification.permission === "granted") {
            new Notification("Pause terminée !", {
                body: "C'est reparti pour 25 minutes de travail."
            });
        }
    } else {
        minutes = 5;
        
        // Notification
        if (Notification.permission === "granted") {
            new Notification("Travail terminé !", {
                body: "Prenez 5 minutes de pause."
            });
        }
    }
    
    seconds = 0;
    updateDisplay();
    progressBar.style.width = '100%';
    
    // Demander la permission pour les notifications
    if (Notification.permission !== "granted") {
        Notification.requestPermission();
    }
    
    startTimer();
}
