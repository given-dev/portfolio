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
      const target = document.querySelector(this.getAttribute('href'));
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

  const responses = {
    greeting: `Hey there! Welcome to Given's portfolio. How can I help you? You can ask about his <strong>skills</strong>, <strong>projects</strong>, <strong>experience</strong>, <strong>blog</strong>, or <strong>contact</strong> info.`,

    blog: `Given has written a few blog posts:
      <ul>
        <li><strong>Why I Started With Vanilla JS Before Frameworks</strong> — Why learning fundamentals first matters</li>
        <li><strong>How My MTN Internship Changed How I See Technology</strong> — Lessons from real-world enterprise systems</li>
        <li><strong>Building Campus Express: From Idea to Working Prototype</strong> — The story behind the food marketplace project</li>
      </ul>
      Check them out in the <a href="#blog" style="color:var(--color-primary);text-decoration:underline;">Blog section</a> above!`,

    skills: `Given's technical skills include:
      <ul>
        <li><strong>Frontend:</strong> HTML5, CSS3, JavaScript</li>
        <li><strong>Backend:</strong> PHP, Node.js, Express</li>
        <li><strong>Databases:</strong> MySQL, PostgreSQL, Oracle</li>
        <li><strong>Analysis:</strong> ERD, DFD, UML, BPMN</li>
        <li><strong>Networking:</strong> TCP/IP, DNS, DHCP, Linux</li>
        <li><strong>Tools:</strong> Git, GitHub, VS Code, Figma, Postman</li>
      </ul>`,

    projects: `Given has built several projects:
      <ul>
        <li><a href="project-1.html" target="_blank" style="color:var(--color-primary);text-decoration:underline;">Campus Express</a> — A campus food marketplace connecting students with vendors (HTML, CSS, JS, PHP)</li>
        <li><a href="project-2.html" target="_blank" style="color:var(--color-primary);text-decoration:underline;">LAPOK Ventures</a> — Digital platform for Coca-Cola bulk distribution (HTML, CSS, JS)</li>
        <li><a href="project-3.html" target="_blank" style="color:var(--color-primary);text-decoration:underline;">Sports/Match Platform</a> — Football data and match information web app (HTML, CSS, JS, REST API)</li>
        <li><a href="project-4.html" target="_blank" style="color:var(--color-primary);text-decoration:underline;">Inventory Management System</a> — Business system for managing products, stock, and alerts (PHP, MySQL)</li>
      </ul>`,

    experience: `Given completed an internship at <strong>MTN Uganda</strong>, where he gained hands-on experience in:
      <ul>
        <li>Customer Service & Business Operations</li>
        <li>Enterprise Technology Environments</li>
        <li>Professional Teamwork & Communication</li>
        <li>How Systems Support Business Processes</li>
      </ul>
      He is also an ongoing Information Systems and Technology student.`,

    contact: `You can reach Given through:
      <ul>
        <li><strong>Email:</strong> giventuhaise12@gmail.com</li>
        <li><strong>GitHub:</strong> github.com/given-div</li>
        <li><strong>LinkedIn:</strong> linkedin.com/in/given-tuhaise</li>
        <li><strong>WhatsApp:</strong> +256 760 931 135</li>
      </ul>`,

    about: `Given is an Information Systems student and aspiring software developer. He's passionate about turning ideas, business challenges, and everyday problems into practical digital solutions. He thinks beyond code — caring about the problem, users, business processes, and real-world impact.`,

    education: `Given is currently studying <strong>Information Systems and Technology</strong>. His coursework covers software development, database systems, systems analysis & design, and networking.`,

    hiring: `Given is available for opportunities! You can reach him at <strong>giventuhaise12@gmail.com</strong> or through his LinkedIn profile.`,

    default: `I'm not sure about that one. Let me connect you with Given directly on WhatsApp so he can help you right away!
      <br><br>
      <a href="https://wa.me/256760931135?text=Hi%20Given%2C%20I%20have%20a%20question%20about%20your%20portfolio." target="_blank" style="display:inline-block;padding:8px 16px;background:#25d366;color:#fff;border-radius:8px;text-decoration:none;font-weight:600;font-size:0.85rem;">Chat on WhatsApp <i class="fas fa-arrow-right" style="margin-left:4px;"></i></a>`
  };

  const keywords = {
    greeting: ['hey', 'hi', 'hello', 'yo', 'sup', 'howdy', 'greetings', 'good morning', 'good afternoon', 'good evening', 'what\'s up', 'whats up'],
    skills: ['skill', 'skills', 'technology', 'tech', 'stack', 'know', 'knows', 'can do', 'tools', 'programming', 'languages', 'frameworks', 'abilities', 'proficient', 'expertise'],
    projects: ['project', 'projects', 'portfolio', 'work', 'built', 'created', 'apps', 'applications', 'websites', 'done', 'made'],
    blog: ['blog', 'article', 'articles', 'posts', 'post', 'wrote', 'writing', 'thoughts', 'read'],
    experience: ['experience', 'internship', 'intern', 'work history', 'job', 'career', 'working', 'worked', 'background'],
    contact: ['contact', 'email', 'reach', 'phone', 'whatsapp', 'linkedin', 'github', 'get in touch', 'hire', 'get given', 'connect', 'talk', 'speak', 'message', 'reach him', 'reach out', 'how can i', 'where can i', 'find him'],
    about: ['about', 'who', 'tell me about', 'background', 'bio', 'introduction', 'himself', 'yourself', 'describe'],
    education: ['education', 'study', 'studying', 'student', 'university', 'college', 'school', 'degree', 'course', 'learning', 'studied'],
    hiring: ['hire', 'hiring', 'available', 'opportunity', 'opportunities', 'looking for', 'job', 'employ', 'recruit', 'freelance', 'contract']
  };

  function matchTopic(input) {
    const lower = input.toLowerCase();
    for (const [topic, words] of Object.entries(keywords)) {
      if (words.some(w => lower.includes(w))) return topic;
    }
    return 'default';
  }

  function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.className = `chatbot-message ${sender}`;
    const avatarLabel = sender === 'bot' ? 'G.' : 'You';
    msg.innerHTML = `
      <div class="chatbot-message-avatar"><span>${avatarLabel}</span></div>
      <div class="chatbot-message-content"><p>${text}</p></div>
    `;
    chatbotMessages.appendChild(msg);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  function handleUserMessage(text) {
    if (!text.trim()) return;
    addMessage(text, 'user');
    chatbotInput.value = '';

    const topic = matchTopic(text);
    setTimeout(() => {
      addMessage(responses[topic], 'bot');
    }, 400);
  }

  chatbotToggle.addEventListener('click', () => {
    chatbot.classList.toggle('open');
    if (chatbot.classList.contains('open')) {
      setTimeout(() => chatbotInput.focus(), 300);
    }
  });

  chatbotClose.addEventListener('click', () => {
    chatbot.classList.remove('open');
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
    }
  });
});
