# OS & Concurrency — Interactive Course

How an operating system really works, and how to write correct concurrent code on top of it, in C
against the real Linux interfaces: from "what is a pointer" to tracing `docker run`, nginx and an
OOM-killer incident through the kernel. **48 chapters across five levels, plus an 8-chapter
Prerequisites level** (P1–P8: C pointers and memory, structs and strings, how a CPU runs code, the
memory hierarchy, bits and hex, compiling and linking, the Linux shell, syscalls and man pages).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `os-*` keys.

> **Status: being written.** Chapters are added in order, one commit each. A page that still carries
> `<!-- os:placeholder -->` shows its planned outline. `grep -l os:placeholder *.html` lists what is left.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | C pointers and the stack/heap, structs and strings, registers and the fetch–execute loop, latency numbers, binary and hex, gcc and ELF, the shell, reading syscalls with `strace` |
| **Beginner** | 1–10 | What an OS does, kernel vs user mode and syscalls, `fork`/`exec`/`wait`, process states, threads, context switches, scheduling (FCFS, SJF, round robin, MLFQ, CFS), IPC, file descriptors |
| **Intermediate** | 11–24 | Address spaces, paging and page tables, the TLB, page faults, page replacement, `malloc`, race conditions, mutexes and spinlocks, condition variables, semaphores, the classic synchronization problems, deadlock, file systems, journaling |
| **Advanced** | 25–36 | Atomics and memory models, lock-free structures, thread pools, `epoll`, event loops and `io_uring`, `mmap` and copy-on-write, the page cache and `fsync`, cache coherence and NUMA, virtualization, containers, booting and drivers, OS security |
| **Expert** | 37–40 | `perf`, `strace` and `/proc`; tail latency; priority inversion and real-time scheduling; the OS interview playbook |
| **Case Studies** | 41–48 | The shell running `ls \| grep`, nginx and 10,000 connections, PostgreSQL on the OS, Redis `fork` snapshots, goroutines vs JVM threads, `docker run`, Chrome's sandbox, an OOM-killer incident |

Where this course meets another Atlas course it keeps its own angle and links across: OS explains
how containers work and Cloud & DevOps runs them; the LLD course's concurrency chapters use the Java
APIs that sit on top of the primitives built here.

## Study tools

- **`glossary.html`**: OS and concurrency terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes (five cards per chapter)
- **`mock-interview.html`**: timed room with 24 OS questions (explain, debug and implement), a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/os-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Every listing is C against the real Linux (POSIX) interfaces, written the same way: every return
value checked and errors reported with `perror` or `strerror(errno)`; the owner of every allocation
and file descriptor named; short reads, short writes and `EINTR` handled with loops; `size_t` and
fixed-width types for sizes and addresses; and one lock order, written down, wherever there is more
than one lock. A little Python and shell appear where they are the clearer tool.
