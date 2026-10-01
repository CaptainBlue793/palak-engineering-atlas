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
