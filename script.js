// ========================================
// Lottery Database (Private)
// ========================================
const lotteryDatabase = {
    "Gus Martinez": ["82419", "34567", "43210", "67890", "89012", "53062", "90128", "77421", "55678", "90909"],
    "John Whittaker": ["71894", "74328", "17843", "32984", "35706"],
    "Luna Martinez": ["22234", "91506", "08461", "24653", "69075"],
    "Claire Todd": ["56290"],
    "Toni Montana": ["53079", "17890", "92175", "08654", "41298"],
    "Alex Gómez": ["97412", "50364", "85426", "69041", "23587", "00217", "01473", "04821", "03358", "02764"],
    "Jimmy Trivani": ["93028"],
    "Danna Okelly": ["43796", "26804", "75092", "81430", "59607", "76209", "59831", "47610", "24097", "18963"],
    "Noha Shefer": ["10483", "81564", "90531", "62487", "70145", "26789", "35298", "76903", "68954", "34702"],
    "Lucas Montero": ["48392", "31415", "92653", "80808"],
    "Daniel Luzbel": ["10574", "76281", "34905", "91846", "57023", "28491", "63970", "85124", "09638", "82051"],
    "Layla Gómez": ["69407"],
    "Lolo Hernández": ["34789", "47215", "73096", "56190", "15842", "90327", "21468", "65843", "29716", "84160"],
    "Santiago Martínez": ["41987", "60197", "50273", "45831", "26490", "83715", "72054", "14698", "97340", "79062"],
    "Mateo Díaz": ["78534", "46901", "12095", "40439", "39328", "41540"],
    "Pau Pérez": ["12384", "64218", "93071", "70596", "38942", "25079", "86103", "09472", "53816", "68521"],
    "Byron Brown": ["22863", "21752", "26196", "25085", "23974", "17318", "16207", "20641", "19530", "18429"],
    "Joselito Fajardo": ["10752", "11863", "15196", "14085", "12974", "05593", "07736", "06642", "09914", "08825"],
    "Benny Buddy": ["54862", "53751", "52640", "51539", "50428", "43762", "45984", "47095", "48206", "49317"],
    "Alex Asecas": ["42651"],
    "Fazio Rossi": ["32762", "33873", "34984", "37106", "38217", "27207", "48750", "28318", "29429", "30540"]
};

// ========================================
// DOM Elements
// ========================================
const form = document.getElementById('verificationForm');
const userNameInput = document.getElementById('userName');
const lotteryNumberInput = document.getElementById('lotteryNumber');

// ========================================
// Utility Functions
// ========================================

/**
 * Calculates the total number of lottery tickets sold
 */
function getTotalTicketsSold() {
    let total = 0;
    for (const numbers of Object.values(lotteryDatabase)) {
        total += numbers.length;
    }
    return total;
}

/**
 * Shows a custom alert with a message and icon
 */
function showCustomAlert(message, icon = '⚠️') {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    // Create alert box
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    
    // Create icon
    const alertIcon = document.createElement('div');
    alertIcon.className = 'custom-alert-icon';
    alertIcon.textContent = icon;
    
    // Create message
    const alertMessage = document.createElement('div');
    alertMessage.className = 'custom-alert-message';
    alertMessage.textContent = message;
    
    // Create button
    const alertButton = document.createElement('button');
    alertButton.className = 'custom-alert-button';
    alertButton.textContent = 'Entendido';
    
    // Close alert on button click
    alertButton.addEventListener('click', () => {
        overlay.style.animation = 'fadeIn 0.2s ease-in-out reverse';
        setTimeout(() => overlay.remove(), 200);
    });
    
    // Close alert on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            overlay.style.animation = 'fadeIn 0.2s ease-in-out reverse';
            setTimeout(() => overlay.remove(), 200);
        }
    });
    
    // Assemble alert
    alertBox.appendChild(alertIcon);
    alertBox.appendChild(alertMessage);
    alertBox.appendChild(alertButton);
    overlay.appendChild(alertBox);
    
    // Add to page
    document.body.appendChild(overlay);
    
    // Focus button for keyboard accessibility
    setTimeout(() => alertButton.focus(), 100);
}

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
    if (result.success) {
        showCustomAlert(`¡Número Verificado!\n\nEl número ${result.number} pertenece a ${result.holderName}`, '✅');
    } else {
        if (result.reason === 'number_not_found') {
            showCustomAlert(`Número No Válido\n\nEl número no está registrado para ${result.holderName}`, '❌');
        } else {
            showCustomAlert('Titular No Encontrado\n\nNo se encontró ningún registro con ese nombre', '❌');
        }
    }
}

/**
 * Validates the lottery number format (5 digits)
 */
function validateNumberFormat(number) {
    return /^\d{5}$/.test(number);
}

/**
 * Checks if a lottery number is duplicated across different holders
 * Returns an object with duplicate information
 */
function checkDuplicateNumber(number) {
    const holders = [];
    
    // Search for all holders of this number
    for (const [name, numbers] of Object.entries(lotteryDatabase)) {
        if (numbers.includes(number)) {
            holders.push(name);
        }
    }
    
    // If more than one holder, it's a duplicate
    if (holders.length > 1) {
        return {
            isDuplicate: true,
            holders: holders,
            number: number
        };
    }
    
    return {
        isDuplicate: false
    };
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
        showCustomAlert('Por favor, introduce tu nombre', '👤');
        userNameInput.focus();
        return;
    }

    if (!validateNumberFormat(lotteryNumber)) {
        showCustomAlert('Por favor, introduce un número de 5 dígitos', '🎫');
        lotteryNumberInput.focus();
        return;
    }

    // Check for duplicates first
    const duplicateCheck = checkDuplicateNumber(lotteryNumber);
    if (duplicateCheck.isDuplicate) {
        showCustomAlert(
            `⚠️ Número Duplicado Detectado ⚠️\n\nSi posees el número ${lotteryNumber}, por favor contacta con el servicio de atención al cliente de Las Venturas News para verificar la titularidad.\n\nEste número aparece registrado a múltiples personas.`,
            '🚨'
        );
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
 * Populates the name select dropdown from the database
 */
function populateNameSuggestions() {
    const selectElement = document.getElementById('userName');

    // Clear existing options except the first placeholder
    selectElement.innerHTML = '<option value="" disabled selected>Selecciona un nombre...</option>';

    // Add an option for each name in the database
    Object.keys(lotteryDatabase).sort().forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        selectElement.appendChild(option);
    });

    console.log(`✓ Loaded ${Object.keys(lotteryDatabase).length} names in dropdown`);
}

/**
 * Scans the entire database for duplicate numbers and shows alert if found
 */
function scanForDuplicates() {
    const numberMap = new Map();
    const duplicates = [];

    // Build a map of numbers to holders
    for (const [name, numbers] of Object.entries(lotteryDatabase)) {
        numbers.forEach(number => {
            if (!numberMap.has(number)) {
                numberMap.set(number, []);
            }
            numberMap.get(number).push(name);
        });
    }

    // Find duplicates
    for (const [number, holders] of numberMap.entries()) {
        if (holders.length > 1) {
            duplicates.push({ number, holders });
        }
    }

    // Show alert if duplicates found
    if (duplicates.length > 0) {
        const duplicateNumbers = duplicates.map(d => d.number).join(', ');
        showCustomAlert(
            `⚠️ Números Duplicados Detectados ⚠️\n\nSe han encontrado ${duplicates.length} número(s) duplicado(s) en el sistema:\n\n${duplicateNumbers}\n\nSi posees alguno de estos números, por favor contacta con el servicio de atención al cliente de Las Venturas News para verificar la titularidad.`,
            '🚨'
        );
        console.warn('⚠️ Duplicados encontrados:', duplicates);
    } else {
        console.log('✓ No se encontraron duplicados');
    }
}

// ========================================
// Initialize on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 Lotería de Navidad - Las Venturas News');
    console.log(`📋 Total de titulares registrados: ${Object.keys(lotteryDatabase).length}`);
    
    const totalTickets = getTotalTicketsSold();
    console.log(`🎫 Total de números vendidos: ${totalTickets}`);
    
    // Display total tickets sold in the UI
    const totalTicketsElement = document.getElementById('totalTickets');
    if (totalTicketsElement) {
        totalTicketsElement.textContent = totalTickets;
    }

    // Initialize snowfall effect
    initSnowfall();

    // Populate name suggestions from database
    populateNameSuggestions();

    // Scan for duplicate numbers on page load
    scanForDuplicates();
});
