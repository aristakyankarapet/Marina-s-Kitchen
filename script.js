// ===== Translations =====
const translations = {
  hy: {
    "music.on": "Միացնել երաժշտությունը",
    "music.off": "Անջատել երաժշտությունը",
    "nav.home": "Գլխավոր",
    "nav.cuisine": "Խոհանոց",
    "nav.about": "Մարինայի մասին",
    "nav.upcoming": "Շուտով",
    "nav.contact": "Կապ",

    "dish.videoWatch": "Դիտել պատրաստումը",
    "dish.videoSoon": "Պատրաստման տեսանյութը՝ շուտով",

    "upcoming.soon": "Շուտով",
    "form.suggestStart": "Իմ առաջարկած ուտեստը՝ ",

    "contact.email": "Էլ. փոստ",
    "contact.address": "Հասցե",

    "form.name": "Անուն",
    "form.email": "Էլ. փոստ",
    "form.message": "Հաղորդագրություն",
    "form.send": "Ուղարկել",
    "form.error": "Խնդրում ենք լրացնել բոլոր դաշտերը ճիշտ։",
    "form.success": "Շնորհակալություն։ Ձեր հաղորդագրությունն ուղարկվեց Մարինային։",
    "form.sending": "Ուղարկվում է…",
    "form.fallback": "Բացվում է ձեր էլ. փոստը՝ նամակն արդեն պատրաստ է, մնում է սեղմել «Ուղարկել»։",

    "footer.tagline": "Պատրաստված սիրով՝ հայկական ավանդույթներով։",
    "footer.music": "Երաժշտություն՝"
  },
  en: {
    "music.on": "Turn music on",
    "music.off": "Turn music off",
    "nav.home": "Home",
    "nav.cuisine": "Cuisine",
    "nav.about": "About Marina",
    "nav.upcoming": "Coming soon",
    "nav.contact": "Contact",

    "dish.videoWatch": "Watch how it's made",
    "dish.videoSoon": "Recipe video coming soon",

    "upcoming.soon": "Coming soon",
    "form.suggestStart": "The dish I suggest: ",

    "contact.email": "Email",
    "contact.address": "Address",

    "form.name": "Name",
    "form.email": "Email",
    "form.message": "Message",
    "form.send": "Send message",
    "form.error": "Please fill in all fields correctly.",
    "form.success": "Thank you! Your message has been sent to Marina.",
    "form.sending": "Sending…",
    "form.fallback": "Opening your email app: the message is ready, just press Send.",

    "footer.tagline": "Made with love, rooted in Armenian tradition.",
    "footer.music": "Music:"
  },
  ru: {
    "music.on": "Включить музыку",
    "music.off": "Выключить музыку",
    "nav.home": "Главная",
    "nav.cuisine": "Кухня",
    "nav.about": "О Марине",
    "nav.upcoming": "Скоро",
    "nav.contact": "Контакты",

    "dish.videoWatch": "Смотреть, как готовится",
    "dish.videoSoon": "Видео рецепта — скоро",

    "upcoming.soon": "Скоро",
    "form.suggestStart": "Предлагаю блюдо: ",

    "contact.email": "Эл. почта",
    "contact.address": "Адрес",

    "form.name": "Имя",
    "form.email": "Эл. почта",
    "form.message": "Сообщение",
    "form.send": "Отправить",
    "form.error": "Пожалуйста, правильно заполните все поля.",
    "form.success": "Спасибо! Ваше сообщение отправлено Марине.",
    "form.sending": "Отправка…",
    "form.fallback": "Открывается ваша почта: письмо уже готово, осталось нажать «Отправить».",

    "footer.tagline": "Приготовлено с любовью, по армянским традициям.",
    "footer.music": "Музыка:"
  }
};

const titles = {
  home: {
    hy: "Marina's Kitchen — Հայկական ավանդական խոհանոց",
    en: "Marina's Kitchen — Traditional Armenian Cuisine",
    ru: "Marina's Kitchen — Традиционная армянская кухня"
  },
  cuisine: { hy: "Խոհանոց — Marina's Kitchen", en: "Cuisine — Marina's Kitchen", ru: "Кухня — Marina's Kitchen" },
  about: { hy: "Մարինայի մասին — Marina's Kitchen", en: "About Marina — Marina's Kitchen", ru: "О Марине — Marina's Kitchen" },
  upcoming: { hy: "Շուտով — Marina's Kitchen", en: "Coming soon — Marina's Kitchen", ru: "Скоро — Marina's Kitchen" },
  contact: { hy: "Կապ — Marina's Kitchen", en: "Contact — Marina's Kitchen", ru: "Контакты — Marina's Kitchen" }
};
const currentPage = document.body.dataset.page || "home";

let currentLang = localStorage.getItem("lang") || "hy";

function t(key) {
  return translations[currentLang][key] || key;
}

function setLanguage(lang) {
  currentLang = translations[lang] ? lang : "hy";
  localStorage.setItem("lang", currentLang);
  document.documentElement.lang = currentLang;
  document.title = (titles[currentPage] || titles.home)[currentLang];

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    el.textContent = t(el.dataset.i18n);
  });
  applyContent();
  document.querySelectorAll(".lang__btn").forEach((btn) => {
    const active = btn.dataset.lang === currentLang;
    btn.classList.toggle("is-active", active);
    btn.setAttribute("aria-pressed", active);
  });
  updateDishVideos();
  updateMusicButton();

  const status = document.getElementById("formStatus");
  if (status && status.dataset.key) status.textContent = t(status.dataset.key);
}

document.querySelectorAll(".lang__btn").forEach((btn) => {
  btn.addEventListener("click", () => setLanguage(btn.dataset.lang));
});

// ===== Page content =====
// The texts, photos and links of each page live in content/<page>.json, where
// Marina edits them with Pages CMS. Every text there has hy / en / ru versions.
let content = {};

function get(path) {
  return path.split(".").reduce((obj, key) => (obj == null ? obj : obj[key]), content);
}

// The current language, or Armenian when that translation is left empty
function pick(value) {
  if (value == null) return "";
  if (typeof value !== "object") return String(value);
  return value[currentLang] || value.hy || "";
}

// The CMS saves photos as "/images/..."; keep them relative to the site
function mediaUrl(path) {
  return String(path || "").replace(/^\//, "");
}

// Vertical crop of a dish photo: 0 = top, 50 = middle, 100 = bottom
function focus(photo) {
  const value = Number(photo.focus);
  return photo.focus === "" || photo.focus == null || isNaN(value) ? 50 : Math.min(Math.max(value, 0), 100);
}

function applyContent() {
  document.querySelectorAll("[data-c]").forEach((el) => {
    el.textContent = pick(get(el.dataset.c));
  });
  document.querySelectorAll("[data-c-alt]").forEach((el) => {
    el.alt = pick(get(el.dataset.cAlt));
  });
}

function buildDishes() {
  const box = document.getElementById("dishes");
  if (!box) return;
  (content.dishes || []).forEach((dish, d) => {
    const photos = (dish.photos || []).map((photo, i) => ({ photo, i })).filter((p) => p.photo && p.photo.image);
    const card = document.createElement("article");
    card.className = "dish reveal";
    card.innerHTML = `
      <div class="dish__img dish__gallery" data-gallery>
        ${photos.map(({ photo, i }, n) => `<img${n ? "" : ' class="is-active"'} loading="lazy" alt=""
          data-c-src="dishes.${d}.photos.${i}.image" data-c-alt="dishes.${d}.photos.${i}.alt"
          style="object-position: center ${focus(photo)}%">`).join("")}
        ${photos.length > 1 ? `<div class="dish__dots">${photos.map((p, n) =>
          `<button type="button"${n ? "" : ' class="is-active"'} aria-label="${n + 1}"></button>`).join("")}</div>` : ""}
      </div>
      <div class="dish__body">
        <h3 class="dish__title" data-c="dishes.${d}.title"></h3>
        <p data-c="dishes.${d}.text"></p>
        <a class="dish__video" target="_blank" rel="noopener"></a>
      </div>`;
    card.querySelector(".dish__video").dataset.videoUrl = dish.video || "";
    box.append(card);
  });
}

function buildAbout() {
  const text = document.getElementById("aboutText");
  const stats = document.getElementById("stats");
  if (!text) return;
  text.innerHTML = (content.paragraphs || []).map((p, i) => `<p data-c="paragraphs.${i}"></p>`).join("");
  stats.innerHTML = (content.stats || []).map((stat, i) => `
    <li class="stat">
      <span class="stat__num" data-count="${Number(stat.number) || 0}">0</span><span class="stat__plus">+</span>
      <span class="stat__label" data-c="stats.${i}.label"></span>
    </li>`).join("");
}

// Dishes coming soon first, then the "your suggestion" cards
function buildUpcoming() {
  const box = document.getElementById("upcomingCards");
  if (!box) return;
  const num = (i) => String(i + 1).padStart(2, "0");
  const dishes = content.dishes || [];
  const cards = dishes.map((dish, i) => `
    <article class="upcoming__card upcoming__card--photo reveal">
      <span class="upcoming__num">${num(i)}</span>
      ${dish.photo ? `<img class="upcoming__img" loading="lazy" alt="" data-c-src="dishes.${i}.photo" data-c-alt="dishes.${i}.photoAlt">` : ""}
      <h3 class="upcoming__title" data-c="dishes.${i}.title"></h3>
      <p data-c="dishes.${i}.text"></p>
      <span class="upcoming__tag" data-i18n="upcoming.soon"></span>
    </article>`);
  for (let i = 0; i < (Number(content.suggestions) || 0); i++) {
    cards.push(`
    <article class="upcoming__card upcoming__card--vote reveal">
      <span class="upcoming__num">${num(dishes.length + i)}</span>
      <div class="upcoming__emblem upcoming__emblem--vote" aria-hidden="true">?</div>
      <h3 class="upcoming__title" data-c="suggestion.title"></h3>
      <p data-c="suggestion.text"></p>
      <a class="upcoming__suggest" href="contact.html?suggest" data-c="suggestion.button"></a>
    </article>`);
  }
  box.innerHTML = cards.join("");
}

function buildContent() {
  buildDishes();
  buildAbout();
  buildUpcoming();
  document.querySelectorAll("[data-c-src]").forEach((el) => {
    el.src = mediaUrl(get(el.dataset.cSrc));
  });
  document.querySelectorAll("[data-c-href]").forEach((el) => {
    el.href = get(el.dataset.cHref) || "#";
  });
}

// ===== Header + mobile menu =====
const header = document.getElementById("header");
const nav = document.getElementById("nav");
const burger = document.getElementById("burger");

function onScroll() {
  // Inner pages have no dark hero under the header, so it is always solid there.
  const solid = document.body.classList.contains("page-inner");
  header.classList.toggle("is-scrolled", solid || window.scrollY > 24 || nav.classList.contains("is-open"));
}
window.addEventListener("scroll", onScroll, { passive: true });

function toggleMenu(open) {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", open);
  onScroll();
}
burger.addEventListener("click", () => toggleMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => toggleMenu(false)));

// Highlight the menu item of the current page
const pageLinks = { home: "index.html", cuisine: "cuisine.html", about: "about.html", upcoming: "upcoming.html", contact: "contact.html" };
nav.querySelectorAll(".nav__link").forEach((link) => {
  link.classList.toggle("is-active", link.getAttribute("href") === pageLinks[currentPage]);
});

// ===== Scroll reveal =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("is-visible");
    revealObserver.unobserve(entry.target);
  });
}, { threshold: 0.15 });

function initReveal() {
  document.querySelectorAll(".reveal").forEach((el) => {
    // Stagger items that sit side by side in a grid
    const siblings = Array.from(el.parentElement.children).filter((c) => c.classList.contains("reveal"));
    el.style.transitionDelay = (siblings.indexOf(el) % 3) * 0.12 + "s";
    revealObserver.observe(el);
  });
}

// ===== Animated counters =====
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = Number(el.dataset.count);
    const duration = 1600;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.6 });
function initCounters() {
  document.querySelectorAll("[data-count]").forEach((el) => counterObserver.observe(el));
}

// ===== Dish photo galleries =====
// Cards with several photos crossfade between them; the dots switch manually.
function initGalleries() {
  document.querySelectorAll("[data-gallery]").forEach((gallery) => {
    const imgs = gallery.querySelectorAll("img");
    const dots = gallery.querySelectorAll(".dish__dots button");
    if (imgs.length < 2) return;
    let current = 0;
    let timer;

    function show(i) {
      imgs[current].classList.remove("is-active");
      dots[current].classList.remove("is-active");
      current = i;
      imgs[current].classList.add("is-active");
      dots[current].classList.add("is-active");
    }
    function start() {
      clearInterval(timer);
      timer = setInterval(() => show((current + 1) % imgs.length), 4500);
    }
    dots.forEach((dot, i) => dot.addEventListener("click", () => { show(i); start(); }));
    start();
  });
}

// ===== Dish recipe videos =====
// A link becomes active once its data-video-url is filled in.
function updateDishVideos() {
  document.querySelectorAll(".dish__video").forEach((link) => {
    const url = link.dataset.videoUrl;
    if (url) link.href = url;
    else link.removeAttribute("href");
    link.classList.toggle("is-soon", !url);
    link.textContent = t(url ? "dish.videoWatch" : "dish.videoSoon");
  });
}

// ===== Contact form =====
// The site is static, so messages are forwarded to Marina's inbox by
// FormSubmit (formsubmit.co). The visitor's email is set as reply-to.
const CONTACT_EMAIL = "torosyanm13@gmail.com";
const FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
const form = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const formButton = form && form.querySelector('button[type="submit"]');
const formFields = form && form.querySelectorAll("input:not([name=_honey]), textarea");

function setStatus(key, isError) {
  formStatus.dataset.key = key;
  formStatus.classList.toggle("is-error", isError);
  formStatus.textContent = t(key);
}

if (form) form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;
  formFields.forEach((field) => {
    const ok = field.value.trim() !== "" && field.checkValidity();
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) return setStatus("form.error", true);

  const data = Object.fromEntries(new FormData(form));
  data._subject = "Marina's Kitchen: " + data.name;
  data._template = "table";
  data._captcha = "false";

  formButton.disabled = true;
  setStatus("form.sending", false);
  try {
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok || String(json.success) !== "true") throw new Error(json.message);
    setStatus("form.success", false);
    form.reset();
  } catch (err) {
    // Backup: open the visitor's email app with the message ready to send.
    setStatus("form.fallback", true);
    const body = `${data.message}\n\n— ${data.name} (${data.email})`;
    window.location.href = "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(data._subject) +
      "&body=" + encodeURIComponent(body);
  } finally {
    formButton.disabled = false;
  }
});

// Coming from "Suggest a dish": start the message and jump to the form.
function startSuggestion() {
  if (!form || !new URLSearchParams(location.search).has("suggest")) return;
  const message = form.querySelector("textarea[name=message]");
  message.value = t("form.suggestStart");
  form.scrollIntoView({ block: "center" });
  message.focus({ preventScroll: true });
  message.setSelectionRange(message.value.length, message.value.length);
}

// ===== Background music =====
// Loops softly in the background. The visitor's on/off choice is remembered.
const music = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
const MUSIC_VOLUME = 0.35;
let musicWanted = localStorage.getItem("music") !== "off";
let fadeTimer;

function updateMusicButton() {
  const playing = !music.paused;
  musicBtn.classList.toggle("is-playing", playing);
  musicBtn.setAttribute("aria-pressed", playing);
  musicBtn.setAttribute("aria-label", t(playing ? "music.off" : "music.on"));
  musicBtn.title = t(playing ? "music.off" : "music.on");
}

// Some phones (iPhone/iPad Safari) don't let pages change the volume, so the
// fade is skipped there; the fade also always ends within a second.
const canSetVolume = (() => {
  const probe = document.createElement("audio");
  probe.volume = 0.5;
  return probe.volume === 0.5;
})();

function fadeTo(target, done) {
  clearInterval(fadeTimer);
  if (!canSetVolume) {
    if (done) done();
    return;
  }
  const start = music.volume;
  const steps = 20;
  let step = 0;
  fadeTimer = setInterval(() => {
    step += 1;
    music.volume = start + (target - start) * (step / steps);
    if (step >= steps) {
      clearInterval(fadeTimer);
      music.volume = target;
      if (done) done();
    }
  }, 50);
}

// Keep the song going from the same spot when moving between pages.
const savedTime = parseFloat(sessionStorage.getItem("musicTime"));
function restoreMusicTime() {
  if (savedTime > 0 && savedTime < music.duration) music.currentTime = savedTime;
}
if (music.readyState >= 1) restoreMusicTime();
else music.addEventListener("loadedmetadata", restoreMusicTime, { once: true });
window.addEventListener("pagehide", () => {
  sessionStorage.setItem("musicTime", music.currentTime);
});

function playMusic() {
  if (canSetVolume) music.volume = 0;
  return music.play().then(() => {
    updateMusicButton(); // no "play" event fires if it was still playing
    fadeTo(MUSIC_VOLUME);
  });
}

function stopMusic() {
  fadeTo(0, () => music.pause());
}

musicBtn.addEventListener("click", () => {
  musicWanted = !musicBtn.classList.contains("is-playing");
  localStorage.setItem("music", musicWanted ? "on" : "off");
  if (musicWanted) {
    playMusic().catch(() => {});
  } else {
    musicBtn.classList.remove("is-playing"); // show "off" right away
    stopMusic();
  }
});

music.addEventListener("play", updateMusicButton);
music.addEventListener("pause", updateMusicButton);

// Browsers block sound until the visitor interacts with the page, so try to
// start right away and otherwise start on the first tap, click or key.
function startOnFirstInteraction(e) {
  if (musicBtn.contains(e.target)) return; // the button handles itself
  ["pointerdown", "keydown"].forEach((type) =>
    document.removeEventListener(type, startOnFirstInteraction));
  if (musicWanted && music.paused) playMusic().catch(() => {});
}

if (musicWanted) {
  playMusic().catch(() => {
    ["pointerdown", "keydown"].forEach((type) =>
      document.addEventListener(type, startOnFirstInteraction));
  });
}

// Pause while the tab is hidden (e.g. an Instagram video is open), resume after.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) music.pause();
  else if (musicWanted && !document.hidden) playMusic().catch(() => {});
});

// ===== Init =====
document.getElementById("year").textContent = new Date().getFullYear();
setLanguage(currentLang);
onScroll();

// Load this page's content, then build the page from it. no-cache makes the
// browser check for Marina's latest edits instead of showing an old copy.
const contentFile = "content/" + currentPage + ".json";
fetch(contentFile, { cache: "no-cache" })
  .then((res) => (res.ok ? res.json() : Promise.reject(new Error(res.status + " " + contentFile))))
  .then((data) => { content = data; })
  .catch((err) => console.error("Could not load page content:", err))
  .finally(() => {
    buildContent();
    setLanguage(currentLang);
    initReveal();
    initCounters();
    initGalleries();
    startSuggestion();
  });
