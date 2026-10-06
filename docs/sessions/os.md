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
  Ch 14: VMA, Zero page, Swap cache; Ch 15: Reference string, kswapd, Direct reclaim; Ch 16: Coalescing, Arena). Chapters are checked headlessly with a driver script that clicks the panel
  and prints its stats, at 1100 px and 390 px wide.
- Push: the owner signed in to GitHub on this machine after Ch 15; the branch is pushed after every chapter again.
- Chapters:
  - Ch 13 The TLB (40 KB): 8-entry TLB simulator (4 workloads, 4 KiB vs 2 MiB pages, process switch with PCIDs off/on)
  - Ch 14 Page Faults & Demand Paging (42 KB): demand-paging simulator (heap/code/unmapped pages, 4/6/12 frames,
    SSD vs hard disk, zero page, swap and swap cache, thrashing)
  - Ch 15 Page Replacement: FIFO, LRU & Clock (35 KB): replacement simulator (FIFO/LRU/Clock/Optimal, 4 preset strings or
    your own, 1-7 frames, faults-by-frames chart that flags Belady's anomaly)
  - Ch 16 The Heap: How malloc Works (38 KB): free-list allocator (first/best/worst fit, splitting, coalescing on/off,
    brk growth, a one-click fragmented heap)
  - Ch 17 Race Conditions & Critical Sections (33 KB): be-the-scheduler stepper for two threads doing counter++ (load/add/store), exhaustive search of all 20 schedules, mutex on/off
  - Ch 18 Mutexes & Spinlocks (37 KB): spin-vs-sleep lock simulation (spinlock / futex-style mutex / spin-then-sleep, 2-8 threads, 1-4 cores, 2 or 40 us critical section) with a per-core timeline and a three-way comparison table
  - Ch 19 Condition Variables (34 KB): three-thread stepper (two workers, one producer) with three waiting styles (no mutex / if / while), reproduces the lost wake-up and the stale-condition bug, and counts every schedule (1,750 / 24 / 24)
  - Ch 20 Semaphores (30 KB): one-semaphore simulator (start at 0, 1 or 3; threads wait, post, return early without posting, or post without waiting) showing the value, who is inside and who sleeps
  - Ch 21 Classic Problems (36 KB): dining-philosophers table (left-then-right, lower fork first, four seats, try-and-back-off; step one philosopher, all at once, or 300 random steps) showing deadlock and livelock; links to LLD Ch 23 for the Java producer-consumer
  - Ch 22 Deadlock (33 KB): banker's algorithm on the textbook 5-process, 3-resource state (step-by-step safety check, three preset requests that are granted / must wait / refused as unsafe, and free-form requests)
  - Ch 23 File Systems (42 KB): hands-on file system with 8 inodes and 12 blocks and a small command line (touch, write, ln, ln -s, mv, rm, cat, ls) showing directory entries, link counts, dangling links, and running out of inodes before blocks
  - Ch 24 Journaling & Crash Consistency (37 KB): pull-the-plug simulator for a one-block append (no journal with the three writes in any order and fsck; ordered metadata journal; full data journal) with reboot-and-recover
  - Ch 25 Atomics & Memory Models (34 KB): store-buffer litmus test (x=1; r1=y against y=1; r2=x) under three models (no store buffers, x86 store buffers, seq_cst stores) with manual buffer drains and a count of every schedule (6 / 74 / 20)
  - Ch 26 Lock-Free Data Structures (35 KB): Treiber-stack stepper (thread 1 pops in three steps while thread 2 pops, frees and pushes back) reproducing ABA and the read of a freed node, with plain CAS or pointer + version
  - Ch 27 Thread Pools & Work Stealing (30 KB): pool-sizing explorer on 4 cores (CPU-bound or I/O-bound tasks, 1-128 threads, arrival rate, bounded or unbounded queue) showing capacity, CPU use, latency, rejections and what each thread is doing
  - Ch 28 I/O Multiplexing (32 KB): be-the-event-loop panel (8 active connections plus 0 / 1,000 / 100,000 idle; select-poll, level-triggered or edge-triggered epoll; read once or until EAGAIN) counting descriptors examined and showing the edge-triggered stall
  - Ch 29 Event Loops & io_uring (32 KB): one-second event-loop simulation (500 small requests plus four heavy tasks of 5, 50 or 200 ms; run on the loop, chunked, or handed to a thread pool) with a loop-busy strip, a latency chart and percentiles
  - Ch 30 mmap & Copy-on-Write (30 KB): fork simulator with eight pages (private or MAP_SHARED memory; write from parent or child, parent rewrites everything, child exec or exit) showing shared frames, read-only entries, copies made and memory saved
  - Ch 31 The Page Cache & fsync (29 KB): write-path simulator (append records with fsync never / every 4 / every record; 30 s writeback; kill -9 or power cut) showing what is in the page cache, what is on disk, what is lost and the time spent in I/O calls
  - Ch 32 Multicore (31 KB): MESI on two cores (reads and writes of x and y, in one cache line or padded onto two) with per-line states, a count of line transfers and invalidations, and 1,000 alternating writes to show false sharing (60 ns against 1.2 ns per write)
  - Ch 33 Virtualization & Hypervisors (32 KB): VM-exit explorer (eight guest operations under software-only, VT-x with shadow paging and emulated devices, or VT-x + EPT + virtio) and a one-second web-serving mix (86% / 56% / 0.4% of the time in the hypervisor)
  - Ch 34 Containers (36 KB): build-a-container panel (switch on PID, mount, network, UTS and user namespaces and memory and CPU limits one at a time; run ps, hostname, ip addr, ls /, id; allocate memory until the cgroup OOM kill; spin threads into throttling)
  - Ch 35 Booting, Kernel Modules & Drivers (36 KB): boot stepper through seven stages with a console log and five injectable faults (boot loader config lost, disk driver missing, wrong root=, bad fstab line, failed service), each stopping at the right stage with the real message and the fix
  - Ch 36 OS Security (33 KB): exploit-versus-defences panel (four attacker inputs against a stack overflow; stack canary, NX, ASLR and a seccomp sandbox as switches) showing the overwritten stack frame, which defence stops which attack, and what the attacker ends up controlling
  - Ch 37 Performance Tools (40 KB): diagnose-five-servers game (run uptime, vmstat, mpstat, free, iostat, top, strace -c and perf top on five slow servers, then pick among CPU saturation, swapping, disk saturation, lock contention and one pinned thread)
  - Ch 38 Tail Latency & the OS (29 KB): fan-out simulator (1-100 back-end calls per request, slow-call rate of 0.1%, 1% or 5%, with or without hedged requests) over 2,000 fixed random requests, showing the share of slow user requests, p50, p99 and the extra load from hedging
  - Ch 39 Priority Inversion & Real-Time Scheduling (30 KB): three-task timeline on one core (high, medium, low; plain mutex, priority inheritance or priority ceiling; adjustable medium-task length) showing H's response time against a 12 ms deadline
  - Ch 40 OS Interview Playbook (34 KB): catch-the-trap drill (22 nearly-true statements across processes, threads, memory, concurrency, deadlock, files, containers and security; answer true, false or it depends, with the correction and a link to the chapter)
