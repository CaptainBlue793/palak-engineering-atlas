# OS & Concurrency — session log

## 2026-10-01 — setup (hub session)
- Done: chapter list approved by the owner (tools/chapters.cjs, P1–P8 + 48); shell generated; palette red→amber;
  course home rewritten (hero, 4-layer dependency map, C code-style strip, links). Glossary, mock interview,
  flashcards intro and README are still LLD copies (Step 2 of the playbook).
- Next: Step 2 (glossary, mock interview, flashcards, README), then P1.

## 2026-10-01 — session 1 (os worktree)
- Done: Step 2 — glossary (186 terms), mock interview (24 questions, OS phases and rubric), README; flashcards intro
  is course-neutral and kept (commit 2503894).
- Decisions: chapters written in order P1→48, one commit each; each chapter is headless-checked by driving its panel.
- Chapters:
  - P1 C for Systems: Pointers & Memory (37 KB)
  - P2 Structs, Arrays & Strings in C (28 KB)
  - P3 How a CPU Runs Your Code (29 KB)
  - P4 The Memory Hierarchy (24 KB)
  - P5 Bits, Hex & Binary Data (25 KB)
  - P6 Compiling & Linking (28 KB)
  - P7 The Linux Shell & Files (37 KB)
  - P8 Reading Syscalls & Man Pages (32 KB)
  - Ch 1 What an Operating System Does (27 KB)
  - Ch 2 Kernel Mode, User Mode & System Calls (31 KB)
  - Ch 3 Processes: fork, exec, wait (33 KB)
  - Ch 4 Process States & the Process Control Block (29 KB)
  - Ch 5 Threads (28 KB)
  - Ch 6 Context Switches & Interrupts (26 KB)
  - Ch 7 CPU Scheduling I: FCFS, SJF, Round Robin (26 KB)
  - Ch 8 CPU Scheduling II: Priorities, MLFQ & Linux CFS (29 KB)
  - Ch 9 IPC: Pipes, Signals & Shared Memory (31 KB)
- Incident (2026-10-01, after Ch 9): `.git/refs/heads/feature/os-course` in the shared .git (inside OneDrive) was zeroed
  (41 null bytes). Restored from the reflog to dc8b067 (Ch 9); working tree was intact. Other branches' refs were fine.
  Mitigation: the branch is now pushed to origin after every chapter.
- Chapters (continued):
  - Ch 10 File Descriptors & "Everything Is a File" (30 KB)
  - Ch 11 Address Spaces & Virtual Memory (30 KB)
  - Ch 12 Paging & Page Tables (27 KB)

## 2026-10-06 — session 2 (standalone clone)
- Setup: the old worktrees (`C:\Users\StarBlue\atlas-courses\`) are not on this machine. Work continues in a
  standalone clone of `feature/os-course` at `C:\Users\palak\atlas-courses\os`, outside OneDrive, so its `.git`
  is not synced. The owner's plan is now one course at a time: finish OS, release it, then the next course.
- Decisions: the glossary gains a few terms as chapters land (Ch 13: ASID, TLB reach, Effective access time;
  Ch 14: VMA, Zero page, Swap cache). Chapters are checked headlessly with a driver script that clicks the panel
  and prints its stats, at 1100 px and 390 px wide.
- Blocked: `git push` needs a GitHub sign-in on this machine (Git Credential Manager can't prompt from the
  session). Commits are local until the owner signs in once.
- Chapters:
  - Ch 13 The TLB (40 KB): 8-entry TLB simulator (4 workloads, 4 KiB vs 2 MiB pages, process switch with PCIDs off/on)
  - Ch 14 Page Faults & Demand Paging (42 KB): demand-paging simulator (heap/code/unmapped pages, 4/6/12 frames,
    SSD vs hard disk, zero page, swap and swap cache, thrashing)
