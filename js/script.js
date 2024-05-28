/**
 * Script de un contador que realiza seguimiento y actualización 
 * visual del tiempo restante hasta un tiempo objetivo.
 * 
 * @author Urias Ramos
 * @since 2024-05-27
 */

//Aqui se establece el tiempo
const initialTime = { days: 14, hours: 0, minutes: 0, seconds: 0 };

//Se establece el tiempo actual
const countdownDuration = calculateCountdownDuration(initialTime);
const countToDate = new Date().getTime() + countdownDuration;
let previousTimeBetweenDates;

// Aqui se inicia el contador
requestAnimationFrame(updateCountdown);

/**
 * Este metodo convierte el tiempo en milisegundos, despues lo devuelve.
 * 
 * @param {Number | String} time tiempo a convertir
 * @returns {Number | String} tiempo convertido en milisegundos
 */
function calculateCountdownDuration(time) {
    return ((time.days * 24 * 60 * 60) + (time.hours * 60 * 60) + (time.minutes * 60) + time.seconds) * 1000;
}

/**
 * Este metodo actualizara el contador
 */
function updateCountdown() {
    const currentDate = new Date().getTime();
    const timeBetweenDates = Math.floor((countToDate - currentDate) / 1000);

    if(timeBetweenDates !== previousTimeBetweenDates) {
        if(timeBetweenDates >= 0) {
            flipAllCards(timeBetweenDates);
            previousTimeBetweenDates = timeBetweenDates;
        }
        else {//cuando el contador llega a 0 se mantiene
            flipAllCards(0);
            previousTimeBetweenDates = 0;
        }
    }
    requestAnimationFrame(updateCountdown);
}

/**
 * Este metodo se encarga de actualizar todas las vistas del contador
 * @param {Number} time tiempo en milisegundos
 */
function flipAllCards(time) {
    const days = Math.max(Math.floor(time / (24 * 3600)), 0);
    const hours = Math.max(Math.floor((time / 3600) % 24), 0);
    const minutes = Math.max(Math.floor((time / 60) % 60), 0);
    const seconds = Math.max(Math.floor(time % 60), 0);

    updateCard('.days .card', days);
    updateCard('.hours .card', hours);
    updateCard('.minutes .card', minutes);
    updateCard('.seconds .card', seconds);
}

/**
 * Actualiza un card en especifico
 * @param {String} selector elemento de la UI a actualizar
 * @param {String} time tiempo a mostrar en el card
 */
function updateCard(selector, time) {
    const card = document.querySelector(selector);

    //El tiempo se convierte a cadena y se asegura de tener al menos 2 caracteres, agregando ceros a la izquierda si es necesario.
    flipCard(card, String(time).padStart(2, '0'));
}

/**
 * Actualiza el contenido de un card con un nuevo tiempo.
 * 
 * @param {HTMLElement} flipCard El elemento que se actualizara
 * @param {Number | String} newTime El nuevo tiempo que se mostrara
 * 
 */
function flipCard(flipCard, newTime) {
    const currentTime = flipCard.querySelector('.top').innerText;

    //si el tiempo actual y el nuevo tiempo son iguales no hace nada
    if(newTime === currentTime) {
        return;
    }

    const topFlip = createFlipElement('flip-card-up', currentTime);
    const bottomFlip = createFlipElement('flip-card-down', newTime);

    const topHalf = flipCard.querySelector('.top');
    const bottomHalf = flipCard.querySelector('.down');

    topFlip.addEventListener('animationstart', () => {
        topHalf.innerText = newTime;
    });

    topFlip.addEventListener('animationend', () => {
        topFlip.remove();
    });

    bottomFlip.addEventListener('animationend', () => {
        bottomHalf.innerText = newTime;
        bottomFlip.remove();
    });

    flipCard.appendChild(topFlip);
    flipCard.appendChild(bottomFlip);
}

/**
 * Este metodo crea y devuelve un elemento Flip con la clase especificada y el tiempo proporcionado
 * 
 * @param {String} className La clase que se le asignara al elemento Flip
 * @param {Number | String} time El tiempo que se mostrara dentro del elemento Flip.
 * @returns {HTMLElement} devuelve el elemento Flip creado
 */
function createFlipElement(className, time) {
    const flipElement = document.createElement('div');
    flipElement.classList.add(className);
    flipElement.innerText = time;
    return flipElement;
}