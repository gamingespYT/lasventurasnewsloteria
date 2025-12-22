// ========================================
// Helper Functions
// ========================================

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
 * Calculates total prizes won by each person
 */
function calculateTotalsByPerson() {
    const totals = {};
    
    // Initialize totals for all people
    for (const name of Object.keys(lotteryDatabase)) {
        totals[name] = {
            total: 0,
            prizes: []
        };
    }
    
    // Calculate prizes for each person
    prizesData.forEach(prize => {
        for (const [name, numbers] of Object.entries(lotteryDatabase)) {
            if (numbers.includes(prize.number)) {
                totals[name].total += prize.amount;
                totals[name].prizes.push({
                    number: prize.number,
                    amount: prize.amount
                });
                break;
            }
        }
    });
    
    return totals;
}

/**
 * Gets medal icon based on ranking
 */
function getMedalIcon(index) {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '👤';
}

/**
 * Renders all person totals sorted by amount
 */
function renderTotals() {
    const container = document.getElementById('totalsContainer');
    const totals = calculateTotalsByPerson();
    
    // Convert to array and sort by total (descending)
    const sortedTotals = Object.entries(totals)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.total - a.total);
    
    sortedTotals.forEach((person, index) => {
        const medal = getMedalIcon(index);
        const hasWon = person.total > 0;
        
        const totalCard = document.createElement('div');
        totalCard.className = 'total-card';
        if (!hasWon) {
            totalCard.classList.add('no-prize');
        } else if (index < 3) {
            totalCard.classList.add(`total-top-${index + 1}`);
        }
        
        let prizesHTML = '';
        if (hasWon) {
            prizesHTML = `
                <div class="prizes-detail">
                    <strong>Números premiados (${person.prizes.length}):</strong>
                    <div class="prizes-list">
                        ${person.prizes
                            .sort((a, b) => b.amount - a.amount)
                            .map(p => `<span class="prize-item">${p.number}: ${formatCurrency(p.amount)}</span>`)
                            .join('')}
                    </div>
                </div>
            `;
        }
        
        totalCard.innerHTML = `
            <div class="total-rank">
                <span class="medal">${medal}</span>
                <span class="rank-number">#${index + 1}</span>
            </div>
            <div class="total-details">
                <div class="person-name">${person.name}</div>
                <div class="person-total ${hasWon ? 'has-prize' : 'no-prize-text'}">
                    ${hasWon ? formatCurrency(person.total) : 'Sin premio'}
                </div>
                ${prizesHTML}
            </div>
        `;
        
        container.appendChild(totalCard);
    });
    
    console.log(`✓ Rendered ${sortedTotals.length} person totals`);
}

/**
 * Updates the global total display
 */
function updateGlobalTotal() {
    const total = prizesData.reduce((sum, prize) => sum + prize.amount, 0);
    const totalElement = document.getElementById('globalTotal');
    if (totalElement) {
        totalElement.textContent = formatCurrency(total);
    }
    console.log(`💰 Global total: ${formatCurrency(total)}`);
}

// ========================================
// Snowfall Animation
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
    console.log('💰 Totales por Persona - Las Venturas News');
    
    // Initialize snowfall effect
    initSnowfall();
    
    // Render person totals
    renderTotals();
    
    // Update global total display
    updateGlobalTotal();
});
