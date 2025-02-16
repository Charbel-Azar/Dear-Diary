const questions = [
    {
        question: "What's your favorite way to start the day?",
        options: [
            "Creating something beautiful",
            "Planning and organizing",
            "Brainstorming new ideas",
            "Connecting with people"
        ]
    },
    {
        question: "If you were a camera filter, which would you be?",
        options: [
            "Dramatic Black & White",
            "Vintage Film",
            "Vibrant Colors",
            "Soft Glam"
        ]
    },
    {
        question: "Your perfect work environment is...",
        options: [
            "A creative studio",
            "A dynamic office",
            "Working remotely",
            "Mixed environments"
        ]
    }
];

const positions = {
    creative: {
        title: "Creative Director",
        description: "Lead our creative vision and inspire teams to produce exceptional content. Perfect for visionary individuals who love to push boundaries.",
    },
    marketing: {
        title: "Marketing Specialist",
        description: "Drive our brand's success through innovative marketing strategies. Ideal for analytical minds with a creative spark.",
    },
    content: {
        title: "Content Creator",
        description: "Create engaging content that tells compelling stories. Great for creative souls who love connecting with audiences.",
    },
    production: {
        title: "Production Manager",
        description: "Coordinate and oversee our production process. Perfect for organized individuals who excel at managing projects.",
    }
};

let currentQuestion = 0;
let userResponses = [];

function showQuestion() {
    const questionContainer = document.getElementById('questionContainer');
    const question = questions[currentQuestion];
    
    // Create new question content
    const newContent = `
        <div class="question">${question.question}</div>
        <div class="options-container">
            ${question.options.map((option, index) => `
                <button class="option-btn" onclick="selectOption(${index})">${option}</button>
            `).join('')}
        </div>
    `;
    
    // If this is the first question, just show it
    if (currentQuestion === 0) {
        questionContainer.innerHTML = newContent;
        questionContainer.classList.add('fade-in');
        return;
    }
    
    // Fade out current question
    questionContainer.classList.add('fade-out');
    
    // After fade out, update content and fade in
    setTimeout(() => {
        questionContainer.classList.remove('fade-out');
        questionContainer.innerHTML = newContent;
        questionContainer.classList.add('fade-in');
    }, 500);
}

function selectOption(optionIndex) {
    // Clear previous selections
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    
    // Select current option
    buttons[optionIndex].classList.add('selected');
    
    // Store response
    userResponses[currentQuestion] = optionIndex;
    
    // Fade out effect for selected option
    buttons[optionIndex].style.transition = 'all 0.3s ease';
    buttons[optionIndex].style.transform = 'scale(1.1)';
    buttons[optionIndex].style.boxShadow = '0 0 20px rgba(226, 203, 159, 0.5)';
    
    // Move to next question or show results after fade effect
    setTimeout(() => {
        if (currentQuestion < questions.length - 1) {
            currentQuestion++;
            showQuestion();
        } else {
            const questionContainer = document.getElementById('questionContainer');
            questionContainer.classList.add('fade-out');
            setTimeout(() => {
                showResults();
            }, 500);
        }
    }, 800);
}

function showResults() {
    const questionContainer = document.getElementById('questionContainer');
    const resultContainer = document.getElementById('resultContainer');
    
    // Hide question container
    questionContainer.style.display = 'none';
    
    // Calculate recommended positions based on responses
    const recommendations = calculateRecommendations();
    
    // Show results
    resultContainer.innerHTML = `
        <h2 style="color: #E2CB9F; font-family: 'GalleryModern', serif; font-size: 4vh; margin-bottom: 4vh; text-align: center;">
            Here are your perfect matches!
        </h2>
        ${recommendations.map(position => `
            <div class="position-card">
                <h3 class="position-title">${positions[position].title}</h3>
                <p class="position-description">${positions[position].description}</p>
                <button class="apply-btn" onclick="applyForPosition('${position}')">Apply Now</button>
            </div>
        `).join('')}
    `;
    
    // Show and animate result container
    resultContainer.style.display = 'block';
    setTimeout(() => {
        resultContainer.classList.add('active');
    }, 50);
}

function calculateRecommendations() {
    // Simple recommendation logic based on responses
    const recommendationScores = {
        creative: 0,
        marketing: 0,
        content: 0,
        production: 0
    };
    
    // Map responses to role affinities
    userResponses.forEach((response, index) => {
        switch(index) {
            case 0: // First question
                if (response === 0) recommendationScores.creative += 2;
                if (response === 1) recommendationScores.production += 2;
                if (response === 2) recommendationScores.marketing += 2;
                if (response === 3) recommendationScores.content += 2;
                break;
            case 1: // Second question
                if (response === 0) recommendationScores.creative += 2;
                if (response === 1) recommendationScores.content += 2;
                if (response === 2) recommendationScores.marketing += 2;
                if (response === 3) recommendationScores.production += 1;
                break;
            case 2: // Third question
                if (response === 0) recommendationScores.creative += 2;
                if (response === 1) recommendationScores.production += 2;
                if (response === 2) recommendationScores.content += 2;
                if (response === 3) recommendationScores.marketing += 2;
                break;
        }
    });
    
    // Sort positions by score and return top 2
    return Object.entries(recommendationScores)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 2)
        .map(([position]) => position);
}

function applyForPosition(position) {
    // Get the role title
    const roleTitle = positions[position].title;
    
    // Compose the email subject and body
    const subject = encodeURIComponent(`Application for ${roleTitle}`);
    const body = encodeURIComponent(`Dear Dear Diary Team,\n\nI am applying for the ${roleTitle} position.\n\nBest regards,\n[Your Name]`);
    
    // Open the user's default email client
    window.location.href = `mailto:careers@deardiary.com?subject=${subject}&body=${body}`;
    
    // Alert to notify the user (optional)
    alert(`Thanks for your interest in the ${roleTitle} position! Our team will contact you soon.`);
}

// Start the questionnaire
showQuestion();