// Fixed Parallax effect
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const parallaxSections = document.querySelectorAll('.parallax-section');
    
    parallaxSections.forEach(section => {
        const parallaxBg = section.querySelector('.parallax-bg');
        if (parallaxBg) {
            const rate = scrolled * -0.3;
            parallaxBg.style.transform = `translateY(${rate}px)`; // No scale
        }
    });
    
    // Navbar background on scroll
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Fade in animation on scroll
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

document.querySelectorAll('.parallax-content, .frames-content, .analysis-content').forEach(el => {
    observer.observe(el);
});

// Movie Analysis Game Logic
class MovieAnalysisGame {
    constructor() {
        this.score = 0;
        this.level = 1;
        this.movies = [
            {
                image: 'Images/pulpfiction_2.jpg',
                correctAnswer: 'Pulp Fiction',
                options: ['Pulp Fiction', 'The Matrix', 'The Shining', 'Blade Runner'],
                analysis: {
                    lighting: 'High contrast, dramatic shadows',
                    composition: 'Rule of thirds, dynamic framing',
                    color: 'Warm tones, saturated colors',
                    camera: 'Medium shot, eye-level angle'
                }
            },
            {
                image: 'Images/thematrix.jpg',
                correctAnswer: 'The Matrix',
                options: ['Pulp Fiction', 'The Matrix', 'Fight Club', 'Blade Runner'],
                analysis: {
                    lighting: 'Green tint, cyberpunk aesthetic',
                    composition: 'Centered subject, digital feel',
                    color: 'Monochrome green, cool tones',
                    camera: 'Bullet time effect, 360 rotation'
                }
            },
            {
                image: 'Images/theshinning.jpg',
                correctAnswer: 'The Shining',
                options: ['The Shining', 'No Country for Old Men', 'Fight Club', 'Inglourious Basterds'],
                analysis: {
                    lighting: 'Natural light, eerie atmosphere',
                    composition: 'Symmetrical, haunting empty spaces',
                    color: 'Warm interiors, cold exteriors',
                    camera: 'Steadicam, tracking shots'
                }
            }
        ];
        this.currentMovieIndex = 0;
        this.init();
    }

    init() {
        this.updateGameStats();
        this.loadCurrentMovie();
        this.setupEventListeners();
    }

    loadCurrentMovie() {
        const currentMovie = this.movies[this.currentMovieIndex];
        const gameImage = document.getElementById('game-image');
        const optionsGrid = document.querySelector('.options-grid');

        // Update image
        gameImage.src = currentMovie.image;

        // Update options
        optionsGrid.innerHTML = '';
        currentMovie.options.forEach(option => {
            const button = document.createElement('button');
            button.className = 'option-btn';
            button.textContent = option;
            button.setAttribute('data-movie', option);
            optionsGrid.appendChild(button);
        });

        // Update analysis tools
        this.updateAnalysisTools(currentMovie.analysis);
    }

    updateAnalysisTools(analysis) {
        const tools = document.querySelectorAll('.tool-item p');
        tools[0].textContent = analysis.lighting;
        tools[1].textContent = analysis.composition;
        tools[2].textContent = analysis.color;
        tools[3].textContent = analysis.camera;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('option-btn')) {
                this.checkAnswer(e.target.getAttribute('data-movie'));
            }
        });
    }

    checkAnswer(selectedMovie) {
        const currentMovie = this.movies[this.currentMovieIndex];
        const buttons = document.querySelectorAll('.option-btn');

        if (selectedMovie === currentMovie.correctAnswer) {
            // Correct answer
            this.score += 10 * this.level;
            this.level++;
            buttons.forEach(btn => {
                if (btn.getAttribute('data-movie') === selectedMovie) {
                    btn.style.background = '#4CAF50';
                    btn.style.borderColor = '#4CAF50';
                }
            });
        } else {
            // Wrong answer
            buttons.forEach(btn => {
                if (btn.getAttribute('data-movie') === selectedMovie) {
                    btn.style.background = '#f44336';
                    btn.style.borderColor = '#f44336';
                }
                if (btn.getAttribute('data-movie') === currentMovie.correctAnswer) {
                    btn.style.background = '#4CAF50';
                    btn.style.borderColor = '#4CAF50';
                }
            });
        }

        this.updateGameStats();

        // Move to next movie after delay
        setTimeout(() => {
            this.currentMovieIndex = (this.currentMovieIndex + 1) % this.movies.length;
            this.loadCurrentMovie();
            this.resetButtons();
        }, 2000);
    }

    resetButtons() {
        const buttons = document.querySelectorAll('.option-btn');
        buttons.forEach(btn => {
            btn.style.background = '';
            btn.style.borderColor = '#ff6b6b';
        });
    }

    updateGameStats() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('level').textContent = this.level;
    }
}

// Initialize the game when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MovieAnalysisGame();
});
// Chatbot functionality
class CinematicChatbot {
    constructor() {
        this.chatbot = document.getElementById('cinematic-chatbot');
        this.toggleButton = document.getElementById('chatbot-toggle');
        this.messagesContainer = document.getElementById('chatbot-messages');
        this.input = document.getElementById('chatbot-input');
        this.sendButton = document.getElementById('chatbot-send');
        this.closeButton = document.getElementById('chatbot-close');
        this.hasAppeared = false;
        this.isVisible = false;
        
        this.init();
    }

    init() {
        // Set up scroll detection
        this.setupScrollDetection();
        
        // Set up event listeners
        this.toggleButton.addEventListener('click', () => this.toggleChatbot());
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        this.closeButton.addEventListener('click', () => this.hideChatbot());
        
        // Set up suggestion buttons
        document.querySelectorAll('.suggestion-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const question = e.target.getAttribute('data-question');
                this.input.value = question;
                this.sendMessage();
            });
        });
    }

    setupScrollDetection() {
        window.addEventListener('scroll', () => {
            const aboutSection = document.getElementById('about');
            if (aboutSection && !this.hasAppeared) {
                const aboutSectionTop = aboutSection.getBoundingClientRect().top;
                const windowHeight = window.innerHeight;
                
                if (aboutSectionTop < windowHeight * 0.8) {
                    this.showToggleButton();
                    this.hasAppeared = true;
                }
            }
        });
    }

    showToggleButton() {
        this.toggleButton.style.display = 'flex';
        setTimeout(() => {
            this.toggleButton.style.opacity = '1';
            this.toggleButton.style.transform = 'scale(1)';
        }, 100);
    }

    toggleChatbot() {
        if (this.isVisible) {
            this.hideChatbot();
        } else {
            this.showChatbot();
        }
    }

    showChatbot() {
        this.chatbot.classList.add('active');
        this.isVisible = true;
        
        // Add welcome message if it's the first time
        if (this.messagesContainer.children.length === 1) {
            this.addMessage('bot', "Welcome to the cinematic analysis section! I'm here to discuss film techniques, directors, and the art of visual storytelling. What would you like to explore?");
        }
    }

    hideChatbot() {
        this.chatbot.classList.remove('active');
        this.isVisible = false;
    }

    sendMessage() {
        const message = this.input.value.trim();
        if (!message) return;

        this.addMessage('user', message);
        this.input.value = '';

        // Simulate typing delay
        setTimeout(() => {
            this.generateResponse(message);
        }, 800);
    }

    addMessage(sender, text) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = document.createElement('div');
        avatar.className = 'message-avatar';
        avatar.innerHTML = sender === 'bot' ? '<i class="fas fa-film"></i>' : '<i class="fas fa-user"></i>';
        
        const content = document.createElement('div');
        content.className = 'message-content';
        content.innerHTML = `<p>${text}</p>`;
        
        messageDiv.appendChild(avatar);
        messageDiv.appendChild(content);
        this.messagesContainer.appendChild(messageDiv);
        
        // Scroll to bottom
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }

    generateResponse(userMessage) {
        const lowerMessage = userMessage.toLowerCase();
        let response = '';

        // Simple response logic
        if (lowerMessage.includes('cinematic') || lowerMessage.includes('frame')) {
            response = "Cinematic frames use composition, lighting, and color to tell stories visually. Key techniques include rule of thirds, leading lines, and strategic depth of field.";
        } else if (lowerMessage.includes('tarantino')) {
            response = "Tarantino's style features nonlinear storytelling, sharp dialogue, and homages to film genres. He uses unique camera angles and pop culture references.";
        } else if (lowerMessage.includes('lighting')) {
            response = "Lighting creates mood. High-key reduces shadows, low-key creates drama. Three-point lighting (key, fill, back) is fundamental in cinema.";
        } else if (lowerMessage.includes('rule of thirds')) {
            response = "The rule of thirds divides the frame into nine sections. Placing subjects along these lines creates balanced, engaging compositions.";
        } else if (lowerMessage.includes('color')) {
            response = "Color evokes emotions. Warm colors suggest passion, cool colors create calm. Directors use specific palettes as signature elements.";
        } else if (lowerMessage.includes('camera')) {
            response = "Camera angles shape perspective. Low angles empower, high angles create vulnerability. Each choice communicates emotional information.";
        } else {
            response = "Interesting question! I can discuss film techniques, director styles, or what makes scenes memorable. Try asking about specific directors or cinematic methods.";
        }

        this.addMessage('bot', response);
    }
}

// Initialize chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new MovieAnalysisGame();
    new CinematicChatbot();
});