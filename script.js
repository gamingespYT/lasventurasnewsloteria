// ========================================
// Lottery Database (Private)
// ========================================
const lotteryDatabase = {
    "Gus": ["82419", "34567", "43210", "67890", "89012", "53062", "90128", "77421", "55678", "90909"],
    "John": ["71894", "74328", "17843", "32984", "35706"],
    "Luna": ["22234", "91506", "08461", "24653", "69075"],
    "Claire": ["56290"],
    "Toni": ["53079", "17890", "92175", "08654", "41298"],
    "Alex Goméz": ["97412", "50364", "85426", "69041", "23587"],
    "Jimmy": ["93028"],
    "Danna": ["43796", "26804", "75092", "81430", "59607", "76209", "59831", "47610", "24097", "18963"],
    "Noha": ["10483", "81564", "90531", "62487", "70145", "26789", "35298", "76903", "68954", "34702"],
    "Lucas": ["48392", "31415", "92653", "80808"]
};

// ========================================
// DOM Elements
// ========================================
const form = document.getElementById('verificationForm');
const userNameInput = document.getElementById('userName');
const lotteryNumberInput = document.getElementById('lotteryNumber');
const resultContainer = document.getElementById('resultContainer');
const resultContent = document.getElementById('resultContent');

// ========================================
// Utility Functions
// ========================================

/**
 * Normalizes a name for comparison (removes accents, converts to lowercase, trims)
 */
function normalizeName(name) {
    return name
        .toLowerCase()
        .trim()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

/**
 * Verifies if a lottery number belongs to a specific person
 */
function verifyLotteryNumber(name, number) {
    const normalizedInputName = normalizeName(name);

    // Search through the database
    for (const [dbName, numbers] of Object.entries(lotteryDatabase)) {
        const normalizedDbName = normalizeName(dbName);

        // Check if names match
        if (normalizedDbName === normalizedInputName) {
            // Check if the number exists for this person
            if (numbers.includes(number)) {
                return {
                    success: true,
                    holderName: dbName,
                    number: number
                };
            } else {
                return {
                    success: false,
                    reason: 'number_not_found',
                    holderName: dbName
                };
            }
        }
    }

    // Name not found in database
    return {
        success: false,
        reason: 'name_not_found'
    };
}

/**
 * Displays the verification result
 */
function displayResult(result) {
    resultContainer.classList.remove('hidden');

    if (result.success) {
        resultContent.className = 'result-content result-success';
        resultContent.innerHTML = `
            <span class="result-icon">✓</span>
            <div class="result-message">¡Número Verificado!</div>
            <div class="result-details">
                El número <strong>${result.number}</strong> pertenece a <strong>${result.holderName}</strong>
            </div>
        `;
    } else {
        resultContent.className = 'result-content result-error';

        if (result.reason === 'number_not_found') {
            resultContent.innerHTML = `
                <span class="result-icon">✗</span>
                <div class="result-message">Número No Válido</div>
                <div class="result-details">
                    El número no está registrado para <strong>${result.holderName}</strong>
                </div>
            `;
        } else {
            resultContent.innerHTML = `
                <span class="result-icon">✗</span>
                <div class="result-message">Titular No Encontrado</div>
                <div class="result-details">
                    No se encontró ningún registro con ese nombre
                </div>
            `;
        }
    }

    // Scroll to result smoothly
    setTimeout(() => {
        resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Validates the lottery number format (5 digits)
 */
function validateNumberFormat(number) {
    return /^\d{5}$/.test(number);
}

// ========================================
// Event Handlers
// ========================================

/**
 * Handle form submission
 */
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const userName = userNameInput.value.trim();
    const lotteryNumber = lotteryNumberInput.value.trim();

    // Validate inputs
    if (!userName) {
        alert('Por favor, introduce tu nombre');
        userNameInput.focus();
        return;
    }

    if (!validateNumberFormat(lotteryNumber)) {
        alert('Por favor, introduce un número de 5 dígitos');
        lotteryNumberInput.focus();
        return;
    }

    // Verify the lottery number
    const result = verifyLotteryNumber(userName, lotteryNumber);
    displayResult(result);
});

/**
 * Only allow numbers in the lottery number input
 */
lotteryNumberInput.addEventListener('input', (e) => {
    e.target.value = e.target.value.replace(/[^0-9]/g, '');
});

/**
 * Hide result when user starts typing again
 */
userNameInput.addEventListener('input', () => {
    if (!resultContainer.classList.contains('hidden')) {
        resultContainer.classList.add('hidden');
    }
});

lotteryNumberInput.addEventListener('input', () => {
    if (!resultContainer.classList.contains('hidden')) {
        resultContainer.classList.add('hidden');
    }
});

// ========================================
// Snowfall Animation
// ========================================

/**
 * Creates a single snowflake element with random properties
 */
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');

    // Random snowflake characters
    const snowflakeChars = ['❄', '❅', '❆'];
    snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];

    // Random horizontal position
    snowflake.style.left = Math.random() * 100 + '%';

    // Random size
    const size = Math.random() * 1.5 + 0.5; // 0.5rem to 2rem
    snowflake.style.fontSize = size + 'rem';

    // Random opacity
    snowflake.style.opacity = Math.random() * 0.6 + 0.3; // 0.3 to 0.9

    // Random animation duration (fall speed)
    const duration = Math.random() * 10 + 10; // 10s to 20s
    snowflake.style.animationDuration = duration + 's';

    // Random delay for staggered start
    snowflake.style.animationDelay = Math.random() * 5 + 's';

    return snowflake;
}

/**
 * Initializes the snowfall effect
 */
function initSnowfall() {
    const container = document.getElementById('snowContainer');
    const numberOfSnowflakes = 50; // Number of snowflakes

    for (let i = 0; i < numberOfSnowflakes; i++) {
        container.appendChild(createSnowflake());
    }

    console.log(`❄️ Generated ${numberOfSnowflakes} snowflakes`);
}



// ========================================
// Initialization Functions
// ========================================

/**
 * Populates the name suggestions datalist from the database
 */
function populateNameSuggestions() {
    const datalist = document.getElementById('namesSuggestions');

    // Clear existing options
    datalist.innerHTML = '';

    // Add an option for each name in the database
    Object.keys(lotteryDatabase).forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        datalist.appendChild(option);
    });

    console.log(`✓ Loaded ${Object.keys(lotteryDatabase).length} name suggestions`);
}

// ========================================
// Initialize on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 Lotería de Navidad - Las Venturas News');
    console.log(`📋 Total de titulares registrados: ${Object.keys(lotteryDatabase).length}`);

    // Initialize snowfall effect
    initSnowfall();

    // Populate name suggestions from database
    populateNameSuggestions();
});
