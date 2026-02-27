const EXPECTED_YEARS = 80;
const WEEKS_IN_YEAR = 52;
const TOTAL_WEEKS = EXPECTED_YEARS * WEEKS_IN_YEAR;

const step1 = document.getElementById('step-1');
const step2 = document.getElementById('step-2');
const dobInput = document.getElementById('dob-input');
const btnNext = document.getElementById('btn-next');
const btnBack = document.getElementById('btn-back');

const statWeeks = document.getElementById('stat-weeks');
const statLeft = document.getElementById('stat-left');
const statPercentage = document.getElementById('stat-percentage');
const lifeGrid = document.getElementById('life-grid');

// Inicializar botón y max date
const today = new Date();
dobInput.max = today.toISOString().split("T")[0];
btnNext.disabled = true;

// Habilitar botón solo si hay fecha
dobInput.addEventListener('input', () => {
    btnNext.disabled = !dobInput.value;
});

// Permitir enter
dobInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !btnNext.disabled) {
        btnNext.click();
    }
});

btnNext.addEventListener('click', () => {
    if (!dobInput.value) return;

    const dob = new Date(dobInput.value);

    // validación si fecha es en el futuro
    if (dob > today) {
        alert('La fecha de nacimiento no puede ser en el futuro.');
        return;
    }

    const msInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeksLived = Math.max(0, Math.floor((today - dob) / msInWeek));
    const weeksLeft = Math.max(0, TOTAL_WEEKS - weeksLived);
    const percentage = Math.min(((weeksLived / TOTAL_WEEKS) * 100), 100).toFixed(1);

    // formatear números sin comas para mantener minimalismo estilo Dieter Rams
    statWeeks.innerText = `${weeksLived} semanas vividas.`;
    statLeft.innerText = `${weeksLeft} semanas restantes.`;
    statPercentage.innerText = `${percentage}% de tu vida completada.`;

    // transición suave
    transitionSteps(step1, step2, () => {
        drawGridAnimated(weeksLived);
    });
});

btnBack.addEventListener('click', () => {
    transitionSteps(step2, step1, () => {
        lifeGrid.innerHTML = ''; // reset grid memory
        dobInput.focus();
    });
});

function transitionSteps(hideElement, showElement, callback) {
    hideElement.classList.remove('active');

    // Asegurar que empiece sin scroll
    document.body.scrollTop = 0; // Para Safari
    document.documentElement.scrollTop = 0; // Para Chrome, Firefox, IE y Opera

    showElement.classList.add('active');
    if (callback) callback();
}

function drawGridAnimated(weeksLived) {
    // Para evitar lag con miles de nodos, usamos innerHTML de una sola vez
    // Y aplicamos una animación elegante al grid entero
    let boxesHtml = '';

    for (let i = 0; i < TOTAL_WEEKS; i++) {
        if (i < weeksLived) {
            boxesHtml += '<div class="week-box lived"></div>';
        } else {
            boxesHtml += '<div class="week-box"></div>';
        }
    }

    lifeGrid.innerHTML = boxesHtml;
}
