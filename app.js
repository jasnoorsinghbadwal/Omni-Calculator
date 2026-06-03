// OmniCalc - Core Calculator Engines Controller

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. GENERAL APP TAB NAVIGATION & SYSTEMS
  // ==========================================
  const appState = {
    isDarkTheme: true,
  };

  const navTabs = document.querySelectorAll('.nav-tab');
  const calcPanes = document.querySelectorAll('.calc-pane');
  const calcTitle = document.getElementById('calc-title');
  const calcDescription = document.getElementById('calc-description');
  const themeToggle = document.getElementById('theme-toggle');
  
  // Mobile Nav Drawer references
  const mobileNavToggle = document.getElementById('mobile-nav-toggle');
  const sidebar = document.querySelector('.calc-sidebar');
  const sidebarOverlay = document.getElementById('sidebar-overlay');

  const CALC_METADATA = {
    standard: { title: 'Standard & Scientific Calculator', desc: 'High-fidelity computation with memory storage and history logging.' },
    age: { title: 'Age & Astrology Lifecycle Analyzer', desc: 'Calculate exact years, months, and seconds of your life along with cosmological alignments.' },
    date: { title: 'Date & Days Calculator', desc: 'Determine time durations between dates or project calendar offsets.' },
    time: { title: 'Time & World Zone Converter', desc: 'Compute hour/minute durations and compare global timezone variances.' },
    tip: { title: 'Tip & Bill Splitter', desc: 'Distribute restaurant receipts, tips, and personal portions instantaneously.' },
    bmi: { title: 'BMI Health Analyzer', desc: 'Assess body mass index score metrics along with customized wellness advice.' },
    compound: { title: 'Compound Interest Investment Calculator', desc: 'Forecast long-term capital accumulation schedules and compound trajectories.' }
  };

  function switchTab(tabKey) {
    // Deactivate all
    navTabs.forEach(t => t.classList.remove('active'));
    calcPanes.forEach(p => p.classList.remove('active'));

    // Activate specific
    const targetTab = document.querySelector(`.nav-tab[data-calc="${tabKey}"]`);
    const targetPane = document.getElementById(`pane-${tabKey}`);
    
    if (targetTab && targetPane) {
      targetTab.classList.add('active');
      targetPane.classList.add('active');
      
      // Update Title Header
      const meta = CALC_METADATA[tabKey];
      calcTitle.textContent = meta.title;
      calcDescription.textContent = meta.desc;
    }

    // Mobile history button & drawer visibility
    const historyToggleBtn = document.getElementById('mobile-history-toggle');
    const historySidebar = document.querySelector('.calculator-history-sidebar');
    const historyOverlay = document.getElementById('history-overlay');
    if (historyToggleBtn) {
      if (tabKey === 'standard') {
        historyToggleBtn.classList.remove('hide-toggle');
      } else {
        historyToggleBtn.classList.add('hide-toggle');
      }
    }
    if (historySidebar && historyOverlay) {
      historySidebar.classList.remove('open');
      historyOverlay.classList.remove('active');
    }

    // Close mobile menu if open
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  }

  // Sidebar listeners
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.dataset.calc);
    });
  });

  // Mobile menu toggle
  mobileNavToggle.addEventListener('click', () => {
    sidebar.classList.toggle('open');
    sidebarOverlay.classList.toggle('active');
  });

  sidebarOverlay.addEventListener('click', () => {
    sidebar.classList.remove('open');
    sidebarOverlay.classList.remove('active');
  });

  // Mobile history panel toggle
  const historyToggleBtn = document.getElementById('mobile-history-toggle');
  const historySidebar = document.querySelector('.calculator-history-sidebar');
  const historyOverlay = document.getElementById('history-overlay');

  function toggleHistoryPanel() {
    if (!historySidebar || !historyOverlay) return;
    const isOpen = historySidebar.classList.contains('open');
    if (isOpen) {
      historySidebar.classList.remove('open');
      historyOverlay.classList.remove('active');
    } else {
      historySidebar.classList.add('open');
      historyOverlay.classList.add('active');
    }
  }

  if (historyToggleBtn) {
    historyToggleBtn.addEventListener('click', toggleHistoryPanel);
  }
  if (historyOverlay) {
    historyOverlay.addEventListener('click', () => {
      if (historySidebar) historySidebar.classList.remove('open');
      historyOverlay.classList.remove('active');
    });
  }

  // Sub-pane tabs router (Date & Time calcs have sub-menus)
  const subTabButtons = document.querySelectorAll('.sub-tab-btn');
  subTabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const parentPane = btn.closest('.calc-pane');
      const siblingButtons = parentPane.querySelectorAll('.sub-tab-btn');
      const subPanes = parentPane.querySelectorAll('.sub-pane');
      const targetSub = btn.dataset.sub;

      siblingButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      subPanes.forEach(pane => {
        if (pane.id.includes(targetSub)) {
          pane.classList.add('active');
        } else {
          pane.classList.remove('active');
        }
      });

      // Special re-initializations when tab changes
      if (targetSub === 'timezone') {
        renderTimezoneClocks();
      }
    });
  });

  // Dark/Light Theme Handler
  themeToggle.addEventListener('click', () => {
    appState.isDarkTheme = !appState.isDarkTheme;
    if (appState.isDarkTheme) {
      document.body.classList.remove('light-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    } else {
      document.body.classList.add('light-theme');
      themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    }
  });


  // ==========================================
  // 2. STANDARD & SCIENTIFIC CALCULATOR ENGINE
  // ==========================================
  const mathState = {
    expression: '',
    history: JSON.parse(localStorage.getItem('oc_math_history')) || [],
    isDegMode: true,
    isEvaluated: false,
  };

  const sciExpressionEl = document.getElementById('sci-expression');
  const sciOutputEl = document.getElementById('sci-output');
  const degToggleBtn = document.getElementById('btn-deg-toggle');
  const mathHistoryList = document.getElementById('math-history-list');
  const clearMathHistoryBtn = document.getElementById('clear-math-history');
  
  const calcButtons = document.querySelectorAll('.calc-keyboard .btn');

  function updateMathDisplay() {
    sciExpressionEl.textContent = mathState.expression;
    if (mathState.expression === '') {
      sciOutputEl.textContent = '0';
    }
  }

  function handleMathButton(btn) {
    const action = btn.dataset.action;
    const val = btn.dataset.val;

    if (val) {
      if (mathState.isEvaluated) {
        if (val === '.') {
          mathState.expression = '0.';
        } else {
          mathState.expression = val;
        }
        mathState.isEvaluated = false;
      } else {
        mathState.expression += val;
      }
      updateMathDisplay();
    } else if (action) {
      if (mathState.isEvaluated) {
        if (['add', 'subtract', 'multiply', 'divide', 'percent', 'power', 'square'].includes(action)) {
          mathState.expression = sciOutputEl.textContent;
        } else if (['clear', 'rad-deg'].includes(action)) {
          // Let these proceed as normal
        } else {
          mathState.expression = '';
        }
        mathState.isEvaluated = false;
      }

      switch (action) {
        case 'clear':
          mathState.expression = '';
          sciOutputEl.textContent = '0';
          updateMathDisplay();
          break;
          
        case 'backspace':
          if (mathState.expression.length > 0) {
            mathState.expression = mathState.expression.slice(0, -1);
            updateMathDisplay();
          }
          break;
          
        case 'add': mathState.expression += '+'; updateMathDisplay(); break;
        case 'subtract': mathState.expression += '-'; updateMathDisplay(); break;
        case 'multiply': mathState.expression += '×'; updateMathDisplay(); break;
        case 'divide': mathState.expression += '÷'; updateMathDisplay(); break;
        case 'percent': mathState.expression += '%'; updateMathDisplay(); break;
        case 'parenthesis-open': mathState.expression += '('; updateMathDisplay(); break;
        case 'parenthesis-close': mathState.expression += ')'; updateMathDisplay(); break;
        
        // Sci operations
        case 'sin': mathState.expression += 'sin('; updateMathDisplay(); break;
        case 'cos': mathState.expression += 'cos('; updateMathDisplay(); break;
        case 'tan': mathState.expression += 'tan('; updateMathDisplay(); break;
        case 'log': mathState.expression += 'log('; updateMathDisplay(); break;
        case 'ln': mathState.expression += 'ln('; updateMathDisplay(); break;
        case 'sqrt': mathState.expression += '√('; updateMathDisplay(); break;
        case 'power': mathState.expression += '^'; updateMathDisplay(); break;
        case 'square': mathState.expression += '^2'; updateMathDisplay(); break;
        case 'inverse': mathState.expression += '^-1'; updateMathDisplay(); break;
        case 'pi': mathState.expression += 'π'; updateMathDisplay(); break;
        case 'e': mathState.expression += 'e'; updateMathDisplay(); break;
        case 'factorial': mathState.expression += '!'; updateMathDisplay(); break;
        
        case 'rad-deg':
          mathState.isDegMode = !mathState.isDegMode;
          degToggleBtn.textContent = mathState.isDegMode ? 'DEG' : 'RAD';
          degToggleBtn.classList.toggle('active', !mathState.isDegMode);
          break;
          
        case 'equals':
          evaluateExpression();
          break;
      }
    }
  }

  // Bind Buttons
  calcButtons.forEach(btn => {
    btn.addEventListener('click', () => handleMathButton(btn));
  });

  // Safe Calculator Math Evaluator (Smart Expression Engine)
  function evaluateExpression() {
    if (!mathState.expression) return;

    let expr = mathState.expression;

    // ── Step 1: Convert visual symbols to math syntax ──
    expr = expr.replace(/×/g, '*').replace(/÷/g, '/');

    // ── Step 2: Replace π with Math.PI (safe — π is unique unicode) ──
    expr = expr.replace(/π/g, 'Math.PI');

    // ── Step 3: Replace standalone 'e' with Math.E ──
    // Only replace 'e' when it's NOT part of a number (scientific notation like 1e5, 2.5e-3)
    // and NOT part of a word (like 'scale', Math.powEr, etc.)
    expr = expr.replace(/(?<![a-zA-Z0-9.])e(?![a-zA-Z0-9])/g, 'Math.E');

    // ── Step 4: Parse factorials (e.g. 5! -> factorial(5)) ──
    expr = expr.replace(/(\d+)!/g, 'factorial($1)');

    // ── Step 5: Parse percentages (e.g. 50% -> (50/100)) ──
    expr = expr.replace(/(\d+(\.\d+)?)%/g, '($1/100)');

    // ── Step 6: Parse square roots (√( -> Math.sqrt() ──
    expr = expr.replace(/√\(/g, 'Math.sqrt(');

    // ── Step 7: Parse powers (^ -> **) ──
    while (expr.includes('^')) {
      const match = expr.match(/(\d+(\.\d+)?)\^([+-]?\d+(\.\d+)?)/);
      if (match) {
        expr = expr.replace(match[0], `Math.pow(${match[1]},${match[3]})`);
      } else {
        expr = expr.replace(/\^/g, '**');
        break;
      }
    }

    // ── Step 8: Implicit multiplication ──
    // 2π, 5Math.PI, 2sin(, 2cos(, 2log(, 2ln(, 2Math.sqrt(, 2(, )(, )2, )Math.PI
    expr = expr.replace(/(\d)(Math\.|sin|cos|tan|log|ln|factorial|\()/g, '$1*$2');
    expr = expr.replace(/(\))(Math\.|sin|cos|tan|log|ln|factorial|\(|\d)/g, '$1*$2');
    expr = expr.replace(/(Math\.PI|Math\.E)(\d|\(|Math\.|sin|cos|tan|log|ln)/g, '$1*$2');

    // ── Step 9: Trig & math helper functions ──
    const degToRad = deg => deg * Math.PI / 180;
    const sin = x => mathState.isDegMode ? Math.sin(degToRad(x)) : Math.sin(x);
    const cos = x => mathState.isDegMode ? Math.cos(degToRad(x)) : Math.cos(x);
    const tan = x => mathState.isDegMode ? Math.tan(degToRad(x)) : Math.tan(x);
    const log = x => Math.log10(x);
    const ln = x => Math.log(x);
    const factorial = n => {
      if (n < 0) return NaN;
      if (n === 0 || n === 1) return 1;
      let result = 1;
      for (let i = 2; i <= n; i++) result *= i;
      return result;
    };

    // ── Step 10: Auto-close unclosed parentheses ──
    const openParens = (expr.match(/\(/g) || []).length;
    const closeParens = (expr.match(/\)/g) || []).length;
    if (openParens > closeParens) {
      expr += ')'.repeat(openParens - closeParens);
    }

    // ── Step 11: Strip trailing operators to prevent syntax errors ──
    expr = expr.replace(/[+\-*/]+$/, '');

    // ── Step 12: Resolve empty parentheses like () -> (0) ──
    expr = expr.replace(/\(\)/g, '(0)');

    // ── Step 13: Fix consecutive operators (e.g. 5++3 -> 5+3, 5*-3 stays) ──
    expr = expr.replace(/([+\-])\1+/g, '$1'); // ++ -> +, -- -> -
    expr = expr.replace(/([*/])\1+/g, '$1');   // ** stays, // -> /

    // ── Step 14: Don't evaluate if expression is empty after cleanup ──
    if (!expr || expr.trim() === '') {
      sciOutputEl.textContent = '0';
      return;
    }

    try {
      const evalFunc = new Function('sin', 'cos', 'tan', 'log', 'ln', 'factorial', `return ${expr}`);
      const result = evalFunc(sin, cos, tan, log, ln, factorial);

      if (isNaN(result) || !isFinite(result)) {
        sciOutputEl.textContent = result === Infinity ? '∞' : (result === -Infinity ? '-∞' : 'Undefined');
      } else {
        const formattedResult = Number(result.toFixed(10)).toString();
        sciOutputEl.textContent = formattedResult;
        pushMathHistory(mathState.expression, formattedResult);
      }
      mathState.isEvaluated = true;
    } catch (e) {
      console.warn('Calc parse error:', e.message);
      sciOutputEl.textContent = 'Invalid Expression';
      mathState.isEvaluated = true;
    }
  }

  // Keyboard binding for standard inputs
  document.addEventListener('keydown', (e) => {
    const paneStandard = document.getElementById('pane-standard');
    if (!paneStandard.classList.contains('active')) return;
    if (document.activeElement.tagName === 'INPUT') return;

    if (e.key >= '0' && e.key <= '9') {
      const btn = document.querySelector(`.btn-num[data-val="${e.key}"]`);
      if (btn) btn.click();
    } else if (e.key === '.') {
      const btn = document.querySelector(`.btn-num[data-val="."]`);
      if (btn) btn.click();
    } else if (e.key === '+') {
      const btn = document.querySelector('.btn-operator[data-action="add"]');
      if (btn) btn.click();
    } else if (e.key === '-') {
      const btn = document.querySelector('.btn-operator[data-action="subtract"]');
      if (btn) btn.click();
    } else if (e.key === '*') {
      const btn = document.querySelector('.btn-operator[data-action="multiply"]');
      if (btn) btn.click();
    } else if (e.key === '/') {
      e.preventDefault();
      const btn = document.querySelector('.btn-operator[data-action="divide"]');
      if (btn) btn.click();
    } else if (e.key === '(') {
      const btn = document.querySelector('.btn-action[data-action="parenthesis-open"]');
      if (btn) btn.click();
    } else if (e.key === ')') {
      const btn = document.querySelector('.btn-action[data-action="parenthesis-close"]');
      if (btn) btn.click();
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      const btn = document.querySelector('.btn-equals');
      if (btn) btn.click();
    } else if (e.key === 'Backspace') {
      const btn = document.querySelector('.btn-action[data-action="backspace"]');
      if (btn) btn.click();
    } else if (e.key === 'Escape') {
      const btn = document.querySelector('.btn-danger[data-action="clear"]');
      if (btn) btn.click();
    }
  });

  // History list
  function renderMathHistory() {
    mathHistoryList.innerHTML = '';
    
    if (mathState.history.length === 0) {
      mathHistoryList.innerHTML = `
        <div class="empty-history">
          <i class="fa-solid fa-clock-rotate-left"></i>
          <p>No calculations logged yet.</p>
        </div>
      `;
      return;
    }

    mathState.history.forEach((item, index) => {
      const card = document.createElement('div');
      card.className = 'history-item';
      card.innerHTML = `
        <div class="history-item-exp">${item.expr}</div>
        <div class="history-item-ans">${item.ans}</div>
      `;
      
      // Click history item appends result to expression
      card.addEventListener('click', () => {
        if (mathState.expression === '' || mathState.isEvaluated) {
          mathState.expression = item.ans;
          mathState.isEvaluated = false;
        } else {
          // If expression ends with operator, directly append, otherwise multiply
          const lastChar = mathState.expression.slice(-1);
          if (['+', '-', '×', '÷', '('].includes(lastChar)) {
            mathState.expression += item.ans;
          } else {
            mathState.expression += '×' + item.ans;
          }
        }
        updateMathDisplay();
      });

      mathHistoryList.appendChild(card);
    });
  }

  function pushMathHistory(expr, ans) {
    // Avoid double logging identical sequential entries
    if (mathState.history.length > 0 && mathState.history[0].expr === expr) return;

    mathState.history.unshift({ expr, ans });
    if (mathState.history.length > 25) mathState.history.pop(); // Limit size
    
    localStorage.setItem('oc_math_history', JSON.stringify(mathState.history));
    renderMathHistory();
  }

  clearMathHistoryBtn.addEventListener('click', () => {
    if (confirm("Clear all logged history?")) {
      mathState.history = [];
      localStorage.setItem('oc_math_history', JSON.stringify(mathState.history));
      renderMathHistory();
    }
  });

  // Initial standard render
  renderMathHistory();


  // ==========================================
  // 3. AGE & ASTROLOGY LIFECYCLE CALCULATOR
  // ==========================================
  let ageTickerInterval = null;
  const birthDateInput = document.getElementById('birth-date');
  const targetDateInput = document.getElementById('age-target-date');
  const calculateAgeBtn = document.getElementById('calculate-age-btn');

  // Outputs
  const elAge = {
    years: document.getElementById('age-years'),
    months: document.getElementById('age-months'),
    days: document.getElementById('age-days'),
    hours: document.getElementById('age-hours'),
    minutes: document.getElementById('age-minutes'),
    seconds: document.getElementById('age-seconds'),
    
    // countdown
    bdayMonths: document.getElementById('bday-countdown-months'),
    bdayDays: document.getElementById('bday-countdown-days'),
    bdaySub: document.getElementById('bday-countdown-sub'),
    bdayCard: document.getElementById('birthday-countdown-card'),
    
    // Western Zodiac
    zodiacName: document.getElementById('zodiac-name'),
    zodiacDates: document.getElementById('zodiac-dates'),
    zodiacSymbol: document.getElementById('zodiac-symbol'),
    zodiacDesc: document.getElementById('zodiac-desc'),

    // Chinese Zodiac
    chineseName: document.getElementById('chinese-name'),
    chineseYear: document.getElementById('chinese-year'),
    chineseIcon: document.getElementById('chinese-zodiac-icon'),
    chineseDesc: document.getElementById('chinese-zodiac-desc')
  };

  // Set default target date to today
  const todayStr = new Date().toISOString().split('T')[0];
  targetDateInput.value = todayStr;

  function runAgeCalculator() {
    const dobValue = birthDateInput.value;
    const targetValue = targetDateInput.value;

    if (!dobValue) return;

    clearInterval(ageTickerInterval);

    const dob = new Date(dobValue + 'T00:00:00'); // local timezone
    let target = new Date(targetValue + 'T23:59:59');

    // If target is today, we want to run a continuous ticker relative to exact current moment!
    const isTargetToday = targetValue === todayStr;

    function computeLifeMetrics() {
      const now = isTargetToday ? new Date() : target;
      
      if (now < dob) {
        clearInterval(ageTickerInterval);
        elAge.years.textContent = '0';
        elAge.months.textContent = '0';
        elAge.days.textContent = '0';
        elAge.hours.textContent = '00';
        elAge.minutes.textContent = '00';
        elAge.seconds.textContent = '00';
        return;
      }

      // Difference math
      let diffMs = now - dob;

      let years = now.getFullYear() - dob.getFullYear();
      let months = now.getMonth() - dob.getMonth();
      let days = now.getDate() - dob.getDate();

      if (days < 0) {
        // Borrow days from previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += prevMonth.getDate();
        months--;
      }

      if (months < 0) {
        months += 12;
        years--;
      }

      // Exact hours, minutes, seconds of life
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();

      // Render
      elAge.years.textContent = years;
      elAge.months.textContent = months;
      elAge.days.textContent = days;
      elAge.hours.textContent = hours.toString().padStart(2, '0');
      elAge.minutes.textContent = minutes.toString().padStart(2, '0');
      elAge.seconds.textContent = seconds.toString().padStart(2, '0');
    }

    // Initial calculations
    computeLifeMetrics();

    // Trigger birthday countdown & astrology sign rendering
    calculateBirthdayCountdown(dob);
    calculateWesternZodiac(dob);
    calculateChineseZodiac(dob);

    if (isTargetToday) {
      ageTickerInterval = setInterval(computeLifeMetrics, 1000);
    }
  }

  function calculateBirthdayCountdown(dob) {
    const now = new Date();
    const currentYear = now.getFullYear();
    
    // Set next birthday date
    let nextBday = new Date(currentYear, dob.getMonth(), dob.getDate());
    
    // If birthday passed this year, next one is next year
    if (now > nextBday) {
      nextBday.setFullYear(currentYear + 1);
    }

    const diffMs = nextBday - now;
    
    // Check if birthday is today
    const isToday = now.getMonth() === dob.getMonth() && now.getDate() === dob.getDate();
    
    if (isToday) {
      elAge.bdayMonths.textContent = '00';
      elAge.bdayDays.textContent = '00';
      elAge.bdaySub.textContent = "Happy Birthday! Celebration active! 🎉";
      elAge.bdayCard.classList.add('birthday-celebration');
      return;
    }

    elAge.bdayCard.classList.remove('birthday-celebration');

    // Months & Days remaining
    let bdayMonths = nextBday.getMonth() - now.getMonth();
    let bdayDays = nextBday.getDate() - now.getDate();

    if (bdayDays < 0) {
      const prevMonth = new Date(nextBday.getFullYear(), nextBday.getMonth(), 0);
      bdayDays += prevMonth.getDate();
      bdayMonths--;
    }

    if (bdayMonths < 0) {
      bdayMonths += 12;
    }

    elAge.bdayMonths.textContent = bdayMonths.toString().padStart(2, '0');
    elAge.bdayDays.textContent = bdayDays.toString().padStart(2, '0');
    elAge.bdaySub.textContent = `Awaiting another spectacular year of life!`;
  }

  function calculateWesternZodiac(dob) {
    const month = dob.getMonth() + 1; // 1-indexed
    const day = dob.getDate();

    let zodiac = "";
    let dates = "";
    let icon = "";
    let desc = "";

    if ((month == 3 && day >= 21) || (month == 4 && day <= 19)) {
      zodiac = "Aries"; dates = "Mar 21 - Apr 19"; icon = '<i class="fa-solid fa-ram"></i>';
      desc = "Bold, energetic, and highly ambitious. Aries are natural born pioneers.";
    } else if ((month == 4 && day >= 20) || (month == 5 && day <= 20)) {
      zodiac = "Taurus"; dates = "Apr 20 - May 20"; icon = '<i class="fa-solid fa-bull"></i>';
      desc = "Dependable, practical, patient, and highly aesthetic. Enjoys physical comforts.";
    } else if ((month == 5 && day >= 21) || (month == 6 && day <= 20)) {
      zodiac = "Gemini"; dates = "May 21 - Jun 20"; icon = '<i class="fa-solid fa-people-arrows"></i>';
      desc = "Expressive, curious, adaptable, and highly intellectual. The social dynamic twin.";
    } else if ((month == 6 && day >= 21) || (month == 7 && day <= 22)) {
      zodiac = "Cancer"; dates = "Jun 21 - Jul 22"; icon = '<i class="fa-solid fa-crab"></i>';
      desc = "Intuitive, emotional, empathetic, and protective. Extremely loyal to family.";
    } else if ((month == 7 && day >= 23) || (month == 8 && day <= 22)) {
      zodiac = "Leo"; dates = "Jul 23 - Aug 22"; icon = '<i class="fa-solid fa-crown"></i>';
      desc = "Outgoing, self-assured, fiery, and generous. Loves high drama and leadership.";
    } else if ((month == 8 && day >= 23) || (month == 9 && day <= 22)) {
      zodiac = "Virgo"; dates = "Aug 23 - Sep 22"; icon = '<i class="fa-solid fa-seedling"></i>';
      desc = "Analytical, systematic, kind, and hardworking. Focused on efficiency and health.";
    } else if ((month == 9 && day >= 23) || (month == 10 && day <= 22)) {
      zodiac = "Libra"; dates = "Sep 23 - Oct 22"; icon = '<i class="fa-solid fa-scale-balanced"></i>';
      desc = "Diplomatic, fair-minded, harmonious, and highly artistic. Seeks balance.";
    } else if ((month == 10 && day >= 23) || (month == 11 && day <= 21)) {
      zodiac = "Scorpio"; dates = "Oct 23 - Nov 21"; icon = '<i class="fa-solid fa-spider"></i>';
      desc = "Passionate, stubbon, brave, and mystical. Possesses magnetic spiritual depth.";
    } else if ((month == 11 && day >= 22) || (month == 12 && day <= 21)) {
      zodiac = "Sagittarius"; dates = "Nov 22 - Dec 21"; icon = '<i class="fa-solid fa-compass"></i>';
      desc = "Generous, idealistic, humorous, and adventure-seeking. Loves open fields.";
    } else if ((month == 12 && day >= 22) || (month == 1 && day <= 19)) {
      zodiac = "Capricorn"; dates = "Dec 22 - Jan 19"; icon = '<i class="fa-solid fa-mountain"></i>';
      desc = "Responsible, disciplined, traditional, and master managers. Climbs mountains.";
    } else if ((month == 1 && day >= 20) || (month == 2 && day <= 18)) {
      zodiac = "Aquarius"; dates = "Jan 20 - Feb 18"; icon = '<i class="fa-solid fa-droplet"></i>';
      desc = "Progressive, original, humanitarian, and highly independent. A visionary.";
    } else if ((month == 2 && day >= 19) || (month == 3 && day <= 20)) {
      zodiac = "Pisces"; dates = "Feb 19 - Mar 20"; icon = '<i class="fa-solid fa-fish"></i>';
      desc = "Compassionate, artistic, intuitive, and wise. Possesses deep spiritual empathy.";
    }

    elAge.zodiacName.textContent = zodiac;
    elAge.zodiacDates.textContent = dates;
    elAge.zodiacSymbol.innerHTML = icon;
    elAge.zodiacDesc.textContent = desc;
  }

  function calculateChineseZodiac(dob) {
    const year = dob.getFullYear();
    const animals = [
      { name: "Rat", icon: '<i class="fa-solid fa-mouse"></i>', desc: "Quick-witted, resourceful, versatile, kind, and smart." },
      { name: "Ox", icon: '<i class="fa-solid fa-cow"></i>', desc: "Diligent, dependable, strong, determined, and honest." },
      { name: "Tiger", icon: '<i class="fa-solid fa-cat"></i>', desc: "Brave, competitive, unpredictable, self-confident, and charming." },
      { name: "Rabbit", icon: '<i class="fa-solid fa-paw"></i>', desc: "Gentle, quiet, elegant, alert, quick, kind, and responsible." },
      { name: "Dragon", icon: '<i class="fa-solid fa-dragon"></i>', desc: "Confident, intelligent, enthusiastic, and powerful." },
      { name: "Snake", icon: '<i class="fa-solid fa-bugs"></i>', desc: "Enigmatic, intelligent, wise, and highly analytical." },
      { name: "Horse", icon: '<i class="fa-solid fa-horse"></i>', desc: "Animated, active, energetic, optimistic, and independent." },
      { name: "Goat", icon: '<i class="fa-solid fa-sheep"></i>', desc: "Gentle, mild-mannered, shy, sympathetic, and creative." },
      { name: "Monkey", icon: '<i class="fa-solid fa-face-smile"></i>', desc: "Sharp, smart, curious, mischievous, and highly innovative." },
      { name: "Rooster", icon: '<i class="fa-solid fa-crow"></i>', desc: "Observant, hardworking, resourceful, courageous, and talented." },
      { name: "Dog", icon: '<i class="fa-solid fa-dog"></i>', desc: "Lovely, honest, prudent, loyal, kind, and extremely helpful." },
      { name: "Pig", icon: '<i class="fa-solid fa-piggy-bank"></i>', desc: "Compassionate, generous, diligent, realistic, and honest." }
    ];

    // Chinese calendar cycles relative to year 4 (Rat)
    const baseOffset = (year - 4) % 12;
    const index = baseOffset >= 0 ? baseOffset : baseOffset + 12;
    const animal = animals[index];

    const chineseNameEl = document.getElementById('chinese-zodiac-name');
    const chineseYearEl = document.getElementById('chinese-zodiac-year');
    
    chineseNameEl.textContent = animal.name;
    chineseYearEl.textContent = `Year of the ${animal.name}`;
    elAge.chineseIcon.innerHTML = animal.icon;
    elAge.chineseDesc.textContent = animal.desc;
  }

  calculateAgeBtn.addEventListener('click', runAgeCalculator);
  
  // Run automatically on first view
  runAgeCalculator();


  // ==========================================
  // 4. DATE & DAYS CALCULATOR ENGINE
  // ==========================================
  
  // Date Difference Elements
  const dateStart = document.getElementById('date-start');
  const dateEnd = document.getElementById('date-end');
  const excludeWeekends = document.getElementById('exclude-weekends');
  const calculateDateDiffBtn = document.getElementById('calculate-date-diff-btn');
  
  const diffTotalDays = document.getElementById('diff-total-days');
  const diffYears = document.getElementById('diff-years');
  const diffMonths = document.getElementById('diff-months');
  const diffWeeks = document.getElementById('diff-weeks');
  const diffBusinessDays = document.getElementById('diff-business-days');

  // Prefill dates
  dateStart.value = todayStr;
  
  // Add 10 days to end date for default
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + 10);
  dateEnd.value = futureDate.toISOString().split('T')[0];

  function runDateDiffCalculator() {
    const startVal = dateStart.value;
    const endVal = dateEnd.value;

    if (!startVal || !endVal) return;

    const start = new Date(startVal + 'T00:00:00');
    const end = new Date(endVal + 'T00:00:00');

    if (end < start) {
      alert("Start Date must occur before End Date!");
      return;
    }

    const diffTime = Math.abs(end - start);
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Breakdown
    let years = end.getFullYear() - start.getFullYear();
    let months = end.getMonth() - start.getMonth();
    let days = end.getDate() - start.getDate();

    if (days < 0) {
      const prevMonth = new Date(end.getFullYear(), end.getMonth(), 0);
      days += prevMonth.getDate();
      months--;
    }
    if (months < 0) {
      months += 12;
      years--;
    }

    const totalWeeks = (totalDays / 7).toFixed(1);

    // Business Days math (Mon-Fri)
    let businessDays = 0;
    let tempDate = new Date(start);
    while (tempDate <= end) {
      const day = tempDate.getDay();
      if (day !== 0 && day !== 6) { // Not Sunday (0) or Saturday (6)
        businessDays++;
      }
      tempDate.setDate(tempDate.getDate() + 1);
    }

    // Render results
    diffTotalDays.textContent = totalDays;
    diffYears.textContent = years;
    diffMonths.textContent = months;
    diffWeeks.textContent = totalWeeks;
    
    if (excludeWeekends.checked) {
      diffBusinessDays.textContent = businessDays;
      diffBusinessDays.parentElement.style.opacity = '1';
    } else {
      diffBusinessDays.textContent = businessDays;
    }
  }

  calculateDateDiffBtn.addEventListener('click', runDateDiffCalculator);
  runDateDiffCalculator();

  // Add/Subtract Offset Elements
  const dateBase = document.getElementById('date-base');
  const addYears = document.getElementById('add-years');
  const addMonths = document.getElementById('add-months');
  const addWeeks = document.getElementById('add-weeks');
  const addDays = document.getElementById('add-days');
  const calculateDateAddSubBtn = document.getElementById('calculate-date-addsub-btn');
  
  const addsubTargetDate = document.getElementById('addsub-target-date');
  const addsubWeekday = document.getElementById('addsub-weekday');

  dateBase.value = todayStr;

  // Operation switcher
  let offsetOperation = 'add';
  const operationTabs = document.querySelectorAll('#date-sub-addsub .radio-tab');
  operationTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      operationTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      offsetOperation = tab.dataset.op;
    });
  });

  function runDateOffsetCalculator() {
    const baseVal = dateBase.value;
    if (!baseVal) return;

    const base = new Date(baseVal + 'T00:00:00');
    
    const yr = parseInt(addYears.value) || 0;
    const mo = parseInt(addMonths.value) || 0;
    const wk = parseInt(addWeeks.value) || 0;
    const dy = parseInt(addDays.value) || 0;

    const sign = offsetOperation === 'add' ? 1 : -1;

    // Apply offset
    base.setFullYear(base.getFullYear() + (yr * sign));
    base.setMonth(base.getMonth() + (mo * sign));
    
    // Add weeks and days
    const totalDaysOffset = (wk * 7) + dy;
    base.setDate(base.getDate() + (totalDaysOffset * sign));

    // Render Target Date
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const formattedDate = base.toLocaleDateString('en-US', options);
    
    addsubTargetDate.textContent = base.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    addsubWeekday.textContent = base.toLocaleDateString('en-US', { weekday: 'long' });
  }

  calculateDateAddSubBtn.addEventListener('click', runDateOffsetCalculator);
  runDateOffsetCalculator();


  // ==========================================
  // 5. TIME & TIME-ZONE CALCULATOR ENGINE
  // ==========================================
  
  // Time Math Elements
  const timeH1 = document.getElementById('time-h1');
  const timeM1 = document.getElementById('time-m1');
  const timeS1 = document.getElementById('time-s1');
  
  const timeH2 = document.getElementById('time-h2');
  const timeM2 = document.getElementById('time-m2');
  const timeS2 = document.getElementById('time-s2');

  const timeMathOutput = document.getElementById('time-math-output');
  const timeMathSubOutput = document.getElementById('time-math-sub-output');
  const calculateTimeMathBtn = document.getElementById('calculate-time-math-btn');

  let timeMathOp = 'add';
  document.getElementById('time-op-add').addEventListener('click', () => {
    document.getElementById('time-op-add').classList.add('active');
    document.getElementById('time-op-sub').classList.remove('active');
    timeMathOp = 'add';
  });
  document.getElementById('time-op-sub').addEventListener('click', () => {
    document.getElementById('time-op-sub').classList.add('active');
    document.getElementById('time-op-add').classList.remove('active');
    timeMathOp = 'sub';
  });

  function runTimeMath() {
    const h1 = parseInt(timeH1.value) || 0;
    const m1 = parseInt(timeM1.value) || 0;
    const s1 = parseInt(timeS1.value) || 0;

    const h2 = parseInt(timeH2.value) || 0;
    const m2 = parseInt(timeM2.value) || 0;
    const s2 = parseInt(timeS2.value) || 0;

    // Convert everything to seconds
    const totalSecs1 = (h1 * 3600) + (m1 * 60) + s1;
    const totalSecs2 = (h2 * 3600) + (m2 * 60) + s2;

    let finalSecs = 0;
    if (timeMathOp === 'add') {
      finalSecs = totalSecs1 + totalSecs2;
    } else {
      finalSecs = totalSecs1 - totalSecs2;
    }

    const isNegative = finalSecs < 0;
    finalSecs = Math.abs(finalSecs);

    // Convert back
    const hrs = Math.floor(finalSecs / 3600);
    const mins = Math.floor((finalSecs % 3600) / 60);
    const secs = finalSecs % 60;

    const formattedHrs = hrs.toString().padStart(2, '0');
    const formattedMins = mins.toString().padStart(2, '0');
    const formattedSecs = secs.toString().padStart(2, '0');

    const sign = isNegative ? '-' : '';
    timeMathOutput.textContent = `${sign}${formattedHrs}:${formattedMins}:${formattedSecs}`;
    
    const equivalentHours = (finalSecs / 3600).toFixed(2);
    timeMathSubOutput.textContent = `Equivalent: ${sign}${equivalentHours} hours total`;
  }

  calculateTimeMathBtn.addEventListener('click', runTimeMath);
  runTimeMath();

  // World Time Zone Converter
  const tzBaseSelect = document.getElementById('tz-base-select');
  const tzBaseTimeInput = document.getElementById('tz-base-time');
  const tzSlider = document.getElementById('tz-slider');
  const tzResultsContainer = document.getElementById('tz-converter-results');

  const TIME_ZONES = [
    { label: 'London (GMT/BST - UTC+0/+1)', offset: 0, bst: true },
    { label: 'New York (EST/EDT - UTC-5/-4)', offset: -5, bst: true },
    { label: 'Los Angeles (PST/PDT - UTC-8/-7)', offset: -8, bst: true },
    { label: 'Dubai (GST - UTC+4)', offset: 4, bst: false },
    { label: 'New Delhi (IST - UTC+5:30)', offset: 5.5, bst: false },
    { label: 'Tokyo (JST - UTC+9)', offset: 9, bst: false },
    { label: 'Sydney (AEST/AEDT - UTC+10/+11)', offset: 10, bst: true },
    { label: 'Paris (CET/CEST - UTC+1/+2)', offset: 1, bst: true },
  ];

  function initTimezoneConverter() {
    tzBaseSelect.innerHTML = '';
    TIME_ZONES.forEach((tz, index) => {
      const opt = document.createElement('option');
      opt.value = index;
      opt.textContent = tz.label;
      if (tz.label.includes('New Delhi')) opt.selected = true; // Default
      tzBaseSelect.appendChild(opt);
    });

    // Default time: current local time
    const now = new Date();
    const currentH = now.getHours().toString().padStart(2, '0');
    const currentM = now.getMinutes().toString().padStart(2, '0');
    tzBaseTimeInput.value = `${currentH}:${currentM}`;
    
    // Sync slider (value = total minutes in day)
    tzSlider.value = (now.getHours() * 60) + now.getMinutes();

    renderTimezoneClocks();
  }

  function renderTimezoneClocks() {
    const baseTzIdx = parseInt(tzBaseSelect.value) || 0;
    const baseTz = TIME_ZONES[baseTzIdx];
    
    const sliderMins = parseInt(tzSlider.value);
    const sliderHrs = Math.floor(sliderMins / 60);
    const sliderRemainingMins = sliderMins % 60;
    
    // Sync time input visual box
    tzBaseTimeInput.value = `${sliderHrs.toString().padStart(2, '0')}:${sliderRemainingMins.toString().padStart(2, '0')}`;

    tzResultsContainer.innerHTML = '';

    // Create a base UTC representation for calculation
    const baseHourFloat = sliderHrs + (sliderRemainingMins / 60);
    const utcTimeFloat = baseHourFloat - baseTz.offset;

    TIME_ZONES.forEach(tz => {
      // Calculate local time float
      let localTimeFloat = utcTimeFloat + tz.offset;
      
      let dayOffsetLabel = "Today";
      
      // Handle day roll overs
      if (localTimeFloat >= 24) {
        localTimeFloat -= 24;
        dayOffsetLabel = "Tomorrow";
      } else if (localTimeFloat < 0) {
        localTimeFloat += 24;
        dayOffsetLabel = "Yesterday";
      }

      // Convert float back to clean hours and minutes
      const hours = Math.floor(localTimeFloat);
      const minutes = Math.round((localTimeFloat - hours) * 60);

      // format clean digital AM/PM
      let ampm = 'AM';
      let displayHours = hours;
      
      if (displayHours >= 12) {
        ampm = 'PM';
        if (displayHours > 12) displayHours -= 12;
      } else if (displayHours === 0) {
        displayHours = 12;
      }

      const formattedTime = `${displayHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} ${ampm}`;

      const card = document.createElement('div');
      card.className = 'city-clock-glow-card';
      
      // Parse a clean city name from label
      const cityName = tz.label.split(' ')[0];

      card.innerHTML = `
        <div class="city-meta-col">
          <h4>${cityName}</h4>
          <span>UTC ${tz.offset >= 0 ? '+' : ''}${tz.offset}</span>
        </div>
        <div class="city-time-col">
          <div class="city-time">${formattedTime}</div>
          <div class="city-day">${dayOffsetLabel}</div>
        </div>
      `;

      tzResultsContainer.appendChild(card);
    });
  }

  // Bind Listeners
  tzBaseSelect.addEventListener('change', renderTimezoneClocks);
  
  tzBaseTimeInput.addEventListener('input', () => {
    const timeParts = tzBaseTimeInput.value.split(':');
    if (timeParts.length === 2) {
      const h = parseInt(timeParts[0]);
      const m = parseInt(timeParts[1]);
      tzSlider.value = (h * 60) + m;
      renderTimezoneClocks();
    }
  });

  tzSlider.addEventListener('input', renderTimezoneClocks);

  // Start clocks
  initTimezoneConverter();


  // ==========================================
  // 6. TIP & SPLIT BILL CALCULATOR ENGINE
  // ==========================================
  const billAmountEl = document.getElementById('bill-amount');
  const tipPctSlider = document.getElementById('tip-pct');
  const tipPctValLabel = document.getElementById('tip-pct-val');
  const splitSlider = document.getElementById('split-count');
  const splitValLabel = document.getElementById('split-count-val');
  
  const tipPerPersonEl = document.getElementById('tip-per-person');
  const totalPerPersonEl = document.getElementById('total-per-person');
  const grandTotalBillEl = document.getElementById('grand-total-bill');
  const grandTotalTipEl = document.getElementById('grand-total-tip');

  const quickTipBtns = document.querySelectorAll('.quick-tip-btn');

  function calculateSplits() {
    const bill = parseFloat(billAmountEl.value) || 0;
    const tipPct = parseInt(tipPctSlider.value);
    const splitCount = parseInt(splitSlider.value);

    // Labels
    tipPctValLabel.textContent = `${tipPct}%`;
    splitValLabel.textContent = `${splitCount} ${splitCount === 1 ? 'Person' : 'People'}`;

    const totalTip = bill * (tipPct / 100);
    const totalBill = bill + totalTip;

    const tipPerPerson = totalTip / splitCount;
    const totalPerPerson = totalBill / splitCount;

    // Render currency
    tipPerPersonEl.textContent = `$${tipPerPerson.toFixed(2)}`;
    totalPerPersonEl.textContent = `$${totalPerPerson.toFixed(2)}`;
    grandTotalBillEl.textContent = `$${totalBill.toFixed(2)}`;
    grandTotalTipEl.textContent = `$${totalTip.toFixed(2)}`;
  }

  // Quick Tip Snap pills
  quickTipBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      quickTipBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const pct = parseInt(btn.dataset.tip);
      tipPctSlider.value = pct;
      calculateSplits();
    });
  });

  // Bind inputs
  billAmountEl.addEventListener('input', calculateSplits);
  
  tipPctSlider.addEventListener('input', () => {
    calculateSplits();
    // remove active standard pills if custom slider moves
    quickTipBtns.forEach(b => {
      if (parseInt(b.dataset.tip) !== parseInt(tipPctSlider.value)) {
        b.classList.remove('active');
      } else {
        b.classList.add('active');
      }
    });
  });

  splitSlider.addEventListener('input', calculateSplits);

  // Initial Tip Render
  calculateSplits();


  // ==========================================
  // 7. BMI HEALTH ANALYZER ENGINE
  // ==========================================
  const bmiSysMetricBtn = document.getElementById('bmi-sys-metric');
  const bmiSysImperialBtn = document.getElementById('bmi-sys-imperial');
  const bmiMetricForm = document.getElementById('bmi-metric-inputs');
  const bmiImperialForm = document.getElementById('bmi-imperial-inputs');

  const weightMetricInput = document.getElementById('bmi-weight-metric');
  const heightMetricInput = document.getElementById('bmi-height-metric');
  
  const weightImperialInput = document.getElementById('bmi-weight-imperial');
  const heightFeetInput = document.getElementById('bmi-height-feet');
  const heightInchesInput = document.getElementById('bmi-height-inches');
  
  const calculateBmiBtn = document.getElementById('calculate-bmi-btn');

  const bmiValueEl = document.getElementById('bmi-value-display');
  const bmiCategoryEl = document.getElementById('bmi-category-label');
  const bmiPin = document.getElementById('bmi-pin');
  const bmiAdviceTitle = document.getElementById('bmi-advice-title');
  const bmiAdviceText = document.getElementById('bmi-advice-text');
  const bmiScoreRing = document.getElementById('bmi-score-ring');

  let bmiMeasurementSystem = 'metric';

  bmiSysMetricBtn.addEventListener('click', () => {
    bmiSysMetricBtn.classList.add('active');
    bmiSysImperialBtn.classList.remove('active');
    bmiMetricForm.style.display = 'block';
    bmiImperialForm.style.display = 'none';
    bmiMeasurementSystem = 'metric';
  });

  bmiSysImperialBtn.addEventListener('click', () => {
    bmiSysImperialBtn.classList.add('active');
    bmiSysMetricBtn.classList.remove('active');
    bmiImperialForm.style.display = 'block';
    bmiMetricForm.style.display = 'none';
    bmiMeasurementSystem = 'imperial';
  });

  function evaluateBmiScore() {
    let bmi = 0;

    if (bmiMeasurementSystem === 'metric') {
      const kg = parseFloat(weightMetricInput.value) || 0;
      const cm = parseFloat(heightMetricInput.value) || 0;
      if (kg > 0 && cm > 0) {
        const heightMeters = cm / 100;
        bmi = kg / (heightMeters * heightMeters);
      }
    } else {
      const lbs = parseFloat(weightImperialInput.value) || 0;
      const ft = parseInt(heightFeetInput.value) || 0;
      const inch = parseInt(heightInchesInput.value) || 0;
      const totalInches = (ft * 12) + inch;
      if (lbs > 0 && totalInches > 0) {
        bmi = (lbs / (totalInches * totalInches)) * 703;
      }
    }

    if (bmi === 0) return;

    const finalBmi = parseFloat(bmi.toFixed(1));
    bmiValueEl.textContent = finalBmi;

    // Categories advice map
    let category = "Normal";
    let adviceTitle = "Healthy Target Weight";
    let adviceText = "Your BMI is within the healthy weight target range. Excellent job! Keep doing what you're doing, eating balanced nutrients and engaging in daily exercises.";
    let themeColor = "var(--accent-green)";
    let glowShadow = "var(--accent-green-glow)";
    let pinPct = 50; // default center

    if (finalBmi < 18.5) {
      category = "Underweight";
      adviceTitle = "Nutrient Rich Focus";
      adviceText = "Your BMI score points to underweight status. It is advisable to focus on consuming calorie-dense, nutrient-rich whole foods. Consider muscle-building resistance training.";
      themeColor = "var(--accent-blue)";
      glowShadow = "var(--accent-blue-glow)";
      // pin pct map (range: 10 to 18.5 maps to 0% to 25%)
      pinPct = Math.max(5, Math.min(22, ((finalBmi - 10) / 8.5) * 25));
    } else if (finalBmi >= 18.5 && finalBmi < 25) {
      // Normal weight
      category = "Healthy";
      themeColor = "var(--accent-green)";
      glowShadow = "var(--accent-green-glow)";
      // pin pct map (range: 18.5 to 25 maps to 25% to 50%)
      pinPct = 25 + (((finalBmi - 18.5) / 6.5) * 25);
    } else if (finalBmi >= 25 && finalBmi < 30) {
      category = "Overweight";
      adviceTitle = "Active Lifestyle Shifts";
      adviceText = "Your BMI lands in the overweight region. Incorporating moderate aerobic routines (150 mins per week) and focusing on dietary portion controls can help realign your weight goals.";
      themeColor = "var(--accent-yellow)";
      glowShadow = "0 0 25px rgba(245, 158, 11, 0.25)";
      // pin pct map (range: 25 to 30 maps to 50% to 75%)
      pinPct = 50 + (((finalBmi - 25) / 5) * 25);
    } else {
      category = "Obese";
      adviceTitle = "Clinical Health Awareness";
      adviceText = "Your BMI score falls under the obesity category. It is highly recommended to consult healthcare professionals to evaluate metabolic health indicators and draft safe fitness regimens.";
      themeColor = "var(--danger)";
      glowShadow = "var(--danger-glow)";
      // pin pct map (range: 30 to 45 maps to 75% to 95%)
      pinPct = 75 + Math.min(20, (((finalBmi - 30) / 15) * 20));
    }

    // Apply aesthetics
    bmiCategoryEl.textContent = category;
    bmiCategoryEl.style.color = themeColor;
    
    bmiScoreRing.style.borderColor = themeColor;
    bmiScoreRing.style.boxShadow = `0 0 35px ${glowShadow}`;

    bmiPin.style.left = `${pinPct}%`;
    bmiPin.style.borderColor = themeColor;

    bmiAdviceTitle.textContent = adviceTitle;
    bmiAdviceText.textContent = adviceText;
  }

  calculateBmiBtn.addEventListener('click', evaluateBmiScore);
  evaluateBmiScore();


  // ==========================================
  // 8. COMPOUND INTEREST / INVESTMENT ENGINE
  // ==========================================
  const invPrincipal = document.getElementById('inv-principal');
  const invMonthly = document.getElementById('inv-monthly');
  const invRate = document.getElementById('inv-rate');
  const invYears = document.getElementById('inv-years');
  const invCompoundFreq = document.getElementById('inv-compound-freq');
  const calculateInvestmentBtn = document.getElementById('calculate-investment-btn');

  const invTotalValueEl = document.getElementById('inv-total-value');
  const invTotalPrincipalEl = document.getElementById('inv-total-principal');
  const invTotalInterestEl = document.getElementById('inv-total-interest');
  const growthTableBody = document.getElementById('investment-growth-table-body');

  function calculateInvestmentGrowth() {
    const principal = parseFloat(invPrincipal.value) || 0;
    const monthlyContribution = parseFloat(invMonthly.value) || 0;
    const rateVal = parseFloat(invRate.value) || 0;
    const years = parseInt(invYears.value) || 1;
    const freq = parseInt(invCompoundFreq.value) || 12;

    const rate = rateVal / 100;
    
    let totalBalance = principal;
    let totalInvested = principal;
    let totalInterest = 0;

    growthTableBody.innerHTML = '';
    
    // Yearly tracker arrays to build rows
    for (let yr = 1; yr <= years; yr++) {
      // Math for a single year compounding
      // Freq = times per year compounded (e.g. 12 = monthly)
      // For each compounding period, calculate interest and add contribution
      const monthsPerCompoundingPeriod = 12 / freq;

      for (let period = 1; period <= freq; period++) {
        // Add monthly contributions that occurred in this period
        const periodContribution = monthlyContribution * monthsPerCompoundingPeriod;
        
        // Add contribution before or after compounding interest? Standard assumes continuous addition
        totalBalance += periodContribution;
        totalInvested += periodContribution;

        // Interest earned this compounding cycle
        const cycleInterest = totalBalance * (rate / freq);
        totalBalance += cycleInterest;
        totalInterest += cycleInterest;
      }

      // Append row to Schedule Table
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>Year ${yr}</td>
        <td>$${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td>$${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
        <td><strong>$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong></td>
      `;
      growthTableBody.appendChild(row);
    }

    // Render Summaries
    invTotalValueEl.textContent = `$${totalBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    invTotalPrincipalEl.textContent = `$${totalInvested.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
    invTotalInterestEl.textContent = `$${totalInterest.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }

  calculateInvestmentBtn.addEventListener('click', calculateInvestmentGrowth);
  calculateInvestmentGrowth();

});
