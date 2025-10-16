// ===== TYPESCRIPT INTERACTIVE FEATURES =====

// Declare global AOS library
declare const AOS: {
  init: (config?: any) => void;
};

// Interface definitions for better type safety
interface PortfolioItem {
  element: HTMLElement;
  category: string;
}

interface TestimonialItem {
  element: HTMLElement;
  content: HTMLElement;
}

interface AnimationConfig {
  threshold: number;
  rootMargin: string;
}

// ===== UTILITY FUNCTIONS =====

/**
 * Debounce function to limit function calls
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
  immediate?: boolean
): (...args: Parameters<T>) => void {
  let timeout: number | null = null;
  
  return function executedFunction(...args: Parameters<T>) {
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
function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  
  return function executedFunction(...args: Parameters<T>) {
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
function isInViewport(element: Element, threshold: number = 0): boolean {
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
function animateOnScroll(element: Element, animationType: string = 'fade-up'): void {
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

// ===== THEME MANAGEMENT =====

class ThemeManager {
  private currentTheme: string = 'light';
  private themeToggle: HTMLElement | null = null;
  
  constructor() {
    this.init();
  }
  
  private init(): void {
    this.themeToggle = document.getElementById('theme-toggle');
    this.currentTheme = localStorage.getItem('theme') || 'light';
    
    this.applyTheme(this.currentTheme);
    this.bindEvents();
  }
  
  private bindEvents(): void {
    if (this.themeToggle) {
      this.themeToggle.addEventListener('click', () => this.toggleTheme());
    }
    
    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        this.applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }
  
  private toggleTheme(): void {
    this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
    this.applyTheme(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }
  
  private applyTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme = theme;
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#111827' : '#ffffff');
    }
  }
  
  public getCurrentTheme(): string {
    return this.currentTheme;
  }
}

// ===== MOBILE NAVIGATION =====

class MobileNavigation {
  private menuToggle: HTMLElement | null = null;
  private navbarMenu: HTMLElement | null = null;
  private isOpen: boolean = false;
  
  constructor() {
    this.menuToggle = document.getElementById('menu-toggle');
    this.navbarMenu = document.getElementById('navbar-menu');
    this.init();
  }
  
  private init(): void {
    this.bindEvents();
  }
  
  private bindEvents(): void {
    if (this.menuToggle) {
      this.menuToggle.addEventListener('click', () => this.toggleMenu());
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isOpen && !this.navbarMenu?.contains(e.target as Node) && !this.menuToggle?.contains(e.target as Node)) {
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
  
  private toggleMenu(): void {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }
  
  private openMenu(): void {
    if (this.navbarMenu && this.menuToggle) {
      this.navbarMenu.classList.add('active');
      this.menuToggle.classList.add('active');
      document.body.style.overflow = 'hidden';
      this.isOpen = true;
      
      // Animate hamburger lines
      const lines = this.menuToggle.querySelectorAll('.hamburger-line');
      lines.forEach((line, index) => {
        const lineElement = line as HTMLElement;
        if (index === 0) lineElement.style.transform = 'rotate(45deg) translate(5px, 5px)';
        if (index === 1) lineElement.style.opacity = '0';
        if (index === 2) lineElement.style.transform = 'rotate(-45deg) translate(7px, -6px)';
      });
    }
  }
  
  private closeMenu(): void {
    if (this.navbarMenu && this.menuToggle) {
      this.navbarMenu.classList.remove('active');
      this.menuToggle.classList.remove('active');
      document.body.style.overflow = '';
      this.isOpen = false;
      
      // Reset hamburger lines
      const lines = this.menuToggle.querySelectorAll('.hamburger-line');
      lines.forEach(line => {
        const lineElement = line as HTMLElement;
        lineElement.style.transform = '';
        lineElement.style.opacity = '';
      });
    }
  }
}

// ===== SMOOTH SCROLLING =====

class SmoothScrolling {
  private headerHeight: number = 80;
  
  constructor() {
    this.init();
  }
  
  private init(): void {
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
  
  private scrollToElement(selector: string): void {
    const targetElement = document.querySelector(selector) as HTMLElement;
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
  private header: HTMLElement | null = null;
  private lastScrollY: number = 0;
  
  constructor() {
    this.header = document.getElementById('header');
    this.init();
  }
  
  private init(): void {
    window.addEventListener('scroll', throttle(() => {
      this.updateHeaderOnScroll();
    }, 16));
  }
  
  private updateHeaderOnScroll(): void {
    if (!this.header) return;
    
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class
    if (currentScrollY > 100) {
      this.header.classList.add('scrolled');
    } else {
      this.header.classList.remove('scrolled');
    }
    
    // Hide/show header on scroll
    if (currentScrollY > this.lastScrollY && currentScrollY > 200) {
      this.header.style.transform = 'translateY(-100%)';
    } else {
      this.header.style.transform = 'translateY(0)';
    }
    
    this.lastScrollY = currentScrollY;
  }
}

// ===== ANIMATED COUNTERS =====

class CounterAnimation {
  private counters: NodeListOf<Element> | null = null;
  private hasAnimated: boolean = false;
  
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }
  
  private init(): void {
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
  
  private animateCounters(): void {
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
  private filterButtons: NodeListOf<Element> | null = null;
  private portfolioItems: PortfolioItem[] = [];
  private currentFilter: string = 'all';
  
  constructor() {
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.init();
  }
  
  private init(): void {
    // Get portfolio items
    const items = document.querySelectorAll('.portfolio-item');
    items.forEach(item => {
      this.portfolioItems.push({
        element: item as HTMLElement,
        category: item.getAttribute('data-category') || 'all'
      });
    });
    
    this.bindEvents();
  }
  
  private bindEvents(): void {
    this.filterButtons?.forEach(button => {
      button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter') || 'all';
        this.filterItems(filter);
      });
    });
  }
  
  private filterItems(filter: string): void {
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
    this.portfolioItems.forEach((item, index) => {
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

// ===== TESTIMONIALS CAROUSEL =====

class TestimonialsCarousel {
  private carousel: HTMLElement | null = null;
  private items: TestimonialItem[] = [];
  private currentIndex: number = 0;
  private autoplayInterval: number | null = null;
  private isPlaying: boolean = true;
  
  constructor() {
    this.carousel = document.querySelector('.testimonials-carousel');
    this.init();
  }
  
  private init(): void {
    const items = document.querySelectorAll('.testimonial-item');
    items.forEach((item, index) => {
      this.items.push({
        element: item as HTMLElement,
        content: item.querySelector('.testimonial-content') as HTMLElement
      });
      
      if (index === 0) {
        item.classList.add('active');
      }
    });
    
    this.bindEvents();
    this.startAutoplay();
  }
  
  private bindEvents(): void {
    // Navigation buttons
    const prevBtn = document.getElementById('testimonial-prev');
    const nextBtn = document.getElementById('testimonial-next');
    
    prevBtn?.addEventListener('click', () => {
      this.stopAutoplay();
      this.previousSlide();
      this.startAutoplay();
    });
    
    nextBtn?.addEventListener('click', () => {
      this.stopAutoplay();
      this.nextSlide();
      this.startAutoplay();
    });
    
    // Dots navigation
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        this.stopAutoplay();
        this.goToSlide(index);
        this.startAutoplay();
      });
    });
    
    // Pause on hover
    this.carousel?.addEventListener('mouseenter', () => this.stopAutoplay());
    this.carousel?.addEventListener('mouseleave', () => this.startAutoplay());
  }
  
  private nextSlide(): void {
    this.goToSlide((this.currentIndex + 1) % this.items.length);
  }
  
  private previousSlide(): void {
    this.goToSlide(this.currentIndex === 0 ? this.items.length - 1 : this.currentIndex - 1);
  }
  
  private goToSlide(index: number): void {
    if (index === this.currentIndex || index < 0 || index >= this.items.length) return;
    
    // Remove active class from current slide
    this.items[this.currentIndex].element.classList.remove('active');
    
    // Add active class to new slide
    this.currentIndex = index;
    this.items[this.currentIndex].element.classList.add('active');
    
    // Update dots
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentIndex);
    });
  }
  
  private startAutoplay(): void {
    if (this.autoplayInterval || !this.isPlaying) return;
    
    this.autoplayInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }
  
  private stopAutoplay(): void {
    if (this.autoplayInterval) {
      clearInterval(this.autoplayInterval);
      this.autoplayInterval = null;
    }
  }
}

// ===== CONTACT FORM =====

class ContactForm {
  private form: HTMLFormElement | null = null;
  private submitButton: HTMLElement | null = null;
  private messageElement: HTMLElement | null = null;
  
  constructor() {
    this.form = document.getElementById('contact-form') as HTMLFormElement;
    this.submitButton = this.form?.querySelector('.btn-text');
    this.messageElement = document.getElementById('form-message');
    this.init();
  }
  
  private init(): void {
    this.bindEvents();
  }
  
  private bindEvents(): void {
    this.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleSubmit();
    });
    
    // Real-time validation
    const inputs = this.form?.querySelectorAll('input, textarea');
    inputs?.forEach(input => {
      input.addEventListener('blur', () => this.validateField(input as HTMLInputElement));
      input.addEventListener('input', () => this.clearFieldError(input as HTMLInputElement));
    });
  }
  
  private async handleSubmit(): Promise<void> {
    if (!this.form || !this.submitButton) return;
    
    // Validate form
    if (!this.validateForm()) {
      this.showMessage('Please fill in all required fields correctly.', 'error');
      return;
    }
    
    // Show loading state
    this.setLoadingState(true);
    
    try {
      // Simulate API call
      await this.submitForm();
      
      // Show success message
      this.showMessage('Thank you! Your message has been sent successfully.', 'success');
      this.form.reset();
      
    } catch (error) {
      this.showMessage('Oops! Something went wrong. Please try again.', 'error');
    } finally {
      this.setLoadingState(false);
    }
  }
  
  private validateForm(): boolean {
    const requiredFields = this.form?.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields?.forEach(field => {
      const input = field as HTMLInputElement;
      if (!this.validateField(input)) {
        isValid = false;
      }
    });
    
    return isValid;
  }
  
  private validateField(field: HTMLInputElement): boolean {
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
  
  private showFieldError(field: HTMLInputElement, message: string): void {
    field.classList.add('error');
    
    // Remove existing error message
    const existingError = field.parentNode?.querySelector('.field-error');
    existingError?.remove();
    
    // Add new error message
    const errorElement = document.createElement('div');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.color = 'var(--danger-color)';
    errorElement.style.fontSize = 'var(--font-size-sm)';
    errorElement.style.marginTop = 'var(--space-1)';
    
    field.parentNode?.appendChild(errorElement);
  }
  
  private clearFieldError(field: HTMLInputElement): void {
    field.classList.remove('error');
    const errorElement = field.parentNode?.querySelector('.field-error');
    errorElement?.remove();
  }
  
  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      name: 'Name',
      email: 'Email',
      subject: 'Subject',
      message: 'Message'
    };
    
    return labels[fieldName] || fieldName;
  }
  
  private async submitForm(): Promise<void> {
    // Simulate API call delay
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simulate 90% success rate
        if (Math.random() > 0.1) {
          resolve();
        } else {
          reject(new Error('Network error'));
        }
      }, 1500);
    });
  }
  
  private setLoadingState(loading: boolean): void {
    if (!this.submitButton || !this.form) return;

    const btnText = this.submitButton.querySelector('.btn-text') as HTMLElement;
    const btnLoading = this.submitButton.querySelector('.btn-loading') as HTMLElement;

    if (loading) {
      if (btnText) btnText.style.display = 'none';
      if (btnLoading) btnLoading.style.display = 'flex';
      this.form.style.pointerEvents = 'none';
    } else {
      if (btnText) btnText.style.display = 'block';
      if (btnLoading) btnLoading.style.display = 'none';
      this.form.style.pointerEvents = 'auto';
    }
  }
  
  private showMessage(message: string, type: 'success' | 'error'): void {
    if (!this.messageElement) return;

    this.messageElement.textContent = message;
    this.messageElement.className = `form-message ${type}`;

    // Auto-hide after 5 seconds
    setTimeout(() => {
      if (this.messageElement) {
        this.messageElement.className = 'form-message';
      }
    }, 5000);
  }
}

// ===== PERFORMANCE OPTIMIZATIONS =====

class PerformanceOptimizer {
  constructor() {
    this.init();
  }
  
  private init(): void {
    // Lazy load images
    this.lazyLoadImages();
    
    // Optimize scroll events
    this.optimizeScrollEvents();
    
    // Preload critical resources
    this.preloadResources();
  }
  
  private lazyLoadImages(): void {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
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
  
  private optimizeScrollEvents(): void {
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
  
  private preloadResources(): void {
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
  private components: any[] = [];
  
  constructor() {
    this.init();
  }
  
  private async init(): Promise<void> {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.initializeComponents());
    } else {
      this.initializeComponents();
    }
  }
  
  private initializeComponents(): void {
    try {
      // Initialize all components
      this.components.push(new ThemeManager());
      this.components.push(new MobileNavigation());
      this.components.push(new SmoothScrolling());
      this.components.push(new HeaderEffects());
      this.components.push(new CounterAnimation());
      this.components.push(new PortfolioFilter());
      this.components.push(new TestimonialsCarousel());
      this.components.push(new ContactForm());
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
      console.error('Error initializing portfolio:', error);
    }
  }
}

// ===== START THE APPLICATION =====

// Initialize the portfolio when script loads
const portfolioApp = new PortfolioApp();

// Export for external use if needed
export { PortfolioApp };

// Add to global scope for debugging
(window as any).PortfolioApp = portfolioApp;