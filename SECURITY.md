Security checklist for ghostwwn.com

1) Add SPF record (DNS)
   - If you DO NOT send email from this domain, add the following TXT record at your DNS provider:
     Name/Host: @
     Type: TXT
     Value: "v=spf1 -all"
   - Verify with:
     dig +short TXT ghostwwn.com

2) Cloudflare / CDN (recommended)
   - Add site to Cloudflare and update nameservers at your registrar to Cloudflare's.
   - DNS config for GitHub Pages:
     - For apex/root domain (ghostwwn.com), add A records to GitHub Pages IPs:
       185.199.108.153
       185.199.109.153
       185.199.110.153
       185.199.111.153
     - Optionally, point `www` as a CNAME to `ghostwwn.github.io`.
   - In Cloudflare:
     - SSL/TLS: choose "Full (strict)" if possible.
     - Enable "Always Use HTTPS" and "Automatic HTTPS Rewrites".
     - Firewall: enable WAF, OWASP rulesets, and rate-limiting for the main endpoints.
     - Page Rules / Transform Rules: add response headers listed below.

3) Response headers (set via CDN or host)
   - Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
   - X-Content-Type-Options: nosniff
   - X-Frame-Options: DENY
   - Referrer-Policy: strict-origin-when-cross-origin
   - Content-Security-Policy: default-src 'self' https: data:; script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdnjs.cloudflare.com; img-src 'self' data: https:; connect-src 'self' https://learn.opswatacademy.com https://www.credly.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; upgrade-insecure-requests

4) Verify
   - After DNS and CDN are configured, run:
     curl -I https://ghostwwn.com
   - Confirm the response headers above are present.

Notes
- Meta CSP is weaker than header CSP and cannot set frame-ancestors; use CDN response headers for full protection.
- If you use email services from this domain (e.g., Google Workspace, SendGrid), update the SPF value to include those services instead of -all.
