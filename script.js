// Mobile nav
const toggle = document.querySelector('.nav-toggle');
const links = document.getElementById('nav-links');
toggle.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(open));
});
links.addEventListener('click', e => {
  if (e.target.tagName === 'A') { links.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
});

// Interactive demo (fictional data)
const base = [
  { when: 'Day −7', what: 'Email + WhatsApp', detail: 'Friendly heads-up with the invoice and a pay link.', state: 'Upcoming' },
  { when: 'Due date', what: 'WhatsApp', detail: '"Invoice INV-2041 for AED 18,400 is due today."', state: 'Due' },
  { when: 'Day +3', what: 'Email', detail: 'Polite notice asking if anything is blocking payment.', state: 'Overdue' },
];
const scenarios = {
  pays: {
    steps: [...base,
      { when: 'Day +5', what: 'Payment received', detail: 'Payment syncs from the accounting system.', state: 'Paid', cls: 'paid' },
      { when: 'Day +5', what: 'Chasing stopped', detail: 'No further reminders. A thank-you message is sent.', state: 'Paid', cls: 'paid' }],
    note: 'Paid on day 5. The customer never got a phone call.'
  },
  promise: {
    steps: [...base,
      { when: 'Day +7', what: 'WhatsApp', detail: 'Amount and pay link, with an offer to speak.', state: 'Overdue' },
      { when: 'Day +8', what: 'Customer replies', detail: '"We\'ll pay on the 20th." The reply reader records the date.', state: 'Promised' },
      { when: 'Day +8', what: 'Reminders paused', detail: 'Nothing is sent until the day after the promised date.', state: 'Promised' },
      { when: 'Day +12', what: 'Payment received', detail: 'Paid as promised. Chasing stopped.', state: 'Paid', cls: 'paid' }],
    note: 'The promise was recorded and respected. No calls were needed.'
  },
  dispute: {
    steps: [...base,
      { when: 'Day +4', what: 'Customer replies', detail: '"This invoice is wrong, we received 40 units, not 50."', state: 'Disputed', cls: 'warn' },
      { when: 'Day +4', what: 'Chasing stopped', detail: 'No more reminders on this invoice.', state: 'Disputed', cls: 'warn' },
      { when: 'Day +4', what: 'Handed to your team', detail: 'Your finance contact gets the reason and the full history.', state: 'Disputed', cls: 'warn', hand: true }],
    note: 'Disputes go to a person. The system never argues with your customer.'
  },
  silent: {
    steps: [...base,
      { when: 'Day +7', what: 'WhatsApp', detail: 'Amount and pay link, with an offer to speak.', state: 'Overdue' },
      { when: 'Day +12', what: 'Phone call', detail: 'Assistant introduces itself, confirms the invoice was received.', state: 'Overdue' },
      { when: 'Day +18', what: 'WhatsApp', detail: 'Follow-up referencing the call.', state: 'Overdue' },
      { when: 'Day +25', what: 'Phone call', detail: 'Second call; asks for the finance contact.', state: 'Overdue' },
      { when: 'Day +30', what: 'Handed to your team', detail: 'Full history of every message and call, ready for a personal follow-up.', state: 'Escalated', cls: 'warn', hand: true }],
    note: 'After 30 days your own team takes over, with everything already documented.'
  }
};

const tl = document.getElementById('timeline');
const stateEl = document.getElementById('caseState');
const noteEl = document.getElementById('caseNote');
const chips = document.querySelectorAll('.chip');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let timer = null;

function run(name) {
  clearInterval(timer);
  chips.forEach(c => c.setAttribute('aria-pressed', String(c.dataset.scenario === name)));
  tl.innerHTML = '';
  const s = scenarios[name];
  let i = 0;
  const add = () => {
    const step = s.steps[i];
    const li = document.createElement('li');
    if (step.hand) li.className = 'hand';
    li.innerHTML = `<span class="when">${step.when}</span><span class="what"><b>${step.what}</b>${step.detail}</span>`;
    tl.appendChild(li);
    stateEl.textContent = step.state;
    stateEl.className = 'pill' + (step.cls ? ' ' + step.cls : '');
    i++;
    if (i >= s.steps.length) { clearInterval(timer); noteEl.textContent = s.note; }
  };
  noteEl.textContent = 'Running…';
  if (reduce) { while (i < s.steps.length) add(); return; }
  add();
  timer = setInterval(add, 700);
}
chips.forEach(c => c.addEventListener('click', () => run(c.dataset.scenario)));
run('promise');
