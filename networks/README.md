# Computer Networks — Interactive Course

How networks really work, from the bits on an Ethernet cable to BGP and the protocols that carry
the web. **48 chapters across five levels, plus an 8-chapter Prerequisites level** (P1–P8: bytes
and byte order, IP arithmetic, clients/servers/ports, the CLI tools, Python sockets, Wireshark,
layering, latency and bandwidth).

Static site, **zero dependencies**, no build step required to read it. Open `index.html` in a
browser; progress, quiz scores and flashcard state are saved in `localStorage` under `net-*` keys.

> **Status: in progress.** Chapters are being written in order. Each chapter has an interactive
> panel, Python socket and CLI listings in the house style, a sequence or flow diagram, a comparison
> table, a real-world use case, a common-mistakes box, an interview drill and a five-question quiz.
> `grep -l net:placeholder *.html` lists the chapters still to come.

## The levels

| Level | Chapters | What it covers |
|---|---|---|
| **Prerequisites** | P1–P8 | Bytes and network byte order, IP addresses as numbers, ports and the 5-tuple, `ping`/`curl`/`dig`/`ss`, Python sockets, Wireshark and `tcpdump`, encapsulation, latency vs bandwidth |
| **Beginner** | 1–10 | OSI vs TCP/IP, Ethernet and switches, ARP, subnetting, routing tables, ICMP and traceroute, UDP, the TCP handshake, NAT, DNS resolution |
| **Intermediate** | 11–24 | TCP reliability, flow control, congestion control (CUBIC, BBR), `TIME_WAIT`, HTTP/1.1, HTTP/2, TLS 1.3, HTTP/3 and QUIC, DHCP, IPv6, WebSockets and SSE, REST and gRPC on the wire, proxies, L4 vs L7 load balancing |
| **Advanced** | 25–36 | BGP, anycast and CDNs, DNSSEC and GeoDNS, VPNs and WireGuard, VLANs and VXLAN, leaf–spine data centres, Kubernetes networking, service mesh and mTLS, Nagle and delayed ACK, kernel networking, firewalls and iptables, DDoS |
| **Expert** | 37–40 | Packet-level debugging, internet latency budgets, SDN, the interview playbook |
| **Case Studies** | 41–48 | Typing google.com packet by packet, a WebRTC call, a CDN and a viral video, Facebook's 2021 BGP outage, the 2016 Dyn DNS attack, load-balancer failover, multiplayer game networking, debugging a slow API from a capture |

Where this course meets the others, each keeps its own angle and links across: the OS course
covers `epoll` and network namespaces from the kernel's side, Cloud & DevOps runs Kubernetes, and
System Design uses load balancers and CDNs as building blocks.

## Study tools

- **`glossary.html`**: networking terms, each linked to the chapter that introduces it
- **`flashcards.html`**: spaced-repetition deck generated from the chapter quizzes
- **`mock-interview.html`**: timed room with 18 networking questions (explain, debug and design), a phase timer, an 8-point rubric and notes saved locally

## Tools

```bash
node tools/scaffold.cjs            # create placeholder pages for chapters in tools/chapters.cjs
node tools/build-study-data.js     # regenerate assets/study-data.js (search index + flashcards)
node build.js                      # -> dist/networks-course.html, the single-file offline edition
```

`assets/app.js` holds the `CHAPTERS` registry, the single source of truth for the sidebar, the
navigation and progress. `tools/chapters.cjs` is the original plan (with each chapter's outline);
`node tools/scaffold.cjs --registry` rewrites the registry from it, so only use that flag before
chapters start being edited by hand.

## House style

Every listing is Python 3 sockets or a real command with its real output. Bytes on the wire and
strings in the program, converted explicitly at the edge; a timeout on every socket; messages
framed on top of TCP's byte stream (a length prefix or a delimiter); sockets closed with `with`;
and every `curl`, `dig`, `ss` or `tcpdump` listing shows the command, its trimmed output and what
the important fields mean.
