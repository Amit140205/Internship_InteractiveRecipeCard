// Recipe Interactive Functionality
class RecipeCard {
    constructor() {
        this.currentStep = 0;
        this.totalSteps = 6;
        this.totalTime = 27 * 60; // 27 minutes in seconds
        this.remainingTime = this.totalTime;
        this.timerInterval = null;
        this.isTimerRunning = false;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateProgress();
    }

    bindEvents() {
        // Toggle buttons for ingredients and steps
        const ingredientsToggle = document.getElementById('ingredientsToggle');
        const stepsToggle = document.getElementById('stepsToggle');
        const startCookingBtn = document.getElementById('startCookingBtn');
        const nextStepBtn = document.getElementById('nextStepBtn');
        const resetBtn = document.getElementById('resetBtn');

        ingredientsToggle.addEventListener('click', () => this.toggleSection('ingredients'));
        stepsToggle.addEventListener('click', () => this.toggleSection('steps'));
        startCookingBtn.addEventListener('click', () => this.startCooking());
        nextStepBtn.addEventListener('click', () => this.nextStep());
        resetBtn.addEventListener('click', () => this.reset());

        // Ingredient hover effects
        const ingredients = document.querySelectorAll('.ingredient');
        ingredients.forEach(ingredient => {
            ingredient.addEventListener('click', () => this.toggleIngredient(ingredient));
        });
    }

    toggleSection(section) {
        const toggle = document.getElementById(`${section}Toggle`);
        const content = document.getElementById(`${section}Content`);
        const icon = toggle.querySelector('.toggle-icon');
        
        if (content.classList.contains('hidden')) {
            // Show section
            content.classList.remove('hidden');
            content.classList.add('show');
            toggle.classList.add('active');
            toggle.querySelector('span').textContent = section === 'ingredients' ? 'Hide Ingredients' : 'Hide Instructions';
            
            // Animate items
            this.animateItems(content, section);
        } else {
            // Hide section
            content.classList.add('hidden');
            content.classList.remove('show');
            toggle.classList.remove('active');
            toggle.querySelector('span').textContent = section === 'ingredients' ? 'Show Ingredients' : 'Show Instructions';
        }
    }

    animateItems(container, section) {
        const items = container.querySelectorAll(section === 'ingredients' ? '.ingredient' : '.step');
        items.forEach((item, index) => {
            item.style.animation = `none`;
            item.offsetHeight; // Trigger reflow
            item.style.animation = `infoFade 0.5s ease-out ${index * 0.1}s both`;
        });
    }

    toggleIngredient(ingredient) {
        ingredient.style.textDecoration = ingredient.style.textDecoration === 'line-through' ? '' : 'line-through';
        ingredient.style.opacity = ingredient.style.opacity === '0.5' ? '1' : '0.5';
    }

    startCooking() {
        // Show steps section if hidden
        const stepsContent = document.getElementById('stepsContent');
        if (stepsContent.classList.contains('hidden')) {
            this.toggleSection('steps');
        }

        // Hide start button, show control buttons
        document.getElementById('startCookingBtn').classList.add('hidden');
        document.getElementById('nextStepBtn').classList.remove('hidden');
        document.getElementById('resetBtn').classList.remove('hidden');

        // Start timer
        document.getElementById('timer').classList.remove('hidden');
        this.startTimer();

        // Highlight first step
        this.currentStep = 1;
        this.highlightCurrentStep();
        this.updateProgress();
    }

    nextStep() {
        if (this.currentStep < this.totalSteps) {
            this.currentStep++;
            this.highlightCurrentStep();
            this.updateProgress();

            if (this.currentStep === this.totalSteps) {
                document.getElementById('nextStepBtn').textContent = 'Finish';
            }
        } else {
            this.finishCooking();
        }
    }

    highlightCurrentStep() {
        // Remove active class from all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.classList.remove('active'));

        // Add active class to current step
        const currentStepElement = document.querySelector(`[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.classList.add('active');
            currentStepElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }

    updateProgress() {
        const progressBar = document.getElementById('progressBar');
        const progressText = document.getElementById('progressText');
        const percentage = (this.currentStep / this.totalSteps) * 100;

        progressBar.style.setProperty('--progress', `${percentage}%`);
        
        if (this.currentStep === 0) {
            progressText.textContent = 'Ready to start';
        } else if (this.currentStep === this.totalSteps) {
            progressText.textContent = 'Recipe completed!';
        } else {
            progressText.textContent = `Step ${this.currentStep} of ${this.totalSteps}`;
        }
    }

    startTimer() {
        if (this.isTimerRunning) return;
        
        this.isTimerRunning = true;
        this.timerInterval = setInterval(() => {
            if (this.remainingTime > 0) {
                this.remainingTime--;
                this.updateTimerDisplay();
            } else {
                this.timerComplete();
            }
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
            this.isTimerRunning = false;
        }
    }

    updateTimerDisplay() {
        const timerDisplay = document.getElementById('timerDisplay');
        const minutes = Math.floor(this.remainingTime / 60);
        const seconds = this.remainingTime % 60;
        timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }

    timerComplete() {
        this.stopTimer();
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.textContent = '00:00';
        timerDisplay.style.color = '#dc3545';
        
        // Add completed animation
        document.getElementById('timer').style.animation = 'timerComplete 1s ease-in-out';
        
        // Show completion message
        setTimeout(() => {
            alert('🎉 Cooking time complete! Your recipe is ready!');
        }, 500);
    }

    finishCooking() {
        this.stopTimer();
        
        // Hide control buttons
        document.getElementById('nextStepBtn').classList.add('hidden');
        
        // Show completion message
        const progressText = document.getElementById('progressText');
        progressText.textContent = '🎉 Recipe completed! Enjoy your meal!';
        progressText.style.color = '#28a745';
        progressText.style.fontWeight = 'bold';
        
        // Add celebration animation
        document.querySelector('.recipe-card').style.animation = 'celebration 0.8s ease-in-out';
    }

    reset() {
        // Reset step counter
        this.currentStep = 0;
        
        // Reset timer
        this.stopTimer();
        this.remainingTime = this.totalTime;
        this.updateTimerDisplay();
        
        // Hide timer and control buttons
        document.getElementById('timer').classList.add('hidden');
        document.getElementById('nextStepBtn').classList.add('hidden');
        document.getElementById('resetBtn').classList.add('hidden');
        document.getElementById('startCookingBtn').classList.remove('hidden');
        
        // Reset button text
        document.getElementById('nextStepBtn').textContent = 'Next Step';
        
        // Remove active class from all steps
        const steps = document.querySelectorAll('.step');
        steps.forEach(step => step.classList.remove('active'));
        
        // Reset progress
        this.updateProgress();
        
        // Reset progress text color
        const progressText = document.getElementById('progressText');
        progressText.style.color = '';
        progressText.style.fontWeight = '';
        
        // Reset timer display color
        const timerDisplay = document.getElementById('timerDisplay');
        timerDisplay.style.color = '';
        
        // Reset animations
        document.querySelector('.recipe-card').style.animation = '';
        document.getElementById('timer').style.animation = '';
        
        // Reset ingredients
        const ingredients = document.querySelectorAll('.ingredient');
        ingredients.forEach(ingredient => {
            ingredient.style.textDecoration = '';
            ingredient.style.opacity = '';
        });
    }
}

// Additional animations and effects
document.addEventListener('DOMContentLoaded', () => {
    // Initialize recipe card
    const recipeCard = new RecipeCard();
    
    // Add celebration animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes celebration {
            0%, 100% { transform: scale(1); }
            25% { transform: scale(1.02) rotate(0.5deg); }
            75% { transform: scale(1.02) rotate(-0.5deg); }
        }
        
        @keyframes timerComplete {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.05); }
        }
        
        .ingredient.completed {
            text-decoration: line-through;
            opacity: 0.5;
            color: #28a745;
        }
    `;
    document.head.appendChild(style);
    
    // Add smooth scrolling behavior
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('click', function() {
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            const nextStepBtn = document.getElementById('nextStepBtn');
            const startBtn = document.getElementById('startCookingBtn');
            
            if (!nextStepBtn.classList.contains('hidden')) {
                e.preventDefault();
                nextStepBtn.click();
            } else if (!startBtn.classList.contains('hidden')) {
                e.preventDefault();
                startBtn.click();
            }
        }
        
        if (e.key === 'r' || e.key === 'R') {
            const resetBtn = document.getElementById('resetBtn');
            if (!resetBtn.classList.contains('hidden')) {
                e.preventDefault();
                resetBtn.click();
            }
        }
    });
    
    // Add print functionality
    document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            // Ensure all content is visible for printing
            const sections = document.querySelectorAll('.section-content');
            const originalStates = [];
            
            sections.forEach((section, index) => {
                originalStates[index] = {
                    hidden: section.classList.contains('hidden'),
                    show: section.classList.contains('show')
                };
                section.classList.remove('hidden');
                section.classList.add('show');
            });
            
            // Restore states after print dialog
            setTimeout(() => {
                sections.forEach((section, index) => {
                    if (originalStates[index].hidden) {
                        section.classList.add('hidden');
                    }
                    if (!originalStates[index].show) {
                        section.classList.remove('show');
                    }
                });
            }, 1000);
        }
    });
});