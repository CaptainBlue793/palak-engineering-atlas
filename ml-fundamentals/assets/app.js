/* =========================================================
   Palak Deb Patra's ML Fundamentals Playlist — shared runtime
   Builds the shell (sidebar, topbar, footer nav) and wires up
   generic components: tabs, steppers, quizzes, flip cards, seg controls.
   Exposes helpers on window.MLF for chapter-specific visualizers.
   ========================================================= */
(function () {
  const CHAPTERS = [
    { n: 0.1, file: 'p1-python-for-data.html',         title: 'Python for Data Work', level: 'Prerequisites', icon: '🐍', mins: 40, blurb: 'The Python the course uses: virtual environments, notebooks, functions, comprehensions and reading files.' },
    { n: 0.2, file: 'p2-numpy.html',                   title: 'NumPy Arrays & Vectorisation', level: 'Prerequisites', icon: '🔢', mins: 40, blurb: 'Arrays, shapes, broadcasting and why a vectorised line beats a Python loop by a hundred times.' },
    { n: 0.3, file: 'p3-pandas.html',                  title: 'pandas DataFrames', level: 'Prerequisites', icon: '🐼', mins: 40, blurb: 'Loading, selecting, filtering, grouping and joining tabular data: the shape every dataset here arrives in.' },
    { n: 0.4, file: 'p4-linear-algebra.html',          title: 'Linear Algebra for ML', level: 'Prerequisites', icon: '📐', mins: 45, blurb: 'Vectors, matrices, dot products, norms and projections: enough to read every model in the course as matrix maths.' },
    { n: 0.5, file: 'p5-calculus.html',                title: 'Derivatives & Gradients', level: 'Prerequisites', icon: '📈', mins: 40, blurb: 'Slopes, partial derivatives, the gradient and the chain rule: what gradient descent actually follows.' },
    { n: 0.6, file: 'p6-probability.html',             title: 'Probability', level: 'Prerequisites', icon: '🎲', mins: 40, blurb: 'Random variables, distributions, conditional probability and Bayes\' rule, simulated rather than proved.' },
    { n: 0.7, file: 'p7-statistics.html',              title: 'Statistics for ML', level: 'Prerequisites', icon: '📊', mins: 40, blurb: 'Samples, estimates, confidence intervals, correlation and the bootstrap: how to tell signal from noise.' },
    { n: 0.8, file: 'p8-eda-plotting.html',            title: 'Exploratory Data Analysis', level: 'Prerequisites', icon: '🔍', mins: 35, blurb: 'Plotting a dataset before modelling it: distributions, relationships, and the problems a chart finds in seconds.' },
    { n: 1, file: '01-what-is-ml.html',              title: 'What Machine Learning Is', level: 'Beginner', icon: '🧭', mins: 35, blurb: 'Learning a rule from examples instead of writing it: supervised, unsupervised, and when not to use ML at all.' },
    { n: 2, file: '02-ml-workflow.html',             title: 'The ML Workflow End to End', level: 'Beginner', icon: '🔁', mins: 45, blurb: 'One complete project in scikit-learn: frame the problem, split, baseline, fit, evaluate, iterate.' },
    { n: 3, file: '03-data-splits.html',             title: 'Train, Validation & Test Splits', level: 'Beginner', icon: '✂️', mins: 35, blurb: 'Why the test set is touched once, stratified and time-based splits, and the first look at leakage.' },
    { n: 4, file: '04-linear-regression.html',       title: 'Linear Regression', level: 'Beginner', icon: '📏', mins: 45, blurb: 'Fitting a line by least squares, reading coefficients, and the assumptions that make them trustworthy.' },
    { n: 5, file: '05-gradient-descent.html',        title: 'Gradient Descent', level: 'Beginner', icon: '⛰️', mins: 45, blurb: 'Walking downhill on a loss surface: learning rates, batch vs mini-batch vs stochastic, and convergence.' },
    { n: 6, file: '06-loss-functions.html',          title: 'Loss Functions', level: 'Beginner', icon: '🎯', mins: 35, blurb: 'MSE, MAE, Huber, log loss and hinge: what each one punishes, and how the choice changes the model.' },
    { n: 7, file: '07-logistic-regression.html',     title: 'Logistic Regression', level: 'Beginner', icon: '🔀', mins: 45, blurb: 'From a score to a probability: the sigmoid, decision boundaries, and why it is still the first classifier to try.' },
    { n: 8, file: '08-classification-metrics.html',  title: 'Classification Metrics', level: 'Beginner', icon: '🧮', mins: 45, blurb: 'The confusion matrix, precision and recall, F1, ROC and PR curves, and choosing a threshold on purpose.' },
    { n: 9, file: '09-regression-metrics.html',      title: 'Regression Metrics & Baselines', level: 'Beginner', icon: '📉', mins: 35, blurb: 'RMSE, MAE, R² and MAPE, what each hides, and the dummy baseline every model must beat.' },
    { n: 10, file: '10-knn.html',                     title: 'k-Nearest Neighbours', level: 'Beginner', icon: '📍', mins: 35, blurb: 'Predicting from the closest examples: distance metrics, why scaling matters, and the curse of dimensionality.' },
    { n: 11, file: '11-bias-variance.html',           title: 'Overfitting & the Bias–Variance Trade-off', level: 'Intermediate', icon: '⚖️', mins: 45, blurb: 'Too simple, too flexible, and the learning curves that tell you which one you have.' },
    { n: 12, file: '12-regularisation.html',          title: 'Regularisation: Ridge, Lasso & Elastic Net', level: 'Intermediate', icon: '🪢', mins: 40, blurb: 'Penalising large weights: L2 shrinks, L1 selects, and the strength is a hyperparameter you tune.' },
    { n: 13, file: '13-cross-validation.html',        title: 'Cross-Validation & Hyperparameter Search', level: 'Intermediate', icon: '🔄', mins: 45, blurb: 'k-fold, grouped and time-series CV, grid vs random vs Bayesian search, and nested CV for honest scores.' },
    { n: 14, file: '14-numeric-features.html',        title: 'Feature Engineering for Numbers', level: 'Intermediate', icon: '🛠️', mins: 40, blurb: 'Scaling, log transforms, binning, ratios, interactions and polynomial features, and which models need which.' },
    { n: 15, file: '15-categorical-features.html',    title: 'Categorical Features & Encodings', level: 'Intermediate', icon: '🏷️', mins: 40, blurb: 'One-hot, ordinal, target and hashing encodings, high cardinality, and how target encoding leaks.' },
    { n: 16, file: '16-missing-data-outliers.html',   title: 'Missing Data & Outliers', level: 'Intermediate', icon: '🕳️', mins: 35, blurb: 'Why values go missing, imputation strategies, missingness indicators, and handling outliers without hiding bugs.' },
    { n: 17, file: '17-decision-trees.html',          title: 'Decision Trees', level: 'Intermediate', icon: '🌳', mins: 45, blurb: 'Splitting on the most informative question: Gini and entropy, depth, pruning, and why one tree overfits.' },
    { n: 18, file: '18-random-forests.html',          title: 'Random Forests & Bagging', level: 'Intermediate', icon: '🌲', mins: 40, blurb: 'Many decorrelated trees voting: bootstrapping, feature subsampling, out-of-bag scores and importances.' },
    { n: 19, file: '19-gradient-boosting.html',       title: 'Gradient Boosting', level: 'Intermediate', icon: '🚀', mins: 50, blurb: 'Trees that fix the previous trees\' mistakes: the idea, XGBoost, LightGBM and CatBoost, and the knobs that matter.' },
    { n: 20, file: '20-svm-kernels.html',             title: 'Support Vector Machines & Kernels', level: 'Intermediate', icon: '🛡️', mins: 45, blurb: 'The widest margin, soft margins for messy data, and the kernel trick that bends a straight boundary.' },
    { n: 21, file: '21-naive-bayes.html',             title: 'Naive Bayes & Generative Classifiers', level: 'Intermediate', icon: '📨', mins: 35, blurb: 'Bayes\' rule with a bold independence assumption: fast, surprisingly strong on text, and easy to break.' },
    { n: 22, file: '22-multiclass-multilabel.html',   title: 'Multi-Class & Multi-Label Problems', level: 'Intermediate', icon: '🗂️', mins: 35, blurb: 'One-vs-rest, one-vs-one, softmax regression, multi-label outputs, and macro vs micro averaging.' },
    { n: 23, file: '23-imbalanced-data.html',         title: 'Imbalanced Data', level: 'Intermediate', icon: '🪶', mins: 40, blurb: 'When 1 in 1,000 is positive: class weights, resampling and SMOTE, threshold moving, and the right metric.' },
    { n: 24, file: '24-sklearn-pipelines.html',       title: 'scikit-learn Pipelines', level: 'Intermediate', icon: '🧱', mins: 40, blurb: 'Pipeline and ColumnTransformer: preprocessing that is fitted on training folds only and ships with the model.' },
    { n: 25, file: '25-kmeans.html',                  title: 'Clustering with k-Means', level: 'Advanced', icon: '🔵', mins: 40, blurb: 'Grouping without labels: Lloyd\'s algorithm, k-means++, choosing k, and the shapes k-means cannot find.' },
    { n: 26, file: '26-density-hierarchical.html',    title: 'Density & Hierarchical Clustering', level: 'Advanced', icon: '🫧', mins: 40, blurb: 'DBSCAN and HDBSCAN for arbitrary shapes and noise, agglomerative clustering and reading a dendrogram.' },
    { n: 27, file: '27-pca.html',                     title: 'Dimensionality Reduction with PCA', level: 'Advanced', icon: '🗜️', mins: 45, blurb: 'Finding the directions of most variance with SVD, choosing how many to keep, and what PCA throws away.' },
    { n: 28, file: '28-tsne-umap.html',               title: 'Visualising High Dimensions: t-SNE & UMAP', level: 'Advanced', icon: '🗺️', mins: 35, blurb: 'Non-linear maps for looking at data, and the ways they mislead: distances, cluster sizes and perplexity.' },
    { n: 29, file: '29-anomaly-detection.html',       title: 'Anomaly Detection', level: 'Advanced', icon: '🚨', mins: 40, blurb: 'Finding the rare odd one out: statistical rules, isolation forests, LOF and one-class SVMs.' },
    { n: 30, file: '30-time-series.html',             title: 'Time-Series Forecasting', level: 'Advanced', icon: '⏱️', mins: 50, blurb: 'Trend and seasonality, lag and rolling features, gradient boosting for forecasts, and backtesting without peeking.' },
    { n: 31, file: '31-collaborative-filtering.html', title: 'Recommender Basics: Collaborative Filtering', level: 'Advanced', icon: '🎬', mins: 45, blurb: 'Users who liked this also liked: neighbourhood methods, matrix factorisation, implicit feedback and cold start.' },
    { n: 32, file: '32-calibration.html',             title: 'Probability Calibration', level: 'Advanced', icon: '🎚️', mins: 35, blurb: 'When a model says 70%, is it right 70% of the time? Reliability diagrams, Platt scaling, isotonic regression.' },
    { n: 33, file: '33-interpretability.html',        title: 'Model Interpretability', level: 'Advanced', icon: '🔬', mins: 45, blurb: 'Why did it predict that? Permutation importance, partial dependence, SHAP values, and their limits.' },
    { n: 34, file: '34-feature-selection.html',       title: 'Feature Selection', level: 'Advanced', icon: '🧹', mins: 35, blurb: 'Filter, wrapper and embedded methods, mutual information, and selecting features without leaking the test set.' },
    { n: 35, file: '35-ensembles-stacking.html',      title: 'Ensembles & Stacking', level: 'Advanced', icon: '🧩', mins: 35, blurb: 'Voting, averaging, stacking and blending: when combining models helps and when it only adds cost.' },
    { n: 36, file: '36-comparing-models.html',        title: 'Comparing Models Honestly', level: 'Advanced', icon: '🧪', mins: 40, blurb: 'Is model B really better? Paired tests, bootstrap confidence intervals, and the multiple-comparisons trap.' },
    { n: 37, file: '37-data-leakage.html',            title: 'Data Leakage', level: 'Expert', icon: '💧', mins: 45, blurb: 'A catalogue of the ways future or test information sneaks into training, and how to catch each one.' },
    { n: 38, file: '38-debugging-models.html',        title: 'Debugging a Model That Doesn’t Work', level: 'Expert', icon: '🐞', mins: 45, blurb: 'A systematic path from "the score is bad": data checks, label noise, error analysis and slicing.' },
    { n: 39, file: '39-notebook-to-production.html',  title: 'From Notebook to Production', level: 'Expert', icon: '📦', mins: 40, blurb: 'Saving and versioning a model, serving a scikit-learn pipeline behind an API, and watching it for drift.' },
    { n: 40, file: '40-interview-playbook.html',      title: 'The ML Fundamentals Interview Playbook', level: 'Expert', icon: '🎤', mins: 45, blurb: 'The questions ML interviews actually ask about models, metrics and trade-offs, and how to answer them.' },
    { n: 41, file: '41-case-zillow-offers.html',      title: 'Case Study: Zillow Offers and Price Prediction', level: 'Case Studies', icon: '🏠', mins: 40, blurb: 'A house-price model priced real purchases in a shifting market, and the business was shut down in 2021.' },
    { n: 42, file: '42-case-netflix-prize.html',      title: 'Case Study: The Netflix Prize', level: 'Case Studies', icon: '🍿', mins: 40, blurb: 'A public competition for a 10% better recommender: matrix factorisation, huge ensembles, and what shipped.' },
    { n: 43, file: '43-case-google-flu-trends.html',  title: 'Case Study: Google Flu Trends', level: 'Case Studies', icon: '🤒', mins: 35, blurb: 'Predicting flu from search queries worked, until it badly overestimated: overfitting and drifting inputs.' },
    { n: 44, file: '44-case-compas-fairness.html',    title: 'Case Study: COMPAS and Fairness Metrics', level: 'Case Studies', icon: '🏛️', mins: 45, blurb: 'A risk score judged both fair and unfair by different metrics, and the result that they cannot all hold at once.' },
    { n: 45, file: '45-case-spam-filter.html',        title: 'Case Study: Building a Spam Filter', level: 'Case Studies', icon: '📧', mins: 40, blurb: 'From bag-of-words Naive Bayes to gradient boosting on engineered features, with adversaries who adapt.' },
    { n: 46, file: '46-case-fraud-detection.html',    title: 'Case Study: Card-Fraud Detection', level: 'Case Studies', icon: '💳', mins: 40, blurb: 'Extreme imbalance, delayed labels and a review team with limited capacity: supervised and anomaly methods together.' },
    { n: 47, file: '47-case-churn.html',              title: 'Case Study: Customer Churn, from Model to Decision', level: 'Case Studies', icon: '🚪', mins: 40, blurb: 'Predicting who will leave is the easy part: costs, thresholds, uplift, and whether the retention offer pays.' },
    { n: 48, file: '48-case-m5-forecasting.html',     title: 'Case Study: The M5 Forecasting Competition', level: 'Case Studies', icon: '🛒', mins: 45, blurb: 'Forecasting Walmart sales for tens of thousands of series: why gradient boosting dominated, and the validation that mattered.' },
  ];

  const LEVELS = [
    ['Prerequisites', 'var(--green)', 'Python, NumPy, pandas, and the linear algebra, calculus, probability and statistics the models use.'],
    ['Beginner', 'var(--accent)', 'The workflow, linear and logistic regression, gradient descent, losses, metrics and nearest neighbours.'],
    ['Intermediate', 'color-mix(in srgb, var(--accent-2) 25%, var(--accent))', 'Overfitting, regularisation, cross-validation, features, trees, forests, boosting, SVMs and pipelines.'],
    ['Advanced', 'color-mix(in srgb, var(--accent-2) 50%, var(--accent))', 'Clustering, dimensionality reduction, anomalies, forecasting, recommenders, calibration and interpretability.'],
    ['Expert', 'color-mix(in srgb, var(--accent-2) 75%, var(--accent))', 'Leakage, debugging a failing model, getting to production, and the interview playbook.'],
    ['Case Studies', 'var(--accent-2)', 'Eight real models and competitions, from Zillow Offers to the Netflix Prize and M5.'],
  ];


  // Prerequisites are stored as 0.1…0.8 (so they sort before Chapter 1) and shown as P1…P8.
  const isPre = (n) => n > 0 && n < 1;
  const numOf = (c) => (c && typeof c === 'object' ? c.n : +c);
  const chNum = (c) => { const n = numOf(c); return isPre(n) ? 'P' + Math.round(n * 10) : String(n); };
  const chName = (c) => { const n = numOf(c); return isPre(n) ? 'Prerequisite ' + Math.round(n * 10) : 'Chapter ' + n; };

  const LS = {
    get(k, d) { try { const v = localStorage.getItem(k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
  };
  // The old single "Chapter 0" became the Prerequisites level: finishing it counts as finishing all of them.
  (function migratePrereqs() {
    const d = LS.get('mlf-done', []);
    if (!Array.isArray(d) || !d.includes(0)) return;
    const pre = CHAPTERS.filter((c) => isPre(c.n)).map((c) => c.n);
    LS.set('mlf-done', [...new Set(d.filter((n) => n !== 0).concat(pre))]);
    const q = LS.get('mlf-quiz', {}); delete q[0]; LS.set('mlf-quiz', q);
  })();
  const doneSet = () => new Set(LS.get('mlf-done', []));

  /* ---------------- helpers ---------------- */
  const SVGNS = 'http://www.w3.org/2000/svg';
  const MLF = {
    CHAPTERS, LEVELS, LS, chNum, chName,
    $: (s, r = document) => r.querySelector(s),
    $$: (s, r = document) => [...r.querySelectorAll(s)],
    sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
    rand: (a, b) => a + Math.random() * (b - a),
    randInt: (a, b) => Math.floor(a + Math.random() * (b - a + 1)),
    clamp: (v, a, b) => Math.max(a, Math.min(b, v)),
    fmt(n, d = 1) {
      if (!isFinite(n)) return '∞';
      const a = Math.abs(n);
      if (a >= 1e12) return (n / 1e12).toFixed(d).replace(/\.0+$/, '') + 'T';
      if (a >= 1e9) return (n / 1e9).toFixed(d).replace(/\.0+$/, '') + 'B';
      if (a >= 1e6) return (n / 1e6).toFixed(d).replace(/\.0+$/, '') + 'M';
      if (a >= 1e3) return (n / 1e3).toFixed(d).replace(/\.0+$/, '') + 'K';
      return (Math.round(n * 10 ** d) / 10 ** d).toString();
    },
    bytes(b) {
      const u = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB'];
      let i = 0; while (b >= 1000 && i < u.length - 1) { b /= 1000; i++; }
      return (b >= 100 ? b.toFixed(0) : b >= 10 ? b.toFixed(1) : b.toFixed(2)).replace(/\.0+$/, '') + ' ' + u[i];
    },
    svg(tag, attrs = {}, parent) {
      const e = document.createElementNS(SVGNS, tag);
      for (const k in attrs) {
        if (k === 'text') e.textContent = attrs[k];
        else e.setAttribute(k, attrs[k]);
      }
      if (parent) parent.appendChild(e);
      return e;
    },
    /** centre of any element in the coordinate space of its owner <svg> */
    center(svg, el) {
      if (typeof el === 'string') el = svg.querySelector('#' + CSS.escape(el));
      const r = el.getBoundingClientRect();
      const pt = svg.createSVGPoint();
      pt.x = r.left + r.width / 2; pt.y = r.top + r.height / 2;
      const p = pt.matrixTransform(svg.getScreenCTM().inverse());
      return { x: p.x, y: p.y };
    },
    /** animate a glowing dot from (x1,y1) to (x2,y2). resolves when done */
    packet(svg, x1, y1, x2, y2, o = {}) {
      const color = o.color || 'var(--accent)';
      const dur = o.dur || 700;
      const g = MLF.svg('g', { class: 'packet', style: `color:${color}` }, svg);
      const c = MLF.svg('circle', { r: o.r || 6, fill: color }, g);
      let t2;
      if (o.label) t2 = MLF.svg('text', { 'font-size': 10, 'text-anchor': 'middle', fill: color, 'font-weight': 700, text: o.label, style: 'font-family:var(--mono)' }, g);
      const ease = (t) => (t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
      return new Promise((res) => {
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const e = ease(t);
          const x = x1 + (x2 - x1) * e, y = y1 + (y2 - y1) * e;
          c.setAttribute('cx', x); c.setAttribute('cy', y);
          if (t2) { t2.setAttribute('x', x); t2.setAttribute('y', y - 11); }
          if (t < 1) requestAnimationFrame(tick);
          else { if (!o.keep) g.remove(); res(g); }
        };
        requestAnimationFrame(tick);
      });
    },
    packetBetween(svg, a, b, o) {
      const p = MLF.center(svg, a), q = MLF.center(svg, b);
      return MLF.packet(svg, p.x, p.y, q.x, q.y, o);
    },
    /** animate along an existing <path> */
    packetAlong(svg, path, o = {}) {
      const len = path.getTotalLength();
      const dur = o.dur || 900;
      const g = MLF.svg('g', { class: 'packet', style: `color:${o.color || 'var(--accent)'}` }, svg);
      const c = MLF.svg('circle', { r: o.r || 6, fill: o.color || 'var(--accent)' }, g);
      return new Promise((res) => {
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const p = path.getPointAtLength(o.reverse ? len * (1 - t) : len * t);
          c.setAttribute('cx', p.x); c.setAttribute('cy', p.y);
          if (t < 1) requestAnimationFrame(tick); else { g.remove(); res(); }
        };
        requestAnimationFrame(tick);
      });
    },
    log(el, html, cls = '') {
      const d = document.createElement('div');
      if (cls) d.className = cls;
      d.innerHTML = html;
      el.appendChild(d);
      while (el.children.length > 120) el.firstChild.remove();
      el.scrollTop = el.scrollHeight;
    },
    toast(msg) {
      let t = document.getElementById('mlf-toast');
      if (!t) {
        t = document.createElement('div'); t.id = 'mlf-toast';
        t.style.cssText = 'position:fixed;left:50%;bottom:26px;transform:translateX(-50%) translateY(20px);background:var(--text);color:var(--bg);padding:10px 18px;border-radius:12px;font-weight:600;font-size:14px;z-index:200;opacity:0;transition:.3s;pointer-events:none;box-shadow:var(--shadow-lg)';
        document.body.appendChild(t);
      }
      t.textContent = msg;
      requestAnimationFrame(() => { t.style.opacity = 1; t.style.transform = 'translateX(-50%)'; });
      clearTimeout(t._h);
      t._h = setTimeout(() => { t.style.opacity = 0; t.style.transform = 'translateX(-50%) translateY(20px)'; }, 2200);
    },
  };
  window.MLF = MLF;

  /* ---------------- theme ---------------- */
  function currentTheme() {
    const t = document.documentElement.getAttribute('data-theme');
    if (t) return t;
    return matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  function toggleTheme() {
    const next = currentTheme() === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    LS.set('mlf-theme', next);
    MLF.$$('.theme-btn').forEach((b) => (b.textContent = next === 'dark' ? '☀️' : '🌙'));
  }

  /* ---------------- shell ---------------- */
  const AUTHOR = 'Palak Deb Patra';
  const ATLAS_WORDMARK = '<svg class="atlas-wordmark" viewBox="0 0 102 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><text x="1" y="25" font-family="Inter, Arial, sans-serif" font-size="28" font-weight="800" letter-spacing="-1.3" fill="currentColor">Engg<tspan class="gold">A</tspan></text></svg>';

  function buildShell() {
    const body = document.body;
    if (!/Palak/.test(document.title)) document.title += ` · ML Fundamentals by ${AUTHOR}`;
    const chapNum = body.dataset.chapter == null ? -1 : +body.dataset.chapter;   // -1 = not a chapter page (prerequisites are 0.1…0.8)
    const chap = CHAPTERS.find((c) => c.n === chapNum);
    const main = MLF.$('main.content');
    if (!main) return { chap };

    const progress = document.createElement('div');
    progress.className = 'read-progress';

    const layout = document.createElement('div'); layout.className = 'layout';
    const sidebar = document.createElement('aside'); sidebar.className = 'sidebar';
    const scrim = document.createElement('div'); scrim.className = 'scrim';
    const mainWrap = document.createElement('div'); mainWrap.className = 'main';

    // sidebar
    const done = doneSet();
    let html = `<a class="brand" href="index.html"><span class="brand-logo"><svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 3v17.5H21"/><path d="M6.5 17.5 19.5 6"/><circle cx="8.5" cy="12.5" r="1.4"/><circle cx="11.5" cy="16" r="1.4"/><circle cx="13.5" cy="9.5" r="1.4"/><circle cx="17.5" cy="11.5" r="1.4"/></svg></span><span><span class="brand-author">Palak Deb Patra</span><span class="grad brand-course">ML Fundamentals Playlist</span></span></a>
      <div class="side-progress"><div class="bar"><i style="width:${(done.size / CHAPTERS.length) * 100}%"></i></div><small>${done.size} of ${CHAPTERS.length} chapters complete</small></div>`;
    let lastLevel = '';
    for (const c of CHAPTERS) {
      if (c.level !== lastLevel) { html += `<div class="nav-level">${c.level}</div>`; lastLevel = c.level; }
      const cls = ['nav-link', done.has(c.n) ? 'done' : '', c.n === chapNum ? 'current' : ''].join(' ');
      html += `<a class="${cls}" href="${c.file}"><span class="num">${done.has(c.n) ? '✓' : chNum(c)}</span><span>${c.title}</span></a>`;
      if (c.n === chapNum) html += `<nav class="toc" id="toc"></nav>`;
    }
    html += `<div class="nav-level">Study tools</div>
      <a class="nav-link study" href="glossary.html"><span class="num">📖</span><span>Glossary</span></a>
      <a class="nav-link study" href="flashcards.html"><span class="num">🃏</span><span>Flashcards</span></a>
      <a class="nav-link study" href="mock-interview.html"><span class="num">🎤</span><span>Mock interview</span></a>`;
    sidebar.innerHTML = html;
    const here = location.pathname.split('/').pop();
    MLF.$$('.nav-link.study', sidebar).forEach((a) => { if (a.getAttribute('href') === here) a.classList.add('current'); });

    // topbar
    const top = document.createElement('header'); top.className = 'topbar';
    const theme = currentTheme();
    top.innerHTML = `<button class="icon-btn menu-btn" aria-label="Menu">☰</button>
      <div class="crumb"><a class="atlas-home" href="../index.html" aria-label="Engineering Atlas home">${ATLAS_WORDMARK}</a> / ${chap ? `<a href="index.html">Course</a> / ${chName(chap)} · <b>${chap.title}</b>` : '<b>ML Fundamentals</b>'}</div>
      <div class="spacer"></div>
      <button class="search-btn" aria-label="Search the course" title="Search (Ctrl+K)">🔎 <span>Search</span> <kbd class="kbd">Ctrl K</kbd></button>
      <button class="icon-btn theme-btn" aria-label="Toggle theme" title="Toggle theme">${theme === 'dark' ? '☀️' : '🌙'}</button>`;

    main.parentNode.insertBefore(layout, main);
    layout.appendChild(sidebar); layout.appendChild(scrim); layout.appendChild(mainWrap);
    mainWrap.appendChild(top); mainWrap.appendChild(main);
    body.insertBefore(progress, body.firstChild);

    top.querySelector('.theme-btn').onclick = toggleTheme;
    const menuBtn = top.querySelector('.menu-btn');
    menuBtn.onclick = () => { sidebar.classList.toggle('open'); scrim.classList.toggle('show'); };
    scrim.onclick = () => { sidebar.classList.remove('open'); scrim.classList.remove('show'); };

    addEventListener('scroll', () => {
      const h = document.documentElement;
      const p = h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight);
      progress.style.width = (p * 100).toFixed(2) + '%';
    }, { passive: true });

    // keep current chapter visible in sidebar
    const cur = sidebar.querySelector('.nav-link.current');
    if (cur) setTimeout(() => cur.scrollIntoView({ block: 'center' }), 0);

    return { chap, main, sidebar };
  }

  function buildToc(chap, main) {
    const toc = document.getElementById('toc');
    const h2s = MLF.$$('h2', main);
    h2s.forEach((h, i) => {
      if (!h.id) h.id = 's' + (i + 1) + '-' + h.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40);
      if (chap && !h.querySelector('.sec-num')) {
        const s = document.createElement('span'); s.className = 'sec-num'; s.textContent = `${chNum(chap)}.${i + 1}`;
        h.prepend(s);
      }
      if (toc) {
        const a = document.createElement('a'); a.href = '#' + h.id;
        a.textContent = h.textContent.replace(/^P?\d+\.\d+/, '').trim();
        toc.appendChild(a);
        a.addEventListener('click', () => { MLF.$('.sidebar').classList.remove('open'); MLF.$('.scrim').classList.remove('show'); });
      }
    });
    if (!toc || !h2s.length) return;
    const links = MLF.$$('a', toc);
    const spy = () => {
      let idx = 0;
      h2s.forEach((h, i) => { if (h.getBoundingClientRect().top < 140) idx = i; });
      links.forEach((l, i) => l.classList.toggle('active', i === idx));
    };
    addEventListener('scroll', spy, { passive: true }); spy();
  }

  function buildFooter(chap, main) {
    if (!chap) return;
    const i = CHAPTERS.indexOf(chap);
    const prev = CHAPTERS[i - 1], next = CHAPTERS[i + 1];
    const box = document.createElement('div');
    const isDone = () => doneSet().has(chap.n);
    const render = () => {
      box.className = 'complete-box' + (isDone() ? ' done' : '');
      box.innerHTML = isDone()
        ? `<p style="font-size:26px;margin:0">🎉</p><p><strong>${chName(chap)} complete!</strong></p><button class="btn sm ghost" data-undo>Mark as not complete</button>`
        : `<p><strong>Finished this chapter?</strong><br><span class="muted small">Track your progress across the course.</span></p><button class="btn primary">✓ Mark chapter complete</button>`;
      box.querySelector('button').onclick = () => {
        const s = doneSet();
        if (isDone()) s.delete(chap.n); else { s.add(chap.n); MLF.toast('Nice work! Progress saved.'); }
        LS.set('mlf-done', [...s]);
        render();
        const side = MLF.$('.sidebar .nav-link.current .num');
        if (side) { side.textContent = isDone() ? '✓' : chNum(chap); side.parentElement.classList.toggle('done', isDone()); }
        const bar = MLF.$('.side-progress');
        if (bar) { const n = doneSet().size; bar.querySelector('i').style.width = (n / CHAPTERS.length) * 100 + '%'; bar.querySelector('small').textContent = `${n} of ${CHAPTERS.length} chapters complete`; }
      };
    };
    render();
    main.appendChild(box);
    const nav = document.createElement('nav'); nav.className = 'chapter-nav';
    nav.innerHTML = (prev ? `<a href="${prev.file}"><small>← Previous</small>${prev.title}</a>` : `<a href="index.html"><small>← Back to</small>Course home</a>`)
      + (next ? `<a class="nx" href="${next.file}"><small>Next →</small>${next.title}</a>` : `<a class="nx" href="index.html"><small>🏁 Finished!</small>Back to course home</a>`);
    main.appendChild(nav);
  }

  /* ---------------- components ---------------- */
  function initTabs(root = document) {
    MLF.$$('.tabs', root).forEach((tabs) => {
      if (tabs._init) return; tabs._init = true;
      const btns = MLF.$$(':scope > .tab-list > button', tabs);
      const panels = MLF.$$(':scope > .tab-panel', tabs);
      const go = (i) => {
        btns.forEach((b, j) => b.classList.toggle('active', i === j));
        panels.forEach((p, j) => p.classList.toggle('active', i === j));
        tabs.dispatchEvent(new CustomEvent('tabchange', { detail: { index: i, panel: panels[i] } }));
      };
      btns.forEach((b, i) => (b.onclick = () => go(i)));
      go(Math.max(0, btns.findIndex((b) => b.classList.contains('active'))));
    });
  }

  function initSeg(root = document) {
    MLF.$$('.seg', root).forEach((seg) => {
      if (seg._init) return; seg._init = true;
      const btns = MLF.$$('button', seg);
      if (!btns.some((b) => b.classList.contains('active')) && btns[0]) btns[0].classList.add('active');
      seg.dataset.value = (btns.find((b) => b.classList.contains('active')) || {}).dataset?.v || '';
      btns.forEach((b) => b.addEventListener('click', () => {
        btns.forEach((x) => x.classList.toggle('active', x === b));
        seg.dataset.value = b.dataset.v;
        seg.dispatchEvent(new CustomEvent('segchange', { detail: b.dataset.v }));
      }));
    });
  }

  function initFlips(root = document) {
    MLF.$$('.flip', root).forEach((f) => {
      if (f._init) return; f._init = true;
      f.setAttribute('tabindex', '0');
      const t = () => f.classList.toggle('flipped');
      f.addEventListener('click', t);
      f.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); t(); } });
    });
  }

  function initSteppers(root = document) {
    MLF.$$('.stepper', root).forEach((st) => {
      if (st._init) return; st._init = true;
      const diagram = document.getElementById(st.dataset.diagram);
      const steps = MLF.$$('ol.steps > li', st);
      const intro = st.dataset.intro || 'Press <b>Next</b> or <b>Play</b> to walk through this flow step by step.';
      st.insertAdjacentHTML('beforeend', `
        <div class="step-text"><div class="st-title"></div><div class="st-desc"></div></div>
        <div class="stepper-bar">
          <div class="stepper-dots">${steps.map(() => '<i></i>').join('')}</div>
          <span class="count"></span>
          <button class="btn sm" data-a="reset" title="Reset">↺</button>
          <button class="btn sm" data-a="prev">← Prev</button>
          <button class="btn sm" data-a="play">▶ Play</button>
          <button class="btn sm primary" data-a="next">Next →</button>
        </div>`);
      const title = MLF.$('.st-title', st), desc = MLF.$('.st-desc', st), count = MLF.$('.count', st);
      const dots = MLF.$$('.stepper-dots i', st);
      const playBtn = MLF.$('[data-a=play]', st);
      let idx = -1, playing = false, token = 0;

      const clear = () => { if (diagram) MLF.$$('.on', diagram).forEach((e) => e.classList.remove('on')); };
      async function go(i) {
        idx = MLF.clamp(i, -1, steps.length - 1);
        const my = ++token;
        clear();
        dots.forEach((d, j) => { d.classList.toggle('active', j === idx); d.classList.toggle('past', j < idx); });
        count.textContent = idx < 0 ? `${steps.length} steps` : `Step ${idx + 1} / ${steps.length}`;
        MLF.$('[data-a=prev]', st).disabled = idx < 0;
        MLF.$('[data-a=next]', st).disabled = idx >= steps.length - 1;
        if (idx < 0) {
          diagram && diagram.classList.remove('stepping');
          title.innerHTML = '👋 Interactive walkthrough'; desc.innerHTML = intro;
          st.dispatchEvent(new CustomEvent('step', { detail: { index: -1 } }));
          return;
        }
        const li = steps[idx];
        diagram && diagram.classList.add('stepping');
        (li.dataset.on || '').split(/\s+/).filter(Boolean).forEach((id) => {
          const e = diagram && diagram.querySelector('#' + CSS.escape(id));
          if (e) e.classList.add('on');
        });
        title.innerHTML = `<span class="n">${idx + 1}</span>${li.dataset.title || ''}`;
        desc.innerHTML = li.innerHTML;
        desc.style.animation = 'none'; void desc.offsetWidth; desc.style.animation = '';
        st.dispatchEvent(new CustomEvent('step', { detail: { index: idx, li } }));
        if (li.dataset.packet && diagram) {
          for (const seg of li.dataset.packet.split(',')) {
            if (my !== token) return;
            const [a, b] = seg.split('>').map((s) => s.trim());
            const ea = diagram.querySelector('#' + CSS.escape(a)), eb = diagram.querySelector('#' + CSS.escape(b));
            if (ea && eb) await MLF.packetBetween(diagram, ea, eb, { color: li.dataset.color, dur: 650 });
          }
        }
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= steps.length - 1) idx = -1;
        while (playing && idx < steps.length - 1) {
          await go(idx + 1);
          await MLF.sleep(+st.dataset.delay || 2300);
        }
        playing = false; playBtn.textContent = '▶ Play';
      }
      st.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]')?.dataset.a;
        if (!a) return;
        if (a !== 'play' && playing) { playing = false; playBtn.textContent = '▶ Play'; }
        if (a === 'next') go(idx + 1);
        if (a === 'prev') go(idx - 1);
        if (a === 'reset') go(-1);
        if (a === 'play') play();
      });
      dots.forEach((d, j) => (d.onclick = () => go(j)));
      st._go = go;
      go(-1);
    });
  }

  function initQuizzes(chap) {
    const quizzes = MLF.$$('.quiz');
    if (!quizzes.length) return;
    let answered = 0, correct = 0;
    const scoreEl = MLF.$('.quiz-score');
    const update = () => {
      if (!scoreEl) return;
      scoreEl.innerHTML = `<span class="big">${correct}/${quizzes.length}</span><span>${answered < quizzes.length ? `Answered ${answered} of ${quizzes.length} — keep going!` : correct === quizzes.length ? 'Perfect score! You nailed this chapter. 🏆' : correct >= quizzes.length * .6 ? 'Solid! Review the ones you missed. 💪' : 'Worth a re-read of the sections above. 📚'}</span>`;
      if (answered === quizzes.length && chap) {
        const best = LS.get('mlf-quiz', {});
        best[chap.n] = Math.max(best[chap.n] || 0, correct / quizzes.length);
        LS.set('mlf-quiz', best);
      }
    };
    quizzes.forEach((q, qi) => {
      const qp = MLF.$('.q', q);
      if (qp && !qp.querySelector('.qn')) qp.insertAdjacentHTML('afterbegin', `<span class="qn">Q${qi + 1}</span>`);
      const opts = MLF.$$('.opt', q);
      const ans = +q.dataset.answer;
      opts.forEach((o, i) => {
        o.dataset.letter = 'ABCDEFG'[i];
        o.onclick = () => {
          if (q.classList.contains('answered')) return;
          q.classList.add('answered');
          answered++;
          if (i === ans) correct++;
          opts.forEach((x, j) => { x.disabled = true; if (j === ans) x.classList.add('correct'); });
          if (i !== ans) o.classList.add('wrong');
          update();
        };
      });
    });
    update();
  }

  function initReveal() {
    const els = MLF.$$('.reveal');
    if (!('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); }
    }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
  }

  /** Run a callback only while an element is on screen (saves CPU for sims) */
  MLF.whenVisible = function (el, onShow, onHide) {
    if (!('IntersectionObserver' in window)) { onShow(); return; }
    new IntersectionObserver((ents) => ents.forEach((en) => (en.isIntersecting ? onShow() : onHide && onHide())), { threshold: 0.05 }).observe(el);
  };

/* >>> shared visuals (generated by tools/components/install.cjs) */
  /* ---------------- sequence diagrams & workflows (shared visuals) ----------------
     <figure class="seq" data-actors="Client|API|DB">
       <ol>
         <li data-m="0>1">POST /orders<small>optional detail shown under the diagram</small></li>
         <li data-m="1>2">INSERT …</li>
         <li data-m="2>1" data-k="reply">ok</li>        reply  = dashed arrow back
         <li data-m="1>1">validate</li>                 self   = loop on one lifeline
         <li data-m="0-2" data-k="note">note text</li>  note   = box spanning lifelines 0…2
         <li data-m="1>2" data-k="fail">timeout</li>    fail   = red arrow ending in ✕ (lost / refused)
         <li data-m="1>2" data-k="bad">stale write</li> bad    = red arrow that arrives (harmful but delivered)
         <li data-m="1>2" data-k="async">event</li>     async  = open arrowhead, dashed
       </ol>
       <figcaption>…</figcaption>
     </figure>
     <figure class="flow"><ol>
         <li data-k="start|step|decision|store|end|fail"><b>Title</b> short description</li>
     </ol><figcaption>…</figcaption></figure>                                           */
  function initSeq(root = document) {
    MLF.$$('figure.seq', root).forEach((fig) => {
      if (fig._init) return; fig._init = true;
      const actors = (fig.dataset.actors || '').split('|').map((s) => s.trim());
      const items = MLF.$$(':scope > ol > li', fig).map((li) => {
        const small = li.querySelector('small');
        const detail = small ? small.innerHTML : '';
        const clone = li.cloneNode(true); const s2 = clone.querySelector('small'); if (s2) s2.remove();
        const m = li.dataset.m || '0>1';
        const note = m.includes('-') && !m.includes('>');
        const [a, b] = m.split(note ? '-' : '>').map((x) => +x);
        return { a, b, note, kind: li.dataset.k || (note ? 'note' : 'msg'), label: clone.textContent.trim(), detail };
      });
      fig.querySelector(':scope > ol').hidden = true;
      const PADX = 80, TOP = 58, ROW = 46, CH = 7.3;   // CH ≈ width of one mono character
      // Each gap between neighbouring lifelines is wide enough for the labels that live in it.
      const gap = actors.slice(1).map((n, i) => Math.max(140, (n.length + actors[i].length) * 3.9 + 30));
      items.forEach((it) => {
        if (it.note) return;
        const lo = Math.min(it.a, it.b), hi = Math.max(it.a, it.b), need = it.label.length * CH + 44;
        if (lo === hi) { if (lo < gap.length) gap[lo] = Math.max(gap[lo], need + 40); return; }
        const have = gap.slice(lo, hi).reduce((s, g) => s + g, 0);
        if (need > have) for (let g = lo; g < hi; g++) gap[g] += (need - have) / (hi - lo);
      });
      const xs = [PADX]; gap.forEach((g) => xs.push(xs.at(-1) + g));
      const selfLast = items.some((it) => !it.note && it.a === it.b && it.a === actors.length - 1);
      const lastSelf = selfLast ? Math.max(...items.filter((it) => !it.note && it.a === it.b && it.a === actors.length - 1).map((it) => it.label.length * CH + 60)) : 0;
      const W = xs.at(-1) + Math.max(PADX, lastSelf);
      const rowH = (it) => (it.note ? 40 : it.a === it.b ? 54 : ROW);
      const ys = []; let y = TOP + 26;
      items.forEach((it) => { ys.push(y); y += rowH(it); });
      const H = y + 20;
      const X = (i) => xs[i];
      const wrap = document.createElement('div'); wrap.className = 'seq-scroll';
      const svg = MLF.svg('svg', { viewBox: `0 0 ${W} ${H}`, width: W, class: 'seq-svg', role: 'img', 'aria-label': 'Sequence diagram: ' + actors.join(', ') });
      svg.style.minWidth = Math.round(W * 0.82) + 'px';   // shrink to fit, but never below ~82%: scroll instead
      wrap.appendChild(svg);
      const defs = MLF.svg('defs', {}, svg);
      const uid = 'sq' + Math.random().toString(36).slice(2, 8);
      [['h', 'var(--text-2)'], ['r', 'var(--red)'], ['a', 'var(--accent)']].forEach(([k, col]) => {
        const mk = MLF.svg('marker', { id: uid + k, viewBox: '0 0 10 10', refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' }, defs);
        MLF.svg('path', { d: 'M0,0 L10,5 L0,10 z', fill: col }, mk);
      });
      actors.forEach((name, i) => {
        MLF.svg('line', { x1: X(i), y1: TOP, x2: X(i), y2: H - 10, class: 'seq-life' }, svg);
        const g = MLF.svg('g', { class: 'seq-actor' }, svg);
        const w = Math.max(70, name.length * 7.4 + 22);
        MLF.svg('rect', { x: X(i) - w / 2, y: 12, width: w, height: 34, rx: 9 }, g);
        MLF.svg('text', { x: X(i), y: 34, 'text-anchor': 'middle', text: name }, g);
      });
      const els = items.map((it, k) => {
        const g = MLF.svg('g', { class: 'seq-msg k-' + it.kind }, svg);
        const yy = ys[k];
        if (it.note) {
          const x1 = X(Math.min(it.a, it.b)) - 56, x2 = X(Math.max(it.a, it.b)) + 56;
          MLF.svg('rect', { x: x1, y: yy - 12, width: x2 - x1, height: 28, rx: 6, class: 'seq-note' }, g);
          MLF.svg('text', { x: (x1 + x2) / 2, y: yy + 6, 'text-anchor': 'middle', text: it.label }, g);
          return { g, path: null };
        }
        let d;
        if (it.a === it.b) d = `M${X(it.a)},${yy} h44 v22 h-40`;
        else d = `M${X(it.a) + (it.b > it.a ? 4 : -4)},${yy + 8} L${X(it.b) + (it.b > it.a ? -6 : 6)},${yy + 8}`;
        const mk = it.kind === 'fail' || it.kind === 'bad' ? 'r' : 'h';
        const p = MLF.svg('path', { d, class: 'seq-arrow', 'marker-end': it.kind === 'fail' ? '' : `url(#${uid}${mk})` }, g);
        if (it.kind === 'fail') {
          const ex = X(it.b) + (it.b > it.a ? -12 : 12);
          MLF.svg('path', { d: `M${ex - 6},${yy + 2} l12,12 M${ex + 6},${yy + 2} l-12,12`, class: 'seq-x' }, g);
        }
        const tx = it.a === it.b ? X(it.a) + 52 : (X(it.a) + X(it.b)) / 2;
        MLF.svg('text', { x: tx, y: it.a === it.b ? yy + 15 : yy, 'text-anchor': it.a === it.b ? 'start' : 'middle', text: it.label, class: 'seq-label' }, g);
        const nx = X(it.a) + (it.a === it.b || it.b > it.a ? -13 : 13), ny = it.a === it.b ? yy + 11 : yy + 8;
        MLF.svg('circle', { cx: nx, cy: ny, r: 8, class: 'seq-badge' }, g);
        MLF.svg('text', { x: nx, y: ny + 3.5, 'text-anchor': 'middle', text: String(k + 1), class: 'seq-num' }, g);
        return { g, path: p };
      });
      const bar = document.createElement('div'); bar.className = 'seq-bar';
      bar.innerHTML = `<div class="seq-detail"><b class="seq-step">▶ Press Play to animate the ${items.length} steps</b><span></span></div>
        <div class="seq-btns"><button class="btn sm" data-a="prev">←</button><button class="btn sm primary" data-a="play">▶ Play</button><button class="btn sm" data-a="next">→</button><button class="btn sm" data-a="all" title="Show every step">All</button></div>`;
      const cap = fig.querySelector('figcaption');
      fig.insertBefore(wrap, cap || null); fig.insertBefore(bar, cap || null);
      const stepEl = bar.querySelector('.seq-step'), detEl = bar.querySelector('.seq-detail span'), playBtn = bar.querySelector('[data-a=play]');
      let idx = -1, playing = false, tok = 0;
      function show(i, animate) {
        idx = MLF.clamp(i, -1, items.length - 1);
        const my = ++tok;
        els.forEach((e, j) => { e.g.classList.toggle('shown', j <= idx); e.g.classList.toggle('cur', j === idx); });
        fig.classList.toggle('seq-started', idx >= 0);
        if (idx < 0) { stepEl.textContent = `▶ Press Play to animate the ${items.length} steps`; detEl.innerHTML = ''; return; }
        const it = items[idx];
        stepEl.textContent = `${idx + 1}/${items.length} · ${it.note ? '' : actors[it.a] + (it.a === it.b ? '' : ' → ' + actors[it.b]) + ': '}${it.label}`;
        detEl.innerHTML = it.detail;
        const p = els[idx].path;
        svg.querySelectorAll('.packet').forEach((x) => x.remove());
        if (animate && p && my === tok) MLF.packetAlong(svg, p, { dur: 520, r: 5, color: it.kind === 'fail' || it.kind === 'bad' ? 'var(--red)' : 'var(--accent)' });
      }
      async function play() {
        if (playing) { playing = false; playBtn.textContent = '▶ Play'; return; }
        playing = true; playBtn.textContent = '⏸ Pause';
        if (idx >= items.length - 1) show(-1);
        while (playing && idx < items.length - 1) { show(idx + 1, true); await MLF.sleep(+fig.dataset.delay || 1500); }
        playing = false; playBtn.textContent = '↻ Replay';
      }
      bar.addEventListener('click', (e) => {
        const a = e.target.closest('[data-a]')?.dataset.a; if (!a) return;
        if (a !== 'play' && playing) { playing = false; playBtn.textContent = '▶ Play'; }
        if (a === 'play') play();
        if (a === 'next') show(idx + 1, true);
        if (a === 'prev') show(idx - 1);
        if (a === 'all') { show(items.length - 1); playBtn.textContent = '↻ Replay'; }
      });
      els.forEach((e, j) => e.g.addEventListener('click', () => { playing = false; playBtn.textContent = '▶ Play'; show(j, true); }));
      show(-1);
      let auto = false;
      MLF.whenVisible(fig, () => { if (!auto && !matchMedia('(prefers-reduced-motion: reduce)').matches) { auto = true; play(); } });
    });
  }

  function initFlow(root = document) {
    MLF.$$('figure.flow', root).forEach((fig) => {
      if (fig._init) return; fig._init = true;
      const lis = MLF.$$(':scope > ol > li', fig);
      lis.forEach((li, i) => {
        li.classList.add('k-' + (li.dataset.k || 'step'));
        li.insertAdjacentHTML('afterbegin', `<i class="fl-n">${i + 1}</i>`);
      });
      fig.classList.toggle('fl-row', lis.length <= 5);
      let i = -1, timer = null;
      const tick = () => {
        i = (i + 1) % (lis.length + 2);   // two beats of rest after the last step
        lis.forEach((li, j) => { li.classList.toggle('on', j === i); li.classList.toggle('done', j < i); });
      };
      lis.forEach((li, j) => li.addEventListener('mouseenter', () => { clearInterval(timer); timer = null; i = j - 1; tick(); }));
      fig.addEventListener('mouseleave', () => { if (!timer && fig._vis) timer = setInterval(tick, 1100); });
      MLF.whenVisible(fig, () => {
        fig._vis = true;
        if (!timer && !matchMedia('(prefers-reduced-motion: reduce)').matches) timer = setInterval(tick, 1100);
      }, () => { fig._vis = false; clearInterval(timer); timer = null; });
    });
  }
  /* <<< shared visuals */

  MLF.initComponents = function (root) { initTabs(root); initSeg(root); initFlips(root); initSteppers(root); initSeq(root); initFlow(root); };

  /* ---------------- command palette (Ctrl+K) ---------------- */
  function initPalette() {
    let box, input, list, results = [], sel = 0, loading = false;

    function build() {
      box = document.createElement('div');
      box.className = 'palette';
      box.innerHTML = `<div class="pal-inner" role="dialog" aria-label="Search the course">
          <div class="pal-top"><span>🔎</span><input id="pal-input" placeholder="Search 46 chapters — principles, patterns, case studies…" autocomplete="off" spellcheck="false"><kbd class="kbd">Esc</kbd></div>
          <div class="pal-list" id="pal-list"></div>
          <div class="pal-foot"><span><kbd class="kbd">↑</kbd><kbd class="kbd">↓</kbd> navigate · <kbd class="kbd">↵</kbd> open</span><span>tip: try “Strategy”, “LRU”, “Liskov”, “thread-safe”</span></div>
        </div>`;
      document.body.appendChild(box);
      input = box.querySelector('#pal-input');
      list = box.querySelector('#pal-list');
      box.addEventListener('click', (e) => { if (e.target === box) close(); });
      input.addEventListener('input', () => { sel = 0; render(); });
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { close(); }
        else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); render(true); }
        else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); render(true); }
        else if (e.key === 'Enter') { e.preventDefault(); go(results[sel]); }
      });
    }

    function search(q) {
      const idx = window.MLF_INDEX || [];
      const terms = q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!terms.length) {
        return CHAPTERS.map((c) => ({ n: c.n, f: c.file, ti: c.title, lv: c.level, t: c.blurb, a: '', k: 'chapter', s: 0 })).slice(0, 12);
      }
      const out = [];
      idx.forEach((c) => {
        const push = (t, a, k, base) => {
          const hay = (t + ' ' + c.ti).toLowerCase();
          let score = 0;
          for (const term of terms) {
            const at = hay.indexOf(term);
            if (at < 0) return;                       // every term must appear
            score += at === 0 ? 12 : hay[at - 1] === ' ' ? 8 : 3;
          }
          if (t.toLowerCase().startsWith(terms[0])) score += 10;
          out.push({ n: c.n, f: c.f, ti: c.ti, lv: c.lv, t, a, k, s: score + base - t.length * 0.01 });
        };
        push(c.ti, '', 'chapter', 22);
        c.e.forEach((e) => push(e.t, e.a, e.k, e.k === 'section' ? 16 : e.k === 'demo' ? 12 : e.k === 'topic' ? 8 : 1));
      });
      const seen = new Set();
      return out.sort((a, b) => b.s - a.s).filter((r) => {
        const key = r.n + '|' + r.t;
        if (seen.has(key)) return false;
        seen.add(key); return true;
      }).slice(0, 30);
    }

    const ICON = { chapter: '📘', section: '§', demo: '🕹️', topic: '•', fact: '💡' };
    function render(keepQuery) {
      if (loading) { list.innerHTML = '<div class="pal-empty">Loading index…</div>'; return; }
      results = search(input.value.trim());
      if (!results.length) { list.innerHTML = '<div class="pal-empty">No matches. Try a broader word.</div>'; return; }
      list.innerHTML = results.map((r, i) => `<a class="pal-item ${i === sel ? 'sel' : ''}" href="${r.f}${r.a ? '#' + r.a : ''}" data-i="${i}">
          <span class="pal-ico">${ICON[r.k] || '•'}</span>
          <span class="pal-text"><b>${esc(r.t)}</b><small>${chName(r.n)} · ${esc(r.ti)}</small></span>
          <span class="pal-lv">${r.lv}</span></a>`).join('');
      MLF.$$('.pal-item', list).forEach((el) => {
        el.addEventListener('mouseenter', () => { sel = +el.dataset.i; MLF.$$('.pal-item', list).forEach((x) => x.classList.toggle('sel', x === el)); });
      });
      const cur = list.querySelector('.sel');
      if (cur && keepQuery) cur.scrollIntoView({ block: 'nearest' });
    }
    const esc = (s) => String(s).replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
    function go(r) { if (r) location.href = r.f + (r.a ? '#' + r.a : ''); }

    function open() {
      if (!box) build();
      box.classList.add('show');
      input.value = ''; sel = 0;
      if (!window.MLF_INDEX) {
        loading = true; render();
        const s = document.createElement('script');
        s.src = 'assets/study-data.js';
        s.onload = () => { loading = false; render(); };
        s.onerror = () => { loading = false; list.innerHTML = '<div class="pal-empty">Could not load the search index.</div>'; };
        document.head.appendChild(s);
      } else render();
      setTimeout(() => input.focus(), 30);
    }
    function close() { if (box) box.classList.remove('show'); }

    addEventListener('keydown', (e) => {
      const typing = /^(INPUT|TEXTAREA|SELECT)$/.test((e.target.tagName || '')) || e.target.isContentEditable;
      if ((e.key === 'k' || e.key === 'K') && (e.ctrlKey || e.metaKey)) { e.preventDefault(); box && box.classList.contains('show') ? close() : open(); }
      else if (e.key === '/' && !typing && !(box && box.classList.contains('show'))) { e.preventDefault(); open(); }
      else if (e.key === 'Escape') close();
    });
    MLF.$$('.search-btn').forEach((b) => (b.onclick = open));
    MLF.openSearch = open;
  }

  /* ---------------- boot ---------------- */
  const { chap, main } = buildShell();
  if (main) {
    buildToc(chap, main);
    buildFooter(chap, main);
    const credit = document.createElement('p');
    credit.className = 'muted small';
    credit.style.cssText = 'text-align:center;margin:44px 0 0';
    credit.innerHTML = `◆ <a href="index.html">${AUTHOR}'s ML Fundamentals Playlist</a> · © 2026 ${AUTHOR}`;
    main.appendChild(credit);
  }
  MLF.chapter = chap;
  MLF.initComponents(document);
  initQuizzes(chap);
  initReveal();
  initPalette();
})();

/* Optional accounts & progress sync (../assets/account.js). Only over http(s): the offline
   single-file edition runs from file:// and simply skips it. Dormant until configured. */
(function () {
  if (!/^https?:$/.test(location.protocol) || window.__atlasAccount) return;
  var s = document.createElement("script");
  s.type = "module"; s.src = "../assets/account.js";
  s.onerror = function () {};
  document.head.appendChild(s);
})();
