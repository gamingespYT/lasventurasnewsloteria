// ========================================
// Note: lotteryDatabase is imported from ../script.js
// ========================================

// ========================================
// Utility Functions
// ========================================

/**
 * Finds the owner of a specific lottery number
 */
function findNumberOwner(number) {
    for (const [name, numbers] of Object.entries(lotteryDatabase)) {
        if (numbers.includes(number)) {
            return name;
        }
    }
    return null;
}

/**
 * Shows a custom alert with number ownership information
 */
function showNumberInfo(number, owner) {
    if (owner) {
        showCustomAlert(`Número: ${number}\n\nEste número pertenece a:\n${owner}`, '🎫');
    } else {
        showCustomAlert(`Número: ${number}\n\nNo se encontró el titular de este número`, '❓');
    }
}

/**
 * Gets all lottery numbers from the database
 */
function getAllNumbers() {
    const allNumbers = [];

    for (const numbers of Object.values(lotteryDatabase)) {
        allNumbers.push(...numbers);
    }

    // Sort numbers numerically
    return allNumbers.sort((a, b) => parseInt(a) - parseInt(b));
}

/**
 * Displays all numbers in the list
 */
function displayNumbers() {
    const numbersList = document.getElementById('numbersList');
    const allNumbers = getAllNumbers();

    // Clear existing content
    numbersList.innerHTML = '';

    // Create a number item for each number
    allNumbers.forEach((number, index) => {
        const numberItem = document.createElement('div');
        numberItem.className = 'number-item';
        numberItem.textContent = number;
        numberItem.style.animationDelay = `${index * 0.01}s`;

        // Add click event to show owner
        numberItem.addEventListener('click', () => {
            const owner = findNumberOwner(number);
            showNumberInfo(number, owner);
        });

        // Add cursor pointer style
        numberItem.style.cursor = 'pointer';

        numbersList.appendChild(numberItem);
    });

    // Update total count
    const totalNumbersElement = document.getElementById('totalNumbers');
    if (totalNumbersElement) {
        totalNumbersElement.textContent = allNumbers.length;
    }

    console.log(`✓ Displayed ${allNumbers.length} numbers`);
}

/**
 * Copies all numbers to clipboard with line breaks
 */
async function copyAllNumbers() {
    const allNumbers = getAllNumbers();
    const numbersText = allNumbers.join('\n');

    try {
        await navigator.clipboard.writeText(numbersText);

        // Visual feedback
        const copyButton = document.getElementById('copyButton');
        const originalText = copyButton.textContent;

        copyButton.textContent = '✅ ¡Copiado!';
        copyButton.classList.add('copied');

        setTimeout(() => {
            copyButton.textContent = originalText;
            copyButton.classList.remove('copied');
        }, 2000);

        console.log('✓ Numbers copied to clipboard');
    } catch (err) {
        console.error('Error copying to clipboard:', err);
        alert('Error al copiar los números. Por favor, inténtalo de nuevo.');
    }
}

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
// Event Listeners
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('🎄 Lista de Números - Lotería de Navidad');

    // Initialize snowfall
    initSnowfall();

    // Display all numbers
    displayNumbers();

    // Add copy button event listener
    const copyButton = document.getElementById('copyButton');
    if (copyButton) {
        copyButton.addEventListener('click', copyAllNumbers);
    }
});
