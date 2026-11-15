# Resume Cubicle

A responsive, static website for Resume Cubicle, a CV and resume writing studio. It describes the writing services and executive packages, explains the process, shares examples and resources, answers common questions, and provides a contact form.

## Pages

- `index.html` — homepage and service overview
- `services.html` — CV, LinkedIn, job search and executive packages
- `process.html` — how the writing process works
- `examples.html` — before-and-after writing examples
- `resources.html` — practical job-search resources
- `about.html` — studio approach and audience
- `faq.html` — common questions
- `contact.html` — contact form and contact options

## Preview locally

No build step or package installation is required. From the project directory, run:

```sh
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

## Deploy

Deploy the project files and `assets/` directory to a static web host, preserving their paths. The canonical URLs, sitemap and robots file currently use `https://resumecubicle.com`. If the production domain changes, update the absolute URLs in each page's canonical and social metadata, the JSON-LD in `index.html`, `sitemap.xml`, and `robots.txt`.

Submit `https://resumecubicle.com/sitemap.xml` to search engine webmaster tools after deployment. Search visibility and indexing depend on the live site and search engines; metadata alone cannot guarantee rankings.

## SEO included

- Page-specific titles and descriptions
- Canonical URLs and Open Graph/Twitter share metadata
- Organization and website JSON-LD on the homepage
- `robots.txt` and an XML sitemap
- Semantic HTML, responsive layout, and descriptive image alternative text

## Contact form configuration

The contact form sends messages through EmailJS. Its service ID, template ID, public key and contact links are configured near the top of `app.js`. Replace placeholder social profile URLs with the real profile links before launch. The form depends on a valid EmailJS setup and network access to EmailJS.
