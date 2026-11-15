// EDIT THESE: your EmailJS service ID, template ID and public key, plus your email, LinkedIn and Fiverr links
const CONFIG = { emailjsService: "YOUR_SERVICE_ID", emailjsTemplate: "YOUR_TEMPLATE_ID", emailjsKey: "YOUR_PUBLIC_KEY", email: "hello@resumecubicle.com", linkedin: "https://www.linkedin.com/in/your-profile", fiverr: "https://www.fiverr.com/your-username" };

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const root = document.documentElement;
root.classList.add("js");

// Headlines: words rise in one by one
$$("h1.split").forEach(h => {
  h.innerHTML = h.textContent.trim().split(/\s+/).map((w, i) => `<span class="w" style="--i:${i}">${w}</span>`).join(" ");
});
$$(".sheet i").forEach((el, i) => el.style.setProperty("--d", (0.5 + i * 0.07) + "s"));

// Scroll-driven motion: progress bar, hero sheet, process line
const sheet = $("#sheet"), box = $(".steps"), steps = $$(".step");
let queued = false;
function frame() {
  const y = scrollY, max = root.scrollHeight - innerHeight;
  root.style.setProperty("--sp", max > 0 ? y / max : 0);
  if (sheet) sheet.style.setProperty("--p", Math.min(1, y / (innerHeight * 0.6)).toFixed(3));
  if (box) {
    const mid = innerHeight * 0.55, r = box.getBoundingClientRect();
    box.style.setProperty("--sf", Math.max(0, Math.min(1, (mid - r.top) / r.height)));
    steps.forEach(s => s.classList.toggle("on", s.getBoundingClientRect().top < mid));
  }
  queued = false;
}
addEventListener("scroll", () => { if (!queued) { queued = true; requestAnimationFrame(frame); } }, { passive: true });
addEventListener("resize", frame);
frame();

// Reveal on scroll
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.15 });
$$(".rv").forEach(el => io.observe(el));

// Soft spotlight that follows the pointer on service tiles
$$(".tile").forEach(t => t.addEventListener("pointermove", e => {
  const r = t.getBoundingClientRect();
  t.style.setProperty("--mx", e.clientX - r.left + "px");
  t.style.setProperty("--my", e.clientY - r.top + "px");
}));

// Before / after toggle (one switch controls every list on the page)
const seg = $(".seg"), lists = $$(".bl");
if (seg && lists.length) {
  $$("button", seg).forEach(b => b.addEventListener("click", () => {
    const v = b.dataset.v;
    if (seg.dataset.v === v) return;
    seg.dataset.v = v;
    $$("button", seg).forEach(x => x.setAttribute("aria-pressed", x === b));
    lists.forEach(l => l.classList.add("swap"));
    setTimeout(() => {
      lists.forEach(l => {
        $$("li", l).forEach(li => { $(".txt", li).textContent = li.dataset[v]; });
        l.dataset.v = v;
        l.classList.remove("swap");
      });
    }, 260);
  }));
}

// Contact form: sends the message to Team Jareh's inbox through EmailJS
const form = $("#form"), note = $("#note"), send = $("#send");
if (form) {
  form.addEventListener("submit", async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const f = new FormData(form);
    if (f.get("website")) return; // spam trap: real visitors never see this field
    if (CONFIG.emailjsKey.startsWith("YOUR")) {
      note.textContent = "Messaging isn’t connected yet. Add your EmailJS details at the top of app.js.";
      return;
    }
    send.disabled = true; send.textContent = "Sending…"; note.textContent = "";
    const email = f.get("email").trim();
    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: CONFIG.emailjsService, template_id: CONFIG.emailjsTemplate, user_id: CONFIG.emailjsKey,
          template_params: { from_name: f.get("name").trim(), from_email: email, reply_to: email, service: f.get("service"), message: (f.get("msg") || "").trim() || "(No message text)" }
        })
      });
      if (!res.ok) throw new Error(res.status);
      form.reset();
      note.textContent = "Thank you, your message has been sent. Team Jareh will reply to the email you gave.";
    } catch (err) {
      note.textContent = "Sorry, your message didn’t send. Please check your connection and try again.";
    }
    send.disabled = false; send.textContent = "Send message";
  });
}

// Contact links (header-free: they appear in the footer and on the contact page)
$$("[data-link=email]").forEach(a => a.href = "mailto:" + CONFIG.email);
$$("[data-link=linkedin]").forEach(a => a.href = CONFIG.linkedin);
$$("[data-link=fiverr]").forEach(a => a.href = CONFIG.fiverr);

// Mobile menu and footer year
const menu = $("#menu"), links = $("#links");
if (menu && links) {
  menu.addEventListener("click", () => menu.setAttribute("aria-expanded", links.classList.toggle("open")));
  $$("a", links).forEach(a => a.addEventListener("click", () => { links.classList.remove("open"); menu.setAttribute("aria-expanded", false); }));
}
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());