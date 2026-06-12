const html = document.documentElement;
const body = document.body;
const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = Array.from(document.querySelectorAll(".site-nav__link"));
const themeToggle = document.querySelector(".theme-toggle");
const backToTop = document.querySelector(".back-to-top");
const yearNode = document.querySelector("#current-year");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const modal = document.querySelector(".modal");
const modalImage = document.querySelector(".modal__image");
const modalTitle = document.querySelector("#certificate-title");
const modalCaption = document.querySelector("#certificate-caption");
const modalCloseButtons = Array.from(document.querySelectorAll("[data-modal-close]"));
const certificateCards = Array.from(document.querySelectorAll(".certificate-card"));
const revealElements = Array.from(document.querySelectorAll(".reveal"));
const sections = Array.from(document.querySelectorAll("main section[id]"));

const storageKey = "kartika-portfolio-theme";
const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
const queryTheme = new URLSearchParams(window.location.search).get("theme");
const explicitTheme = queryTheme === "dark" || queryTheme === "light" ? queryTheme : null;

const readStoredTheme = () => {
  try {
    return localStorage.getItem(storageKey);
  } catch {
    return null;
  }
};

const writeStoredTheme = (theme) => {
  try {
    localStorage.setItem(storageKey, theme);
  } catch {
    return null;
  }
};

const getPreferredTheme = () =>
  explicitTheme || readStoredTheme() || (mediaQuery.matches ? "dark" : "light");

const applyTheme = (theme) => {
  html.dataset.theme = theme;
  writeStoredTheme(theme);
  themeToggle?.setAttribute("aria-label", theme === "dark" ? "Ganti ke mode terang" : "Ganti ke mode gelap");
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme === "dark" ? "#13080d" : "#b63d76");
  }
};

applyTheme(getPreferredTheme());

yearNode.textContent = new Date().getFullYear();

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 8);
  backToTop.classList.toggle("is-visible", window.scrollY > 500);
};

const setActiveLink = () => {
  let activeId = sections[0]?.id || "";
  const offset = window.innerHeight * 0.32;

  for (const section of sections) {
    const rect = section.getBoundingClientRect();
    if (rect.top <= offset && rect.bottom >= offset) {
      activeId = section.id;
    }
  }

  navLinks.forEach((link) => {
    const isActive = link.getAttribute("href") === `#${activeId}`;
    link.classList.toggle("is-active", isActive);
  });
};

const openMenu = () => {
  header.classList.add("is-open");
  navToggle.setAttribute("aria-expanded", "true");
  navToggle.setAttribute("aria-label", "Tutup navigasi");
};

const closeMenu = () => {
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Buka navigasi");
};

navToggle.addEventListener("click", () => {
  if (header.classList.contains("is-open")) {
    closeMenu();
  } else {
    openMenu();
  }
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => closeMenu());
});

themeToggle.addEventListener("click", () => {
  const nextTheme = html.dataset.theme === "dark" ? "light" : "dark";
  applyTheme(nextTheme);
});

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

const openModal = ({ title, caption, image }) => {
  modal.hidden = false;
  body.style.overflow = "hidden";
  modalImage.src = image;
  modalImage.alt = title;
  modalTitle.textContent = title;
  modalCaption.textContent = caption;

  requestAnimationFrame(() => {
    modal.querySelector(".modal__close").focus();
  });
};

const closeModal = () => {
  modal.hidden = true;
  body.style.overflow = "";
  modalImage.src = "";
};

certificateCards.forEach((card) => {
  card.addEventListener("click", () => {
    openModal({
      title: card.dataset.title || "Sertifikat",
      caption: card.dataset.caption || "",
      image: card.dataset.image || "",
    });
  });
});

modalCloseButtons.forEach((button) => {
  button.addEventListener("click", closeModal);
});

modal.addEventListener("click", (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !modal.hidden) {
    closeModal();
  }

  if (event.key === "Escape" && header.classList.contains("is-open")) {
    closeMenu();
  }
});

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        const index = revealElements.indexOf(entry.target);
        entry.target.style.setProperty("--reveal-delay", `${Math.min(index * 90, 450)}ms`);
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.18 }
  );

  revealElements.forEach((element) => {
    revealObserver.observe(element);
  });
} else {
  revealElements.forEach((element) => {
    element.classList.add("is-visible");
  });
}

window.addEventListener("scroll", () => {
  setHeaderState();
  setActiveLink();
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 860) {
    closeMenu();
  }
});

setHeaderState();
setActiveLink();

const syncThemeWithSystem = () => {
  if (!readStoredTheme()) {
    applyTheme(getPreferredTheme());
  }
};

if (typeof mediaQuery.addEventListener === "function") {
  mediaQuery.addEventListener("change", syncThemeWithSystem);
} else if (typeof mediaQuery.addListener === "function") {
  mediaQuery.addListener(syncThemeWithSystem);
}
