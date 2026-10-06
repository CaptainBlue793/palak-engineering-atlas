# Computer Networks — session log

## 2026-10-01 — session 1
- Chapter list approved by the owner as drafted (P1–P8 + 48 chapters). Icons de-duplicated:
  Ch 27 🔏, Ch 35 🔥, Ch 46 🩺.
- Step 2: course home (map: link/network → transport → application/security → internet & case
  studies), glossary (119 terms), mock interview (18 questions; Clarify → Big picture → Layer by
  layer → Deep dive → Failure & debugging → Wrap-up; networking rubric), README.
- Decisions: P7 teaches encapsulation; Ch 1 only maps the models. Ch 40 has the 2-minute URL answer,
  Ch 41 the full packet trace. Ch 33 teaches Nagle/delayed ACK; Ch 48 finds it in a capture.
- Needs a shared change: `.objectives li` is `display:flex`, so an objective containing `<code>` splits into columns (LLD pages have it too). Fix in style.css: wrap content or use `display:block` with a positioned ✓. Networks chapters wrap objective text in `<span>` meanwhile.
- P1 Bytes, Encoding & Byte Order: byte inspector (UTF-8/UTF-16/Latin-1/ASCII, endianness)
- P2 IP Addresses & Binary Arithmetic: mask workbench (bitwise AND, same-network check)
- P3 Clients, Servers & Ports: connection-table simulator (5-tuples, refused, port exhaustion)
- P4 ping, curl, dig & Friends: debug-the-broken-endpoint game (6 incidents)
- P5 Sockets in Python: two-sided socket-call stepper (backlog, blocking, refused, timeouts)
- P6 Reading Packets with Wireshark: mini-Wireshark (display-filter parser, details tree, real header bytes, follow stream)
- P7 Layering & Encapsulation: encapsulation builder (MSS, fragmentation, TLS overhead, MTU)
- P8 Latency, Bandwidth & Throughput: latency-vs-bandwidth calculator with BDP pipe
- Ch 1 OSI vs TCP/IP: layer sorter (20 cards with defensible answers)
- Ch 2 Ethernet, MAC Addresses & Switches: learning-switch simulator (flood, learn, age, VM move, hub mode)
- Ch 3 ARP: LAN simulator (resolve, cache states, failed lookup, spoofing, keepalived failover)
- Ch 4 IP Addressing & Subnetting: VLSM subnet planner (AWS rules, growth, /31)
- Ch 5 Routing Tables & Forwarding: three-router hop-by-hop tracer (LPM, return path, loop, null route)
- Ch 6 ICMP, ping & traceroute: traceroute/mtr simulator (probe types, silent and rate-limited hops, real loss)
- Ch 7 UDP: voice call over UDP vs TCP on a lossy path (late = lost)

## 2026-10-06 — session 2 (standalone clone)
- Setup: work continues in a standalone clone of `feature/networks-course` at `C:\Users\palak\atlas-courses\networks`, outside OneDrive.
  `main` (with the released OS course) was merged into the branch first. The owner's plan is one course at a time; this is the second.
- Decisions: each chapter's panel is driven headlessly (script errors, the numbers quoted in the text, 390 px overflow) before its commit;
  the branch is pushed after every chapter. The glossary already covers Ch 8–48, so terms are added only when a chapter needs a new one.
- Ch 8 TCP: The Handshake & the Byte Stream: conversation builder (handshake one segment at a time, data both ways, lose-the-next-segment, real or relative sequence numbers, states at both ends)
- Ch 9 NAT, Ports & Sockets: be-the-NAT-router panel (three devices behind one address and six ports; outbound TCP and UDP, replies, a stranger's packet, idle expiry after 1 and 6 minutes, port exhaustion)
