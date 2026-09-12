
  // ---------- Footer auto date ----------
  document.getElementById('footerDate').textContent =
    '© ' + new Date().getFullYear() + ' Beyyond Tech. All rights reserved.';

  // Keep social links consistent with the live profiles.
  document.querySelectorAll('.footer-social, .social-row').forEach(group => {
    group.querySelectorAll('[title="X / Twitter"], [title="GitHub"]').forEach(link => link.remove());
    const linkedIn = group.querySelector('[title="LinkedIn"]');
    if (linkedIn) {
      linkedIn.title = 'TikTok';
      linkedIn.innerHTML = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M15 3c.3 2.4 1.7 4 4 4v3c-1.5 0-2.9-.4-4-1.2V15a5 5 0 1 1-5-5c.3 0 .7 0 1 .1v3.1a2 2 0 1 0 1 1.8V3h3Z"/></svg>';
    }
  });

  // ---------- Mobile menu ----------
  const menuToggle = document.getElementById('menuToggle');
  const primaryNav = document.getElementById('primaryNav');
  menuToggle.addEventListener('click', () => {
    primaryNav.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => primaryNav.classList.remove('open'));
  });

  // ---------- Reveal on scroll ----------
  const revealItems = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealItems.forEach(item => revealObserver.observe(item));

  // ---------- Values diagram (About) ----------
  (function(){
    const diagram = document.getElementById('valuesDiagram');
    if (!diagram) return;
    const nodes = diagram.querySelectorAll('.vd-node');
    const lines = diagram.querySelectorAll('.vd-line');
    const dots = document.querySelectorAll('.vd-dot');
    const captionTitle = document.getElementById('vdCaptionTitle');
    const captionText = document.getElementById('vdCaptionText');
    const values = [
      { title: 'Security First', text: "Every system we touch is hardened before it's handed over." },
      { title: 'Straight Talk', text: 'Clear pricing, clear timelines, no technical smoke.' },
      { title: 'Built to Scale', text: "Solutions sized for where you are, ready for where you're going." },
      { title: 'Always On', text: "Monitoring and support that doesn't clock out at 5pm." }
    ];
    let active = 0, timer = null;

    function setActive(i){
      active = i;
      nodes.forEach(n => n.classList.toggle('active', +n.dataset.i === i));
      lines.forEach(l => l.classList.toggle('active', +l.dataset.i === i));
      dots.forEach(d => d.classList.toggle('active', +d.dataset.i === i));
      captionTitle.style.opacity = 0;
      captionText.style.opacity = 0;
      setTimeout(() => {
        captionTitle.textContent = values[i].title;
        captionText.textContent = values[i].text;
        captionTitle.style.opacity = 1;
        captionText.style.opacity = 1;
      }, 180);
    }
    function next(){ setActive((active + 1) % values.length); }
    function startCycle(){ clearInterval(timer); timer = setInterval(next, 2800); }
    function pauseCycle(){ clearInterval(timer); }

    nodes.forEach(n => {
      n.addEventListener('mouseenter', () => { pauseCycle(); setActive(+n.dataset.i); });
      n.addEventListener('click', () => { pauseCycle(); setActive(+n.dataset.i); startCycle(); });
      n.addEventListener('mouseleave', startCycle);
    });
    dots.forEach(d => d.addEventListener('click', () => { pauseCycle(); setActive(+d.dataset.i); startCycle(); }));

    const dObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          diagram.classList.add('in');
          setActive(0);
          startCycle();
          dObserver.unobserve(diagram);
        }
      });
    }, { threshold: 0.35 });
    dObserver.observe(diagram);
  })();

  // ---------- FAQ accordion ----------
  (function(){
    const items = document.querySelectorAll('#faqList .faq-item');
    if (!items.length) return;
    function setHeight(item){
      const answer = item.querySelector('.faq-answer');
      const inner = item.querySelector('.faq-answer-inner');
      answer.style.maxHeight = item.classList.contains('open') ? inner.scrollHeight + 'px' : '0px';
    }
    items.forEach(item => {
      setHeight(item);
      item.querySelector('.faq-question').addEventListener('click', () => {
        const wasOpen = item.classList.contains('open');
        items.forEach(i => { i.classList.remove('open'); setHeight(i); });
        if (!wasOpen) { item.classList.add('open'); setHeight(item); }
      });
    });
    window.addEventListener('resize', () => items.forEach(setHeight));
  })();

  // ---------- Contact form (front-end only) ----------
  const contactFormEl = document.getElementById('contactForm');
  if (contactFormEl) {
    contactFormEl.addEventListener('submit', function(e){
      e.preventDefault();
      const btn = this.querySelector('.btn-submit');
      const label = btn.querySelector('.btn-submit-label');
      const original = label.textContent;
      btn.classList.add('success');
      label.textContent = 'Message Sent ✓';
      this.reset();
      document.querySelectorAll('.chip.selected').forEach(c => c.classList.remove('selected'));
      const svcInput = document.getElementById('serviceInput');
      if (svcInput) svcInput.value = '';
      setTimeout(() => { btn.classList.remove('success'); label.textContent = original; }, 2500);
    });
  }

  // ---------- Service chips (multi-select) ----------
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
      const selected = Array.from(document.querySelectorAll('.chip.selected')).map(c => c.dataset.value);
      document.getElementById('serviceInput').value = selected.join(', ');
    });
  });

  // ---------- Project slider ----------
  (function(){
    const slider = document.getElementById('projectSlider');
    const prevBtn = document.getElementById('projPrev');
    const nextBtn = document.getElementById('projNext');
    if (!slider) return;

    function stepAmount(){
      const card = slider.querySelector('.project-slide');
      return card ? card.getBoundingClientRect().width + 24 : 320;
    }
    prevBtn.addEventListener('click', () => slider.scrollBy({ left: -stepAmount(), behavior: 'smooth' }));
    nextBtn.addEventListener('click', () => slider.scrollBy({ left: stepAmount(), behavior: 'smooth' }));

    let isDown = false, startX = 0, startScroll = 0, dragged = false;
    slider.addEventListener('mousedown', (e) => {
      isDown = true; dragged = false;
      startX = e.pageX; startScroll = slider.scrollLeft;
    });
    window.addEventListener('mouseup', () => isDown = false);
    slider.addEventListener('mouseleave', () => isDown = false);
    slider.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const delta = e.pageX - startX;
      if (Math.abs(delta) > 4) dragged = true;
      slider.scrollLeft = startScroll - delta;
    });
    // Prevent the "View Project" click firing right after a drag
    slider.addEventListener('click', (e) => { if (dragged) { e.preventDefault(); e.stopPropagation(); } }, true);
  })();

  // ---------- Modals ----------
  const modalOverlay = document.getElementById('modalOverlay');
  const modalTitle = document.getElementById('modalTitle');
  const modalBody = document.getElementById('modalBody');
  const todayStr = new Date().toLocaleDateString('en-ZA', { year:'numeric', month:'long', day:'numeric' });
  const CONTACT_URL = document.body.dataset.page === 'contact' ? '#contact' : 'contact.html#contact';

  const banner = (cls, svg) => `<div class="modal-project-banner banner-${cls}">${svg}</div>`;
  const imageBanner = (src, alt) => `<div class="modal-project-banner image-banner"><img src="${src}" alt="${alt}"></div>`;
  const svgShield = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M12 2 4 5v6c0 5 3.4 8.7 8 9 4.6-.3 8-4 8-9V5l-8-3Z"/><path d="M9 12l2 2 4-4"/></svg>';
  const svgCloud = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M7 18a4 4 0 0 1-.6-7.96A5.5 5.5 0 0 1 17 9.02 4 4 0 0 1 17 18H7Z"/></svg>';
  const svgWeb = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="3" y="4" width="18" height="16" rx="1.5"/><path d="M3 8.5h18"/></svg>';
  const svgSocial = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><path d="M3 11v2a2 2 0 0 0 2 2h1l4 4v-6"/><path d="M10 9 18 4v16l-8-5"/></svg>';
  const svgAuto = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="2"/><circle cx="5" cy="6" r="1.6"/><circle cx="19" cy="18" r="1.6"/></svg>';

  const modalContent = {
    'svc-security': {
      title: 'Cybersecurity & Data Protection',
      html: `
        ${banner('security', svgShield)}
        <p class="updated">Service · Ongoing Retainer or Once-Off Audit</p>
        <p>We protect the systems your business already runs on — endpoints, networks, and the personal data you're responsible for under POPIA — before an incident forces the issue.</p>
        <div class="modal-tag-row"><span>Threat Monitoring</span><span>Endpoint Security</span><span>Staff Training</span><span>POPIA Compliance</span></div>
        <h4>What's Included</h4>
        <ul class="check-list">
          <li>Network and endpoint security audit</li>
          <li>Ongoing threat monitoring and alerting</li>
          <li>Staff security-awareness training</li>
          <li>POPIA-aligned data-handling review</li>
          <li>Incident response planning</li>
        </ul>
        <h4>Ideal For</h4>
        <p>Businesses handling customer data who've never had a formal security review, or who need one to satisfy a client, insurer, or regulatory requirement.</p>
        <p style="margin-top:16px;">Every engagement is scoped and quoted individually — <a href="${CONTACT_URL}" style="color:var(--red-bright);">get in touch</a> for a free assessment.</p>
      `
    },
    'svc-automation': {
      title: 'AI & Automation Solutions',
      html: `
        ${banner('automation', svgAuto)}
        <p class="updated">Service · Project-Based</p>
        <p>We map how work actually moves through your business, then automate the repetitive parts — so time goes to decisions that need a person, not data entry.</p>
        <div class="modal-tag-row"><span>Workflow Automation</span><span>Data Systems</span><span>Custom Tooling</span></div>
        <h4>What's Included</h4>
        <ul class="check-list">
          <li>Workflow mapping and bottleneck identification</li>
          <li>Automation build for repetitive/manual tasks</li>
          <li>Integration between existing tools and systems</li>
          <li>Handover documentation and staff training</li>
        </ul>
        <h4>Ideal For</h4>
        <p>Teams doing the same manual task repeatedly — data entry, ticket triage, reporting — where a few hours a week could be given back.</p>
        <p style="margin-top:16px;">Every engagement is scoped and quoted individually — <a href="${CONTACT_URL}" style="color:var(--red-bright);">get in touch</a> for a free assessment.</p>
      `
    },
    'svc-cloud': {
      title: 'Cloud Infrastructure',
      html: `
        ${banner('cloud', svgCloud)}
        <p class="updated">Service · Project-Based with Optional Retainer</p>
        <p>We move systems to a right-sized cloud setup — built for a startup budget today, ready to scale without a second migration later.</p>
        <div class="modal-tag-row"><span>Cloud Migration</span><span>Hosting</span><span>Backup &amp; Recovery</span></div>
        <h4>What's Included</h4>
        <ul class="check-list">
          <li>Hosting and cost audit of your current setup</li>
          <li>Migration planning and execution</li>
          <li>Automated backup and disaster recovery</li>
          <li>Ongoing monitoring (optional retainer)</li>
        </ul>
        <h4>Ideal For</h4>
        <p>Businesses on outdated or over-priced hosting, or anyone who's never had a proper backup and recovery plan in place.</p>
        <p style="margin-top:16px;">Every engagement is scoped and quoted individually — <a href="${CONTACT_URL}" style="color:var(--red-bright);">get in touch</a> for a free assessment.</p>
      `
    },
    'svc-managed': {
      title: 'Managed IT & Deployment',
      html: `
        ${banner('web', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><rect x="4" y="8" width="16" height="12" rx="1"/><path d="M8 8V6a4 4 0 0 1 8 0v2"/></svg>')}
        <p class="updated">Service · Ongoing Retainer</p>
        <p>The day-to-day IT management that keeps everything else running quietly in the background — hardware, helpdesk, and the small fires that never make it to a case study.</p>
        <div class="modal-tag-row"><span>Helpdesk</span><span>Hardware Rollout</span><span>Managed Support</span></div>
        <h4>What's Included</h4>
        <ul class="check-list">
          <li>Staff helpdesk support (email/phone/ticket)</li>
          <li>New hardware setup and rollout</li>
          <li>Software updates and patch management</li>
          <li>Monthly reporting on tickets and uptime</li>
        </ul>
        <h4>Ideal For</h4>
        <p>Small teams without an in-house IT person, who need someone to call when something breaks — and someone checking things before they do.</p>
        <p style="margin-top:16px;">Every engagement is scoped and quoted individually — <a href="${CONTACT_URL}" style="color:var(--red-bright);">get in touch</a> for a free assessment.</p>
      `
    },
    privacy: {
      title: 'Privacy Policy',
      html: `
        <p class="updated">Last updated: ${todayStr}</p>
        <h4>1. Overview</h4>
        <p>Beyyond Tech ("we", "us") respects your privacy. This policy explains what information we collect through this website and how it is used.</p>
        <h4>2. Information We Collect</h4>
        <p>Contact details you submit via our forms (name, email, company, message) and standard technical data such as browser type and pages visited.</p>
        <h4>3. How We Use It</h4>
        <p>To respond to enquiries, provide quotes, deliver services you request, and improve this website. We do not sell your information.</p>
        <h4>4. Data Sharing</h4>
        <p>We only share information with service providers who help us operate (e.g. hosting, email) and only where necessary to deliver our services.</p>
        <h4>5. Your Rights</h4>
        <p>You may request access to, correction of, or deletion of your personal information at any time by contacting us directly.</p>
        <p style="margin-top:16px;">This is a template policy — replace with wording reviewed by a legal professional before launch.</p>
      `
    },
    terms: {
      title: 'Terms of Service',
      html: `
        <p class="updated">Last updated: ${todayStr}</p>
        <h4>1. Acceptance of Terms</h4>
        <p>By using this website or engaging Beyyond Tech for services, you agree to these terms.</p>
        <h4>2. Services</h4>
        <p>Beyyond Tech provides IT consulting, cybersecurity, cloud infrastructure, automation and managed IT services as scoped in individual client agreements.</p>
        <h4>3. Client Responsibilities</h4>
        <p>Clients agree to provide accurate information and timely access needed to deliver contracted services.</p>
        <h4>4. Limitation of Liability</h4>
        <p>Beyyond Tech is not liable for indirect or consequential losses arising from use of this website or general enquiries made through it.</p>
        <h4>5. Governing Law</h4>
        <p>These terms are governed by the laws of the Republic of South Africa.</p>
        <p style="margin-top:16px;">This is a template — replace with wording reviewed by a legal professional before launch.</p>
      `
    },
    popia: {
      title: 'POPIA Agreement',
      html: `
        <p class="updated">Last updated: ${todayStr}</p>
        <h4>1. Purpose</h4>
        <p>This section confirms our commitment to the Protection of Personal Information Act (POPIA) of South Africa when processing personal information collected via this site.</p>
        <h4>2. Lawful Processing</h4>
        <p>Personal information is collected only for specified purposes (responding to enquiries, delivering services) and processed lawfully, minimally, and with appropriate security safeguards.</p>
        <h4>3. Consent</h4>
        <p>By submitting a form on this website, you consent to Beyyond Tech processing your information for the purpose it was submitted.</p>
        <h4>4. Data Subject Rights</h4>
        <p>Under POPIA, you have the right to access, correct, or request deletion of your personal information, and to object to processing where applicable.</p>
        <h4>5. Information Officer</h4>
        <p>Enquiries regarding this agreement or POPIA-related requests can be directed to our Information Officer via the contact details on this site.</p>
        <p style="margin-top:16px;">This is a template — have a legal professional confirm full POPIA compliance before launch.</p>
      `
    },
    support: {
      title: 'Support',
      html: `
        <p class="updated">Support hours: 24/7 monitoring · Helpdesk Mon–Fri 08:00–17:00 SAST</p>
        <h4>Existing Clients</h4>
        <p>Log a ticket via the contact form or email our support address directly for the fastest response.</p>
        <h4>New Enquiries</h4>
        <p>Use the Contact Us section to tell us what you're working with and what you need — we reply within one business day.</p>
        <h4>Urgent / Security Incidents</h4>
        <p>For active security incidents, mark your message "Urgent" in the subject and call our support line directly.</p>
      `
    },
    'proj-security': {
      title: 'Security Overhaul for a Growing SME',
      html: `
        ${imageBanner('assets/security.jpg', 'Security project banner')}
        <p class="updated">Capability Showcase · Cybersecurity · 4–6 weeks</p>
        <p>An illustrative engagement showing how we'd take an SME with ad-hoc, unmonitored IT and bring it up to a defensible security baseline without disrupting day-to-day operations.</p>
        <div class="modal-tag-row"><span>Network Audit</span><span>Endpoint Hardening</span><span>Staff Training</span><span>POPIA Alignment</span></div>
        <h4>What We'd Do</h4>
        <ul class="check-list">
          <li>Full network and endpoint audit to map exposure</li>
          <li>Harden devices and close open access points</li>
          <li>Roll out staff security-awareness training</li>
          <li>Document a POPIA-aligned data-handling baseline</li>
        </ul>
        <h4>Outcome</h4>
        <p>A monitored, hardened environment with a clear owner for ongoing security — handed over with documentation, not left as a one-off fix.</p>
      `
    },
    'proj-cloud': {
      title: 'Cloud Migration & Cost Rebuild',
      html: `
        ${imageBanner('assets/cloud.jpg', 'Cloud project banner')}
        <p class="updated">Capability Showcase · Cloud Infrastructure · 3–5 weeks</p>
        <p>Moving an on-premise or over-provisioned setup to a right-sized cloud environment — built for a startup budget, ready to scale when the business is.</p>
        <div class="modal-tag-row"><span>Cloud Migration</span><span>Cost Optimisation</span><span>Backup &amp; Recovery</span></div>
        <h4>What We'd Do</h4>
        <ul class="check-list">
          <li>Audit current hosting spend and usage patterns</li>
          <li>Migrate workloads to a right-sized cloud setup</li>
          <li>Configure automated backup and recovery</li>
          <li>Hand over a monitored, documented environment</li>
        </ul>
        <h4>Outcome</h4>
        <p>Lower hosting overhead and improved uptime, with room to scale without another migration project.</p>
      `
    },
    'proj-web': {
      title: 'Business Website Design & Build',
      html: `
        ${imageBanner('assets/website.jpg', 'Beyyond Tech website project banner')}
        <p class="updated">Real Delivery · Web Development · 2–4 weeks</p>
        <p>Not a hypothetical — this is the actual site you're looking at right now, built with the same client intake-to-delivery process we run for every project: brief, brand-matched design, build, review, launch.</p>
        <div class="modal-tag-row"><span>Brand-Matched Design</span><span>Responsive Build</span><span>Launch &amp; Handover</span></div>
        <h4>What We Did</h4>
        <ul class="check-list">
          <li>Took the brief and confirmed scope, pages and goals</li>
          <li>Designed around the existing brand, logo and colour palette</li>
          <li>Built a responsive, fast-loading site with no page-load frameworks</li>
          <li>Structured it for revision — reviewed, refined, launched</li>
        </ul>
        <h4>Outcome</h4>
        <p>A live, professional site ready to point customers to — plus a defined path for post-launch change requests, exactly as we'd hand it to any client.</p>
      `
    },
    'proj-social': {
      title: 'Social Media Management Setup',
      html: `
        ${imageBanner('assets/social.jpg', 'Social media project banner')}
        <p class="updated">Capability Showcase · Social Media · 2–3 weeks</p>
        <p>Standing up a client's social presence properly: a brand voice guide, a content calendar and an approval workflow, so posting stays consistent after we hand it over.</p>
        <div class="modal-tag-row"><span>Content Calendar</span><span>Brand Voice Guide</span><span>Approval Workflow</span></div>
        <h4>What We'd Do</h4>
        <ul class="check-list">
          <li>Define brand voice and content pillars</li>
          <li>Build a recurring content calendar</li>
          <li>Set up a client approval workflow before posting</li>
          <li>Establish basic performance reporting</li>
        </ul>
        <h4>Outcome</h4>
        <p>Consistent, on-brand posting with a repeatable process — not a one-person scramble every week.</p>
      `
    },
    'proj-automation': {
      title: 'Support Desk Automation',
      html: `
        ${imageBanner('assets/automation.jpg', 'Automation project banner')}
        <p class="updated">Capability Showcase · Automation · 2–4 weeks</p>
        <p>Automating the repetitive first steps of IT support so a small helpdesk team can focus on the issues that actually need a person.</p>
        <div class="modal-tag-row"><span>Ticket Triage</span><span>Workflow Automation</span><span>Reporting</span></div>
        <h4>What We'd Do</h4>
        <ul class="check-list">
          <li>Map current ticket intake and triage steps</li>
          <li>Automate routing and first-response for common requests</li>
          <li>Set up status reporting for the support queue</li>
        </ul>
        <h4>Outcome</h4>
        <p>Faster first response times and a support team spending less time on routine tickets.</p>
      `
    }
  };

  document.querySelectorAll('[data-modal]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.getAttribute('data-modal');
      const content = modalContent[key];
      if (!content) return;
      modalTitle.textContent = content.title;
      modalBody.innerHTML = content.html;
      modalOverlay.classList.add('open');
    });
  });
  document.getElementById('modalClose').addEventListener('click', () => modalOverlay.classList.remove('open'));
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) modalOverlay.classList.remove('open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modalOverlay.classList.remove('open');
  });

  // ---------- Network canvas (hero signature) ----------
  (function(){
    const canvas = document.getElementById('network-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let w, h, nodes = [];
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function resize(){
      const hero = document.getElementById('home');
      w = canvas.width = hero.offsetWidth;
      h = canvas.height = hero.offsetHeight;
      const count = Math.max(18, Math.floor((w * h) / 42000));
      nodes = Array.from({length: count}, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: Math.random() * 1.6 + 1
      }));
    }

    function step(){
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes){
        if (!reduceMotion){
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0 || n.x > w) n.vx *= -1;
          if (n.y < 0 || n.y > h) n.vy *= -1;
        }
      }
      for (let i = 0; i < nodes.length; i++){
        for (let j = i + 1; j < nodes.length; j++){
          const a = nodes[i], b = nodes[j];
          const dx = a.x - b.x, dy = a.y - b.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < 150){
            ctx.strokeStyle = 'rgba(161,30,30,' + (1 - dist/150) * 0.35 + ')';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.stroke();
          }
        }
      }
      for (const n of nodes){
        ctx.fillStyle = 'rgba(211,55,47,0.85)';
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!reduceMotion) requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener('resize', () => { resize(); });
  })();

  // ---------- Global animated background (site-wide, sits behind every page) ----------
  (function(){
    const canvas = document.createElement('canvas');
    canvas.id = 'grid-bg';
    document.body.prepend(canvas);
    const ctx = canvas.getContext('2d');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let w, h, particles = [], pulses = [];
    const CELL = 74;

    function resize(){
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      const count = Math.max(26, Math.floor((w * h) / 34000));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.6 + 0.7,
        vy: -(Math.random() * 0.1 + 0.02),
        alpha: Math.random() * 0.55 + 0.28,
        twinkle: Math.random() * Math.PI * 2
      }));
    }

    function spawnPulse(){
      const horizontal = Math.random() < 0.5;
      const lineCount = Math.floor((horizontal ? h : w) / CELL);
      if (lineCount < 1) return;
      pulses.push({
        horizontal,
        pos: Math.floor(Math.random() * lineCount) * CELL,
        t: 0,
        len: Math.random() * 130 + 80,
        speed: Math.random() * 1.4 + 1,
        dir: Math.random() < 0.5 ? 1 : -1
      });
    }

    function step(){
      ctx.clearRect(0, 0, w, h);

      // Faint structural grid
      ctx.strokeStyle = 'rgba(156,28,28,0.12)';
      ctx.lineWidth = 1;
      for (let x = 0; x < w; x += CELL){
        ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, h); ctx.stroke();
      }
      for (let y = 0; y < h; y += CELL){
        ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke();
      }

      // Drifting glow particles
      for (const p of particles){
        if (!reduceMotion){
          p.y += p.vy;
          if (p.y < -10) p.y = h + 10;
          p.twinkle += 0.018;
        }
        const a = p.alpha * (0.6 + 0.4 * Math.sin(p.twinkle));
        ctx.fillStyle = `rgba(211,55,47,${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Traveling light pulses along grid lines (circuit-trace effect)
      if (!reduceMotion){
        for (let i = pulses.length - 1; i >= 0; i--){
          const pu = pulses[i];
          pu.t += pu.speed;
          const axisLen = pu.horizontal ? w : h;
          if (pu.t > axisLen + pu.len){ pulses.splice(i, 1); continue; }
          const head = pu.dir > 0 ? pu.t : axisLen - pu.t;
          const tail = pu.dir > 0 ? pu.t - pu.len : head + pu.len;
          const start = Math.min(head, tail), end = Math.max(head, tail);
          const grad = pu.horizontal
            ? ctx.createLinearGradient(start, 0, end, 0)
            : ctx.createLinearGradient(0, start, 0, end);
          grad.addColorStop(0, 'rgba(211,55,47,0)');
          grad.addColorStop(0.5, 'rgba(211,55,47,0.5)');
          grad.addColorStop(1, 'rgba(211,55,47,0)');
          ctx.strokeStyle = grad;
          ctx.lineWidth = 2;
          ctx.beginPath();
          if (pu.horizontal){ ctx.moveTo(start, pu.pos); ctx.lineTo(end, pu.pos); }
          else { ctx.moveTo(pu.pos, start); ctx.lineTo(pu.pos, end); }
          ctx.stroke();
        }
        if (Math.random() < 0.008 && pulses.length < 4) spawnPulse();
      }

      if (!reduceMotion) requestAnimationFrame(step);
    }

    resize();
    step();
    window.addEventListener('resize', resize);
  })();
