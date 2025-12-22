// ========================================
// Helper Functions
// ========================================

/**
 * Finds the owner of a lottery number
 */
function findNumberOwner(number) {
    if (typeof lotteryDatabase === 'undefined') {
        console.error('lotteryDatabase is not defined');
        return "Desconocido";
    }
    
    for (const [name, numbers] of Object.entries(lotteryDatabase)) {
        if (numbers.includes(number)) {
            return name;
        }
    }
    return "Desconocido";
}

/**
 * Formats a number as currency
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
}

/**
 * Calculates total prizes
 */
function calculateTotalPrizes() {
    return prizesData.reduce((total, prize) => total + prize.amount, 0);
}

/**
 * Gets medal icon based on ranking
 */
function getMedalIcon(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '🎁';
}

/**
 * Renders all prizes sorted by amount
 */
function renderPrizes() {
    const container = document.getElementById('prizesContainer');
    
    // Sort prizes by amount (descending)
    const sortedPrizes = [...prizesData].sort((a, b) => b.amount - a.amount);
    
    sortedPrizes.forEach((prize, index) => {
        const owner = findNumberOwner(prize.number);
        const medal = getMedalIcon(index);
        
        const prizeCard = document.createElement('div');
        prizeCard.className = 'prize-card';
        if (index < 3) {
            prizeCard.classList.add(`prize-top-${index + 1}`);
        }
        
        prizeCard.innerHTML = `
            <div class="prize-rank">
                <span class="medal">${medal}</span>
                <span class="rank-number">#${index + 1}</span>
            </div>
            <div class="prize-details">
                <div class="prize-number">${prize.number}</div>
                <div class="prize-amount">${formatCurrency(prize.amount)}</div>
                <div class="prize-owner">👤 ${owner}</div>
            </div>
        `;
        
        container.appendChild(prizeCard);
    });
    
    console.log(`✓ Rendered ${sortedPrizes.length} prizes`);
}

/**
 * Updates the total prizes display
 */
function updateTotalPrizes() {
    const total = calculateTotalPrizes();
    const totalElement = document.getElementById('totalPrizes');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
    console.log(`💰 Total prizes: ${formatCurrency(total)}`);
}

// ========================================
// Snowfall Animation (reusing from main)
// ========================================

function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.classList.add('snowflake');

    const snowflakeChars = ['❄', '❅', '❆'];
    snowflake.textContent = snowflakeChars[Math.floor(Math.random() * snowflakeChars.length)];

    snowflake.style.left = Math.random() * 100 + '%';
    const size = Math.random() * 1.5 + 0.5;
    snowflake.style.fontSize = size + 'rem';
    snowflake.style.opacity = Math.random() * 0.6 + 0.3;
    const duration = Math.random() * 10 + 10;
    snowflake.style.animationDuration = duration + 's';
    snowflake.style.animationDelay = Math.random() * 5 + 's';

    return snowflake;
}

function initSnowfall() {
    const container = document.getElementById('snowContainer');
    const numberOfSnowflakes = 50;

    for (let i = 0; i < numberOfSnowflakes; i++) {
        container.appendChild(createSnowflake());
    }

    console.log(`❄️ Generated ${numberOfSnowflakes} snowflakes`);
}

// ========================================
// Initialize on Page Load
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('🏆 Premios de Lotería - Las Venturas News');
    console.log(`🎁 Total de premios: ${prizesData.length}`);
    
    // Initialize snowfall effect
    initSnowfall();
    
    // Render prizes
    renderPrizes();
    
    // Update total display
    updateTotalPrizes();
});
