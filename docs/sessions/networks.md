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
- Ch 10 DNS Resolution: recursive-resolver simulator (four names incl. a CNAME across TLDs and a typo; step-by-step trace with latencies; the cache with TTLs counting down; 1 minute / 10 minutes / 3 days pass; negative caching)
- Ch 11 TCP Reliability: lose-some-segments panel (ten segments, click to lose any; timer only, fast retransmit, or fast retransmit + SACK) showing the receiver's ACK stream with duplicates and SACK ranges, the sender's timeline, and time to deliver against no loss
- Ch 12 Flow Control & the Receive Window: sliding-window stepper (40 KB to an 8 KB receive buffer; the application reads 8 KB, 2 KB or nothing per round trip, changeable mid-run) showing the window, the buffer, zero-window probes and the window update
- Ch 13 Congestion Control: cwnd simulator over 30 seconds (Reno, CUBIC or BBR; a shallow, 1-BDP or deep bottleneck queue; 0 / 0.1% / 1% random loss) charting packets in flight against link capacity and the drop line, with link use, queueing delay and loss counts
- Ch 14 Closing Connections & TIME_WAIT: closing stepper with four scenarios (orderly close, half-close, the last ACK lost, close with unread data) showing each segment and both ends' states, TIME-WAIT and the reset
- Ch 15 HTTP/1.1: page-load waterfall (13 files; a new connection per request, one kept alive, one pipelined, or six in parallel; 20 / 100 / 300 ms round trips; an optional slow second file) showing handshakes, queueing and head-of-line blocking
- Ch 16 HTTP/2: twelve files over six HTTP/1.1 connections or one HTTP/2 connection (interleaved packets on the wire, urgent streams first, completion time per file), with one lost packet to show TCP head-of-line blocking stalling every stream
- Ch 17 TLS 1.3 & Certificates: certificate-chain validator (correct, expired, wrong name, intermediate not sent, self-signed, private CA; browser or curl) showing the chain, the four checks and the exact error each client reports
- Ch 18 HTTP/3 & QUIC: round-trip comparison of TCP + TLS 1.3 against QUIC (50 / 150 / 300 ms; first visit or returning with 0-RTT) for time to first byte, and for a Wi-Fi to mobile network change (reconnect against connection migration)
- Ch 19 DHCP: café lease simulator (five addresses, one-hour leases; devices join with DORA, walk out without releasing, 30-minute steps with renewals and expiry) showing the lease table, pool exhaustion and 169.254 self-assigned addresses
- Ch 20 IPv6: address workbench (type or pick an address; full and shortest forms, kind, /64 network and interface ID split, MAC recovered from an EUI-64 interface ID, and precise messages for invalid input)
- Ch 21 WebSockets & Server-Sent Events: one minute of server events delivered five ways (polling every 5 s or 1 s, long polling, SSE, WebSocket; 5 events or 120) with a happens/received timeline, request count, header overhead and delay
- Ch 22 REST & gRPC on the Wire: live Protobuf encoder for a four-field Order (uint64, string, uint32, bool) beside its JSON, with tag, length and value bytes in hex, varints, default values that vanish, and the gRPC 5-byte prefix
- Ch 23 Forward & Reverse Proxies: client-address panel (a request through two proxies; honest or forged X-Forwarded-For; edge proxy appends, overwrites or passes; application reads the TCP source, the first entry or the last untrusted entry) showing the header at each hop and whether the result is correct, a proxy or spoofed
- Ch 24 Load Balancers: algorithm simulator (3,000 requests to four servers; round robin, least connections, two random choices, hash of the client; all alike, one slow server, or one dominant client) showing each server's share and queue, median and 99th-percentile latency
- Ch 25 BGP: eight-network route simulator (customer > peer > provider preference, valley-free export; an intruder announcing the same /24 or two /25s; RPKI origin validation by nobody, the two carriers, or everyone) showing each network's chosen route and where its traffic goes
- Ch 26 Anycast & CDNs: one anycast address announced from up to five cities (toggle each site) with seven user cities, showing where each user lands, round trip and new-connection time, and automatic failover when a site stops announcing
- Ch 27 DNS in Depth: DNS failover timeline (TTL of 30 s / 5 min / 1 h; health-check detection of 30 or 90 s; 0 or 5% of clients ignoring the TTL) charting the share of users still sent to the dead region, with time to recover and the authoritative query rate
- Ch 28 VPNs & Tunnels: tunnel-overhead panel (WireGuard, IPsec, GRE or VXLAN; IPv4 or IPv6 outside; 1500 or 1492 link; host MTU set or left at 1500; ICMP delivered, blocked, or MSS clamped) showing the wrapped packet's layout, tunnel MTU, and the MTU black hole
- Ch 29 VLANs & Overlay Networks: two-switch VLAN panel (six hosts, per-host VLAN, a trunk carrying both VLANs or only VLAN 10; click a host to broadcast) showing who receives the frame, the tag on the trunk, and hosts cut off by a trunk that doesn't carry their VLAN
- Ch 30 Data-Centre Networks: leaf-spine uplink panel (2 / 4 / 8 spines, one optionally failed; 24 or 48 servers per rack; 24 small flows or 4 elephants, both 240 Gbit/s) showing per-uplink load from ECMP hashing, oversubscription, hash collisions and the cost of a failed spine
- Ch 31 Kubernetes Networking: pod-to-Service packet tracer (calling pod web or report; overlay or native routing; optional network policy; a new backend for each connection) showing DNS, the DNAT on the source node, the hop between nodes, delivery or a policy drop, and the reply's reverse translation
- Ch 32 Service Mesh & mTLS: retry-amplification panel (gateway > web > orders > inventory; inventory healthy, failing half, or down; 0 / 1 / 3 retries; every layer, edge only, or every layer with a 20% retry budget) showing requests per user request at each service and the user's success rate
- Ch 33 TCP Performance: write-write-read timeline (one or two writes; Nagle or TCP_NODELAY; delayed or immediate ACKs; 1 / 20 / 100 ms round trip) showing each segment, the 40 ms stall, time spent waiting and packets sent
