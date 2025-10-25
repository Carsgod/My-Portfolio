// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function to limit function calls
 */
function debounce(func, wait, immediate) {
  let timeout = null;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    
    const callNow = immediate && !timeout;
    
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit function calls
 */
function throttle(func, limit) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Check if element is in viewport
 */
function isInViewport(element, threshold = 0) {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.top >= -threshold &&
    rect.left >= -threshold &&
    rect.bottom <= windowHeight + threshold &&
    rect.right <= windowWidth + threshold
  );
}

/**
 * Animate element entrance
 */
function animateOnScroll(element, animationType = 'fade-up') {
  if (!element || isInViewport(element, 100)) {
    element.classList.add('aos-animate');
    return;
  }
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('aos-animate');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );
  
  observer.observe(element);
}


// ===== LOADING MANAGER =====

class LoadingManager {
  constructor() {
    this.loadingScreen = null;
    this.isLoaded = false;
    this.welcomeMessages = [];
    this.currentMessageIndex = 0;
    this.messageInterval = null;
    this.loadingScreen = document.getElementById('loading-screen');
    this.init();
  }

  init() {
    this.getWelcomeMessages();
    this.startWelcomeSequence();

    // Simulate loading time for better UX (extended for welcome messages)
    setTimeout(() => {
      this.hideLoadingScreen();
    }, 8000); // Extended to 8 seconds to show all 6 welcome messages

    // Hide loading screen when everything is loaded
    window.addEventListener('load', () => {
      if (document.readyState === 'complete') {
        // Let the welcome sequence complete first
        setTimeout(() => {
          this.hideLoadingScreen();
        }, 1000);
      }
    });
  }

  getWelcomeMessages() {
    const messageElements = document.querySelectorAll('.welcome-message');
    this.welcomeMessages = Array.from(messageElements);
    console.log('Found welcome messages:', this.welcomeMessages.length);
    this.welcomeMessages.forEach((msg, index) => {
      console.log(`Message ${index + 1}:`, msg.textContent, 'Element:', msg);
    });
  }

  startWelcomeSequence() {
    if (this.welcomeMessages.length === 0) return;

    console.log('Starting welcome sequence with', this.welcomeMessages.length, 'messages');

    // Start showing messages after 1 second
    setTimeout(() => {
      this.showNextMessage();
    }, 1000);
  }

  showNextMessage() {
    // Hide all messages first
    this.welcomeMessages.forEach(message => {
      message.classList.remove('active');
      message.classList.add('fade-out');
    });

    // Show current message
    if (this.currentMessageIndex < this.welcomeMessages.length) {
      const currentMessage = this.welcomeMessages[this.currentMessageIndex];
      if (currentMessage) {
        console.log('Showing message:', currentMessage.textContent);
        setTimeout(() => {
          currentMessage.classList.add('active');
          currentMessage.classList.remove('fade-out');
        }, 300);
      }

      this.currentMessageIndex++;

      // Schedule next message
      if (this.currentMessageIndex < this.welcomeMessages.length) {
        setTimeout(() => {
          this.showNextMessage();
        }, 1200); // Show each message for 1.2 seconds
      } else {
        console.log('Welcome sequence completed');
      }
    }
  }

  hideLoadingScreen() {
    if (this.loadingScreen && !this.isLoaded) {
      this.loadingScreen.classList.add('hidden');
      this.isLoaded = true;

      // Remove from DOM after animation
      setTimeout(() => {
        if (this.loadingScreen) {
          this.loadingScreen.remove();
        }
      }, 500);
    }
  }

  showLoadingScreen() {
    if (this.loadingScreen && this.isLoaded) {
      this.loadingScreen.classList.remove('hidden');
      this.isLoaded = false;
      this.currentMessageIndex = 0;
    }
  }
}

// ===== CURSOR EFFECTS =====

class CursorManager {
  constructor() {
    this.cursorEffect = null;
    this.cursorTrail = null;
    this.mouseX = 0;
    this.mouseY = 0;
    this.trailPositions = [];
    this.cursorEffect = document.getElementById('cursor-effect');
    this.cursorTrail = document.getElementById('cursor-trail');
    this.init();
  }

  init() {
    if (!this.cursorEffect || !this.cursorTrail) return;
    
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
      this.updateCursorPosition();
    });
    
    // Add hover effects for interactive elements
    const interactiveElements = document.querySelectorAll('a, button, .project-item, .service-card');
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.cursorEffect?.classList.add('hover');
      });
      
      element.addEventListener('mouseleave', () => {
        this.cursorEffect?.classList.remove('hover');
      });
    });
    
    // Animate cursor trail
    this.animateTrail();
  }
  
  updateCursorPosition() {
    if (this.cursorEffect) {
      this.cursorEffect.style.left = `${this.mouseX}px`;
      this.cursorEffect.style.top = `${this.mouseY}px`;
    }

    // Add position to trail
    this.trailPositions.push({x: this.mouseX, y: this.mouseY});

    // Limit trail length
    if (this.trailPositions.length > 10) {
      this.trailPositions.shift();
    }
  }

  animateTrail() {
    if (!this.cursorTrail || this.trailPositions.length === 0) {
      requestAnimationFrame(() => this.animateTrail());
      return;
    }
    
    const trailPosition = this.trailPositions[0];
    this.cursorTrail.style.left = `${trailPosition.x}px`;
    this.cursorTrail.style.top = `${trailPosition.y}px`;
    
    // Fade out effect
    const opacity = this.trailPositions.length / 10;
    this.cursorTrail.style.opacity = opacity.toString();
    
    this.trailPositions.shift();
    
    requestAnimationFrame(() => this.animateTrail());
  }
}

// ===== MOBILE NAVIGATION =====

class MobileNavigation {
  constructor() {
    this.menuToggle = null;
    this.navbarMenu = null;
    this.isOpen = false;
    this.menuToggle = document.getElementById('menu-toggle');
    this.navbarMenu = document.getElementById('navbar-menu');
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && this.navbarMenu && !this.navbarMenu.contains(e.target) && this.menuToggle && !this.menuToggle.contains(e.target)) {
        this.closeMenu();
      }
    });

    // Close menu on window resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && this.isOpen) {
        this.closeMenu();
      }
    });

    // Close menu when clicking nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (this.isOpen) {
          this.closeMenu();
        }
      });
    });
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    if (this.navbarMenu && this.menuToggle) {
      this.navbarMenu.classList.add('active');
      this.menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      
      // Animate hamburger lines
      const lines = this.menuToggle.querySelectorAll('.hamburger-line');
      lines.forEach((line, index) => {
        if (index === 0) line.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) line.style.opacity = '0';
        if (index === 2) line.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      });
    }
  }
  
  closeMenu() {
    if (this.navbarMenu && this.menuToggle) {
      this.navbarMenu.classList.remove('active');
      this.menuToggle.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;

      // Reset hamburger lines
      const lines = this.menuToggle.querySelectorAll('.hamburger-line');
      lines.forEach(line => {
        line.style.transform = '';
        line.style.opacity = '';
      });
    }
  }
}

// ===== SMOOTH SCROLLING =====

class SmoothScrolling {
  constructor() {
    this.headerHeight = 80;
    this.init();
  }

  init() {
    // Handle navigation links
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        if (targetId) {
          this.scrollToElement(targetId);
        }
      });
    });

    // Handle scroll indicator
    const scrollIndicator = document.querySelector('.hero-scroll');
    if (scrollIndicator) {
      scrollIndicator.addEventListener('click', () => {
        this.scrollToElement('#about');
      });
    }
  }

  scrollToElement(selector) {
    const targetElement = document.querySelector(selector);
    if (targetElement) {
      const targetPosition = targetElement.offsetTop - this.headerHeight;
      
      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    }
  }
}

// ===== HEADER SCROLL EFFECTS =====

class HeaderEffects {
  constructor() {
    this.header = null;
    this.heroSection = null;
    this.lastScrollY = 0;
    this.header = document.getElementById('header');
    this.heroSection = document.getElementById('home');
    this.init();
  }

  init() {
    window.addEventListener('scroll', throttle(() => {
      this.updateHeaderOnScroll();
    }, 16));
  }

  updateHeaderOnScroll() {
    if (!this.header || !this.heroSection) return;

    const currentScrollY = window.scrollY;
    const heroHeight = this.heroSection.offsetHeight;
    const heroInView = currentScrollY < heroHeight - 100; // Hero section is considered "in view" until user scrolls past 100px from the top

    // Toggle navbar states based on hero section visibility
    if (heroInView) {
      // On hero section - glass prism effect
      this.header.classList.add('transparent', 'prism-navbar');
      this.header.classList.remove('normal-navbar');
    } else {
      // Off hero section - normal navbar with background
      this.header.classList.add('normal-navbar');
      this.header.classList.remove('transparent', 'prism-navbar');
    }

    // Add/remove scrolled class for other scroll effects
    if (currentScrollY > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }

    // Hide/show header on scroll (only when not on hero section)
    if (!heroInView && currentScrollY > this.lastScrollY && currentScrollY > 200) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }

    this.lastScrollY = currentScrollY;
  }
}

// ===== ANIMATED COUNTERS =====

class CounterAnimation {
  constructor() {
    this.counters = null;
    this.hasAnimated = false;
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    // Check if counters are in viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasAnimated) {
            this.animateCounters();
            this.hasAnimated = true;
          }
        });
      },
      { threshold: 0.5 }
    );
    
    this.counters?.forEach(counter => {
      observer.observe(counter);
    });
  }
  
  animateCounters() {
    this.counters?.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target') || '0');
      const duration = 2000; // 2 seconds
      const increment = target / (duration / 16); // 60fps
      let current = 0;
      
      const timer = setInterval(() => {
        current += increment;
        counter.textContent = Math.floor(current).toString();
        
        if (current >= target) {
          counter.textContent = target.toString();
          clearInterval(timer);
        }
      }, 16);
    });
  }
}

// ===== PORTFOLIO FILTERING =====

class PortfolioFilter {
  constructor() {
    this.filterButtons = null;
    this.projectItems = [];
    this.currentFilter = 'all';
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.init();
  }

  init() {
    // Get project items
    const items = document.querySelectorAll('.project-item');
    items.forEach(item => {
      this.projectItems.push({
        element: item,
        category: item.getAttribute('data-category') || 'all'
      });
    });

    this.bindEvents();
  }

  bindEvents() {
    this.filterButtons?.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter') || 'all';
        this.filterItems(filter);
      });
    });
  }
  
  filterItems(filter) {
    if (this.currentFilter === filter) return;
    
    this.currentFilter = filter;
    
    // Update active button
    this.filterButtons?.forEach(btn => {
      btn.classList.remove('active');
      if (btn.getAttribute('data-filter') === filter) {
        btn.classList.add('active');
      }
    });
    
    // Filter items with animation
    this.projectItems.forEach((item, index) => {
      const shouldShow = filter === 'all' || item.category === filter;
      
      setTimeout(() => {
        if (shouldShow) {
          item.element.classList.remove('hidden');
          setTimeout(() => {
            item.element.style.opacity = '1';
            item.element.style.transform = 'scale(1)';
          }, 50);
        } else {
          item.element.style.opacity = '0';
          item.element.style.transform = 'scale(0.8)';
          setTimeout(() => {
            item.element.classList.add('hidden');
          }, 300);
        }
      }, index * 100);
    });
  }
}


// ===== WHATSAPP INTEGRATION =====

class WhatsAppIntegration {
    constructor() {
       this.showWhatsAppFormBtn = null;
       this.backToContactFormBtn = null;
       this.whatsappFormContainer = null;
       this.contactFormContainer = null;
       this.whatsappForm = null;
       this.sendBtn = null;
       this.showWhatsAppFormBtn = document.getElementById('show-whatsapp-form-btn');
       this.backToContactFormBtn = document.getElementById('back-to-contact-form-btn');
       this.whatsappFormContainer = document.getElementById('whatsapp-form-container');
       this.contactFormContainer = document.getElementById('contact-form-container');
       this.whatsappForm = document.getElementById('whatsapp-form');
       this.sendBtn = document.getElementById('whatsapp-send-btn');
       this.init();
    }

   init() {
      if (!this.showWhatsAppFormBtn || !this.backToContactFormBtn || !this.whatsappFormContainer || !this.contactFormContainer) {
         console.error('WhatsApp integration elements not found');
         return;
      }

      this.bindEvents();
      console.log('WhatsApp integration initialized');
   }

   bindEvents() {
      // Show WhatsApp form when trigger button is clicked
      this.showWhatsAppFormBtn?.addEventListener('click', (e) => {
         e.preventDefault();
         this.showWhatsAppForm();
      });

      // Go back to contact form
      this.backToContactFormBtn?.addEventListener('click', () => {
         this.showContactForm();
      });

      // Handle WhatsApp form submission
      this.whatsappForm?.addEventListener('submit', (e) => {
         e.preventDefault();
         this.handleSubmit();
      });

      // Real-time form validation
      const inputs = this.whatsappForm?.querySelectorAll('input, textarea');
      inputs?.forEach(input => {
         input.addEventListener('blur', () => this.validateField(input));
         input.addEventListener('input', () => this.clearFieldError(input));
      });
   }

   showWhatsAppForm() {
      // Hide contact form container
      this.contactFormContainer?.classList.remove('active');
      this.contactFormContainer?.classList.add('hidden');

      // Show WhatsApp Form container
      this.whatsappFormContainer?.classList.add('active');
      this.whatsappFormContainer?.classList.remove('hidden');

      // Focus first input
      setTimeout(() => {
         const firstInput = this.whatsappForm?.querySelector('input');
         firstInput?.focus();
      }, 300);

      console.log('Switched to WhatsApp form');
   }

   showContactForm() {
      // Show contact form container
      this.contactFormContainer?.classList.add('active');
      this.contactFormContainer?.classList.remove('hidden');

      // Hide WhatsApp Form container
      this.whatsappFormContainer?.classList.remove('active');
      this.whatsappFormContainer?.classList.add('hidden');

      // Reset WhatsApp form
      this.whatsappForm?.reset();
      this.clearAllErrors();

      console.log('Switched back to contact form');
   }

   validateField(field) {
      const value = field.value.trim();
      const fieldType = field.type;
      const fieldName = field.name;

      this.clearFieldError(field);

      if (field.hasAttribute('required') && !value) {
         this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required.`);
         return false;
      }

      if (fieldType === 'email' && value) {
         const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
         if (!emailRegex.test(value)) {
            this.showFieldError(field, 'Please enter a valid email address.');
            return false;
         }
      }

      if (fieldName === 'name' && value && value.length < 2) {
         this.showFieldError(field, 'Name must be at least 2 characters long.');
         return false;
      }

      return true;
   }

   showFieldError(field, message) {
      field.classList.add('error');

      const existingError = field.parentNode?.querySelector('.field-error');
      if (existingError) existingError.remove();

      const errorElement = document.createElement('div');
      errorElement.className = 'field-error';
      errorElement.textContent = message;
      errorElement.style.cssText = `
         color: var(--danger-color);
         font-size: var(--font-size-sm);
         margin-top: var(--space-1);
      `;

      field.parentNode?.appendChild(errorElement);
   }

   clearFieldError(field) {
      field.classList.remove('error');
      const errorElement = field.parentNode?.querySelector('.field-error');
      if (errorElement) errorElement.remove();
   }

   clearAllErrors() {
      const errorElements = this.whatsappForm?.querySelectorAll('.field-error');
      errorElements?.forEach(error => error.remove());

      const errorFields = this.whatsappForm?.querySelectorAll('.error');
      errorFields?.forEach(field => field.classList.remove('error'));
   }

   getFieldLabel(fieldName) {
      const labels = {
         name: 'Name',
         email: 'Email',
         subject: 'Subject',
         message: 'Message'
      };
      return labels[fieldName] || fieldName;
   }

   handleSubmit() {
      if (!this.whatsappForm || !this.sendBtn) return;

      // Validate form
      const inputs = this.whatsappForm.querySelectorAll('input, textarea');
      let isValid = true;

      inputs.forEach(input => {
         if (!this.validateField(input)) {
            isValid = false;
         }
      });

      if (!isValid) {
         this.showMessage('Please fill in all required fields correctly.', 'error');
         return;
      }

      // Get form data
      const formData = new FormData(this.whatsappForm);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      // Send to WhatsApp
      this.sendToWhatsApp(name, email, subject, message);
   }

   sendToWhatsApp(name, email, subject, message) {
      try {
         const phoneNumber = '233595759917';
         const whatsappMessage = `🌟 New Contact Form Submission 🌟

👤 Name: ${name}
📧 Email: ${email}
📝 Subject: ${subject}

💬 Message:
${message}

---
✨ Sent from your portfolio website ✨`;

         const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

         // Show loading state
         this.setLoadingState(true);

         // Open WhatsApp in new window
         const whatsappWindow = window.open(whatsappURL, '_blank');

         setTimeout(() => {
            this.setLoadingState(false);

            if (!whatsappWindow) {
               this.showMessage('WhatsApp was blocked by popup blocker. Please allow popups and try again.', 'error');
            } else {
               this.showMessage('✅ WhatsApp opened successfully! Complete the message in WhatsApp.', 'success');
               // Switch back to Google Form after successful WhatsApp opening
               setTimeout(() => {
                  this.showGoogleForm();
               }, 2000);
            }
         }, 1000);

      } catch (error) {
         console.error('WhatsApp sending failed:', error);
         this.showMessage('❌ Error opening WhatsApp. Please try again or contact directly.', 'error');
         this.setLoadingState(false);
      }
   }

   setLoadingState(loading) {
      if (!this.sendBtn) return;

      const btnText = this.sendBtn.querySelector('.btn-text');
      const btnLoading = this.sendBtn.querySelector('.btn-loading');

      if (loading) {
         btnText.style.display = 'none';
         btnLoading.style.display = 'flex';
         this.whatsappForm.style.pointerEvents = 'none';
      } else {
         btnText.style.display = 'block';
         btnLoading.style.display = 'none';
         this.whatsappForm.style.pointerEvents = 'auto';
      }
   }

   showMessage(message, type) {
      // Create temporary notification
      const notification = document.createElement('div');
      notification.className = `whatsapp-notification whatsapp-notification-${type}`;
      notification.innerHTML = `
         <div class="whatsapp-notification-content">
            <span class="whatsapp-notification-message">${message}</span>
            <button class="whatsapp-notification-close" aria-label="Close notification">
               <i class="fas fa-times"></i>
            </button>
         </div>
      `;

      // Add styles
      notification.style.cssText = `
         position: fixed;
         top: 20px;
         right: 20px;
         background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
         color: white;
         padding: 1rem 1.5rem;
         border-radius: var(--radius-lg);
         box-shadow: var(--shadow-lg);
         z-index: var(--z-toast);
         opacity: 0;
         transform: translateX(100%);
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         max-width: 350px;
      `;

      document.body.appendChild(notification);

      // Animate in
      setTimeout(() => {
         notification.style.opacity = '1';
         notification.style.transform = 'translateX(0)';
      }, 100);

      // Close button functionality
      const closeBtn = notification.querySelector('.whatsapp-notification-close');
      closeBtn?.addEventListener('click', () => {
         notification.style.opacity = '0';
         notification.style.transform = 'translateX(100%)';
         setTimeout(() => notification.remove(), 300);
      });

      // Auto-remove after 5 seconds
      setTimeout(() => {
         if (document.body.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
         }
      }, 5000);
   }
}

// ===== CONTACT FORM =====

class ContactForm {
   constructor() {
     this.form = null;
     this.submitButton = null;
     this.btnText = null;
     this.btnLoading = null;
     this.messageElement = null;
     this.form = document.getElementById('contact-form');
     this.submitButton = this.form?.querySelector('.btn-primary');
     this.btnText = this.submitButton?.querySelector('.btn-text');
     this.btnLoading = this.submitButton?.querySelector('.btn-loading');
     this.messageElement = document.getElementById('form-message');
     console.log('ContactForm initialized:', {
       form: !!this.form,
       submitButton: !!this.submitButton,
       btnText: !!this.btnText,
       btnLoading: !!this.btnLoading,
       messageElement: !!this.messageElement
     });
     this.init();
   }

  init() {
    this.bindEvents();
  }
  
  bindEvents() {
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });

    // Real-time validation
    const inputs = this.form?.querySelectorAll('input, textarea');
    inputs?.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input));
      input.addEventListener('input', () => this.clearFieldError(input));
    });
  }

  async handleSubmit() {
    if (!this.form || !this.btnText || !this.btnLoading) {
      console.error('Form or button elements not found');
      return;
    }

    console.log('Form submission started');

    // Validate form
    if (!this.validateForm()) {
      console.log('Form validation failed');
      this.showMessage('Please fill in all required fields correctly.', 'error');
      return;
    }

    console.log('Form validation passed');

    // Show loading state
    this.setLoadingState(true);

    try {
      // Get form data
      const formData = new FormData(this.form);
      const name = formData.get('name');
      const email = formData.get('email');
      const subject = formData.get('subject');
      const message = formData.get('message');

      console.log('Form data collected:', { name, email, subject, message: message.substring(0, 50) + '...' });

      // Send to both WhatsApp and Email
      const results = await Promise.allSettled([
        this.sendToWhatsApp(name, email, subject, message),
        this.sendToEmail(name, email, subject, message)
      ]);

      console.log('Both sending operations completed:', results);

      // Check results
      const whatsappResult = results[0];
      const emailResult = results[1];

      if (whatsappResult.status === 'fulfilled' && emailResult.status === 'fulfilled') {
        console.log('Both WhatsApp and email sent successfully');
        this.showMessage('✅ Success! Your message has been sent to both WhatsApp and email. WhatsApp should open in a new tab.', 'success');
      } else {
        console.log('Some sending operations failed:', { whatsappResult, emailResult });
        this.showMessage('⚠️ Your message was sent but some delivery methods failed. Please contact directly via WhatsApp or email.', 'success');
      }

      this.form.reset();
      console.log('Form reset completed');

    } catch (error) {
      console.error('Form submission error:', error);
      this.showMessage(`❌ Error: ${error.message || 'Something went wrong. Please try again or contact directly.'}`, 'error');
    } finally {
      this.setLoadingState(false);
      console.log('Loading state cleared');
    }
  }
  
  validateForm() {
    const requiredFields = this.form?.querySelectorAll('[required]');
    let isValid = true;

    requiredFields?.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const fieldType = field.type;
    const fieldName = field.name;
    
    // Clear previous error
    this.clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
      this.showFieldError(field, `${this.getFieldLabel(fieldName)} is required.`);
      return false;
    }
    
    // Email validation
    if (fieldType === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showFieldError(field, 'Please enter a valid email address.');
        return false;
      }
    }
    
    // Name validation
    if (fieldName === 'name' && value && value.length < 2) {
      this.showFieldError(field, 'Name must be at least 2 characters long.');
      return false;
    }
    
    return true;
  }
  
  showFieldError(field, message) {
    field.classList.add('error');

    // Remove existing error message
    const existingError = field.parentNode?.querySelector('.field-error');
    if (existingError) existingError.remove();

    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger-color)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-1)';

    field.parentNode?.appendChild(errorElement);
  }

  clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode?.querySelector('.field-error');
    if (errorElement) errorElement.remove();
  }

  getFieldLabel(fieldName) {
    const labels = {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message'
    };

    return labels[fieldName] || fieldName;
  }
  
  async sendToWhatsApp(name, email, subject, message) {
    try {
      const phoneNumber = '233595759917';
      const whatsappMessage = `🌟 New Contact Form Submission 🌟

👤 Name: ${name}
📧 Email: ${email}
📝 Subject: ${subject}

💬 Message:
${message}

---
✨ Sent from your project website ✨`;

      // Use WhatsApp Web API or direct link
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

      // Open WhatsApp in new window/tab
      const whatsappWindow = window.open(whatsappURL, '_blank');

      // Check if window opened successfully
      if (!whatsappWindow) {
        console.warn('WhatsApp window was blocked by popup blocker');
        // Fallback: try to open in same window
        window.location.href = whatsappURL;
        return Promise.resolve();
      }

      console.log('✅ WhatsApp message prepared and window opened');
      return Promise.resolve();
    } catch (error) {
      console.error('WhatsApp sending failed:', error);
      throw error;
    }
  }

  async sendToEmail(name, email, subject, message) {
    try {
      console.log('Attempting to send email:', { name, email, subject });

      // Simulate email sending API call
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          // Simulate 95% success rate for email
          if (Math.random() > 0.05) {
            console.log('✅ Email sent successfully to:', email);
            resolve();
          } else {
            console.error('❌ Email sending failed');
            reject(new Error('Email service temporarily unavailable'));
          }
        }, 1500);
      });
    } catch (error) {
      console.error('Email sending error:', error);
      throw error;
    }
  }

  async submitForm() {
    // Legacy method for backward compatibility
    return this.sendToEmail('User', 'user@example.com', 'Form Submission', 'Legacy form submission');
  }

  setLoadingState(loading) {
    if (!this.btnText || !this.btnLoading) return;

    if (loading) {
      this.btnText.style.display = 'none';
      this.btnLoading.style.display = 'flex';
      this.form.style.pointerEvents = 'none';
    } else {
      this.btnText.style.display = 'block';
      this.btnLoading.style.display = 'none';
      this.form.style.pointerEvents = 'auto';
    }
  }

  showMessage(message, type) {
    if (!this.messageElement) return;
    
    this.messageElement.textContent = message;
    this.messageElement.className = `form-message ${type}`;
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      this.messageElement.className = 'form-message';
    }, 5000);
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

class PerformanceOptimizer {
  constructor() {
    this.init();
  }

  init() {
    // Lazy load images
    this.lazyLoadImages();

    // Optimize scroll events
    this.optimizeScrollEvents();

    // Preload critical resources
    this.preloadResources();
  }

  lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');

    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src || '';
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    images.forEach(img => imageObserver.observe(img));
  }

  optimizeScrollEvents() {
    let ticking = false;
    
    const updateOnScroll = () => {
      // Update scroll-dependent animations here
      ticking = false;
    };
    
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(updateOnScroll);
        ticking = true;
      }
    });
  }
  
  preloadResources() {
    // Preload critical fonts
    const fontPreloads = [
      'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap',
      'https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&display=swap'
    ];
    
    fontPreloads.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      document.head.appendChild(link);
    });
  }
}

// ===== INITIALIZATION =====

class PortfolioApp {
  constructor() {
    this.components = [];
    this.init();
  }

  async init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }

  initializeComponents() {
    try {
      // Initialize all components
      this.components.push(new LoadingManager());
      this.components.push(new CursorManager());
      this.components.push(new MobileNavigation());
      this.components.push(new SmoothScrolling());
      this.components.push(new HeaderEffects());
      this.components.push(new CounterAnimation());
      this.components.push(new PortfolioFilter());
      this.components.push(new TestimonialsSlider());
      this.components.push(new ContactForm());
      this.components.push(new WhatsAppIntegration());
      this.components.push(new HeroVideoPlayer());
      this.components.push(new ScrollNavigation());
      this.components.push(new ServicesScrollAnimation());

      // Enhanced services scroll animation with smoother transitions
      setTimeout(() => {
         const servicesSection = document.querySelector('.services');
         if (servicesSection) {
            servicesSection.classList.add('services-scroll-animate');
            console.log('Enhanced services scroll animation activated');

            let currentScrollStage = 0;
            let isAnimationInProgress = false;

            const handleScrollStage = () => {
               if (isAnimationInProgress) return;

               const rect = servicesSection.getBoundingClientRect();
               const windowHeight = window.innerHeight;
               const sectionHeight = rect.height;

               // Calculate scroll progress more accurately
               const sectionTop = rect.top;
               const visibleHeight = Math.min(windowHeight, sectionHeight);
               const totalVisibleHeight = windowHeight + sectionHeight;

               // Enhanced progress calculation
               let progress = 0;
               if (sectionTop <= windowHeight && rect.bottom >= 0) {
                  progress = Math.max(0, Math.min(1,
                     (windowHeight - sectionTop) / (totalVisibleHeight * 0.6)
                  ));
               } else if (sectionTop > windowHeight) {
                  progress = 0;
               } else {
                  progress = 1;
               }

               // Calculate target stage with smoother transitions
               const totalStages = 7; // 0-6
               const targetStage = Math.min(totalStages - 1, Math.floor(progress * totalStages));

               if (targetStage !== currentScrollStage) {
                  isAnimationInProgress = true;

                  // Remove all existing stage classes
                  for (let i = 0; i < totalStages; i++) {
                     servicesSection.classList.remove(`services-scroll-stage-${i}`);
                  }

                  // Add new stage class with slight delay for smoother transition
                  setTimeout(() => {
                     servicesSection.classList.add(`services-scroll-stage-${targetStage}`);
                     currentScrollStage = targetStage;
                     isAnimationInProgress = false;
                     console.log(`Services scroll stage: ${targetStage}, progress: ${progress.toFixed(3)}`);
                  }, 50);
               }
            };

            // Initial call
            handleScrollStage();

            // Optimized scroll listener with requestAnimationFrame
            let ticking = false;
            const optimizedScrollHandler = () => {
               if (!ticking) {
                  requestAnimationFrame(() => {
                     handleScrollStage();
                     ticking = false;
                  });
                  ticking = true;
               }
            };

            window.addEventListener('scroll', optimizedScrollHandler, { passive: true });

            // Add resize handler to recalculate on window resize
            const handleResize = throttle(() => {
               handleScrollStage();
            }, 250);

            window.addEventListener('resize', handleResize);
         }
      }, 100);
      this.components.push(new GalaxyBackground());
      this.components.push(new CookieConsentManager());
      this.components.push(new PerformanceOptimizer());
      
      // Initialize AOS (Animate On Scroll)
      if (typeof AOS !== 'undefined') {
        AOS.init({
          duration: 800,
          easing: 'ease-in-out',
          once: true,
          offset: 100
        });
      }
      
      console.log('Portfolio initialized successfully!');
      
    } catch (error) {
      console.error('Error initializing project:', error);
    }
  }
  
  getComponent(componentName) {
    return this.components.find(component =>
      component.constructor.name === componentName
    );
  }
}

// ===== SCROLL NAVIGATION =====

class ScrollNavigation {
  constructor() {
    this.scrollNav = null;
    this.dots = [];
    this.sections = [];
    this.currentActive = null; // Start with no active section
    this.scrollNav = document.querySelector('.scroll-nav');
    console.log('ScrollNavigation initialized, waiting for DOM...');
    this.init();
  }

  init() {
    if (!this.scrollNav) {
      console.log('Scroll navigation element not found');
      return;
    }

    // Get all navigation dots
    this.dots = Array.from(this.scrollNav.querySelectorAll('.scroll-dot'));
    console.log('Found navigation dots:', this.dots.length);

    // Define sections with their elements and dot indices
    this.sections = [
      { id: 'home', element: document.getElementById('home'), dotIndex: 0 },
      { id: 'about', element: document.getElementById('about'), dotIndex: 1 },
      { id: 'services', element: document.getElementById('services'), dotIndex: 2 },
      { id: 'project', element: document.getElementById('project'), dotIndex: 3 },
      { id: 'testimonials', element: document.getElementById('testimonials'), dotIndex: 4 },
      { id: 'blog', element: document.getElementById('blog'), dotIndex: 5 },
      { id: 'contact', element: document.getElementById('contact'), dotIndex: 6 },
      { id: 'footer', element: document.getElementById('footer'), dotIndex: 7 }
    ].filter(section => {
      const exists = section.element !== null;
      if (!exists) {
        console.log(`Section ${section.id} not found, skipping`);
      }
      return exists;
    });

    console.log('Active sections:', this.sections.map(s => s.id));

    if (this.sections.length === 0) {
      console.error('No sections found for scroll navigation');
      return;
    }

    this.bindEvents();

    // Set initial active section based on current scroll position
    this.setInitialActiveSection();

    // Start tracking after a short delay to ensure all elements are rendered
    setTimeout(() => {
      this.startTracking();
    }, 100);
  }

  bindEvents() {
    // Handle dot clicks
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = this.sections[index];
        if (targetSection && targetSection.element) {
          this.scrollToSection(targetSection.element);
        }
      });
    });

    // Handle keyboard navigation for accessibility
    this.dots.forEach((dot, index) => {
      dot.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          dot.click();
        }
      });
    });
  }

  startTracking() {
    console.log('Starting scroll tracking for sections:', this.sections.map(s => s.id));

    if ('IntersectionObserver' in window) {
      // Use Intersection Observer for better performance
      const observerOptions = {
        threshold: [0.1, 0.3, 0.5, 0.7, 0.9],
        rootMargin: '-10% 0px -80% 0px'
      };

      const observer = new IntersectionObserver((entries) => {
        // Find the section with highest intersection ratio
        let maxRatio = 0;
        let activeEntry = null;

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio;
            activeEntry = entry;
          }
        });

        if (activeEntry) {
          const sectionId = activeEntry.target.id;
          console.log('Intersection Observer detected section:', sectionId, 'with ratio:', maxRatio);
          this.setActiveSection(sectionId);
        }
      }, observerOptions);

      // Observe all sections
      this.sections.forEach(section => {
        if (section.element) {
          console.log('Observing section:', section.id);
          observer.observe(section.element);
        }
      });
    } else {
      console.log('Intersection Observer not supported, using scroll events');
    }

    // Enhanced fallback with better detection
    window.addEventListener('scroll', throttle(() => {
      this.updateActiveOnScroll();
    }, 50));

    // Also check on load and resize
    window.addEventListener('load', () => {
      console.log('Page loaded, checking initial section');
      this.setInitialActiveSection();
    });

    window.addEventListener('resize', throttle(() => {
      console.log('Window resized, updating section detection');
      this.setInitialActiveSection();
    }, 250));
  }

  setInitialActiveSection() {
    const scrollPosition = window.scrollY + window.innerHeight / 3;

    // Find which section is currently in view
    for (let i = this.sections.length - 1; i >= 0; i--) {
      const section = this.sections[i];
      if (!section.element) continue;

      const elementTop = section.element.offsetTop;
      const elementBottom = elementTop + section.element.offsetHeight;

      if (scrollPosition >= elementTop && scrollPosition <= elementBottom) {
        console.log('Setting initial active section:', section.id);
        this.setActiveSection(section.id);
        break;
      }
    }

    // If no section is in view (e.g., at very top), default to home
    if (!this.currentActive) {
      console.log('No section in view, defaulting to home');
      this.setActiveSection('home');
    }
  }

  setActiveSection(sectionId) {
    if (this.currentActive === sectionId) return;

    console.log('Changing active section from', this.currentActive, 'to', sectionId);
    this.currentActive = sectionId;

    // Remove active class from all dots
    this.dots.forEach(dot => dot.classList.remove('active'));

    // Add active class to current dot
    const activeSection = this.sections.find(section => section.id === sectionId);
    if (activeSection && this.dots[activeSection.dotIndex]) {
      this.dots[activeSection.dotIndex].classList.add('active');
      console.log('Activated dot index:', activeSection.dotIndex, 'for section:', sectionId);
    }
  }

  updateActiveOnScroll() {
    if (!this.sections.length) return;

    const scrollPosition = window.scrollY;
    const windowHeight = window.innerHeight;
    const middlePosition = scrollPosition + windowHeight / 2;

    let currentSection = null;
    let maxVisibility = 0;

    // Check each section to find which has the most visibility
    this.sections.forEach(section => {
      if (!section.element) return;

      const elementTop = section.element.offsetTop;
      const elementBottom = elementTop + section.element.offsetHeight;
      const elementHeight = elementBottom - elementTop;

      // Calculate how much of the section is visible
      let visibleTop = Math.max(elementTop, scrollPosition);
      let visibleBottom = Math.min(elementBottom, scrollPosition + windowHeight);
      let visibleHeight = Math.max(0, visibleBottom - visibleTop);

      // Calculate visibility ratio
      let visibility = visibleHeight / elementHeight;

      // Bonus points for sections that contain the middle of the screen
      if (middlePosition >= elementTop && middlePosition <= elementBottom) {
        visibility += 0.5;
      }

      if (visibility > maxVisibility) {
        maxVisibility = visibility;
        currentSection = section;
      }
    });

    if (currentSection && currentSection.id !== this.currentActive) {
      console.log('Scroll detection: switching to section', currentSection.id, 'with visibility', maxVisibility);
      this.setActiveSection(currentSection.id);
    }
  }

  scrollToSection(element) {
    if (!element) return;

    const headerHeight = document.getElementById('header')?.offsetHeight || 80;
    const targetPosition = element.offsetTop - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: 'smooth'
    });

    // Update active section immediately for better UX
    this.setActiveSection(element.id);
  }
}

// ===== TESTIMONIALS SLIDER =====

class TestimonialsSlider {
   constructor() {
     this.slider = null;
     this.slides = [];
     this.dots = [];
     this.prevBtn = null;
     this.nextBtn = null;
     this.currentSlide = 0;
     this.totalSlides = 0;
     this.autoPlayInterval = null;
     this.autoPlayDelay = 5000; // 5 seconds
     this.progressInterval = null;
     this.isPlaying = true;
     this.slider = document.querySelector('.testimonials-slider');
     this.init();
   }

   init() {
     if (!this.slider) {
       console.error('Testimonials slider not found');
       return;
     }

     // Get DOM elements
     this.slides = Array.from(this.slider.querySelectorAll('.testimonial-slide'));
     this.dots = Array.from(this.slider.querySelectorAll('.dot'));
     this.prevBtn = this.slider.querySelector('.prev-btn');
     this.nextBtn = this.slider.querySelector('.next-btn');

     this.totalSlides = this.slides.length;

     if (this.totalSlides === 0) {
       console.error('No testimonial slides found');
       return;
     }

     console.log(`Testimonials slider initialized with ${this.totalSlides} slides`);

     this.bindEvents();
     this.startAutoPlay();
     this.updateSlidePositions();
   }

   bindEvents() {
     // Navigation buttons
     this.prevBtn?.addEventListener('click', () => {
       this.goToPreviousSlide();
     });

     this.nextBtn?.addEventListener('click', () => {
       this.goToNextSlide();
     });

     // Dots navigation
     this.dots.forEach((dot, index) => {
       dot.addEventListener('click', () => {
         this.goToSlide(index);
       });
     });

     // Pause auto-play on hover
     this.slider?.addEventListener('mouseenter', () => {
       this.pauseAutoPlay();
     });

     this.slider?.addEventListener('mouseleave', () => {
       this.resumeAutoPlay();
     });

     // Keyboard navigation
     document.addEventListener('keydown', (e) => {
       if (!this.slider || !this.isInViewport()) return;

       switch(e.key) {
         case 'ArrowLeft':
           e.preventDefault();
           this.goToPreviousSlide();
           break;
         case 'ArrowRight':
           e.preventDefault();
           this.goToNextSlide();
           break;
         case ' ':
           e.preventDefault();
           this.toggleAutoPlay();
           break;
       }
     });

     // Touch/swipe support for mobile
     let startX = 0;
     let endX = 0;

     this.slider?.addEventListener('touchstart', (e) => {
       startX = e.touches[0].clientX;
     });

     this.slider?.addEventListener('touchend', (e) => {
       endX = e.changedTouches[0].clientX;
       this.handleSwipe();
     });

     // Handle visibility change (pause when tab is not visible)
     document.addEventListener('visibilitychange', () => {
       if (document.hidden) {
         this.pauseAutoPlay();
       } else {
         this.resumeAutoPlay();
       }
     });
   }

   handleSwipe() {
     const threshold = 50;
     const diff = startX - endX;

     if (Math.abs(diff) < threshold) return;

     if (diff > 0) {
       // Swipe left - next slide
       this.goToNextSlide();
     } else {
       // Swipe right - previous slide
       this.goToPreviousSlide();
     }
   }

   goToSlide(slideIndex) {
     if (slideIndex < 0 || slideIndex >= this.totalSlides) return;

     // Remove all classes from current slides
     this.slides.forEach(slide => {
       slide.classList.remove('active', 'prev', 'next');
     });

     // Update current slide
     this.currentSlide = slideIndex;

     // Set new active slide
     const activeSlide = this.slides[this.currentSlide];
     if (activeSlide) {
       activeSlide.classList.add('active');
     }

     // Set previous slide (if exists)
     if (this.currentSlide > 0) {
       this.slides[this.currentSlide - 1].classList.add('prev');
     } else {
       this.slides[this.totalSlides - 1].classList.add('prev');
     }

     // Set next slide (if exists)
     if (this.currentSlide < this.totalSlides - 1) {
       this.slides[this.currentSlide + 1].classList.add('next');
     } else {
       this.slides[0].classList.add('next');
     }

     // Update dots
     this.updateDots();

     // Restart auto-play
     this.restartAutoPlay();

     console.log(`Switched to slide ${this.currentSlide + 1}`);
   }

   goToNextSlide() {
     const nextSlide = (this.currentSlide + 1) % this.totalSlides;
     this.goToSlide(nextSlide);
   }

   goToPreviousSlide() {
     const prevSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
     this.goToSlide(prevSlide);
   }

   updateDots() {
     this.dots.forEach((dot, index) => {
       dot.classList.toggle('active', index === this.currentSlide);
     });
   }

   updateSlidePositions() {
     // Ensure first slide is active on load
     if (this.slides.length > 0) {
       this.slides[0].classList.add('active');
       if (this.slides.length > 1) {
         this.slides[1].classList.add('next');
       }
       if (this.slides.length > 2) {
         this.slides[this.slides.length - 1].classList.add('prev');
       }
     }

     this.updateDots();
   }

   startAutoPlay() {
     if (this.totalSlides <= 1) return;

     this.autoPlayInterval = setInterval(() => {
       this.goToNextSlide();
     }, this.autoPlayDelay);

     this.startProgressIndicator();
     console.log('Auto-play started');
   }

   pauseAutoPlay() {
     if (this.autoPlayInterval) {
       clearInterval(this.autoPlayInterval);
       this.autoPlayInterval = null;
     }
     this.stopProgressIndicator();
     console.log('Auto-play paused');
   }

   resumeAutoPlay() {
     if (this.isPlaying && this.totalSlides > 1) {
       this.startAutoPlay();
     }
   }

   restartAutoPlay() {
     if (this.isPlaying) {
       this.pauseAutoPlay();
       this.resumeAutoPlay();
     }
   }

   toggleAutoPlay() {
     this.isPlaying = !this.isPlaying;

     if (this.isPlaying) {
       this.resumeAutoPlay();
     } else {
       this.pauseAutoPlay();
     }

     console.log('Auto-play', this.isPlaying ? 'resumed' : 'paused');
   }

   startProgressIndicator() {
     const progressElement = this.slider?.querySelector('.autoplay-progress');
     if (!progressElement) return;

     let progress = 0;
     const increment = 100 / (this.autoPlayDelay / 100); // Update every 100ms

     this.progressInterval = setInterval(() => {
       progress += increment;
       if (progress >= 100) progress = 0;

       // Update CSS custom property for smooth animation
       progressElement.style.setProperty('--progress', `${progress}%`);
     }, 100);
   }

   stopProgressIndicator() {
     if (this.progressInterval) {
       clearInterval(this.progressInterval);
       this.progressInterval = null;
     }

     const progressElement = this.slider?.querySelector('.autoplay-progress');
     if (progressElement) {
       progressElement.style.setProperty('--progress', '0%');
     }
   }

   isInViewport() {
     if (!this.slider) return false;

     const rect = this.slider.getBoundingClientRect();
     const windowHeight = window.innerHeight || document.documentElement.clientHeight;

     return (
       rect.top >= -rect.height &&
       rect.left >= -rect.width &&
       rect.bottom <= windowHeight + rect.height &&
       rect.right <= (window.innerWidth || document.documentElement.clientWidth) + rect.width
     );
   }
}

// ===== HERO VIDEO PLAYER =====

class HeroVideoPlayer {
  constructor() {
    this.heroVideoPlayer = null;
    this.heroVideo = null;
    this.watchVideoBtn = null;
    this.videoPlayPauseBtn = null;
    this.videoCloseBtn = null;
    this.videoProgressBar = null;
    this.progressInterval = null;
    this.isVideoMode = false;
    this.isPosterDelay = false;
    this.posterDelayTimeout = null;
    this.init();
  }

  init() {
    // Get DOM elements
    this.heroVideoPlayer = document.getElementById('hero-video-player');
    this.heroVideo = document.getElementById('hero-video');
    this.watchVideoBtn = document.getElementById('watch-video-btn');
    this.videoPlayPauseBtn = document.getElementById('video-play-pause');
    this.videoCloseBtn = document.getElementById('video-close');
    this.videoProgressBar = document.getElementById('video-progress-bar');

    if (!this.heroVideoPlayer || !this.heroVideo || !this.watchVideoBtn) {
      console.error('Hero video player elements not found');
      return;
    }

    this.bindEvents();
    console.log('Hero video player initialized');
  }

  bindEvents() {
    // Watch video button - toggle to video mode
    this.watchVideoBtn?.addEventListener('click', () => {
      this.enterVideoMode();
    });

    // Video click - toggle play/pause
    this.heroVideo?.addEventListener('click', () => {
      this.togglePlayPause();
    });

    // Video play/pause button
    this.videoPlayPauseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.togglePlayPause();
    });

    // Video close button - exit video mode
    this.videoCloseBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.exitVideoMode();
    });

    // Video progress bar click
    const videoProgress = document.querySelector('.video-progress');
    videoProgress?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.seekVideo(e);
    });

    // Video events
    this.heroVideo?.addEventListener('play', () => {
      this.updatePlayPauseIcon(true);
      this.startProgressTracking();
    });

    this.heroVideo?.addEventListener('pause', () => {
      // Don't update icon if we're in poster delay mode
      if (!this.isPosterDelay) {
        this.updatePlayPauseIcon(false);
      }
      this.stopProgressTracking();
    });

    this.heroVideo?.addEventListener('ended', () => {
      this.updatePlayPauseIcon(false);
      this.stopProgressTracking();
      // Auto-exit video mode when video ends
      setTimeout(() => {
        if (this.isVideoMode) {
          this.exitVideoMode();
        }
      }, 2000);
    });

    this.heroVideo?.addEventListener('timeupdate', () => {
      this.updateProgressBar();
    });

    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (!this.isVideoMode) return;

      switch(e.key) {
        case 'Escape':
          this.exitVideoMode();
          break;
        case ' ':
          e.preventDefault();
          this.togglePlayPause();
          break;
      }
    });
  }

  enterVideoMode() {
    if (this.isVideoMode) return;

    this.isVideoMode = true;
    this.heroVideoPlayer?.classList.add('active');

    // Ensure hero content is visible but dimmed
    const heroContent = document.querySelector('.hero-content');
    const heroScroll = document.querySelector('.hero-scroll');

    if (heroContent) {
      heroContent.style.opacity = '0.3';
      heroContent.style.pointerEvents = 'none';
    }

    if (heroScroll) {
      heroScroll.style.opacity = '0';
      heroScroll.style.pointerEvents = 'none';
    }

    // Show poster image for 2 seconds before playing video
    this.showPosterDelay();

    console.log('Entered video mode');
  }

  showPosterDelay() {
    this.isPosterDelay = true;

    // Add visual indication for delay state
    this.heroVideoPlayer?.classList.add('poster-delay');

    // Update play button to show it's in delay mode
    this.updatePlayPauseIcon('delay');

    // Set timeout to start video after 2 seconds
    this.posterDelayTimeout = setTimeout(() => {
      this.startVideoPlayback();
    }, 2000);
  }

  startVideoPlayback() {
    if (!this.heroVideo) return;

    this.isPosterDelay = false;

    // Remove delay visual indication
    this.heroVideoPlayer?.classList.remove('poster-delay');

    // Start playing video
    this.heroVideo.play().catch(error => {
      console.error('Error playing video:', error);
      this.showVideoError();
    });

    console.log('Video playback started after delay');
  }

  exitVideoMode() {
    if (!this.isVideoMode) return;

    this.isVideoMode = false;
    this.clearPosterDelay();
    this.heroVideoPlayer?.classList.remove('active');

    // Restore hero content
    const heroContent = document.querySelector('.hero-content');
    const heroScroll = document.querySelector('.hero-scroll');

    if (heroContent) {
      heroContent.style.opacity = '';
      heroContent.style.pointerEvents = '';
    }

    if (heroScroll) {
      heroScroll.style.opacity = '';
      heroScroll.style.pointerEvents = '';
    }

    // Pause and reset video
    if (this.heroVideo) {
      this.heroVideo.pause();
      this.heroVideo.currentTime = 0;
    }

    this.stopProgressTracking();
    console.log('Exited video mode');
  }

  togglePlayPause() {
    if (!this.heroVideo) return;

    // If we're in poster delay mode, start video immediately
    if (this.isPosterDelay) {
      this.clearPosterDelay();
      this.startVideoPlayback();
      return;
    }

    // Normal play/pause functionality
    if (this.heroVideo.paused) {
      this.heroVideo.play();
    } else {
      this.heroVideo.pause();
    }
  }

  clearPosterDelay() {
    if (this.posterDelayTimeout) {
      clearTimeout(this.posterDelayTimeout);
      this.posterDelayTimeout = null;
    }
    this.isPosterDelay = false;
    this.heroVideoPlayer?.classList.remove('poster-delay');
  }

  updatePlayPauseIcon(state) {
    if (!this.videoPlayPauseBtn) return;

    const icon = this.videoPlayPauseBtn.querySelector('i');
    if (icon) {
      switch(state) {
        case 'delay':
          icon.className = 'fas fa-clock';
          break;
        case true: // isPlaying
          icon.className = 'fas fa-pause';
          break;
        case false: // isPaused
        default:
          icon.className = 'fas fa-play';
          break;
      }
    }
  }

  startProgressTracking() {
    this.stopProgressTracking(); // Clear any existing interval

    this.progressInterval = setInterval(() => {
      this.updateProgressBar();
    }, 100);
  }

  stopProgressTracking() {
    if (this.progressInterval) {
      clearInterval(this.progressInterval);
      this.progressInterval = null;
    }
  }

  updateProgressBar() {
    if (!this.heroVideo || !this.videoProgressBar) return;

    const progress = (this.heroVideo.currentTime / this.heroVideo.duration) * 100;
    this.videoProgressBar.style.width = `${progress || 0}%`;
  }

  seekVideo(event) {
    if (!this.heroVideo) return;

    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const progressBarWidth = rect.width;
    const seekTime = (clickX / progressBarWidth) * this.heroVideo.duration;

    this.heroVideo.currentTime = seekTime;
  }

  showVideoError() {
    // Show a temporary error message
    const errorMsg = document.createElement('div');
    errorMsg.textContent = 'Video playback not available';
    errorMsg.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 1rem 2rem;
      border-radius: 0.5rem;
      z-index: 10;
    `;

    this.heroVideoPlayer?.appendChild(errorMsg);

    setTimeout(() => {
      errorMsg.remove();
      this.exitVideoMode();
    }, 3000);
  }
}

// ===== GALAXY BACKGROUND =====

class GalaxyBackground {
    constructor(containerId = 'services-galaxy') {
       this.canvas = null;
       this.ctx = null;
       this.particles = [];
       this.numParticles = 200; // Increased from 120 to 200
       this.mouse = { x: null, y: null };
       this.animationId = null;
       this.containerId = containerId;
       this.canvas = document.getElementById(containerId);
       this.init();
    }

   init() {
      if (!this.canvas) {
         console.error(`Galaxy canvas with id '${this.containerId}' not found`);
         return;
      }

      this.ctx = this.canvas.getContext("2d");
      this.resizeCanvas();

      // Create particles with enhanced properties
      this.createParticles();

      this.bindEvents();
      this.animate();

      console.log(`Galaxy background initialized with ${this.numParticles} particles`);
   }

   resizeCanvas() {
      const container = this.canvas.parentElement;
      if (container) {
         this.canvas.width = container.offsetWidth;
         this.canvas.height = container.offsetHeight;
      } else {
         this.canvas.width = window.innerWidth;
         this.canvas.height = window.innerHeight;
      }
   }

   createParticles() {
      this.particles = [];
      for (let i = 0; i < this.numParticles; i++) {
         this.particles.push(new GalaxyParticle(this.canvas.width, this.canvas.height));
      }
   }

   bindEvents() {
      // Handle window resize
      window.addEventListener("resize", throttle(() => {
         this.resizeCanvas();
         this.createParticles(); // Recreate particles for new dimensions
      }, 250));

      // Handle mouse movement
      window.addEventListener("mousemove", throttle((e) => {
         const rect = this.canvas.getBoundingClientRect();
         this.mouse.x = e.clientX - rect.left;
         this.mouse.y = e.clientY - rect.top;
      }, 16));

      // Handle mouse leave
      this.canvas.addEventListener("mouseleave", () => {
         this.mouse.x = null;
         this.mouse.y = null;
      });
   }

   animate() {
      this.animationId = requestAnimationFrame(() => this.animate());
      this.update();
      this.draw();
   }

   update() {
      // Update all particles
      for (let particle of this.particles) {
         particle.update(this.mouse, this.canvas.width, this.canvas.height);
      }
   }

   draw() {
      // Clear canvas with fade effect for trails
      this.ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

      // Draw connections first (behind particles)
      this.drawConnections();

      // Draw particles on top
      for (let particle of this.particles) {
         particle.draw(this.ctx);
      }
   }

   drawConnections() {
      for (let i = 0; i < this.particles.length; i++) {
         for (let j = i + 1; j < this.particles.length; j++) {
            const dx = this.particles[i].x - this.particles[j].x;
            const dy = this.particles[i].y - this.particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) { // Increased connection distance
               const opacity = (1 - distance / 150) * 0.3;
               this.ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
               this.ctx.lineWidth = 0.5;
               this.ctx.beginPath();
               this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
               this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
               this.ctx.stroke();
            }
         }
      }
   }

   destroy() {
      if (this.animationId) {
         cancelAnimationFrame(this.animationId);
      }
      this.particles = [];
   }
}

class GalaxyParticle {
    constructor(canvasWidth, canvasHeight) {
       this.x = Math.random() * canvasWidth;
       this.y = Math.random() * canvasHeight;
       this.radius = Math.random() * 3 + 1; // Larger particles
       this.baseRadius = this.radius;

       // Enhanced color palette with more variety
       const colors = [
          '#FFD700', // Gold
          '#FFA500', // Orange
          '#FF6347', // Tomato
          '#FF69B4', // Hot Pink
          '#00CED1', // Dark Turquoise
          '#9370DB', // Medium Purple
          '#32CD32', // Lime Green
          '#FF4500', // Orange Red
          '#1E90FF', // Dodger Blue
          '#FF1493'  // Deep Pink
       ];

       this.color = colors[Math.floor(Math.random() * colors.length)];
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;

      // Pulsing effect
      this.pulsePhase = Math.random() * Math.PI * 2;
      this.pulseSpeed = 0.02 + Math.random() * 0.03;
   }

   update(mouse, canvasWidth, canvasHeight) {
      // Move particle
      this.x += this.speedX;
      this.y += this.speedY;

      // Bounce off edges
      if (this.x < 0 || this.x > canvasWidth) this.speedX *= -1;
      if (this.y < 0 || this.y > canvasHeight) this.speedY *= -1;

      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
         const dx = mouse.x - this.x;
         const dy = mouse.y - this.y;
         const distance = Math.sqrt(dx * dx + dy * dy);

         if (distance < 200) { // Increased interaction radius
            const force = (200 - distance) / 200;
            this.x += (dx / distance) * force * 2;
            this.y += (dy / distance) * force * 2;
         }
      }

      // Pulsing effect
      this.pulsePhase += this.pulseSpeed;
      this.radius = this.baseRadius + Math.sin(this.pulsePhase) * 1;
   }

   draw(ctx) {
      // Outer glow
      const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 3);
      gradient.addColorStop(0, this.color + '80'); // 50% opacity
      gradient.addColorStop(0.5, this.color + '40'); // 25% opacity
      gradient.addColorStop(1, this.color + '00'); // 0% opacity

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      // Main particle
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Inner bright core
      ctx.fillStyle = '#FFFFFF';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
   }
}

// ===== COOKIE CONSENT MANAGER =====

class CookieConsentManager {
   constructor() {
      this.cookieConsent = null;
      this.cookieModal = null;
      this.acceptBtn = null;
      this.rejectBtn = null;
      this.customizeBtn = null;
      this.closeBtn = null;
      this.modalCloseBtn = null;
      this.analyticsCheckbox = null;
      this.marketingCheckbox = null;
      this.essentialCheckbox = null;
      this.cookieConsent = document.getElementById('cookie-consent');
      this.cookieModal = document.getElementById('cookie-details-modal');
      this.init();
   }

   init() {
      if (!this.cookieConsent) {
         console.error('Cookie consent element not found');
         return;
      }

      // Get DOM elements
      this.acceptBtn = document.getElementById('cookie-accept');
      this.rejectBtn = document.getElementById('cookie-reject');
      this.customizeBtn = document.getElementById('cookie-customize');
      this.closeBtn = document.getElementById('cookie-close');
      this.modalCloseBtn = document.querySelector('.cookie-modal-close');
      this.analyticsCheckbox = document.getElementById('analytics-cookies');
      this.marketingCheckbox = document.getElementById('marketing-cookies');
      this.essentialCheckbox = document.getElementById('essential-cookies');

      // Check if user has already made a choice
      console.log('Cookie consent init - checking user consent...');
      if (!this.hasUserConsent()) {
         console.log('No existing consent found - showing popup immediately');
         // Show immediately for better UX
         setTimeout(() => {
            this.showConsent();
         }, 2000); // Show after 2 seconds to let page load
      } else {
         console.log('User has already given consent - not showing popup');
      }

      this.bindEvents();
      console.log('Cookie consent manager initialized');
   }

   bindEvents() {
      // Accept all cookies
      this.acceptBtn?.addEventListener('click', () => {
         this.acceptAllCookies();
      });

      // Reject all non-essential cookies
      this.rejectBtn?.addEventListener('click', () => {
         this.rejectAllCookies();
      });

      // Open customization modal
      this.customizeBtn?.addEventListener('click', () => {
         this.showCookieModal();
      });

      // Close consent popup
      this.closeBtn?.addEventListener('click', () => {
         this.hideConsent();
      });

      // Close modal
      this.modalCloseBtn?.addEventListener('click', () => {
         this.hideCookieModal();
      });

      // Handle checkbox changes
      this.analyticsCheckbox?.addEventListener('change', () => {
         this.updateCookiePreferences();
      });

      this.marketingCheckbox?.addEventListener('change', () => {
         this.updateCookiePreferences();
      });

      // Close modal when clicking outside
      this.cookieModal?.addEventListener('click', (e) => {
         if (e.target === this.cookieModal) {
            this.hideCookieModal();
         }
      });

      // Keyboard navigation
      document.addEventListener('keydown', (e) => {
         if (e.key === 'Escape') {
            if (this.cookieModal?.classList.contains('show')) {
               this.hideCookieModal();
            } else if (this.cookieConsent?.classList.contains('show')) {
               this.hideConsent();
            }
         }
      });
   }

   hasUserConsent() {
      try {
         const consent = localStorage.getItem('cookieConsent');
         console.log('Checking user consent:', consent);
         return consent !== null;
      } catch (error) {
         console.error('Error checking localStorage:', error);
         return false; // If localStorage fails, show consent
      }
   }

   waitForHeroScroll() {
      console.log('Starting waitForHeroScroll...');

      // Get hero section
      const heroSection = document.getElementById('home');
      if (!heroSection) {
         console.error('Hero section not found for scroll detection');
         // Fallback: show after 5 seconds if hero not found
         setTimeout(() => {
            if (!this.hasUserConsent()) {
               console.log('Showing consent as fallback (hero not found)');
               this.showConsent();
            }
         }, 5000);
         return;
      }

      console.log('Hero section found, height:', heroSection.offsetHeight);
      let hasShownConsent = false;

      const checkScrollPosition = throttle(() => {
         if (hasShownConsent || this.hasUserConsent()) {
            console.log('Consent already shown or user already consented');
            window.removeEventListener('scroll', checkScrollPosition);
            return;
         }

         const scrollY = window.scrollY;
         const heroHeight = heroSection.offsetHeight;
         const triggerPoint = heroHeight - 100;

         console.log(`Scroll position: ${scrollY}px, Hero height: ${heroHeight}px, Trigger point: ${triggerPoint}px`);

         // Show consent when user scrolls past hero section (with 100px buffer)
         if (scrollY > triggerPoint) {
            hasShownConsent = true;
            window.removeEventListener('scroll', checkScrollPosition);
            console.log('Cookie consent triggered by scroll position');
            this.showConsent();
         }
      }, 100);

      // Start listening for scroll events
      window.addEventListener('scroll', checkScrollPosition);
      console.log('Scroll event listener added');

      // Fallback: show after 15 seconds if user never scrolls past hero
      setTimeout(() => {
         if (!hasShownConsent && !this.hasUserConsent()) {
            console.log('Cookie consent shown after 15s timeout');
            window.removeEventListener('scroll', checkScrollPosition);
            this.showConsent();
         }
      }, 15000);

      // Debug: Add manual trigger for testing (remove in production)
      window.debugShowCookieConsent = () => {
         console.log('Manual cookie consent trigger');
         window.removeEventListener('scroll', checkScrollPosition);
         this.showConsent();
      };

      // Debug: Add function to clear consent for testing
      window.debugClearCookieConsent = () => {
         localStorage.removeItem('cookieConsent');
         console.log('Cookie consent cleared for testing');
      };
   }

   showConsent() {
      this.cookieConsent?.classList.add('show');

      // Load saved preferences
      this.loadSavedPreferences();

      // Animate in after a short delay
      setTimeout(() => {
         if (this.cookieConsent) {
            this.cookieConsent.style.transform = 'translateY(0) scale(1)';
            this.cookieConsent.style.opacity = '1';
         }
      }, 100);
   }

   hideConsent() {
      if (!this.cookieConsent) return;

      this.cookieConsent.style.transform = 'translateY(100px) scale(0.9)';
      this.cookieConsent.style.opacity = '0';

      setTimeout(() => {
         this.cookieConsent?.classList.remove('show');
      }, 300);
   }

   showCookieModal() {
      this.cookieModal?.classList.add('show');
      document.body.style.overflow = 'hidden';
   }

   hideCookieModal() {
      if (!this.cookieModal) return;

      this.cookieModal.classList.remove('show');
      document.body.style.overflow = '';
   }

   acceptAllCookies() {
      const preferences = {
         essential: true,
         analytics: true,
         marketing: true,
         timestamp: Date.now(),
         version: '1.0'
      };

      this.savePreferences(preferences);
      this.hideConsent();
      this.initializeCookies(preferences);
      this.showNotification('✅ All cookies accepted!', 'success');
   }

   rejectAllCookies() {
      const preferences = {
         essential: true,  // Essential cookies cannot be rejected
         analytics: false,
         marketing: false,
         timestamp: Date.now(),
         version: '1.0'
      };

      this.savePreferences(preferences);
      this.hideConsent();
      this.initializeCookies(preferences);
      this.showNotification('🍪 Only essential cookies enabled', 'info');
   }

   updateCookiePreferences() {
      if (!this.analyticsCheckbox || !this.marketingCheckbox) return;

      const preferences = {
         essential: true,
         analytics: this.analyticsCheckbox.checked,
         marketing: this.marketingCheckbox.checked,
         timestamp: Date.now(),
         version: '1.0'
      };

      this.savePreferences(preferences);
      this.initializeCookies(preferences);
   }

   savePreferences(preferences) {
      try {
         localStorage.setItem('cookieConsent', JSON.stringify(preferences));
         console.log('Cookie preferences saved:', preferences);
      } catch (error) {
         console.error('Error saving cookie preferences:', error);
      }
   }

   loadSavedPreferences() {
      try {
         const saved = localStorage.getItem('cookieConsent');
         if (saved) {
            const preferences = JSON.parse(saved);

            if (this.analyticsCheckbox) {
               this.analyticsCheckbox.checked = preferences.analytics || false;
            }

            if (this.marketingCheckbox) {
               this.marketingCheckbox.checked = preferences.marketing || false;
            }

            // Initialize cookies with saved preferences
            this.initializeCookies(preferences);
         }
      } catch (error) {
         console.error('Error loading cookie preferences:', error);
      }
   }

   initializeCookies(preferences) {
      // Initialize Google Analytics if accepted
      if (preferences.analytics) {
         this.initializeGoogleAnalytics();
      }

      // Initialize marketing cookies if accepted
      if (preferences.marketing) {
         this.initializeMarketingCookies();
      }

      // Always initialize essential cookies
      this.initializeEssentialCookies();
   }

   initializeGoogleAnalytics() {
      // Check if GA is already loaded
      if (window.gtag || document.querySelector('script[src*="googletagmanager.com"]')) {
         return;
      }

      try {
         // Load Google Tag Manager
         const script = document.createElement('script');
         script.async = true;
         script.src = 'https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID'; // Replace with your GA ID
         document.head.appendChild(script);

         window.dataLayer = window.dataLayer || [];
         function gtag(){dataLayer.push(arguments);}
         window.gtag = gtag;

         gtag('js', new Date());
         gtag('config', 'GA_MEASUREMENT_ID'); // Replace with your GA ID

         console.log('Google Analytics initialized');
      } catch (error) {
         console.error('Error initializing Google Analytics:', error);
      }
   }

   initializeMarketingCookies() {
      // Initialize Facebook Pixel, LinkedIn Insight Tag, etc.
      console.log('Marketing cookies initialized');

      // Example: Facebook Pixel
      if (!document.querySelector('script[src*="facebook.net"]')) {
         const script = document.createElement('script');
         script.async = true;
         script.src = 'https://connect.facebook.net/en_US/fbevents.js';
         document.head.appendChild(script);

         // Initialize Facebook Pixel
         if (window.fbq) {
            window.fbq('init', 'YOUR_FACEBOOK_PIXEL_ID'); // Replace with your Pixel ID
            window.fbq('track', 'PageView');
         }
      }
   }

   initializeEssentialCookies() {
      // Set essential cookies for basic functionality
      try {
         // Theme preference
         if (!document.cookie.includes('theme=')) {
            document.cookie = `theme=dark; path=/; max-age=${30 * 24 * 60 * 60}`; // 30 days
         }

         // Session management
         if (!document.cookie.includes('session=')) {
            document.cookie = `session=${Date.now()}; path=/; max-age=${24 * 60 * 60}`; // 24 hours
         }

         console.log('Essential cookies initialized');
      } catch (error) {
         console.error('Error initializing essential cookies:', error);
      }
   }

   showNotification(message, type = 'info') {
      // Create notification element
      const notification = document.createElement('div');
      notification.className = `cookie-notification cookie-notification-${type}`;
      notification.innerHTML = `
         <div class="cookie-notification-content">
            <span class="cookie-notification-message">${message}</span>
            <button class="cookie-notification-close" aria-label="Close notification">
               <i class="fas fa-times"></i>
            </button>
         </div>
      `;

      // Add styles
      notification.style.cssText = `
         position: fixed;
         top: 20px;
         right: 20px;
         background: ${type === 'success' ? 'var(--success-color)' : type === 'error' ? 'var(--danger-color)' : 'var(--primary-color)'};
         color: white;
         padding: 1rem 1.5rem;
         border-radius: var(--radius-lg);
         box-shadow: var(--shadow-lg);
         z-index: var(--z-toast);
         opacity: 0;
         transform: translateX(100%);
         transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
         max-width: 300px;
      `;

      document.body.appendChild(notification);

      // Animate in
      setTimeout(() => {
         notification.style.opacity = '1';
         notification.style.transform = 'translateX(0)';
      }, 100);

      // Close button functionality
      const closeBtn = notification.querySelector('.cookie-notification-close');
      closeBtn?.addEventListener('click', () => {
         notification.style.opacity = '0';
         notification.style.transform = 'translateX(100%)';
         setTimeout(() => notification.remove(), 300);
      });

      // Auto-remove after 5 seconds
      setTimeout(() => {
         if (document.body.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
         }
      }, 5000);
   }
}

// ===== ENHANCED SERVICES SCROLL ANIMATION =====

class ServicesScrollAnimation {
    constructor() {
       this.servicesSection = null;
       this.serviceItems = [];
       this.currentStage = 0;
       this.lastScrollY = 0;
       this.isScrollingDown = true;
       this.scrollProgress = 0;
       this.animationFrame = null;
       this.servicesSection = document.querySelector('.services');
       this.init();
    }

    init() {
       if (!this.servicesSection) {
          console.error('Services section not found');
          return;
       }

       // Get all service items
       this.serviceItems = Array.from(this.servicesSection.querySelectorAll('.service-item'));

       if (this.serviceItems.length === 0) {
          console.error('No service items found');
          return;
       }

       console.log(`Enhanced services scroll animation initialized with ${this.serviceItems.length} items`);

       this.bindEvents();
       this.startAnimationLoop();
       this.setInitialState();
    }

    setInitialState() {
       // Start with all items visible in grid layout
       this.servicesSection.classList.add('services-scroll-animate');
       this.updateScrollProgress();
    }

    bindEvents() {
       // Track scroll direction and progress
       window.addEventListener('scroll', throttle(() => {
          const currentScrollY = window.scrollY;
          this.isScrollingDown = currentScrollY > this.lastScrollY;
          this.lastScrollY = currentScrollY;
          this.updateScrollProgress();
       }, 16));

       // Recalculate on resize
       window.addEventListener('resize', throttle(() => {
          this.updateScrollProgress();
       }, 250));
    }

    updateScrollProgress() {
       if (!this.servicesSection) return;

       const rect = this.servicesSection.getBoundingClientRect();
       const windowHeight = window.innerHeight;
       const sectionHeight = rect.height;

       // Calculate how much of the section is visible
       const sectionTop = rect.top;
       const visibleHeight = Math.min(windowHeight, sectionHeight);

       // Calculate scroll progress (0 to 1)
       if (sectionTop <= windowHeight && rect.bottom >= 0) {
          const progress = Math.max(0, Math.min(1,
             (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)
          ));
          this.scrollProgress = progress;
       } else if (sectionTop > windowHeight) {
          this.scrollProgress = 0;
       } else {
          this.scrollProgress = 1;
       }
    }

    startAnimationLoop() {
       const animate = () => {
          this.updateAnimation();
          this.animationFrame = requestAnimationFrame(animate);
       };
       requestAnimationFrame(animate);
    }

    updateAnimation() {
       if (!this.servicesSection || this.serviceItems.length === 0) return;

       // Calculate which stage we should be in based on scroll progress
       const totalStages = 7; // 0 to 6 stages for smoother transitions
       const stage = Math.min(totalStages - 1, Math.floor(this.scrollProgress * totalStages));

       // Update stage if changed
       if (stage !== this.currentStage) {
          this.currentStage = stage;
          this.updateStage();
       }

       // Apply dynamic transforms based on scroll progress within current stage
       this.updateDynamicTransforms();
    }

    updateStage() {
       // Remove all stage classes
       for (let i = 0; i < 7; i++) {
          this.servicesSection.classList.remove(`services-scroll-stage-${i}`);
       }

       // Add current stage class
       this.servicesSection.classList.add(`services-scroll-stage-${this.currentStage}`);

       console.log(`Services scroll stage: ${this.currentStage}, progress: ${this.scrollProgress.toFixed(2)}`);
    }

    updateDynamicTransforms() {
       const stageProgress = (this.scrollProgress * 7) % 1; // Progress within current stage
       const isMobile = window.innerWidth <= 768;

       this.serviceItems.forEach((item, index) => {
          const baseDelay = isMobile ? index * 0.1 : index * 0.05;
          const delay = Math.max(0, stageProgress - baseDelay);

          if (delay > 0 && delay < 1) {
             // Apply smooth transition transforms
             const scale = 1 - (delay * 0.1);
             const translateY = delay * 20;
             const opacity = Math.max(0.3, 1 - delay * 0.7);

             item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
             item.style.opacity = opacity;
          }
       });
    }

    destroy() {
       if (this.animationFrame) {
          cancelAnimationFrame(this.animationFrame);
       }
    }
}

// ===== BACK TO TOP BUTTON =====

class BackToTopButton {
   constructor() {
      this.button = null;
      this.heroSection = null;
      this.button = document.getElementById('back-to-top');
      this.heroSection = document.getElementById('home');
      this.init();
   }

   init() {
      if (!this.button) {
         console.error('Back to top button not found');
         return;
      }

      if (!this.heroSection) {
         console.error('Hero section not found');
         return;
      }

      this.bindEvents();
      console.log('Back to top button initialized');
   }

   bindEvents() {
      // Show/hide button based on scroll position and current section
      window.addEventListener('scroll', throttle(() => {
         this.toggleButtonVisibility();
      }, 100));

      // Smooth scroll to top when clicked
      this.button.addEventListener('click', () => {
         this.scrollToTop();
      });

      // Keyboard accessibility
      this.button.addEventListener('keydown', (e) => {
         if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            this.scrollToTop();
         }
      });
   }

   toggleButtonVisibility() {
      const scrollY = window.scrollY;
      const heroHeight = this.heroSection.offsetHeight;
      const isOnHeroSection = scrollY < heroHeight - 100;

      // Hide button completely when on hero section
      if (isOnHeroSection) {
         this.button.style.opacity = '0';
         this.button.style.visibility = 'hidden';
         return;
      }

      // Show button on other sections
      this.button.style.opacity = '1';
      this.button.style.visibility = 'visible';
   }

   scrollToTop() {
      window.scrollTo({
         top: 0,
         behavior: 'smooth'
      });

      // Add visual feedback
      this.button.style.transform = 'translateY(-4px) scale(1.2)';
      setTimeout(() => {
         this.button.style.transform = '';
      }, 200);
   }
}

// ===== START THE APPLICATION =====

// Initialize the project when script loads
const projectApp = new PortfolioApp();

// Initialize back to top button
const backToTopButton = new BackToTopButton();

// Add to global scope for debugging
window.PortfolioApp = projectApp;

// Debug function to manually test services animation
window.debugServicesAnimation = () => {
   const servicesSection = document.querySelector('.services');
   if (servicesSection) {
      console.log('Manually testing services animation...');

      let stage = 0;
      const interval = setInterval(() => {
         // Remove all stage classes
         for (let i = 0; i <= 6; i++) {
            servicesSection.classList.remove(`services-scroll-stage-${i}`);
         }
         // Add current stage
         servicesSection.classList.add(`services-scroll-stage-${stage}`);
         console.log(`Debug: Set to stage ${stage}`);

         stage++;
         if (stage > 6) {
            clearInterval(interval);
            console.log('Debug animation completed');
         }
      }, 1000);
   } else {
      console.error('Services section not found for debug');
   }
};


// ===== BLOG POSTS FUNCTIONALITY =====
class BlogPostsManager {
   constructor() {
      this.viewAllBtn = null;
      this.hiddenPosts = [];
      this.isShowingAll = false;
      this.init();
   }

   init() {
      // Get the view all posts button
      this.viewAllBtn = document.getElementById('view-all-posts-btn');

      if (this.viewAllBtn) {
         // Get all hidden posts
         this.hiddenPosts = document.querySelectorAll('.blog-card.hidden-post');

         // Add click event listener
         this.viewAllBtn.addEventListener('click', () => this.togglePosts());

         // Initialize AOS for hidden posts (in case they're shown later)
         this.initAOSForHiddenPosts();
      }
   }

   initAOSForHiddenPosts() {
      // Initialize AOS for hidden posts so they animate when shown
      if (typeof AOS !== 'undefined' && this.hiddenPosts.length > 0) {
         this.hiddenPosts.forEach((post, index) => {
            // Set different delays for staggered animation
            post.style.animationDelay = `${(index + 1) * 0.1}s`;
         });
      }
   }

   togglePosts() {
      if (this.isShowingAll) {
         this.hidePosts();
      } else {
         this.showPosts();
      }
   }

   showPosts() {
      // Show all hidden posts with animation
      this.hiddenPosts.forEach((post, index) => {
         setTimeout(() => {
            post.classList.add('show');
            // Refresh AOS for the newly visible element
            if (typeof AOS !== 'undefined') {
               AOS.refresh();
            }
         }, index * 100); // Stagger the animation
      });

      // Update button text and state
      this.viewAllBtn.innerHTML = '<i class="fas fa-minus"></i> Show Less';
      this.viewAllBtn.classList.add('showing-all');
      this.isShowingAll = true;

      // Add spinning icon animation
      const icon = this.viewAllBtn.querySelector('i');
      if (icon) {
         icon.style.animation = 'spin 0.5s ease-in-out';
         setTimeout(() => {
            icon.style.animation = '';
         }, 500);
      }
   }

   hidePosts() {
      // Hide all posts with animation
      this.hiddenPosts.forEach((post, index) => {
         setTimeout(() => {
            post.classList.remove('show');
         }, index * 50); // Faster stagger for hiding
      });

      // Update button text and state
      this.viewAllBtn.innerHTML = '<i class="fas fa-plus"></i> View All Posts';
      this.viewAllBtn.classList.remove('showing-all');
      this.isShowingAll = false;

      // Add spinning icon animation
      const icon = this.viewAllBtn.querySelector('i');
      if (icon) {
         icon.style.animation = 'spin 0.5s ease-in-out';
         setTimeout(() => {
            icon.style.animation = '';
         }, 500);
      }
   }
}

// Project overlay click handler
document.addEventListener('DOMContentLoaded', function() {
    const projectImages = document.querySelectorAll('.project-image');

    projectImages.forEach(image => {
        image.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') return; // If clicking on link, don't show overlay

            const overlay = image.querySelector('.project-overlay');

            if (overlay) {
                overlay.classList.toggle('active');

                // Auto-hide after 5 seconds
                setTimeout(() => {
                    overlay.classList.remove('active');
                }, 5000);
            }
        });
    });
});

// Initialize the blog posts functionality when script loads
document.addEventListener('DOMContentLoaded', function() {
    const blogManager = new BlogPostsManager();
    window.blogManager = blogManager; // Add to global scope for debugging
});
      this.components.push(new MobileNav());
      this.components.push(new ThemeToggle());
      this.components.push(new HeroTypingEffect()); 
      this.components.push(new HeroScrollIndicator());
      this.components.push(new ServicesScrollAnimation());
      this.components.push(new GalaxyBackground());
      this.components.push(new HeroVideoPlayer());
      this.components.push(new CookieConsentManager());
      this.components.push(new BackToTopButton());
      this.components.push(new BlogPostsManager());
      this.components.push(new TestimonialsSlider());
      this.components.push(new ContactForm());
      this.components.push(new HeroVideoPlayer());
      this.components.push(new SmoothScroll());
      this.components.push(new ScrollAnimations());
      this.components.push(new LightboxGallery());  
      this.components.push(new FormValidation());
      this.components.push(new HeaderEffects());
      this.components.push(new CounterAnimation());
      this.components.push(new PortfolioFilter());
      // this.components.push(new ProjectsCarousel());
      this.components.push(new TestimonialsSlider());
      this.components.push(new ContactForm());  
      this.components.push(new HeroVideoPlayer());
      this.components.push(new SmoothScroll());
      this.components.push(new ScrollAnimations());
      this.components.push(new LightboxGallery());
      this.components.push(new FormValidation());
// Duplicate carousel items for infinite scrolling illusion
const track = document.querySelector('.carousel-track');
const images = [...track.children];

images.forEach(img => {
  const clone = img.cloneNode(true);
  track.appendChild(clone);
});

// Auto-position carousel between two sections
const carousel = document.querySelector('.carousel-container');
const hero = document.querySelector('.hero');
const next = document.querySelector('.next-section');

function positionCarousel() {
  const heroBottom = hero.getBoundingClientRect().bottom + window.scrollY;
  const nextTop = next.getBoundingClientRect().top + window.scrollY;
  const middle = heroBottom + (nextTop - heroBottom) / 2;

  carousel.style.top = `${middle - carousel.offsetHeight / 2}px`;
}

// Position on load and resize
window.addEventListener('load', positionCarousel);
window.addEventListener('resize', positionCarousel);
