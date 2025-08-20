// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Initialize Application
function initializeApp() {
    setupNavigation();
    setupFileUpload();
    setupAnimations();
    setupScrollEffects();
    setupFormHandlers();
    setupParticleAnimation();
}

// Navigation Functionality
function setupNavigation() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });

    // Active navigation highlighting
    updateActiveNavigation();
    window.addEventListener('scroll', updateActiveNavigation);
}

// Update active navigation based on scroll position
function updateActiveNavigation() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let currentSection = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${currentSection}`) {
            link.classList.add('active');
        }
    });
}

// File Upload Functionality
function setupFileUpload() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const uploadProgress = document.getElementById('uploadProgress');
    const resultsContainer = document.getElementById('resultsContainer');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');

    // Click to browse files
    uploadArea.addEventListener('click', (e) => {
        if (e.target.classList.contains('upload-browse') || e.target.closest('.upload-content')) {
            fileInput.click();
        }
    });

    // Drag and drop functionality
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    // File input change
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // Handle file upload
    function handleFileUpload(file) {
        // Validate file type
        if (!file.type.startsWith('image/')) {
            showErrorMessage('Please upload a valid image file.');
            return;
        }

        // Validate file size (max 10MB)
        if (file.size > 10 * 1024 * 1024) {
            showErrorMessage('File size must be less than 10MB.');
            return;
        }

        // Show progress
        showUploadProgress();

        // Simulate upload progress
        simulateUploadProgress(() => {
            displayImagePreview(file);
            generateDiagnosisReport(file);
            showResults();
        });
    }

    // Show upload progress
    function showUploadProgress() {
        document.querySelector('.upload-content').style.display = 'none';
        uploadProgress.style.display = 'block';
    }

    // Simulate upload progress
    function simulateUploadProgress(callback) {
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                setTimeout(callback, 500);
            }
            progressFill.style.width = progress + '%';
            progressText.textContent = `Uploading... ${Math.round(progress)}%`;
        }, 200);
    }

    // Display image preview
    function displayImagePreview(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const previewImg = document.getElementById('previewImg');
            const imageInfo = document.getElementById('imageInfo');
            
            previewImg.src = e.target.result;
            previewImg.onload = () => {
                // Add loading animation
                previewImg.style.opacity = '0';
                previewImg.style.transform = 'scale(0.8)';
                
                setTimeout(() => {
                    previewImg.style.transition = 'all 0.5s ease';
                    previewImg.style.opacity = '1';
                    previewImg.style.transform = 'scale(1)';
                }, 100);
            };
            
            // Display image info
            const fileSizeKB = (file.size / 1024).toFixed(1);
            imageInfo.textContent = `${file.name} (${fileSizeKB} KB)`;
        };
        reader.readAsDataURL(file);
    }

    // Generate diagnosis report with dummy data
    function generateDiagnosisReport(file) {
        const diagnosisContent = document.getElementById('diagnosisContent');
        
        // Show loading state
        diagnosisContent.innerHTML = `
            <div class="diagnosis-loading">
                <div class="loading-spinner"></div>
                <span>Analyzing image with AI...</span>
            </div>
        `;

        // Simulate AI analysis delay
        setTimeout(() => {
            const dummyResults = generateDummyDiagnosis();
            displayDiagnosisResults(dummyResults);
        }, 3000);
    }

    // Generate dummy diagnosis data
    function generateDummyDiagnosis() {
        const conditions = [
            { label: 'X-Ray Quality', values: ['Excellent', 'Good', 'Fair'], colors: ['good', 'good', 'suspected'] },
            { label: 'Tuberculosis', values: ['Negative', 'Suspected', 'Positive'], colors: ['negative', 'suspected', 'positive'] },
            { label: 'Pneumonia', values: ['Negative', 'Suspected', 'Positive'], colors: ['negative', 'suspected', 'positive'] },
            { label: 'Lung Opacity', values: ['Clear', 'Minor', 'Significant'], colors: ['negative', 'suspected', 'positive'] },
            { label: 'Heart Size', values: ['Normal', 'Slightly Enlarged', 'Enlarged'], colors: ['negative', 'suspected', 'positive'] },
            { label: 'Bone Density', values: ['Normal', 'Reduced', 'Severely Reduced'], colors: ['negative', 'suspected', 'positive'] }
        ];

        return conditions.map(condition => {
            const randomIndex = Math.floor(Math.random() * condition.values.length);
            return {
                label: condition.label,
                value: condition.values[randomIndex],
                color: condition.colors[randomIndex]
            };
        });
    }

    // Display diagnosis results
    function displayDiagnosisResults(results) {
        const diagnosisContent = document.getElementById('diagnosisContent');
        
        let resultsHTML = '<div class="diagnosis-results">';
        results.forEach((result, index) => {
            resultsHTML += `
                <div class="diagnosis-item" style="animation-delay: ${index * 0.1}s">
                    <span class="diagnosis-label">${result.label}:</span>
                    <span class="diagnosis-value ${result.color}">${result.value}</span>
                </div>
            `;
        });
        
        resultsHTML += `
            <div class="diagnosis-confidence" style="margin-top: 20px; padding: 16px; background: rgba(59, 130, 246, 0.1); border-radius: 12px; text-align: center;">
                <strong>AI Confidence Score: ${(85 + Math.random() * 10).toFixed(1)}%</strong>
                <br>
                <small style="color: #64748b; margin-top: 8px; display: block;">
                    This analysis is for informational purposes only. Please consult with a medical professional for proper diagnosis.
                </small>
            </div>
        `;
        
        resultsHTML += '</div>';
        
        diagnosisContent.innerHTML = resultsHTML;
        
        // Trigger animations
        setTimeout(() => {
            const diagnosisResults = diagnosisContent.querySelector('.diagnosis-results');
            if (diagnosisResults) {
                diagnosisResults.style.display = 'block';
            }
        }, 100);
    }

    // Show results section
    function showResults() {
        resultsContainer.style.display = 'block';
        resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Show error message
    function showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.innerHTML = `
            <div style="background: rgba(239, 68, 68, 0.1); color: #dc2626; padding: 16px; border-radius: 12px; margin: 20px; text-align: center; border: 1px solid rgba(239, 68, 68, 0.2);">
                <i class="fas fa-exclamation-triangle" style="margin-right: 8px;"></i>
                ${message}
            </div>
        `;
        
        uploadArea.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

// Animation and Visual Effects
function setupAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.feature-card, .upload-card, .section-header');
    animatedElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });

    // Parallax effect for hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            const rate = scrolled * -0.3;
            heroVisual.style.transform = `translateY(${rate}px)`;
        }
    });
}

// Scroll Effects
function setupScrollEffects() {
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Reveal animations on scroll
    const revealElements = document.querySelectorAll('.feature-card, .stat-item');
    
    function revealOnScroll() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('reveal-active');
            }
        });
    }

    window.addEventListener('scroll', revealOnScroll);
    revealOnScroll(); // Check on load
}

// Form Handlers
function setupFormHandlers() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Simple validation
        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        if (!isValidEmail(email)) {
            showFormMessage('Please enter a valid email address.', 'error');
            return;
        }

        // Simulate form submission
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        submitBtn.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px; margin: 0 auto;"></div>';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            contactForm.reset();
            showFormMessage('Thank you for your message! We\'ll get back to you soon.', 'success');
        }, 2000);
    });

    // Email validation
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Show form message
    function showFormMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `form-message ${type}`;
        messageDiv.style.cssText = `
            padding: 16px;
            border-radius: 12px;
            margin-top: 16px;
            text-align: center;
            font-weight: 500;
            animation: slideInUp 0.3s ease-out;
            ${type === 'success' ? 
                'background: rgba(16, 185, 129, 0.1); color: #059669; border: 1px solid rgba(16, 185, 129, 0.2);' : 
                'background: rgba(239, 68, 68, 0.1); color: #dc2626; border: 1px solid rgba(239, 68, 68, 0.2);'}
        `;
        messageDiv.textContent = message;

        const existingMessage = contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        contactForm.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.remove();
        }, 5000);
    }
}

// Particle Animation Enhancement
function setupParticleAnimation() {
    // Add floating geometric shapes
    const hero = document.querySelector('.hero');
    if (hero) {
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                position: absolute;
                width: ${20 + Math.random() * 40}px;
                height: ${20 + Math.random() * 40}px;
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: ${Math.random() > 0.5 ? '50%' : '8px'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: floatUpDown ${15 + Math.random() * 10}s ease-in-out infinite;
                animation-delay: ${Math.random() * 5}s;
                backdrop-filter: blur(2px);
            `;
            hero.appendChild(shape);
        }
    }

    // Add CSS for floating shapes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes floatUpDown {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            25% { transform: translateY(-20px) rotate(90deg); }
            50% { transform: translateY(0) rotate(180deg); }
            75% { transform: translateY(-10px) rotate(270deg); }
        }
        
        .floating-shape {
            pointer-events: none;
            z-index: 1;
        }
        
        .animate-on-scroll {
            opacity: 0;
            transform: translateY(50px);
            transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        
        .animate-on-scroll.animate-in {
            opacity: 1;
            transform: translateY(0);
        }
        
        .reveal-active {
            animation: fadeInUp 0.8s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Loading Animation
function showLoadingAnimation(element, text = 'Loading...') {
    element.innerHTML = `
        <div style="display: flex; flex-direction: column; align-items: center; gap: 16px; padding: 40px;">
            <div class="loading-spinner"></div>
            <span style="color: #64748b; font-weight: 500;">${text}</span>
        </div>
    `;
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimized scroll handler
const optimizedScrollHandler = throttle(() => {
    updateActiveNavigation();
    
    // Update navbar background
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
}, 16);

// Replace the existing scroll event listener
window.removeEventListener('scroll', updateActiveNavigation);
window.addEventListener('scroll', optimizedScrollHandler);

// Initialize animations when page loads
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Add stagger animation to hero stats
    const statsItems = document.querySelectorAll('.stat-item');
    statsItems.forEach((item, index) => {
        item.style.animationDelay = `${1 + index * 0.2}s`;
        item.classList.add('animate-stat');
    });
});

// Add CSS for stat animation
const statStyle = document.createElement('style');
statStyle.textContent = `
    .animate-stat {
        animation: bounceInUp 0.8s ease-out both;
    }
    
    @keyframes bounceInUp {
        0% {
            opacity: 0;
            transform: translate3d(0, 100px, 0);
        }
        60% {
            opacity: 1;
            transform: translate3d(0, -20px, 0);
        }
        75% {
            transform: translate3d(0, 10px, 0);
        }
        90% {
            transform: translate3d(0, -5px, 0);
        }
        100% {
            transform: translate3d(0, 0, 0);
        }
    }
`;
document.head.appendChild(statStyle);
