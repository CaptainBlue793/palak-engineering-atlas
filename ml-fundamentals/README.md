# ML Fundamentals — Interactive Course

Machine learning before neural networks: regression and classification, metrics, validation,
feature engineering, trees and gradient boosting, clustering, dimensionality reduction, anomaly
detection and forecasting. **48 chapters across five levels, plus an 8-chapter Prerequisites level**
(P1–P8: Python for data work, NumPy, pandas, linear algebra, derivatives and gradients, probability,
statistics, and exploratory data analysis).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `mlf-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- mlf:placeholder -->` are unwritten; `grep -l mlf:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Python for data work, NumPy arrays and vectorisation, pandas, linear algebra, derivatives and gradients, probability, statistics, exploratory data analysis |
| **Beginner** | 1–10 | What ML is, the end-to-end workflow, train/validation/test splits, linear regression, gradient descent, loss functions, logistic regression, classification and regression metrics, k-nearest neighbours |
| **Intermediate** | 11–24 | Bias and variance, regularisation, cross-validation and hyperparameter search, numeric and categorical features, missing data, decision trees, random forests, gradient boosting, SVMs, Naive Bayes, multi-class problems, imbalanced data, scikit-learn pipelines |
| **Advanced** | 25–36 | k-means, density and hierarchical clustering, PCA, t-SNE and UMAP, anomaly detection, time-series forecasting, collaborative filtering, calibration, interpretability, feature selection, ensembles and stacking, comparing models honestly |
| **Expert** | 37–40 | Data leakage, debugging a model that doesn't work, from notebook to production, the interview playbook |
| **Case Studies** | 41–48 | Zillow Offers, the Netflix Prize, Google Flu Trends, COMPAS and fairness metrics, a spam filter, card-fraud detection, customer churn, the M5 forecasting competition |

Where this course meets the others, each keeps its own angle and links across: ML & AI Systems
surveys the same foundations in a few chapters and then covers training and serving at scale; this
course goes deep on the models themselves. Deep learning, computer vision, NLP and LLMs are courses
of their own.

## Study tools

- **`glossary.html`**: machine-learning terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 20 concept and case problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/ml-fundamentals-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with NumPy, pandas and scikit-learn, all following the same five rules: split
first and touch the test set once; preprocessing lives inside a `Pipeline`, fitted on training rows
only; every result is shown next to a dummy baseline; scores are reported as a cross-validated mean
with its spread; and everything is seeded (`random_state`) and vectorised.
