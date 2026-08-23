// ============================================
// CONTACT FORM ENHANCEMENTS
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    initializeContactForm();
    setupFormInteractions();
});

function initializeContactForm() {
    const form = document.getElementById('contactForm');
    
    if (!form) return;

    // Add real-time validation
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('change', () => validateField(input));
    });

    // Form submission
    form.addEventListener('submit', handleFormSubmit);
}

function validateField(field) {
    const value = field.value.trim();
    const name = field.name;
    let isValid = true;
    let errorMessage = '';

    if (!value && field.hasAttribute('required')) {
        isValid = false;
        errorMessage = 'This field is required';
    } else {
        switch(name) {
            case 'email':
                if (value && !isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Please enter a valid email address';
                }
                break;
            case 'name':
                if (value && value.length < 2) {
                    isValid = false;
                    errorMessage = 'Name must be at least 2 characters';
                }
                break;
            case 'subject':
                if (value && value.length < 5) {
                    isValid = false;
                    errorMessage = 'Subject must be at least 5 characters';
                }
                break;
            case 'message':
                if (value && value.length < 10) {
                    isValid = false;
                    errorMessage = 'Message must be at least 10 characters';
                }
                break;
        }
    }

    if (!isValid) {
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    } else {
        field.classList.remove('is-invalid');
        removeFieldError(field);
    }

    return isValid;
}

function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function showFieldError(field, message) {
    // Remove existing error if any
    const existingError = field.parentElement.querySelector('.field-error');
    if (existingError) {
        existingError.remove();
    }

    // Add error message
    const errorDiv = document.createElement('small');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.cssText = `
        display: block;
        color: #f87171;
        margin-top: 0.25rem;
        font-weight: 600;
    `;
    
    field.parentElement.appendChild(errorDiv);
}

function removeFieldError(field) {
    const errorDiv = field.parentElement.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);
    
    // Validate all fields
    const inputs = form.querySelectorAll('input, textarea, select');
    let formIsValid = true;

    inputs.forEach(input => {
        if (!validateField(input)) {
            formIsValid = false;
        }
    });

    // Check terms checkbox
    const agreeTerms = form.querySelector('#agreeTerms');
    if (!agreeTerms.checked) {
        agreeTerms.classList.add('is-invalid');
        showFormMessage('Please agree to the terms and privacy policy', 'danger');
        return;
    }

    if (!formIsValid) {
        showFormMessage('Please fix the errors above', 'danger');
        return;
    }

    // Show loading state
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';

    // Prepare data
    const data = Object.fromEntries(formData);
    
   fetch("/send-email", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
})
    .then(async (response) => {
        const result = await response.json();

        if (!response.ok || !result.success) {
            throw new Error(
                result.error || "Failed to send message."
            );
        }

        return result;
    })
    .then(() => {
        showFormMessage(
            "Message sent successfully! I'll get back to you soon.",
            "success"
        );

        form.reset();

        inputs.forEach((input) => {
            input.classList.remove("is-invalid");
        });
    })
    .catch((error) => {
        console.error(error);

        showFormMessage(
            "Something went wrong. Please try emailing me directly.",
            "danger"
        );
    })
    .finally(() => {
        submitButton.disabled = false;
        submitButton.textContent = originalText;

        const messageDiv =
            document.getElementById("formMessage");

        if (messageDiv) {
            messageDiv.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
            });
        }
    });
}

function showFormMessage(message, type) {
    const messageDiv = document.getElementById('formMessage');
    
    if (!messageDiv) return;

    const alertClass = type === 'danger' ? 'alert-danger' : 'alert-success';
    const alertClasses = ['alert-danger', 'alert-success'];
    
    messageDiv.textContent = message;
    messageDiv.className = `mt-3 alert ${alertClass}`;
    messageDiv.style.display = 'block';
    messageDiv.style.animation = 'slideIn 0.3s ease';

    if (type === 'success') {
        setTimeout(() => {
            messageDiv.style.display = 'none';
        }, 5000);
    }
}

function setupFormInteractions() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // Character counter for message field
    const messageField = form.querySelector('#message');
    if (messageField) {
        messageField.addEventListener('input', updateCharacterCount);
    }

    // Form field focus effects
    const formControls = form.querySelectorAll('.form-control-custom, .form-select-custom');
    formControls.forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        control.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });

    // Clear errors on input
    formControls.forEach(control => {
        control.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            const error = this.parentElement.querySelector('.field-error');
            if (error) {
                error.remove();
            }
        });
    });
}

function updateCharacterCount() {
    const messageField = document.getElementById('message');
    const count = messageField.value.length;
    
    let counter = messageField.parentElement.querySelector('.char-count');
    if (!counter) {
        counter = document.createElement('small');
        counter.className = 'char-count';
        counter.style.cssText = `
            display: block;
            color: var(--text-muted);
            margin-top: 0.5rem;
            font-size: 0.85rem;
        `;
        messageField.parentElement.appendChild(counter);
    }

    counter.textContent = `${count} characters`;
}

// ============================================
// EMAIL VALIDATION
// ============================================

function validateEmailFormat(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// ============================================
// PHONE NUMBER FORMATTING (Optional)
// ============================================

function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    
    if (value.length > 0) {
        if (value.length <= 3) {
            value = value;
        } else if (value.length <= 6) {
            value = value.slice(0, 3) + '-' + value.slice(3);
        } else if (value.length <= 10) {
            value = value.slice(0, 3) + '-' + value.slice(3, 6) + '-' + value.slice(6);
        } else {
            value = '+' + value.slice(0, value.length - 10) + '-' + value.slice(-10, -7) + '-' + value.slice(-7, -4) + '-' + value.slice(-4);
        }
    }
    
    input.value = value;
}

// ============================================
// FORM STATE PERSISTENCE
// ============================================

function saveFormState() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('change', () => {
            const formState = {};
            inputs.forEach(field => {
                formState[field.name] = field.value;
            });
            localStorage.setItem('contactFormState', JSON.stringify(formState));
        });
    });

    // Restore form state if exists
    const savedState = localStorage.getItem('contactFormState');
    if (savedState) {
        const formState = JSON.parse(savedState);
        Object.keys(formState).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                field.value = formState[key];
            }
        });
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    saveFormState();
});

// ============================================
// EXPORT FORM DATA
// ============================================

function exportFormData(format = 'json') {
    const form = document.getElementById('contactForm');
    if (!form) return;

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    if (format === 'json') {
        console.log(JSON.stringify(data, null, 2));
        return JSON.stringify(data, null, 2);
    } else if (format === 'csv') {
        const csv = Object.keys(data)
            .map(key => `${key},${data[key]}`)
            .join('\n');
        return csv;
    }
}

console.log('Contact form initialized! 📧');
