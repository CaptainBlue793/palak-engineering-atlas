# Cloud & DevOps — Interactive Course

How code gets from a laptop to production and stays up there: Linux servers, cloud networking and
IAM, containers, CI/CD, Kubernetes, Terraform, observability, SLOs and incident response.
**48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: the Linux command
line, Bash, Git, YAML and JSON, networking for operations, systemd, SSH, HTTP APIs and curl).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `ops-*` keys.

> **Status: in progress.** Chapters are written in order, one commit each. Pages still marked with
> `<!-- ops:placeholder -->` are unwritten; `grep -l ops:placeholder *.html` lists them.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | The Linux shell, Bash scripting, Git workflows, YAML and JSON, ports/DNS/TLS for operators, systemd, SSH keys, HTTP APIs with curl |
| **Beginner** | 1–10 | DevOps and SRE, regions and zones, compute, block/object/file storage, VPCs, IAM, Docker, Dockerfiles, registries, CI with GitHub Actions |
| **Intermediate** | 11–24 | Kubernetes architecture, pods/deployments/services, config and secrets, ingress, storage, Helm and Kustomize, rolling/blue-green/canary, GitOps with Argo CD, Terraform (two chapters), metrics, logs, traces, SLOs and alerting |
| **Advanced** | 25–36 | Autoscaling, serverless, operating a service mesh, Vault and KMS, supply-chain security, landing zones, FinOps, disaster recovery, multi-region, chaos engineering, platform engineering, policy as code |
| **Expert** | 37–40 | Incident response and postmortems, on-call and toil, capacity planning, the interview playbook |
| **Case Studies** | 41–48 | Laptop to production, a zero-downtime database migration, a Kubernetes outage, AWS us-east-1 (2021), CrowdStrike (2024), a cloud-cost blowout, monolith to Kubernetes, the 2025 GitHub Actions supply-chain attack |

Where this course meets the others, each keeps its own angle and links across: the OS course
explains how containers work (namespaces and cgroups), this one runs them; the Networks course
covers Kubernetes networking in depth, this one operates the cluster; System Design draws the
architecture, this one deploys and keeps it alive.

## Study tools

- **`glossary.html`**: cloud and DevOps terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 20 design and troubleshooting problems, a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/cloud-devops-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Listings are Bash, Dockerfile, Kubernetes YAML, Terraform (HCL) and GitHub Actions, all following
the same five rules: scripts fail loudly (`set -euo pipefail`, quoted variables); everything is
pinned (image digests, provider versions, actions by commit SHA); desired state lives in Git and
changes go through a plan or a pull request; least privilege by default (non-root containers,
scoped roles, explicit workflow `permissions:`); and every resource is labelled with its owner.
