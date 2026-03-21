// Todo Form JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const submitButton = document.querySelector('button[type="submit"]');
    const inputs = document.querySelectorAll('input, textarea, select');

    // Add form validation
    form.addEventListener('submit', function(e) {
        e.preventDefault(); // Prevent default form submission

        // Validate all required fields
        let isValid = true;
        inputs.forEach(input => {
            if (input.hasAttribute('required') && !input.value.trim()) {
                showError(`${input.name} is required`);
                isValid = false;
                input.focus();
                return false;
            }
        });

        if (!isValid) return;

        // Disable button during submission
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        // Create FormData object
        const formData = new FormData(form);

        // Submit form using fetch
        fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData))
        })
        .then(response => response.json())
        .then(data => {
            showSuccess('Task created successfully!');
            form.reset();
            console.log('Task created:', data);
        })
        .catch(error => {
            showError('Failed to create task. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Task';
        });
    });

    // Real-time validation feedback
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            if (this.hasAttribute('required') && !this.value.trim()) {
                this.style.borderColor = '#dc3545';
            } else {
                this.style.borderColor = '#28a745';
            }
        });

        input.addEventListener('input', function() {
            if (this.value.trim()) {
                this.style.borderColor = '#28a745';
            }
        });
    });

    // Show success message
    function showSuccess(message) {
        hideMessages();
        const successDiv = document.createElement('div');
        successDiv.className = 'success-message';
        successDiv.textContent = message;
        form.appendChild(successDiv);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            successDiv.style.display = 'none';
        }, 5000);
    }

    // Show error message
    function showError(message) {
        hideMessages();
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        form.appendChild(errorDiv);

        // Auto-hide after 5 seconds
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }

    // Hide all messages
    function hideMessages() {
        const messages = document.querySelectorAll('.success-message, .error-message');
        messages.forEach(msg => msg.remove());
    }

    // Add loading state styles
    const style = document.createElement('style');
    style.textContent = `
        .loading {
            opacity: 0.6;
            pointer-events: none;
        }
    `;
    document.head.appendChild(style);
});