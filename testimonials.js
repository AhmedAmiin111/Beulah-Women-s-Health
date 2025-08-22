document.addEventListener('DOMContentLoaded', function() {
    console.log('Testimonials script loaded');
    
    // Get all elements needed for the testimonial slider
    const slides = document.querySelectorAll('.testimonial-slide');
    const dotsContainer = document.querySelector('.testimonial-dots');
    const prevBtn = document.querySelector('.testimonial-arrow.prev');
    const nextBtn = document.querySelector('.testimonial-arrow.next');
    const slideContainer = document.querySelector('.testimonial-slides');
    
    console.log('Slides found:', slides.length);
    console.log('Previous button found:', prevBtn !== null);
    console.log('Next button found:', nextBtn !== null);
    
    // Early exit if no slides found
    if (!slides.length) {
        console.error('No testimonial slides found!');
        return;
    }
    
    let currentSlide = 0;
    let isAnimating = false;
    let autoplayInterval = null;
    let touchStartX = 0;
    let touchEndX = 0;
    
    // Initialize the slider
    function initSlider() {
        // Clear any existing dots
        if (dotsContainer) {
            while (dotsContainer.firstChild) {
                dotsContainer.removeChild(dotsContainer.firstChild);
            }
            
            // Create dots for navigation
            slides.forEach((_, index) => {
                const dot = document.createElement('span');
                dot.classList.add('testimonial-dot');
                if (index === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    if (!isAnimating) showSlide(index);
                });
                dotsContainer.appendChild(dot);
            });
        }
        
        // Hide all slides except the first one
        slides.forEach((slide, index) => {
            if (index === 0) {
                slide.classList.add('active');
            } else {
                slide.style.display = 'none';
            }
        });
        
        // Set up event listeners
        if (prevBtn) {
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                prevSlide();
                console.log('Previous button clicked');
            });
        } else {
            console.warn('Previous button not found!');
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                nextSlide();
                console.log('Next button clicked');
            });
        } else {
            console.warn('Next button not found!');
        }
        
        // Touch events for mobile swipe
        if (slideContainer) {
            slideContainer.addEventListener('touchstart', handleTouchStart, false);
            slideContainer.addEventListener('touchend', handleTouchEnd, false);
        }
        
        // Start autoplay
        startAutoplay();
    }
    
    // Show a specific slide
    function showSlide(index, direction = null) {
        // Don't do anything if already on this slide or in the middle of an animation
        if (index === currentSlide || isAnimating) return;
        
        isAnimating = true;
        
        // Default direction if not specified
        if (!direction) {
            direction = index > currentSlide ? 'next' : 'prev';
        }
        
        const currentElement = slides[currentSlide];
        const nextElement = slides[index];
        
        // Make sure next slide is visible but with no transition yet
        nextElement.style.display = '';
        nextElement.style.transition = 'none';
        nextElement.classList.remove('active', 'to-left', 'to-right');
        
        // Set initial position based on direction
        if (direction === 'next') {
            nextElement.classList.add('to-right');
        } else {
            nextElement.classList.add('to-left');
        }
        
        // Force browser to apply the above styles before continuing
        void nextElement.offsetWidth;
        
        // Now restore transitions for the animation
        nextElement.style.transition = '';
        
        // Animate current slide out
        if (direction === 'next') {
            currentElement.classList.add('to-left');
            currentElement.classList.remove('active');
        } else {
            currentElement.classList.add('to-right');
            currentElement.classList.remove('active');
        }
        
        // Animate new slide in
        nextElement.classList.add('active');
        nextElement.classList.remove('to-left', 'to-right');
        
        // Update dots
        if (dotsContainer) {
            const dots = document.querySelectorAll('.testimonial-dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Update the current slide index
        currentSlide = index;
        
        // Finish animation and cleanup
        setTimeout(() => {
            currentElement.style.display = 'none';
            isAnimating = false;
        }, 600); // Match CSS transition time
        
        // Reset autoplay
        resetAutoplay();
    }
    
    // Navigate to the next slide
    function nextSlide() {
        if (isAnimating) return;
        const next = (currentSlide + 1) % slides.length;
        showSlide(next, 'next');
    }
    
    // Navigate to the previous slide
    function prevSlide() {
        if (isAnimating) return;
        const prev = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(prev, 'prev');
    }
    
    // Start the autoplay timer
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                nextSlide();
                console.log('Auto-advancing to next slide');
            }
        }, 8000); // Show next slide every 5 seconds (reduced from 7 seconds)
        
        console.log('Autoplay started');
    }
    
    // Reset the autoplay timer
    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
            startAutoplay();
        }
    }
    
    // Handle touch events for mobile swiping
    function handleTouchStart(evt) {
        touchStartX = evt.touches[0].clientX;
    }
    
    function handleTouchEnd(evt) {
        touchEndX = evt.changedTouches[0].clientX;
        handleSwipe();
    }
    
    function handleSwipe() {
        if (isAnimating) return;
        
        const swipeThreshold = 50;
        const difference = touchStartX - touchEndX;
        
        if (Math.abs(difference) < swipeThreshold) return;
        
        if (difference > 0) {
            // Swipe left, show next slide
            nextSlide();
        } else {
            // Swipe right, show previous slide
            prevSlide();
        }
    }
    
    // Initialize the slider
    initSlider();
});
