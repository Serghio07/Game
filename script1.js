// Variables de puntuación 
let leftScore = 0;
let rightScore = 0;
const leftCharacter = document.getElementById('leftCharacter');
const rightCharacter = document.getElementById('rightCharacter');
const scoreDisplay = document.getElementById('score');
const container1 = document.querySelectorAll('.container')[0];
const container2 = document.querySelectorAll('.container')[1];

// Variables para controlar el estado de salto
let leftJumping = false;
let rightJumping = false;

// Crear el bloque de ladrillo para el jugador izquierdo
let leftBrick = document.createElement('div');
leftBrick.style.width = '60px';
leftBrick.style.height = '60px';
leftBrick.style.backgroundImage = 'url("https://www.gifservice.fr/img/gif-vignette-large/831f50d26aad3ea3e6506c745407a8b2/221957-malo-pulgares-abajo-emoticonos-mensajes.gif")';
leftBrick.style.backgroundSize = 'cover';
leftBrick.style.position = 'absolute';
leftBrick.style.top = `${Math.random() * 10 + 40}%`; // Ajusta la posición vertical (40% a 50%)
leftBrick.style.left = `${Math.random() * 40 + 10}%`; // Posición en el área del jugador izquierdo (10% a 50%)
container1.appendChild(leftBrick); // Añadir ladrillo al contenedor del jugador izquierdo

// Crear el bloque de ladrillo para el jugador derecho
let rightBrick = document.createElement('div');
rightBrick.style.width = '60px';
rightBrick.style.height = '60px';
rightBrick.style.backgroundImage = 'url("https://www.gifservice.fr/img/gif-vignette-large/831f50d26aad3ea3e6506c745407a8b2/221957-malo-pulgares-abajo-emoticonos-mensajes.gif")';
rightBrick.style.backgroundSize = 'cover';
rightBrick.style.position = 'absolute';
rightBrick.style.top = `${Math.random() * 10 + 40}%`; // Ajusta la posición vertical (40% a 50%)
rightBrick.style.left = `${Math.random() * 40 + 50}%`; // Posición en el área del jugador derecho (50% a 90%)
container2.appendChild(rightBrick); // Añadir ladrillo al contenedor del jugador derecho

// Función para actualizar la puntuación en pantalla
function updateScore() {
    scoreDisplay.textContent = `Left: ${leftScore} | Right: ${rightScore}`;
}

// Función para mover el ladrillo del jugador izquierdo a una nueva ubicación
function moveLeftBrick() {
    leftBrick.style.top = `${Math.random() * 10 + 40}%`; // Nueva posición vertical (40% a 50%)
    leftBrick.style.left = `${Math.random() * 40 + 10}%`; // Nueva posición horizontal en el área del jugador izquierdo
}

// Función para mover el ladrillo del jugador derecho a una nueva ubicación
function moveRightBrick() {
    rightBrick.style.top = `${Math.random() * 10 + 40}%`; // Nueva posición vertical (40% a 50%)
    rightBrick.style.left = `${Math.random() * 40 + 50}%`; // Nueva posición horizontal en el área del jugador derecho
}

// Función para detectar colisión del jugador izquierdo con su ladrillo
function detectCollisionLeft(character) {
    const charRect = character.getBoundingClientRect();
    const brickRect = leftBrick.getBoundingClientRect();

    if (
        charRect.left < brickRect.right &&
        charRect.right > brickRect.left &&
        charRect.top < brickRect.bottom &&
        charRect.bottom > brickRect.top
    ) {
        // Colisión detectada, incrementar la puntuación del jugador izquierdo
        leftScore++;
        updateScore();
        moveLeftBrick(); // Mover el ladrillo del jugador izquierdo a una nueva ubicación
    }
}

// Función para detectar colisión del jugador derecho con su ladrillo
function detectCollisionRight(character) {
    const charRect = character.getBoundingClientRect();
    const brickRect = rightBrick.getBoundingClientRect();

    if (
        charRect.left < brickRect.right &&
        charRect.right > brickRect.left &&
        charRect.top < brickRect.bottom &&
        charRect.bottom > brickRect.top
    ) {
        // Colisión detectada, incrementar la puntuación del jugador derecho
        rightScore++;
        updateScore();
        moveRightBrick(); // Mover el ladrillo del jugador derecho a una nueva ubicación
    }
}

// Función para el salto del personaje
function jump(character, isLeft) {
    if (isLeft ? leftJumping : rightJumping) return;

    const originalBottom = parseInt(window.getComputedStyle(character).bottom);

    let jumpHeight = originalBottom + 100;
    let jumpUp = setInterval(() => {
        character.style.bottom = `${jumpHeight}px`;
        jumpHeight += 10;

        if (jumpHeight >= originalBottom + 200) {
            clearInterval(jumpUp);

            let fallDown = setInterval(() => {
                character.style.bottom = `${jumpHeight}px`;
                jumpHeight -= 10;

                if (jumpHeight <= originalBottom) {
                    clearInterval(fallDown);
                    character.style.bottom = `${originalBottom}px`;

                    // Solo actualiza el estado del salto cuando el personaje vuelve a su posición original
                    if (isLeft) {
                        leftJumping = false;
                    } else {
                        rightJumping = false;
                    }
                }

                // Detectar colisión durante el salto
                if (isLeft) {
                    detectCollisionLeft(character);
                } else {
                    detectCollisionRight(character);
                }
            }, 20);
        }

        // Detectar colisión durante el salto
        if (isLeft) {
            detectCollisionLeft(character);
        } else {
            detectCollisionRight(character);
        }
    }, 20);

    if (isLeft) leftJumping = true;
    else rightJumping = true;
}

// Movimiento del personaje
function moveCharacter(character, direction, isLeft) {
    const currentLeft = parseInt(window.getComputedStyle(character).left) || 0;

    if (direction === 'left' && currentLeft > 0) {
        character.style.left = `${currentLeft - 10}px`;
    } else if (direction === 'right' && currentLeft < window.innerWidth - character.offsetWidth) {
        character.style.left = `${currentLeft + 10}px`;
    }

    // Detectar colisión después de mover
    if (isLeft) {
        detectCollisionLeft(character);
    } else {
        detectCollisionRight(character);
    }
}

// Controles de teclado
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Controles para el personaje de la izquierda (Flechas y Barra espaciadora)
        case 'ArrowLeft':
            moveCharacter(leftCharacter, 'left', true);
            break;
        case 'ArrowRight':
            moveCharacter(leftCharacter, 'right', true);
            break;
        case ' ':
            jump(leftCharacter, true);
            break;

        // Controles para el personaje de la derecha (W, A, S, D)
        case 'a':
            moveCharacter(rightCharacter, 'left', false);
            break;
        case 'd':
            moveCharacter(rightCharacter, 'right', false);
            break;
        case 'w':
            jump(rightCharacter, false);
            break;
    }
});

// Funciones para generar nubes
function createCloud(container, isDark) {
    const cloud = document.createElement('div');
    cloud.classList.add('cloud');

    // Si la nube es oscura
    if (isDark) {
        cloud.classList.add('dark');
    }

    // Posiciones de altura aleatorias entre 10% y 60%
    const randomTop = Math.random() * 50 + 10; // Valores entre 10% y 60%
    cloud.style.top = `${randomTop}%`;

    // Duración aleatoria entre 15 y 20 segundos
    cloud.style.animationDuration = `${15 + Math.random() * 5}s`;

    container.appendChild(cloud);

    // Eliminar la nube cuando termine su animación
    cloud.addEventListener('animationend', () => {
        container.removeChild(cloud);
    });
}

// Función para generar nuevas nubes
function generateNewCloud(container) {
    const maxCloudsOnScreen = 4; // Número máximo de nubes por pantalla
    const currentClouds = container.querySelectorAll('.cloud');

    // Generar nube solo si el número actual es menor que el máximo
    if (currentClouds.length < maxCloudsOnScreen) {
        const whiteClouds = container.querySelectorAll('.cloud:not(.dark)').length;
        const darkClouds = container.querySelectorAll('.cloud.dark').length;

        // Generar una nube manteniendo el balance entre nubes oscuras y blancas
        if (whiteClouds <= darkClouds) {
            createCloud(container, false); // Nube blanca
        } else {
            createCloud(container, true); // Nube oscura
        }
    }
}

// Función para generar nubes al inicio
function generateClouds() {
    const cloudContainers = document.querySelectorAll('.container');

    cloudContainers.forEach(container => {
        // Generar entre 2 y 4 nubes al inicio
        const initialClouds = Math.floor(Math.random() * 3) + 2; // Entre 2 y 4

        for (let i = 0; i < initialClouds; i++) {
            generateNewCloud(container);
        }
    });
}

// Inicia la generación de nubes
window.onload = generateClouds;
