// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
  initYear();
  initDonateWidget();
  initForms();
  initSmoothScroll();
  initNavigation();
  initCounterAnimation();
  initScrollToTop();
  initFancybox();
});

// Set current year in footer
function initYear() {
  const yearElement = document.getElementById('year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

// Donate Widget functionality
function initDonateWidget() {
  // Toggle between one-time and monthly
  const toggleButtons = document.querySelectorAll('.toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', function() {
      toggleButtons.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  // Amount chips
  const chips = document.querySelectorAll('.chip');
  const customAmountInput = document.querySelector('.donate-widget__input');
  const customAmountField = customAmountInput?.querySelector('input');

  chips.forEach(chip => {
    chip.addEventListener('click', function() {
      const amount = this.dataset.amount;
      
      if (amount === 'other') {
        // Show custom amount input
        if (customAmountInput) {
          customAmountInput.style.display = 'block';
          if (customAmountField) {
            customAmountField.focus();
          }
        }
        // Remove active from other chips
        chips.forEach(c => {
          if (c !== this) c.classList.remove('active');
        });
        this.classList.add('active');
      } else {
        // Hide custom amount input
        if (customAmountInput) {
          customAmountInput.style.display = 'none';
        }
        // Toggle active state
        chips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Donate button click
  const donateButtons = document.querySelectorAll('[data-action="donate"]');
  donateButtons.forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.preventDefault();
      const donateSection = document.getElementById('donate');
      if (donateSection) {
        donateSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // Donate widget submit
  const donateSubmit = document.querySelector('.donate-widget__submit');
  if (donateSubmit) {
    donateSubmit.addEventListener('click', function() {
      const activeChip = document.querySelector('.chip.active');
      let amount = null;

      if (activeChip) {
        const chipAmount = activeChip.dataset.amount;
        if (chipAmount === 'other') {
          amount = customAmountField?.value;
        } else {
          amount = chipAmount;
        }
      }

      if (!amount || amount <= 0) {
        alert('Будь ласка, оберіть або введіть суму донату');
        return;
      }

      if (activeChip && activeChip.dataset.amount === 'other' && amount < 10) {
        alert('Мінімальна сума донату — 10 грн');
        return;
      }

      // Placeholder: In real implementation, this would redirect to payment gateway
      alert(`Дякуємо! Ви обрали донат на суму ${amount} грн. Наразі це плейсхолдер. У реальному проекті тут буде перенаправлення на платіжну систему.`);
    });
  }
}

// Form handling
function initForms() {
  // Contact form
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit(this, 'contact');
    });
  }

  // Partner form
  const partnerForm = document.getElementById('partnerForm');
  if (partnerForm) {
    partnerForm.addEventListener('submit', function(e) {
      e.preventDefault();
      handleFormSubmit(this, 'partner');
    });
  }
}

function handleFormSubmit(form, formType) {
  // Get form data
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());

  // Hide previous alerts
  const alerts = form.querySelectorAll('.alert');
  alerts.forEach(alert => {
    alert.style.display = 'none';
  });

  // Validate required fields
  const requiredFields = form.querySelectorAll('[required]');
  let isValid = true;

  requiredFields.forEach(field => {
    if (field.type === 'checkbox' && !field.checked) {
      isValid = false;
      field.focus();
    } else if (field.type !== 'checkbox' && !field.value.trim()) {
      isValid = false;
      field.focus();
    }
  });

  if (!isValid) {
    showAlert(form, 'danger', 'Будь ласка, заповніть всі обов\'язкові поля');
    return;
  }

  // Simulate form submission
  // In real implementation, this would send data to server
  setTimeout(() => {
    showAlert(form, 'success', 'Дякуємо! Ваше повідомлення надіслано. Ми зв\'яжемося з вами найближчим часом.');
    form.reset();
    
    // Scroll to success message
    const successAlert = form.querySelector('.alert--success');
    if (successAlert) {
      successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, 500);
}

function showAlert(form, type, message) {
  const alert = form.querySelector(`.alert--${type}`);
  if (alert) {
    alert.textContent = message;
    alert.style.display = 'block';
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      alert.style.display = 'none';
    }, 5000);
  }
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#' || href === '#top') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerOffset = 80;
        const elementPosition = target.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Navigation highlight on scroll
function initNavigation() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav a');

  if (sections.length === 0 || navLinks.length === 0) return;

  function highlightNav() {
    let current = '';
    const scrollY = window.pageYOffset;
    const headerHeight = document.querySelector('.header').offsetHeight;

    sections.forEach(section => {
      const sectionTop = section.offsetTop - headerHeight - 100;
      const sectionHeight = section.offsetHeight;
      
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', highlightNav);
  highlightNav(); // Initial call
}

// Header scroll effect
let lastScroll = 0;
const header = document.querySelector('.header');

if (header) {
  window.addEventListener('scroll', function() {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    } else {
      header.style.boxShadow = 'none';
    }
    
    lastScroll = currentScroll;
  });
}

// Image error handling - show placeholder if image fails to load
document.querySelectorAll('img').forEach(img => {
  img.addEventListener('error', function() {
    // Create a placeholder div if image fails
    const placeholder = document.createElement('div');
    placeholder.style.width = '100%';
    placeholder.style.height = '100%';
    placeholder.style.backgroundColor = '#E5E7EB';
    placeholder.style.display = 'flex';
    placeholder.style.alignItems = 'center';
    placeholder.style.justifyContent = 'center';
    placeholder.style.color = '#6B7280';
    placeholder.style.fontSize = '14px';
    placeholder.textContent = 'Зображення';
    
    if (this.parentElement) {
      this.parentElement.replaceChild(placeholder, this);
    }
  });
});

// Progress bar animation on scroll
const observerOptions = {
  threshold: 0.5,
  rootMargin: '0px'
};

const progressObserver = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const progressBar = entry.target.querySelector('.progress__bar');
      if (progressBar) {
        const width = progressBar.style.width;
        progressBar.style.width = '0%';
        setTimeout(() => {
          progressBar.style.width = width;
        }, 100);
      }
    }
  });
}, observerOptions);

document.querySelectorAll('.progress').forEach(progress => {
  progressObserver.observe(progress.closest('.card'));
});

// Counter Animation for Statistics
function initCounterAnimation() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  
  if (statNumbers.length === 0) return;

  const animateCounter = (element) => {
    const target = parseInt(element.getAttribute('data-target'));
    const suffix = element.getAttribute('data-suffix') || '';
    const duration = 4000; // 4 seconds
    const steps = 120;
    const increment = target / steps;
    let current = 0;
    let step = 0;

    const updateCounter = () => {
      step++;
      current = Math.min(Math.floor(increment * step), target);
      
      // Format number with spaces for thousands
      let formatted = current.toString();
      if (current >= 1000) {
        formatted = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
      }
      
      element.textContent = formatted + suffix;

      if (step < steps) {
        requestAnimationFrame(updateCounter);
      } else {
        // Ensure final value is set
        let finalFormatted = target.toString();
        if (target >= 1000) {
          finalFormatted = target.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
        }
        element.textContent = finalFormatted + suffix;
      }
    };

    updateCounter();
  };

  // Use Intersection Observer to trigger animation when section is visible
  const statsSection = document.querySelector('.stats-section');
  if (!statsSection) return;

  const observerOptions = {
    threshold: 0.5,
    rootMargin: '0px'
  };

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        statNumbers.forEach(stat => {
          if (!stat.classList.contains('animated')) {
            stat.classList.add('animated');
            animateCounter(stat);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  statsObserver.observe(statsSection);
}

// Timeline Highlight on Scroll
function initTimelineHighlight() {
  const timelineDots = document.querySelectorAll('.timeline-dot[data-section]');
  const historySections = document.querySelectorAll('.history-year[id]');
  
  if (timelineDots.length === 0 || historySections.length === 0) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px 0px -50% 0px'
  };

  const timelineObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.getAttribute('id');
        
        // Remove active class from all dots
        timelineDots.forEach(dot => {
          dot.classList.remove('active');
        });
        
        // Add active class to corresponding dot
        const correspondingDot = document.querySelector(`.timeline-dot[data-section="${sectionId}"]`);
        if (correspondingDot) {
          correspondingDot.classList.add('active');
        }
      }
    });
  }, observerOptions);

  // Observe all history sections
  historySections.forEach(section => {
    timelineObserver.observe(section);
  });

  // Click handler for timeline dots
  timelineDots.forEach(dot => {
    dot.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      const targetSection = document.getElementById(sectionId);
      
      if (targetSection) {
        const headerOffset = 100;
        const elementPosition = targetSection.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Scroll to Top Button
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;

  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  });

  btn.addEventListener('click', function() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Fancybox initialization
function initFancybox() {
  if (typeof Fancybox === 'undefined') return;

  Fancybox.bind('[data-fancybox]', {
    animated: true,
    showClass: 'fancybox-fadeIn',
    hideClass: 'fancybox-fadeOut',
    dragToClose: false,
    Toolbar: {
      display: {
        left: ['infobar'],
        middle: [],
        right: ['close'],
      },
    },
    Images: {
      zoom: true,
    },
    Thumbs: {
      type: 'classic',
    },
  });
}

// Initialize timeline if on about page
if (document.querySelector('.history-timeline')) {
  document.addEventListener('DOMContentLoaded', function() {
    initTimelineHighlight();
  });
}

