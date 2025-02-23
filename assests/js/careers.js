// Define questions with background images
const questions = [
    {
        question: "What's your favorite way to start the day?",
        options: [
            {
                text: "Creating something beautiful",
                background: "url('./assests/images/art/art (1).jpeg')",
                score: { creative: 2, content: 1 }
            },
            {
                text: "Planning and organizing",
                background: "url('./assests/images/art/art (1).jpg')",
                score: { production: 2, marketing: 1 }
            },
            {
                text: "Brainstorming new ideas",
                background: "url('./assests/images/art/art (2).jpg')",
                score: { marketing: 2, creative: 1 }
            },
            {
                text: "Connecting with people",
                background: "url('./assests/images/art/art (3).jpg')",
                score: { content: 2, marketing: 1 }
            }
        ]
    },
    {
        question: "If you were a camera filter, which would you be?",
        options: [
            {
                text: "Dramatic Black & White",
                background: "url('path/to/bw.jpg')",
                score: { creative: 2, production: 1 }
            },
            {
                text: "Vintage Film",
                background: "url('path/to/vintage.jpg')",
                score: { content: 2, creative: 1 }
            },
            {
                text: "Vibrant Colors",
                background: "url('path/to/vibrant.jpg')",
                score: { marketing: 2, content: 1 }
            },
            {
                text: "Soft Glam",
                background: "url('path/to/glam.jpg')",
                score: { production: 2, marketing: 1 }
            }
        ]
    },
    {
        question: "Your perfect work environment is...",
        options: [
            {
                text: "A creative studio",
                background: "url('path/to/studio.jpg')",
                score: { creative: 2, content: 1 }
            },
            {
                text: "A dynamic office",
                background: "url('path/to/office.jpg')",
                score: { production: 2, marketing: 1 }
            },
            {
                text: "Working remotely",
                background: "url('path/to/remote.jpg')",
                score: { content: 2, creative: 1 }
            },
            {
                text: "Mixed environments",
                background: "url('path/to/mixed.jpg')",
                score: { marketing: 2, production: 1 }
            }
        ]
    }
];

// Define career positions
const positions = {
    creative: {
        title: "Creative Director",
        description: "Lead our creative vision and inspire teams to produce exceptional content. Perfect for visionary individuals who love to push boundaries.",
        background: "url('path/to/creative-director.jpg')"
    },
    marketing: {
        title: "Marketing Specialist",
        description: "Drive our brand's success through innovative marketing strategies. Ideal for analytical minds with a creative spark.",
        background: "url('path/to/marketing.jpg')"
    },
    content: {
        title: "Content Creator",
        description: "Create engaging content that tells compelling stories. Great for creative souls who love connecting with audiences.",
        background: "url('path/to/content.jpg')"
    },
    production: {
        title: "Production Manager",
        description: "Coordinate and oversee our production process. Perfect for organized individuals who excel at managing projects.",
        background: "url('path/to/production.jpg')"
    }
};

// Initialize state
let currentQuestion = 0;
let userScores = {
    creative: 0,
    marketing: 0,
    content: 0,
    production: 0
};

// Show question and handle background images
function showQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const question = questions[currentQuestion];
    
    const newContent = `
        <div class="question">${question.question}</div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <button 
                    class="option-btn" 
                    data-background="${option.background}"
                    onmouseover="handleOptionHover(this, true)"
                    onmouseout="handleOptionHover(this, false)"
                    onclick="selectOption(${index})"
                >${option.text}</button>
            `).join('')}
        </div>
        <div class="skip-button-container">
            <button class="skip-btn" onclick="showAllPositions()">Too Lazy?</button>
        </div>
        <div class="option-background"></div>
    `;
    
    if (currentQuestion === 0) {
        questionContainer.innerHTML = newContent;
        questionContainer.classList.add('fade-in');
        return;
    }
    
    questionContainer.classList.add('fade-out');
    setTimeout(() => {
        questionContainer.classList.remove('fade-out');
        questionContainer.innerHTML = newContent;
        questionContainer.classList.add('fade-in');
    }, 500);
}

// Handle option hover effects
function handleOptionHover(button, isHovering) {
    const background = button.closest('.question-container').querySelector('.option-background');
    const backgroundImage = button.getAttribute('data-background');
    
    if (isHovering) {
        background.style.backgroundImage = backgroundImage;
        background.style.opacity = '1';
        button.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
    } else {
        background.style.opacity = '0';
        button.style.backgroundColor = 'transparent';
    }
}

// Handle option selection
function selectOption(optionIndex) {
    const question = questions[currentQuestion];
    const selectedOption = question.options[optionIndex];
    
    // Update scores
    Object.entries(selectedOption.score).forEach(([category, points]) => {
        userScores[category] += points;
    });
    
    // Visual feedback
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[optionIndex].classList.add('selected');
    
    // Transition effect
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            const questionContainer = document.getElementById('questionContainer');
            questionContainer.classList.add('fade-out');
            setTimeout(showResults, 500);
        }
    }, 800);
}

// Show results
function showResults() {
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');
    
    questionContainer.style.display = 'none';
    
    // Get top 2 positions based on scores
    const topPositions = Object.entries(userScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([position]) => position);
    
    // Create results HTML
    resultContainer.innerHTML = `
        <h2 class="results-title">Here are your perfect matches!</h2>
        ${topPositions.map(position => `
            <div class="position-card" 
                 onmouseover="handleCardHover(this, true)"
                 onmouseout="handleCardHover(this, false)"
                 data-background="${positions[position].background}">
                <div class="position-content">
                    <h3 class="position-title">${positions[position].title}</h3>
                    <p class="position-description">${positions[position].description}</p>
                    <button class="apply-btn" onclick="applyForPosition('${position}')">
                        Apply Now
                    </button>
                </div>
                <div class="card-background"></div>
            </div>
        `).join('')}
    `;
    
    resultContainer.style.display = 'block';
    setTimeout(() => resultContainer.classList.add('active'), 50);
}

// Handle result card hover effects
function handleCardHover(card, isHovering) {
    const background = card.querySelector('.card-background');
    const backgroundImage = card.getAttribute('data-background');
    
    if (isHovering) {
        background.style.backgroundImage = backgroundImage;
        background.style.opacity = '1';
    } else {
        background.style.opacity = '0';
    }
}

// Handle job application
function applyForPosition(position) {
    const roleTitle = positions[position].title;
    const subject = encodeURIComponent(`Application for ${roleTitle}`);
    const body = encodeURIComponent(
        `Dear Dear Diary Team,\n\n` +
        `I am excited to apply for the ${roleTitle} position.\n\n` +
        `Best regards,\n[Your Name]`
    );
    
    window.location.href = `mailto:careers@deardiary.com?subject=${subject}&body=${body}`;
    alert(`Thanks for your interest in the ${roleTitle} position! Our team will be in touch soon.`);
}

function showAllPositions() {
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');
    
    // Hide question container with fade effect
    questionContainer.classList.add('fade-out');
    setTimeout(() => {
        questionContainer.style.display = 'none';
        
        // Show all positions
        resultContainer.innerHTML = `
            <h2 class="results-title">All Available Positions</h2>
            ${Object.entries(positions).map(([key, position]) => `
                <div class="position-card" 
                     onmouseover="handleCardHover(this, true)"
                     onmouseout="handleCardHover(this, false)"
                     data-background="${position.background}">
                    <div class="position-content">
                        <h3 class="position-title">${position.title}</h3>
                        <p class="position-description">${position.description}</p>
                        <button class="apply-btn" onclick="applyForPosition('${key}')">
                            Apply Now
                        </button>
                    </div>
                    <div class="card-background"></div>
                </div>
            `).join('')}
        `;
        
        // Show and animate result container
        resultContainer.style.display = 'block';
        setTimeout(() => resultContainer.classList.add('active'), 50);
    }, 500);
}

// Start the quiz
document.addEventListener('DOMContentLoaded', showQuestion);