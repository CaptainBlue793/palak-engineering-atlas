# Computer Vision — Interactive Course

How machines see, from the pixel up: convolutions written by hand, CNNs trained from random weights,
augmentation, normalisation, residual networks and transfer learning, then detection (boxes, NMS,
Faster R-CNN, one-stage detectors, mAP), segmentation (U-Net, Mask R-CNN), vision transformers,
Swin and DETR, self-supervised learning, CLIP and SAM, autoencoders, GANs and diffusion models,
video, tracking, 3D geometry and NeRF, OCR, image retrieval, robustness and deployment.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: images as
tensors, the PyTorch training loop, colour spaces and image formats, geometry and transforms,
classical filtering, loading image data fast, losses and metrics, GPU memory and throughput).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `cv-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- cv:placeholder -->` are unwritten; `grep -l cv:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Images as tensors, PyTorch and the training loop, colour spaces, gamma and formats, coordinates and transforms, classical filtering, loading image data fast, losses and metrics for classifiers, GPU memory and throughput |
| **Beginner** | 1–10 | What computer vision is, convolutions in depth, building and training a CNN, data augmentation, normalisation layers, residual networks, transfer learning, evaluating classifiers, feature maps and Grad-CAM |
| **Intermediate** | 11–24 | CNN architectures, efficient convolutions, detection basics, two-stage and one-stage detectors, mAP, semantic and instance segmentation, vision transformers and how to train them, Swin and DETR, contrastive self-supervised learning, MAE and DINO, CLIP |
| **Advanced** | 25–36 | SAM and open-vocabulary detection, autoencoders and VAEs, GANs, diffusion from scratch, latent diffusion and guidance, evaluating generators, video, optical flow and tracking, camera geometry and depth, NeRF and Gaussian splatting, OCR, image retrieval |
| **Expert** | 37–40 | Robustness and adversarial examples, deploying vision models, debugging vision pipelines and datasets, the interview playbook |
| **Case Studies** | 41–48 | AlexNet and ImageNet, ResNet, YOLO, self-driving perception, Face ID, Stable Diffusion, Segment Anything, visual search |

Where this course meets the others, each keeps its own angle and links across: Deep Learning
covers backpropagation and training networks in general; LLMs covers transformers in depth and
multimodal language models; ML & AI Systems covers the platform around models; RAG covers vector
search. This course is about images: what a model sees, how it is trained to see it, and how to
tell whether it does.

## Study tools

- **`glossary.html`**: computer-vision terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 26 concept, maths and design problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/computer-vision-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Python with PyTorch and torchvision, run on one 16 GB consumer GPU (RTX 5070 Ti),
following the same five rules: every tensor line says its shape; preprocessing (channel order,
resize, crop, value range, mean and std) is written down exactly; weight versions, library
versions and seeds are pinned; times and memory are measured on the GPU, never guessed; and a new
model overfits one batch and matches a reference before any long run. Every simulator is driven by
real measurements.
