// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    
    // PROJECT GALLERY INTERACTIVITY
    
    // Select all detail buttons
    const detailButtons = document.querySelectorAll('.details-btn');
    
    // Add click event listener to each button
    detailButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the project ID from data attribute
            const projectId = this.getAttribute('data-project');
            const detailsDiv = document.getElementById(`project-details-${projectId}`);
            
            // Check if details are currently visible
            const isVisible = detailsDiv.style.display === 'block';
            
            // Toggle visibility
            if (isVisible) {
                detailsDiv.style.display = 'none';
                this.textContent = 'Show Details';
            } else {
                detailsDiv.style.display = 'block';
                this.textContent = 'Hide Details';
            }
        });
    });
    
    
    // FORM VALIDATION
    
    
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    
    // Helper function to show error messages
    function showError(inputElement, errorElement, message) {
        errorElement.textContent = message;
        inputElement.classList.add('error');
    }
    
    // Helper function to clear error messages
    function clearError(inputElement, errorElement) {
        errorElement.textContent = '';
        inputElement.classList.remove('error');
    }
    
    // Validation functions
    function validateName() {
        const nameInput = document.getElementById('name');
        const nameError = document.getElementById('name-error');
        const nameValue = nameInput.value.trim();
        
        if (nameValue === '') {
            showError(nameInput, nameError, 'Name is required');
            return false;
        }
        
        if (nameValue.length < 2) {
            showError(nameInput, nameError, 'Name must be at least 2 characters');
            return false;
        }
        
        clearError(nameInput, nameError);
        return true;
    }
    
    function validateEmail() {
        const emailInput = document.getElementById('email');
        const emailError = document.getElementById('email-error');
        const emailValue = emailInput.value.trim();
        
        // Regular expression for email validation
        const emailPattern = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
        
        if (emailValue === '') {
            showError(emailInput, emailError, 'Email is required');
            return false;
        }
        
        if (!emailPattern.test(emailValue)) {
            showError(emailInput, emailError, 'Please enter a valid email address');
            return false;
        }
        
        clearError(emailInput, emailError);
        return true;
    }
    
    function validateSubject() {
        const subjectSelect = document.getElementById('subject');
        const subjectError = document.getElementById('subject-error');
        const subjectValue = subjectSelect.value;
        
        if (subjectValue === '') {
            showError(subjectSelect, subjectError, 'Please select a subject');
            return false;
        }
        
        clearError(subjectSelect, subjectError);
        return true;
    }
    
    function validateMessage() {
        const messageInput = document.getElementById('message');
        const messageError = document.getElementById('message-error');
        const messageValue = messageInput.value.trim();
        
        if (messageValue === '') {
            showError(messageInput, messageError, 'Message is required');
            return false;
        }
        
        if (messageValue.length < 10) {
            showError(messageInput, messageError, 'Message must be at least 10 characters');
            return false;
        }
        
        clearError(messageInput, messageError);
        return true;
    }
    
    // Real-time validation (as user types)
    document.getElementById('name').addEventListener('input', validateName);
    document.getElementById('email').addEventListener('input', validateEmail);
    document.getElementById('subject').addEventListener('change', validateSubject);
    document.getElementById('message').addEventListener('input', validateMessage);
    
    // Form submission handler
    contactForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent actual form submission
        
        // Validate all fields
        const isNameValid = validateName();
        const isEmailValid = validateEmail();
        const isSubjectValid = validateSubject();
        const isMessageValid = validateMessage();
        
        // If all validations pass
        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Collect form data
            const formData = {
                name: document.getElementById('name').value.trim(),
                email: document.getElementById('email').value.trim(),
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value.trim(),
                date: new Date().toLocaleString()
            };
            
            // Display success message
            formStatus.innerHTML = `
                <div class="success-message">
                    ✅ Thank you, ${formData.name}! Your message has been sent successfully.
                    <br><small>Subject: ${formData.subject}</small>
                    <br><small>Sent: ${formData.date}</small>
                </div>
            `;
            
            // Reset the form
            contactForm.reset();
            
            // Clear any error messages
            clearError(document.getElementById('name'), document.getElementById('name-error'));
            clearError(document.getElementById('email'), document.getElementById('email-error'));
            clearError(document.getElementById('subject'), document.getElementById('subject-error'));
            clearError(document.getElementById('message'), document.getElementById('message-error'));
            
            // Clear saved draft from local storage
            localStorage.removeItem('contactFormDraft');
            
            // Log to console (simulating API call)
            console.log('Form submitted:', formData);
            
            // Clear success message after 5 seconds
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 5000);
        } else {
            // Show error summary
            formStatus.innerHTML = `
                <div class="error-message summary">
                    ⚠️ Please correct the errors above before submitting.
                </div>
            `;
            
            // Auto-clear error summary after 3 seconds
            setTimeout(() => {
                formStatus.innerHTML = '';
            }, 3000);
        }
    });
    
    
    // BROWSER API: LOCAL STORAGE DRAFT SAVING
    
    
    // Save form draft to local storage
    function saveFormDraft() {
        const draft = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };
        localStorage.setItem('contactFormDraft', JSON.stringify(draft));
    }
    
    // Load form draft from local storage
    function loadFormDraft() {
        const savedDraft = localStorage.getItem('contactFormDraft');
        if (savedDraft) {
            const draft = JSON.parse(savedDraft);
            document.getElementById('name').value = draft.name || '';
            document.getElementById('email').value = draft.email || '';
            document.getElementById('subject').value = draft.subject || '';
            document.getElementById('message').value = draft.message || '';
            
            // Optional: Show notification that draft was loaded
            console.log('Draft loaded from local storage');
        }
    }
    
    // Save draft when user types
    const formInputs = ['name', 'email', 'subject', 'message'];
    formInputs.forEach(inputId => {
        const input = document.getElementById(inputId);
        if (input) {
            input.addEventListener('input', saveFormDraft);
        }
    });
    
    // Load draft on page load
    loadFormDraft();
    
    
    // SMOOTH SCROLLING FOR NAVIGATION
    
    
    document.querySelectorAll('.nav-links a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    
    // OPTIONAL: GEOLOCATION API EXAMPLE
    
    // Uncomment this section if you want to add geolocation feature
    
    /*
    if ('geolocation' in navigator) {
        console.log('Geolocation is available');
        
        // You could add a button to request user location
        // const locationBtn = document.createElement('button');
        // locationBtn.textContent = 'Share My Location';
        // locationBtn.addEventListener('click', () => {
        //     navigator.geolocation.getCurrentPosition(position => {
        //         console.log('Latitude:', position.coords.latitude);
        //         console.log('Longitude:', position.coords.longitude);
        //     });
        // });
        // document.querySelector('#contact').appendChild(locationBtn);
    }
    */
    
    console.log('Portfolio JavaScript initialized successfully!');
});