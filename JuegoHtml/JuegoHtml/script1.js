let leftScore = 0;
let rightScore = 0;
const leftCharacter = document.getElementById('leftCharacter');
const rightCharacter = document.getElementById('rightCharacter');
const scoreDisplay = document.getElementById('score');

// Variables para controlar el estado de salto
let leftJumping = false;
let rightJumping = false;

// Función para actualizar la puntuación en pantalla
function updateScore() {
    scoreDisplay.textContent = `Left: ${leftScore} | Right: ${rightScore}`;
}

// Función para el salto del personaje
function jump(character, isLeft) {
    if (isLeft ? leftJumping : rightJumping) return;

    const originalBottom = parseInt(window.getComputedStyle(character).bottom);

    let jumpHeight = originalBottom + 100;
    let jumpUp = setInterval(() => {
        character.style.bottom = `${jumpHeight}px`;
        jumpHeight += 10;

        if (jumpHeight >= originalBottom + 150) {
            clearInterval(jumpUp);

            let fallDown = setInterval(() => {
                character.style.bottom = `${jumpHeight}px`;
                jumpHeight -= 10;

                if (jumpHeight <= originalBottom) {
                    clearInterval(fallDown);
                    character.style.bottom = `${originalBottom}px`;

                    // Solo actualiza la puntuación cuando el personaje vuelve a su posición original
                    if (isLeft) {
                        leftScore++;
                        leftJumping = false;
                    } else {
                        rightScore++;
                        rightJumping = false;
                    }
                    updateScore();
                }
            }, 20);
        }
    }, 20);

    if (isLeft) leftJumping = true;
    else rightJumping = true;
}

// Movimiento del personaje
function moveCharacter(character, direction) {
    const left = parseInt(window.getComputedStyle(character).left);
    const right = parseInt(window.getComputedStyle(character).right);

    if (direction === 'left' && left > 0) {
        character.style.left = `${left - 10}px`;
    } else if (direction === 'right' && left < window.innerWidth - character.offsetWidth) {
        character.style.left = `${left + 10}px`;
    } else if (direction === 'up' && right > 0) {
        character.style.right = `${right - 10}px`;
    } else if (direction === 'down' && right < window.innerWidth - character.offsetWidth) {
        character.style.right = `${right + 10}px`;
    }
}

// Controles de teclado
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        // Controles para el personaje de la izquierda (Flechas y Barra espaciadora)
        case 'ArrowLeft':
            moveCharacter(leftCharacter, 'left');
            break;
        case 'ArrowRight':
            moveCharacter(leftCharacter, 'right');
            break;
        case ' ':
            jump(leftCharacter, true);
            break;

        // Controles para el personaje de la derecha (W, A, S, D)
        case 'a':
            moveCharacter(rightCharacter, 'left');
            break;
        case 'd':
            moveCharacter(rightCharacter, 'right');
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

    // Detectar cuando la nube ha llegado a la mitad de su recorrido
    cloud.addEventListener('animationiteration', () => {
        const cloudPosition = cloud.getBoundingClientRect().left;
        const containerWidth = container.offsetWidth;

        // Verificamos si la nube está aproximadamente a la mitad del contenedor
        if (cloudPosition < containerWidth / 2 && cloudPosition > containerWidth / 4) {
            generateNewCloud(container); // Generamos una nueva nube cuando está en la mitad
        }
    });

    // Eliminar la nube cuando termine su animación
    cloud.addEventListener('animationend', () => {
        container.removeChild(cloud);
    });
}

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
