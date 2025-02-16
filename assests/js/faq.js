class FAQs {
    constructor() {
        this.questions = [
            {
                question: "What services do you offer?",
                answer: "We offer comprehensive digital marketing solutions including SEO, social media management, content marketing, PPC advertising, and email marketing campaigns."
            },
            {
                question: "How long until I see results?",
                answer: "While initial improvements can be seen within 1-2 months, significant results typically become visible within 3-6 months of consistent digital marketing efforts."
            },
            {
                question: "Do you offer custom packages?",
                answer: "Yes! We create tailored marketing strategies based on your business goals, target audience, and budget. Each package is customized to meet your specific needs."
            },
            {
                question: "How do you measure success?",
                answer: "We track various KPIs including website traffic, conversion rates, engagement metrics, ROI, and provide detailed monthly reports with actionable insights."
            },
            {
                question: "What makes you different?",
                answer: "We combine data-driven strategies with creative excellence, offering personalized attention and transparent communication throughout our partnership."
            }
        ];

        this.chatArea = document.getElementById('chatArea');
        this.questionsArea = document.getElementById('questionsArea');
        this.initialized = false;
        
        // Create intersection observer
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !this.initialized) {
                    this.initialize();
                    this.initialized = true;
                    observer.disconnect(); // Stop observing once initialized
                }
            });
        }, {
            threshold: 0.3 // Trigger when 30% of the element is visible
        });
        
        // Start observing the FAQ container
        observer.observe(document.querySelector('.faqs-container'));
    }

    async initialize() {
        // Add visible class to container
        document.querySelector('.faqs-container').classList.add('visible');
        
        // Wait for container animation
        await new Promise(resolve => setTimeout(resolve, 600));

        // Add initial greeting with typing indicator
        const typingIndicator = this.createTypingIndicator();
        this.chatArea.appendChild(typingIndicator);
        
        // Wait for typing animation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Remove typing indicator and add greeting
        typingIndicator.remove();
        const greetingDiv = document.createElement('div');
        greetingDiv.className = 'message answer';
        greetingDiv.textContent = 'Ask me anything! 👋';
        this.chatArea.appendChild(greetingDiv);

        // Add question buttons with slight delay
        setTimeout(() => {
            this.questions.forEach((qa, index) => {
                const button = document.createElement('button');
                button.className = 'question-button';
                button.textContent = qa.question;
                button.addEventListener('click', () => this.handleQuestion(index));
                this.questionsArea.appendChild(button);
            });
        }, 800);
    }

    createTypingIndicator() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typingDiv.appendChild(dot);
        }
        return typingDiv;
    }

    getRandomTypingDuration() {
        return Math.floor(Math.random() * (3000 - 1000 + 1) + 1000); // Random duration between 1-3 seconds
    }

    async handleQuestion(index) {
        const qa = this.questions[index];
        
        // Disable all buttons temporarily
        const buttons = this.questionsArea.querySelectorAll('.question-button');
        buttons.forEach(button => button.disabled = true);
        
        // Add question to chat
        const questionDiv = document.createElement('div');
        questionDiv.className = 'message questions';
        questionDiv.textContent = qa.question;
        this.chatArea.appendChild(questionDiv);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;

        // Wait a bit before showing typing indicator
        await new Promise(resolve => setTimeout(resolve, 800));

        // Show typing indicator
        const typingIndicator = this.createTypingIndicator();
        this.chatArea.appendChild(typingIndicator);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;

        // Wait for random typing duration
        const typingDuration = this.getRandomTypingDuration();
        await new Promise(resolve => setTimeout(resolve, typingDuration));

        // Remove typing indicator and add answer
        typingIndicator.remove();
        const answerDiv = document.createElement('div');
        answerDiv.className = 'message answer';
        answerDiv.textContent = qa.answer;
        this.chatArea.appendChild(answerDiv);
        this.chatArea.scrollTop = this.chatArea.scrollHeight;

        // Re-enable buttons after a delay
        setTimeout(() => {
            buttons.forEach(button => button.disabled = false);
        }, 1000);

        // Disable the clicked button temporarily
        const button = this.questionsArea.children[index];
        button.disabled = true;
        setTimeout(() => {
            button.disabled = false;
        }, 2000);

        this.chatArea.scrollTop = this.chatArea.scrollHeight;
    }
}

// Initialize the FAQ chat
const faqChat = new FAQs();