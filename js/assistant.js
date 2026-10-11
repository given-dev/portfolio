/* Answers are retrieved from the page and CV facts; no model or API key is used. */
(function (root) {
  'use strict';

  const cvLink = 'documents/Tuhaise-Given-CV.pdf';
  const cvFacts = [
    { id: 'resume', title: 'Resume / CV', tags: ['cv', 'resume', 'curriculum vitae', 'download', 'qualification', 'qualifications'], text: 'Download or view Given\'s two-page CV for his professional profile, education, experience, projects, certifications and languages.', href: cvLink, source: 'View or download CV' },
    { id: 'education', title: 'Education', tags: ['education', 'study', 'studying', 'degree', 'university', 'college', 'school', 'kyambogo', 'kabalega', 'damian'], text: 'Given is studying for a Bachelor\'s Degree in Information Systems at Kyambogo University (2024 - Present). He attended Kabalega Secondary School for A Level (2022 - 2023) and Blessed Damian Secondary School for O Level (2017 - 2020).', href: cvLink, source: 'Source: CV' },
    { id: 'mtn', title: 'MTN Uganda internship', tags: ['mtn', 'internship', 'intern', 'customer', 'telecom', 'call centre', 'call center'], text: 'From June to August 2026, Given interned at MTN Uganda Headquarters\' Customer Experience Centre. He supported IT assistance, customer inquiries and problem-solving through the call centre, gaining exposure to mobile money, IT operations and customer systems.', href: cvLink, source: 'Source: CV' },
    { id: 'afriboards', title: 'Afriboards Consultant', tags: ['afriboards', 'frontend developer', 'software development experience'], text: 'From January to September 2026, Given worked in software development and frontend development at Afriboards Consultant. He designed and built Lapok DMS with role-based access, fleet and stock management, waybills, sales workflows and reporting dashboards.', href: cvLink, source: 'Source: CV' },
    { id: 'lapok-dms', title: 'Lapok DMS', tags: ['lapok', 'dms', 'distribution', 'coca cola', 'coca-cola', 'waybill', 'waybills', 'fleet', 'efris', 'edi'], text: 'The CV describes Lapok DMS as a distribution management system built for a Coca-Cola outlet, with role-based access, stock, fleet, waybills and sales workflows. Technologies listed are PHP/MySQL, Python/Flask and JavaScript. Given researched EDI/EFRIS integration; the CV does not say that integration was deployed.', href: cvLink, source: 'Source: CV' },
    { id: 'payments', title: 'Task-and-earning platform', tags: ['task', 'earning', 'payout', 'payouts', 'momo', 'airtel', 'payments', 'mobile money'], text: 'Given\'s CV describes a task-and-earning platform with mobile money payout integration using MTN MoMo and Airtel Money. It does not provide a public project link or further implementation details.', href: cvLink, source: 'Source: CV' },
    { id: 'certifications', title: 'Certifications', tags: ['certification', 'certifications', 'certificate', 'certificates', 'cisco', 'ccna', 'network security', 'data analytics'], text: 'The CV lists Introduction to Networking (Cisco), Data Analytics Essentials (Cisco) and Network Security (listed under CCNA). No credential IDs or completion dates are provided.', href: cvLink, source: 'Source: CV' },
    { id: 'languages', title: 'Spoken languages', tags: ['spoken', 'speak', 'language', 'languages', 'english', 'lunyoro', 'lugungu', 'luganda', 'lutoro', 'alur', 'swahili'], text: 'English: proficient. Lunyoro and Lugungu: excellent. Luganda, Lutoro and Alur: good. Swahili: fair.', href: cvLink, source: 'Source: CV' },
    { id: 'volunteer', title: 'Volunteer experience', tags: ['volunteer', 'volunteering', 'audit', 'auditing'], text: 'Given volunteered in system auditing at Lapok Ventures for one month in April, auditing a newly designed and implemented company system. The CV does not specify the year.', href: cvLink, source: 'Source: CV' },
    { id: 'cv-skills', title: 'Development and professional skills', tags: ['python', 'flask', 'cpanel', 'deployment', 'analysis', 'communication', 'teamwork'], text: 'The CV lists PHP/MySQL, Python/Flask, JavaScript, HTML and CSS, plus system analysis, integration research and deployment with cPanel, Linux and Git. Professional skills include data analysis, communication, customer service, teamwork, computer literacy and quick learning.', href: cvLink, source: 'Source: CV' },
    { id: 'availability', title: 'Career interests', tags: ['hire', 'hiring', 'available', 'availability', 'opportunity', 'opportunities', 'recruit', 'job', 'business analyst', 'location', 'based', 'kampala'], text: 'Given is based in Kampala, Uganda and is seeking an entry-level Business Analyst opportunity. Contact him to discuss roles or confirm current availability.', href: '#contact', source: 'Contact Given' }
  ];

  function normalize(value) {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function contains(query, phrase) {
    return (` ${query} `).includes(` ${normalize(phrase)} `);
  }

  function compact(element) {
    return element ? element.textContent.replace(/\s+/g, ' ').trim() : '';
  }

  // Read the current repository page so text changes do not leave stale answers.
  function fromPage(doc) {
    const records = cvFacts.map(item => ({ ...item }));
    const about = doc.querySelector('.about-content');
    if (about) records.push({ id: 'about', title: 'About Given', tags: ['about', 'who', 'bio', 'background', 'introduction'], text: compact(about), href: '#about', source: 'Source: About section' });

    const stack = doc.querySelectorAll('.stack-category');
    if (stack.length) records.push({ id: 'skills', title: 'Technical skills', tags: ['skill', 'skills', 'stack', 'tools', 'technology', 'technologies', 'programming', 'frameworks', 'coding'], text: Array.from(stack, compact).join('\n'), href: '#stack', source: 'Source: Technology stack' });

    const cards = Array.from(doc.querySelectorAll('.project-card'));
    cards.forEach((card, i) => {
      const title = compact(card.querySelector('.project-title'));
      const parts = [compact(card.querySelector('.project-tagline')), ...Array.from(card.querySelectorAll('.project-step'), compact), `Technologies: ${Array.from(card.querySelectorAll('.project-tech span'), compact).join(', ')}.`, compact(card.querySelector('.project-result'))];
      const aliases = [['campus', 'campusexpress', 'campus express', 'food', 'delivery'], ['lapok ventures', 'wholesale', 'catalog'], ['sport', 'sports', 'match', 'football', 'fixtures'], ['inventory', 'stock', 'alerts']];
      records.push({ id: `project-${i+1}`, title, tags: aliases[i] || [title], text: parts.filter(Boolean).join('\n'), href: card.querySelector('.project-link')?.getAttribute('href') || '#projects', source: 'Source: Project page' });
    });
    if (cards.length) records.push({ id: 'projects', title: 'Portfolio projects', tags: ['project', 'projects', 'portfolio', 'built', 'apps', 'applications', 'websites'], text: cards.map(card => `${compact(card.querySelector('.project-title'))}: ${compact(card.querySelector('.project-tagline'))}`).join('\n'), href: '#projects', source: 'Explore projects' });

    records.push({ id: 'experience', title: 'Work experience', tags: ['experience', 'work history', 'career', 'worked', 'employment'], text: 'Afriboards Consultant: software development / frontend development, January - September 2026. MTN Uganda Headquarters: Customer Experience Centre internship, June - August 2026. Volunteer system auditing at Lapok Ventures: April, one month (year not specified).', href: cvLink, source: 'Source: CV' });

    const contact = Array.from(doc.querySelectorAll('#contact .contact-card')).map(card => compact(card));
    records.push({ id: 'contact', title: 'Contact Given', tags: ['contact', 'email', 'phone', 'whatsapp', 'linkedin', 'github', 'reach', 'get in touch', 'connect'], text: `${contact.join('\n')}\nCV email: givenmicon@gmail.com. Repository: https://github.com/given-dev/portfolio`, href: '#contact', source: 'Contact links' });

    const blogs = Array.from(doc.querySelectorAll('.blog-card h3'), compact);
    if (blogs.length) records.push({ id: 'blog', title: 'Portfolio blog', tags: ['blog', 'article', 'articles', 'posts', 'writing'], text: `The portfolio lists these article titles:\n${blogs.join('\n')}\nFull article text is not included in this repository.`, href: '#blog', source: 'Source: Blog section' });
    return records;
  }

  function answer(input, records, previousId) {
    const query = normalize(input);
    if (!query) return { kind: 'empty', entries: [] };
    if (/^(hi|hey|hello|yo|good morning|good afternoon|good evening|thanks|thank you)$/.test(query)) {
      return { kind: 'greeting', text: 'Hello! Ask about Given\'s projects, experience, skills, education, certifications or CV.', entries: [] };
    }
    if (/\b(salary|salary expectation|date of birth|birthday|age|married|address|gpa|grade|grades)\b/.test(query)) {
      return { kind: 'unknown', entries: [] };
    }
    if (/^(more|tell me more|more details|what else|and more)$/.test(query) && previousId) {
      const previous = records.find(item => item.id === previousId);
      if (previous) return { kind: 'answer', entries: [previous] };
    }

    const tokens = query.split(' ').filter(word => word.length > 2 && !['what','which','where','when','does','your','given','tell','about','please','this','that','with','have','from','their','his','her','the','and','can','you','are','how','for','me'].includes(word));
    const scored = records.map(item => {
      const tagMatches = item.tags.filter(tag => contains(query, tag));
      let score = tagMatches.reduce((sum, tag) => sum + 8 + normalize(tag).split(' ').length*2, 0);
      const title = normalize(item.title);
      if (contains(query, title)) score += 15;
      for (const token of tokens) {
        if (contains(title, token)) score += 3;
        if (contains(normalize(item.text), token)) score += 1;
      }
      return { item, score, direct: tagMatches.length > 0 || contains(query, title) };
    }).filter(result => result.direct || result.score >= 4).sort((a,b) => b.score-a.score);

    // Explicit CV, contact and spoken/programming language intents beat broad keywords.
    let primaryId = null;
    if (/\b(cv|resume|curriculum vitae)\b/.test(query) && !/\b(experience|education|certifications|skills|projects)\b/.test(query)) primaryId = 'resume';
    if (/\b(programming|coding) languages?\b/.test(query)) primaryId = 'skills';
    if (/\b(spoken|speak|speaks)\b/.test(query)) primaryId = 'languages';
    if (/\b(email|phone|contact|whatsapp|linkedin|github)\b/.test(query)) primaryId = 'contact';
    // Named employers and CV-only subjects should not be displaced by summaries.
    if (!primaryId) {
      const named = [
        ['afriboards', ['afriboards']],
        ['payments', ['momo', 'airtel', 'payout', 'payouts', 'task and earning']],
        ['mtn', ['mtn', 'internship', 'intern']],
        ['lapok-dms', ['dms', 'efris', 'edi', 'fleet', 'waybills']],
        ['education', ['kyambogo', 'kabalega', 'damian']],
        ['certifications', ['cisco', 'ccna', 'certifications', 'certificates']],
        ['volunteer', ['volunteer', 'auditing', 'audit']]
      ].find(([, phrases]) => phrases.some(phrase => contains(query, phrase)));
      if (named) primaryId = named[0];
    }
    const primary = primaryId && records.find(item => item.id === primaryId);
    if (primary) return { kind: 'answer', entries: [primary] };
    if (!scored.length) return { kind: 'unknown', entries: [] };
    const best = scored[0];
    const second = scored[1];
    const entries = [best.item];
    if (second && second.direct && second.score >= best.score*0.75 && second.item.id !== best.item.id) entries.push(second.item);
    return { kind: 'answer', entries };
  }

  const api = { fromPage, answer, cvFacts, normalize, contains };
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.PortfolioAssistant = api;
})(typeof window !== 'undefined' ? window : globalThis);
