# ML Fundamentals — session log

Branch `feature/ml-fundamentals-course`, clone `C:\Users\palak\atlas-courses\ml-fundamentals`.
Code: Python with NumPy, pandas and scikit-learn. Runtime namespace (planned): `MLF`.

## 2026-10-14 — session 1
- Done: draft chapter plan in `ml-fundamentals/tools/chapters.cjs` (P1–P8 + 48 chapters, ~38 h).
- Decisions: scope is machine learning before neural networks; deep learning, CV, NLP and LLMs are their own
  courses. Overlap with ML & AI Systems Ch 2–7 is linked, not repeated.
- Needs a shared change: add `indexVar: 'MLF_INDEX'`, `first: 'p1-python-for-data.html'` and
  `dist: 'ml-fundamentals-course.html'` to the `ml-fundamentals` stub in `assets/atlas.js` before scaffolding.
- P1 Python for Data Work: notebook hidden-state simulator (four cells run in any order, kernel state, stale variables, comparison with a fresh run); venv/conda/uv table; Pimentel et al. 2019 notebook study
- P2 NumPy Arrays & Vectorisation: broadcasting explorer (two typed shapes, right-aligned rule table, stretched-cell grids, NumPy's exact error, the (n,) vs (n,1) bug preset); measured loop 80 ms vs (x*x).sum 3.5 ms vs np.dot 0.2 ms; views vs copies
- P3 pandas DataFrames: join explorer (inner/left/right/outer, a duplicated customer key, validate=many_to_one; rows, order, NaNs and MergeError text match pandas 3.0.6); groupby dropna and transform; loc vs iloc; copy-on-write
- P4 Linear Algebra for ML: two-vector playground (sliders for a and b; dot product, norms, cosine, angle, projection and residual with residual·b = 0; four presets); X @ w as predictions; solve vs inv; rank and duplicate features; projection to least squares
