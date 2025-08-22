// FAQ Section Accordion Functionality
document.addEventListener('DOMContentLoaded', function() {
    // Get all FAQ question headers
    const faqHeaders = document.querySelectorAll('.faq-question');
    
    // Add click event to each question
    faqHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Toggle active class on the clicked question
            this.classList.toggle('active');
            
            // Get the content panel for this question
            const content = this.nextElementSibling;
            
            // Toggle display of the content
            if (content.style.maxHeight) {
                content.style.maxHeight = null;
            } else {
                content.style.maxHeight = content.scrollHeight + "px";
            }
        });
    });
    
    });
