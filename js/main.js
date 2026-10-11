/* ============================================
   GIVEN PORTFOLIO - Interactive Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  // Theme Toggle
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  html.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
  }

  // Mobile Navigation Toggle
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });

  // Close mobile nav on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    });
  });

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    if (!navToggle.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });

  // Close mobile nav on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navLinks.classList.contains('active')) {
      navLinks.classList.remove('active');
      navToggle.classList.remove('active');
    }
  });

  // Navbar scroll effect
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    if (currentScroll > 50) {
      navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.06)';
    } else {
      navbar.style.boxShadow = 'none';
    }
    lastScroll = currentScroll;
  });

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      const target = href === '#' ? document.body : document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Project Filter
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 300);
        }
      });
    });
  });

  // Scroll Animations with Intersection Observer
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add fade-in class to animatable elements
  const animatableElements = [
    '.capability-card',
    '.project-card',
    '.stack-category',
    '.why-card',
    '.timeline-item',
    '.contact-card',
    '.vision-item',
    '.experiment-item',
    '.blog-card'
  ];

  animatableElements.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, index) => {
      el.classList.add('fade-in');
      el.style.transitionDelay = `${index * 0.05}s`;
      fadeObserver.observe(el);
    });
  });

  // Active nav link highlight on scroll
  const sections = document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      const sectionId = section.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        document.querySelectorAll('.nav-link').forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  });

  // Typing effect for hero title accent (optional enhancement)
  const heroAccent = document.querySelector('.hero-title-accent');
  if (heroAccent) {
    heroAccent.style.opacity = '1';
  }

  // Add nav-active style dynamically
  const style = document.createElement('style');
  style.textContent = `
    .nav-active {
      color: var(--color-primary) !important;
    }
    .nav-active::after {
      width: 100% !important;
    }
  `;
  document.head.appendChild(style);

  // ============================================
  // CHATBOT
  // ============================================
  const chatbot = document.getElementById('chatbot');
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotMessages = document.getElementById('chatbot-messages');
  const chatbotForm = document.getElementById('chatbot-form');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSuggestions = document.getElementById('chatbot-suggestions');

  // Project detail pages share this file but do not include a chat panel.
  if (!chatbot) return;

  const knowledge = PortfolioAssistant.fromPage(document);
  let previousTopic = null;

  function addMessage(content, sender) {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${sender}`;
    const avatar = document.createElement('div');
    avatar.className = 'chatbot-message-avatar';
    avatar.textContent = sender === 'bot' ? 'G.' : 'You';
    const body = document.createElement('div');
    body.className = 'chatbot-message-content';
    if (typeof content === 'string') {
      const paragraph = document.createElement('p');
      paragraph.textContent = content;
      body.appendChild(paragraph);
    } else {
      content.entries.forEach(entry => {
        const title = document.createElement('strong');
        title.textContent = entry.title;
        body.appendChild(title);
        entry.text.split('\n').forEach(line => {
          const paragraph = document.createElement('p');
          paragraph.textContent = line;
          body.appendChild(paragraph);
        });
        const source = document.createElement('a');
        source.href = entry.href;
        source.textContent = entry.source;
        source.className = 'chatbot-source';
        if (entry.href.endsWith('.pdf')) {
          source.target = '_blank';
          source.rel = 'noopener';
        }
        body.appendChild(source);
      });
    }
    msg.append(avatar, body);
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function handleUserMessage(text) {
    const message = text.trim().slice(0, 500);
    if (!message) return;
    addMessage(message, 'user');
    chatbotInput.value = '';
    const result = PortfolioAssistant.answer(message, knowledge, previousTopic);
    if (result.kind === 'answer') {
      previousTopic = result.entries[0].id;
      addMessage(result, 'bot');
    } else if (result.kind === 'greeting') {
      addMessage(result.text, 'bot');
    } else {
      addMessage("I couldn't find that information in Given's portfolio or CV. Try a specific project, education, skills or experience question, or contact Given for details.", 'bot');
      addMessage({ entries: [{title: 'Contact Given', text: 'For information not covered here, reach out directly.', href: '#contact', source: 'Open contact section'}] }, 'bot');
    }
  }

  chatbotToggle.addEventListener('click', () => {
    chatbot.classList.toggle('open');
    chatbotToggle.setAttribute('aria-expanded', String(chatbot.classList.contains('open')));
    if (chatbot.classList.contains('open')) {
      setTimeout(() => chatbotInput.focus(), 300);
    }
  });

  chatbotClose.addEventListener('click', () => {
    chatbot.classList.remove('open');
    chatbotToggle.setAttribute('aria-expanded', 'false');
    chatbotToggle.focus();
  });

  chatbotForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleUserMessage(chatbotInput.value);
  });

  chatbotSuggestions.querySelectorAll('.chatbot-suggestion').forEach(btn => {
    btn.addEventListener('click', () => {
      handleUserMessage(btn.dataset.question);
    });
  });

  // Close chatbot on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && chatbot.classList.contains('open')) {
      chatbot.classList.remove('open');
      chatbotToggle.setAttribute('aria-expanded', 'false');
      chatbotToggle.focus();
    }
  });
});
