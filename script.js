const navbar = document.querySelector(".navbar");
const year = document.getElementById("year");
const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");
const counters = document.querySelectorAll(".counter");
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const sections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const productImageMap = [
  { pattern: /marble|calacutta|tajmahal|super white|monalisa|onyx/i, src: "images/products/marble-texture.svg" },
  { pattern: /quartzite|patagonia|maharaja|macau?bus|macaubas|azul bahia/i, src: "images/products/quartzite-texture.svg" },
  { pattern: /sandstone|teakwood|woodland|sand dunes/i, src: "images/products/sandstone-texture.svg" },
  { pattern: /black|galaxy|pearl|marquino|markino|forest|thunder|fish|g20|jet|nero|cosmic|cosmos|nova|regal|monsoon|pyrite|mist/i, src: "images/products/black-granite.png" },
  { pattern: /white|alaska|colonial|moon|platinum|viscon|viscont|ivory|classic|glacier|super|cotton|bianco/i, src: "images/products/white-granite.png" },
  { pattern: /red|imperial red|jhansi|ruby|lakha|chima|rosy|ilkal/i, src: "images/products/red-granite.png" },
  { pattern: /gold|golden|yellow|kashmir|desert gold|sahara|paroda|champagne|madurai|prada/i, src: "images/products/gold-granite.png" },
  { pattern: /brown|tan|coffee|desert brown|antique|baltic|cherry|silk|fantasy/i, src: "images/products/brown-granite.png" },
  { pattern: /green|hassan|kuppam|verde|fusion/i, src: "images/products/green-granite.png" },
  { pattern: /pink/i, src: "images/products/pink-granite.png" },
  { pattern: /grey|gray|steel|silver|matrix|elegant/i, src: "images/products/grey-granite.png" },
  { pattern: /blue|azul|aqua|bahia|macaubas|vizag|himalayan|volga|labrador|pearl silver|roma|marina|lemurian/i, src: "images/products/blue-granite.png" },
  { pattern: /tile|tiles|cutter|slab|slabs|block|blocks/i, src: "images/products/granite-tiles.png" },
  { pattern: /monument|headstone|tombstone|gravestone|memorial|vase|pillar|ball/i, src: "images/products/granite-monuments.png" },
  { pattern: /ivory|cream|beige|tajmahal/i, src: "images/products/ivory-granite.png" },
];

const fallbackProductImage = "images/products/grey-granite.png";

if (year) {
  year.textContent = new Date().getFullYear();
}

const getProductImage = (name) => {
  const match = productImageMap.find((item) => item.pattern.test(name));
  return match ? match.src : fallbackProductImage;
};

const createZoomViewer = () => {
  const viewer = document.createElement("div");
  viewer.className = "image-zoom-viewer";
  viewer.hidden = true;
  viewer.innerHTML = `
    <button class="image-zoom-close" type="button" aria-label="Close image preview">Close</button>
    <figure>
      <img src="" alt="">
      <figcaption></figcaption>
    </figure>
  `;
  document.body.appendChild(viewer);

  const image = viewer.querySelector("img");
  const caption = viewer.querySelector("figcaption");
  const closeButton = viewer.querySelector("button");

  const close = () => {
    viewer.hidden = true;
    document.body.classList.remove("zoom-open");
    image.src = "";
  };

  closeButton.addEventListener("click", close);
  viewer.addEventListener("click", (event) => {
    if (event.target === viewer) close();
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !viewer.hidden) close();
  });

  return {
    open(src, alt) {
      image.src = src;
      image.alt = alt;
      caption.textContent = alt;
      viewer.hidden = false;
      document.body.classList.add("zoom-open");
      closeButton.focus();
    },
  };
};

const zoomViewer = createZoomViewer();

const enhanceProductChips = () => {
  document.querySelectorAll(".product-chip-group span, .catalogue-chip-grid span").forEach((chip) => {
    if (chip.dataset.enhanced === "true") return;
    const name = chip.textContent.trim();
    const src = getProductImage(name);
    chip.dataset.enhanced = "true";
    chip.dataset.zoomSrc = src;
    chip.dataset.zoomAlt = name;
    chip.setAttribute("role", "button");
    chip.setAttribute("tabindex", "0");
    chip.setAttribute("aria-label", `View ${name} image`);
    chip.classList.add("product-thumb-chip");
    chip.innerHTML = `<img src="${src}" width="72" height="52" alt="${name}" loading="lazy" decoding="async"><span>${name}</span>`;
  });
};

enhanceProductChips();

document.addEventListener("click", (event) => {
  const chip = event.target.closest(".product-thumb-chip");
  if (chip) {
    zoomViewer.open(chip.dataset.zoomSrc, chip.dataset.zoomAlt);
    return;
  }

  const zoomImage = event.target.closest(".store-product-media img, .stone-image");
  if (zoomImage) {
    zoomViewer.open(zoomImage.currentSrc || zoomImage.src, zoomImage.alt || "Product image");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const chip = event.target.closest(".product-thumb-chip");
  if (!chip) return;
  event.preventDefault();
  zoomViewer.open(chip.dataset.zoomSrc, chip.dataset.zoomAlt);
});

const updateNavbar = () => {
  if (!navbar) return;
  navbar.classList.toggle("scrolled", window.scrollY > 30);
};

updateNavbar();
window.addEventListener("scroll", updateNavbar, { passive: true });

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".reveal").forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  document.querySelectorAll(".reveal").forEach((element) => {
    element.classList.add("visible");
  });
}

document.querySelectorAll(".navbar-nav .nav-link, .navbar-nav .btn, .footer-list a").forEach((link) => {
  link.addEventListener("click", () => {
    const menu = document.getElementById("mainNavbar");
    if (!menu || !menu.classList.contains("show")) return;
    if (typeof bootstrap === "undefined") return;
    const collapse = bootstrap.Collapse.getOrCreateInstance(menu);
    collapse.hide();
  });
});

const animateCounter = (counter) => {
  if (counter.dataset.animated === "true") return;
  counter.dataset.animated = "true";
  const target = Number(counter.dataset.count || 0);
  if (prefersReducedMotion) {
    counter.textContent = target;
    return;
  }

  const duration = 1300;
  const startTime = performance.now();

  const tick = (currentTime) => {
    const progress = Math.min((currentTime - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    counter.textContent = Math.round(target * eased);
    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

if ("IntersectionObserver" in window) {
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.6 }
  );

  counters.forEach((counter) => {
    counterObserver.observe(counter);
  });
} else {
  counters.forEach(animateCounter);
}

const setActiveNavLink = () => {
  const scrollPosition = window.scrollY + 130;
  let currentId = "home";

  sections.forEach((section) => {
    if (section.offsetTop <= scrollPosition) {
      currentId = section.id;
    }
  });

  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${currentId}`);
  });
};

setActiveNavLink();
window.addEventListener("scroll", setActiveNavLink, { passive: true });

if (contactForm && formStatus) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const name = formData.get("name") || "there";
    formStatus.hidden = false;
    formStatus.textContent = `Thank you, ${name}. Your message has been submitted successfully. HBC Exports will contact you shortly.`;
    contactForm.reset();
  });
}
