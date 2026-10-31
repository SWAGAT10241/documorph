# 🛡️ Security Policy

The DocuMorph team and maintainers take application and supply chain security seriously. This document outlines our vulnerability disclosure policy and security design principles.

---

## 🔒 Supported Versions

We provide security updates and patches for the following versions:

| Version | Supported |
|:---|:---:|
| 1.x.x (main) | ✅ Supported |
| < 1.0.0 | ❌ End of Life |

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability or sensitive information exposure within DocuMorph, please **do NOT report it in public GitHub issues**.

Instead, follow responsible disclosure:
1. **Email:** Send your vulnerability report directly to [swagatsourav10241@gmail.com](mailto:swagatsourav10241@gmail.com) with the subject line `[SECURITY] DocuMorph Vulnerability Report`.
2. **Details to Include:**
   - Detailed description of the vulnerability and attack vector.
   - Proof of Concept (PoC) or reproduction steps.
   - Potential impact on end-user privacy, API secrets, or sandbox integrity.
3. **Response SLA:**
   - You will receive an initial acknowledgment within **24 hours**.
   - A triage assessment and mitigation plan will follow within **48–72 hours**.
   - A coordinated public release will occur once a validated patch is deployed.

---

## 🧱 Architectural Security Guardrails

DocuMorph is engineered with privacy-first and secure-by-default execution principles:

1. **Client-Side Sandbox Isolation:**  
   Simulated API executions and schema inspections take place entirely within isolated browser state. No arbitrary client tokens or credentials are leaked to remote proxy servers.

2. **Zero Telemetry Leaks for Custom Documents:**  
   Ingested OpenAPI schemas and custom architecture Markdown uploaded by users stay within the browser session memory and are never transmitted to unauthorized third-party telemetry collectors.

3. **Dependency Scanning & Automated Audits:**  
   Continuous GitHub Actions workflows audit packages against known CVEs on every commit using `pnpm audit` and GitHub CodeQL static analysis.
