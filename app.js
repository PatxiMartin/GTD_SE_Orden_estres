class OrganizationPresentation {
    constructor() {
        this.currentSlide = 1;
        this.totalSlides = 6;
        this.slides = document.querySelectorAll('.slide');
        this.progressBar = document.querySelector('.progress-fill');
        this.currentSlideSpan = document.querySelector('.current-slide');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        
        this.init();
    }

    init() {
        // Initialize slide visibility
        this.updateSlideVisibility();
        this.updateProgress();
        this.updateNavButtons();
        
        // Event listeners
        this.prevBtn.addEventListener('click', () => this.previousSlide());
        this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyPress(e));
        
        // Focus management for accessibility
        document.addEventListener('DOMContentLoaded', () => {
            this.focusCurrentSlide();
        });
        
        // Trigger animations for first slide
        setTimeout(() => this.triggerSlideAnimations(1), 100);
    }

    nextSlide() {
        if (this.currentSlide < this.totalSlides) {
            this.currentSlide++;
            this.updatePresentation();
        }
    }

    previousSlide() {
        if (this.currentSlide > 1) {
            this.currentSlide--;
            this.updatePresentation();
        }
    }

    goToSlide(slideNumber) {
        if (slideNumber >= 1 && slideNumber <= this.totalSlides) {
            this.currentSlide = slideNumber;
            this.updatePresentation();
        }
    }

    updatePresentation() {
        this.updateSlideVisibility();
        this.updateProgress();
        this.updateNavButtons();
        this.focusCurrentSlide();
        
        // Trigger animations for current slide after a short delay
        setTimeout(() => this.triggerSlideAnimations(this.currentSlide), 150);
    }

    updateSlideVisibility() {
        this.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            if (slideNumber === this.currentSlide) {
                slide.classList.add('active');
                slide.style.display = 'block';
                // Reset and restart animations
                this.resetSlideAnimations(slide);
            } else {
                slide.classList.remove('active');
                slide.style.display = 'none';
            }
        });
    }

    updateProgress() {
        const progressPercentage = (this.currentSlide / this.totalSlides) * 100;
        this.progressBar.style.width = `${progressPercentage}%`;
        this.currentSlideSpan.textContent = this.currentSlide;
    }

    updateNavButtons() {
        // Update previous button
        this.prevBtn.disabled = this.currentSlide === 1;
        
        // Update next button
        if (this.currentSlide === this.totalSlides) {
            this.nextBtn.textContent = 'Finalizar';
            this.nextBtn.innerHTML = 'Finalizar <span>✓</span>';
        } else {
            this.nextBtn.innerHTML = 'Siguiente <span>→</span>';
        }
        this.nextBtn.disabled = false;
    }

    handleKeyPress(event) {
        switch (event.key) {
            case 'ArrowRight':
            case ' ': // Spacebar
                event.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                event.preventDefault();
                this.previousSlide();
                break;
            case 'Home':
                event.preventDefault();
                this.goToSlide(1);
                break;
            case 'End':
                event.preventDefault();
                this.goToSlide(this.totalSlides);
                break;
            case 'PageDown':
                event.preventDefault();
                this.nextSlide();
                break;
            case 'PageUp':
                event.preventDefault();
                this.previousSlide();
                break;
        }
    }

    focusCurrentSlide() {
        const currentSlideElement = document.querySelector(`[data-slide="${this.currentSlide}"]`);
        if (currentSlideElement) {
            // Set tabindex and focus for screen readers
            currentSlideElement.setAttribute('tabindex', '-1');
            currentSlideElement.focus();
            
            // Remove focus outline for mouse users
            currentSlideElement.style.outline = 'none';
        }
    }

    resetSlideAnimations(slide) {
        // Reset all animated elements in the slide
        const animatedElements = slide.querySelectorAll('.slide-icon, .slide-title, .slide-subtitle, .intro-text, .highlight-text, .content-section p, .key-point, .time-waste-section, .scientific-fact, .expert-quote, .research-points, .key-insight, .key-quote-box, .analogy-section, .principle, .para-item, .naming-rules, .benefits-section, .practices-section, .final-message');
        
        animatedElements.forEach(element => {
            element.style.animation = 'none';
            element.offsetHeight; // Trigger reflow
            element.style.animation = null;
        });
    }

    triggerSlideAnimations(slideNumber) {
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        if (!slide) return;

        // Re-trigger animations by removing and re-adding the active class
        slide.classList.remove('active');
        setTimeout(() => {
            slide.classList.add('active');
        }, 10);
    }

    // Method to handle presentation completion
    handlePresentationEnd() {
        // Could be extended to show a completion message or redirect
        alert('¡Presentación completada! Esperamos que hayas aprendido sobre el poder de la organización para reducir el estrés.');
    }
}

// Advanced features for better user experience
class PresentationEnhancer {
    constructor(presentation) {
        this.presentation = presentation;
        this.init();
    }

    init() {
        this.addSwipeSupport();
        this.addVisibilityChangeHandler();
        this.addResizeHandler();
        this.preloadSlideContent();
    }

    // Add touch/swipe support for mobile devices
    addSwipeSupport() {
        let startX = null;
        let startY = null;
        const minSwipeDistance = 50;

        document.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;
            
            const deltaX = endX - startX;
            const deltaY = endY - startY;

            // Only process horizontal swipes
            if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
                if (deltaX > 0) {
                    // Swipe right - go to previous slide
                    this.presentation.previousSlide();
                } else {
                    // Swipe left - go to next slide
                    this.presentation.nextSlide();
                }
            }

            startX = null;
            startY = null;
        }, { passive: true });
    }

    // Handle page visibility changes (when user switches tabs)
    addVisibilityChangeHandler() {
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                // Page became visible again - refresh current slide
                setTimeout(() => {
                    this.presentation.triggerSlideAnimations(this.presentation.currentSlide);
                }, 100);
            }
        });
    }

    // Handle window resize events
    addResizeHandler() {
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                // Refresh layout after resize
                this.presentation.updateSlideVisibility();
            }, 250);
        });
    }

    // Preload slide content for better performance
    preloadSlideContent() {
        // This could be extended to preload images or other resources
        // For now, we ensure all slides are properly initialized
        this.presentation.slides.forEach((slide, index) => {
            slide.setAttribute('data-preloaded', 'true');
        });
    }
}

// Accessibility enhancements
class AccessibilityManager {
    constructor(presentation) {
        this.presentation = presentation;
        this.init();
    }

    init() {
        this.addAriaLabels();
        this.addSkipNavigation();
        this.addScreenReaderAnnouncements();
        this.enhanceKeyboardNavigation();
    }

    addAriaLabels() {
        // Add ARIA labels to slides
        this.presentation.slides.forEach((slide, index) => {
            const slideNumber = index + 1;
            slide.setAttribute('role', 'tabpanel');
            slide.setAttribute('aria-labelledby', `slide-${slideNumber}-title`);
            slide.setAttribute('aria-hidden', slideNumber !== this.presentation.currentSlide);
            
            const title = slide.querySelector('.slide-title');
            if (title) {
                title.id = `slide-${slideNumber}-title`;
            }
        });

        // Add ARIA labels to navigation buttons
        const prevBtn = this.presentation.prevBtn;
        const nextBtn = this.presentation.nextBtn;
        
        prevBtn.setAttribute('aria-describedby', 'nav-help');
        nextBtn.setAttribute('aria-describedby', 'nav-help');

        // Add hidden description for screen readers
        const navHelp = document.createElement('div');
        navHelp.id = 'nav-help';
        navHelp.className = 'sr-only';
        navHelp.textContent = 'Use las flechas del teclado o la barra espaciadora para navegar entre diapositivas';
        document.body.appendChild(navHelp);
    }

    addSkipNavigation() {
        // Add skip navigation for keyboard users
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Saltar al contenido principal';
        skipLink.className = 'sr-only';
        skipLink.style.position = 'absolute';
        skipLink.style.left = '-9999px';
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.left = 'auto';
            skipLink.style.top = '10px';
            skipLink.style.zIndex = '1000';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.left = '-9999px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
        
        // Add main content ID
        const slidesContainer = document.querySelector('.slides-container');
        slidesContainer.id = 'main-content';
    }

    addScreenReaderAnnouncements() {
        // Create live region for announcements
        const liveRegion = document.createElement('div');
        liveRegion.setAttribute('aria-live', 'polite');
        liveRegion.setAttribute('aria-atomic', 'true');
        liveRegion.className = 'sr-only';
        liveRegion.id = 'slide-announcements';
        document.body.appendChild(liveRegion);

        // Announce slide changes
        const originalGoToSlide = this.presentation.goToSlide.bind(this.presentation);
        this.presentation.goToSlide = (slideNumber) => {
            originalGoToSlide(slideNumber);
            this.announceSlideChange(slideNumber);
        };

        const originalNextSlide = this.presentation.nextSlide.bind(this.presentation);
        this.presentation.nextSlide = () => {
            const oldSlide = this.presentation.currentSlide;
            originalNextSlide();
            if (this.presentation.currentSlide !== oldSlide) {
                this.announceSlideChange(this.presentation.currentSlide);
            }
        };

        const originalPreviousSlide = this.presentation.previousSlide.bind(this.presentation);
        this.presentation.previousSlide = () => {
            const oldSlide = this.presentation.currentSlide;
            originalPreviousSlide();
            if (this.presentation.currentSlide !== oldSlide) {
                this.announceSlideChange(this.presentation.currentSlide);
            }
        };
    }

    announceSlideChange(slideNumber) {
        const liveRegion = document.getElementById('slide-announcements');
        const slide = document.querySelector(`[data-slide="${slideNumber}"]`);
        const title = slide ? slide.querySelector('.slide-title')?.textContent : '';
        
        liveRegion.textContent = `Diapositiva ${slideNumber} de ${this.presentation.totalSlides}: ${title}`;
        
        // Update aria-hidden attributes
        this.presentation.slides.forEach((slide, index) => {
            const slideNum = index + 1;
            slide.setAttribute('aria-hidden', slideNum !== slideNumber);
        });
    }

    enhanceKeyboardNavigation() {
        // Add keyboard navigation hints
        document.addEventListener('keydown', (e) => {
            // Show keyboard hints when user starts using keyboard
            if (['ArrowLeft', 'ArrowRight', ' ', 'PageUp', 'PageDown', 'Home', 'End'].includes(e.key)) {
                document.body.classList.add('keyboard-navigation');
            }
        });

        // Hide keyboard hints when user uses mouse
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
        });
    }
}

// Initialize the presentation when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const presentation = new OrganizationPresentation();
    const enhancer = new PresentationEnhancer(presentation);
    const accessibility = new AccessibilityManager(presentation);
    
    // Global reference for debugging
    window.organizationPresentation = presentation;
    
    console.log('📋 Presentación "Organización y Estrés" inicializada correctamente');
    console.log('🎯 Usa las flechas del teclado, la barra espaciadora, o los botones para navegar');
    console.log('📱 En dispositivos móviles, desliza horizontalmente para navegar');
});

// Handle any errors gracefully
window.addEventListener('error', (e) => {
    console.error('Error en la presentación:', e.error);
    // Could show a user-friendly error message
});

// Performance monitoring (optional)
window.addEventListener('load', () => {
    // Log performance metrics
    if (window.performance && window.performance.timing) {
        const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
        console.log(`⚡ Presentación cargada en ${loadTime}ms`);
    }
});