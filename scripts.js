async function loadContent() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log("Loading content...");

    if (data.about) renderAbout(data.about);
    if (data.publications) renderPublications(data.publications);
    if (data.projects) renderProjects(data.projects);
    if (data.activeProjects) renderActiveProjects(data.activeProjects);
    if (data.researchUpdates) renderResearchUpdates(data.researchUpdates);
    if (data.achievements) {
      console.log("Rendering achievements...", data.achievements);
      renderAchievements(data.achievements);
    }
    if (data.affiliations) {
      console.log("Rendering affiliations...", data.affiliations);
      renderAffiliations(data.affiliations);
    }

    loadProjectImages();
    initializeAboutSection();
  } catch (error) {
    console.error("Error loading content:", error);
  }
}

function renderAbout(about) {
  const heroBio = document.querySelector("#hero p");
  if (heroBio && about.shortBio) {
    heroBio.textContent = about.shortBio;
  }

  const profilePic = document.querySelector(".profile-pic");
  if (profilePic && about.image) {
    profilePic.src = about.image;
  }
}

function renderPublications(publications) {
  const publicationList = document.querySelector(".publication-list");
  publicationList.innerHTML = publications
    .map(
      (pub) => `
        <div class="publication ${pub.underReview ? "under-review" : ""}">
            <div class="publication-content">
                <h3>${pub.title}</h3>
                <div class="publication-meta">
                    <span><i class="far fa-calendar"></i> ${pub.year}</span>
                    <span><i class="far fa-user"></i> ${pub.authors}</span>
                    ${
                      pub.underReview
                        ? '<span class="review-badge"><i class="fas fa-hourglass-half"></i> Under Review</span>'
                        : `<span class="venue-badge"><i class="fas fa-book"></i> ${pub.venue}</span>`
                    }
                </div>
                <p>${pub.description}</p>
            </div>
            <div class="publication-links">
                <a href="${pub.links.pdf}" class="pub-link" target="_blank">
                    <i class="fas fa-file-pdf"></i> PDF
                </a>
                <a href="${pub.links.code}" class="pub-link" target="_blank">
                    <i class="fas fa-code"></i> Code
                </a>
            </div>
        </div>
    `
    )
    .join("");
}
function renderProjects(projects) {
  const projectGrid = document.querySelector(".project-grid");
  projectGrid.innerHTML = projects
    .map(
      (project) => `
        <div class="project-card" data-aos="fade-up">
            <div class="project-content">
                <div>
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>
                    <div class="project-tags">
                        ${project.tags
                          .map(
                            (tag) => `
                            <span class="project-tag">${tag}</span>
                        `
                          )
                          .join("")}
                    </div>
                </div>
                <div class="project-links">
                    <a href="${
                      project.link
                    }" class="project-link" target="_blank">
                        <i class="fab fa-github"></i> View Project
                    </a>
                    ${
                      project.demo
                        ? `<a href="${project.demo}" class="project-demo" target="_blank">
                            <i class="fas fa-external-link-alt"></i> Live Demo
                        </a>`
                        : ""
                    }
                </div>
            </div>
        </div>
    `
    )
    .join("");
}

function renderAchievements(achievements) {
  const achievementsGrid = document.querySelector(".achievements-grid");
  if (!achievementsGrid) {
    console.error("Achievements grid element not found");
    return;
  }

  achievementsGrid.innerHTML = achievements
    .map(
      (achievement) => `
      <div class="achievement-card">
        <h3 class="achievement-title">${achievement.title}</h3>
        <div class="achievement-date">${achievement.date}</div>
        <p class="achievement-description">${achievement.description}</p>
        <a href="${achievement.link}" class="achievement-link" target="_blank">
          View Details <i class="fas fa-external-link-alt"></i>
        </a>
      </div>
    `
    )
    .join("");
}

function renderAffiliations(affiliations) {
  const affiliationsList = document.querySelector(".affiliations-list");
  if (!affiliationsList) {
    console.error("Affiliations list element not found");
    return;
  }

  affiliationsList.innerHTML = affiliations
    .map(
      (affiliation) => `
      <div class="affiliation-card">
        <div class="affiliation-content">
          <h3>${affiliation.organization}</h3>
          <div class="affiliation-role">${affiliation.role}</div>
          <div class="affiliation-period">${affiliation.period}</div>
          <p class="affiliation-description">${affiliation.description}</p>
        </div>
      </div>
    `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", () => {
  loadContent();
});

function updateNavigation() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-links a");

  let currentSection = "";

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (window.scrollY >= sectionTop - 300) {
      currentSection = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href").slice(1) === currentSection) {
      link.classList.add("active");
    }
  });
}

window.addEventListener("scroll", updateNavigation);

function loadProjectImages() {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    const img = new Image();
    const imageUrl = card.querySelector(".project-image").dataset.src;

    img.onload = function () {
      card.querySelector(
        ".project-image"
      ).style.backgroundImage = `url(${imageUrl})`;
      card.querySelector(".project-image").classList.add("loaded");
    };

    img.src = imageUrl;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadProjectImages();

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelector(".nav-links.active")?.classList.remove("active");
    }
  });

  const contentSections = document.querySelectorAll("section");
  contentSections.forEach((section) => {
    section.innerHTML += '<div class="loading-spinner"></div>';
  });
});

function renderActiveProjects(activeProjects) {
  const activeProjectsGrid = document.querySelector(".active-projects-grid");
  activeProjectsGrid.innerHTML = activeProjects
    .map(
      (project) => `
    <div class="active-project-card">
      <div class="active-project-progress"></div>
      <div class="active-project-header">
        <span class="active-project-status status-${project.status
          .toLowerCase()
          .replace(/\s+/g, "-")}">
          ${project.status}
        </span>
      </div>
      <h3 class="active-project-title">${project.title}</h3>
      <div class="active-project-timeline">
        <i class="far fa-calendar-alt"></i>
        ${project.startDate} - ${project.expectedCompletion}
      </div>
      <p class="active-project-description">${project.description}</p>
      <div class="active-project-tags">
        ${project.tags
          .map(
            (tag) => `
          <span class="active-project-tag">${tag}</span>
        `
          )
          .join("")}
      </div>
      ${
        project.link
          ? `
        <a href="${project.link}" class="active-project-link" target="_blank">
          <i class="fas fa-external-link-alt"></i> View Project
        </a>
      `
          : ""
      }
    </div>
  `
    )
    .join("");
}

document.addEventListener("DOMContentLoaded", function () {
  const projectCards = document.querySelectorAll(".project-card");

  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
});

// Add mouse movement tracking for section backgrounds
document.querySelectorAll("section").forEach((section) => {
  section.addEventListener("mousemove", (e) => {
    const rect = section.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / section.offsetWidth) * 100;
    const y = ((e.clientY - rect.top) / section.offsetHeight) * 100;

    section.style.setProperty("--mouse-x", `${x}%`);
    section.style.setProperty("--mouse-y", `${y}%`);
  });
});

// Theme Toggle Functionality
document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("theme-toggle");
  const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

  // Check for saved theme preference or default to user's system preference
  const currentTheme =
    localStorage.getItem("theme") ||
    (prefersDarkScheme.matches ? "dark" : "light");

  // Set initial theme
  document.body.setAttribute("data-theme", currentTheme);
  updateThemeIcon(currentTheme);

  // Theme toggle click handler
  themeToggle.addEventListener("click", () => {
    const newTheme =
      document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });

  // Update theme icon based on current theme
  function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector("i");
    if (theme === "light") {
      icon.className = "fas fa-moon";
    } else {
      icon.className = "fas fa-sun";
    }
  }

  // Listen for system theme changes
  prefersDarkScheme.addEventListener("change", (e) => {
    const newTheme = e.matches ? "dark" : "light";
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeIcon(newTheme);
  });
});

function initializeAboutSection() {
    const aboutSection = document.querySelector('.about-text');
    const paragraphs = aboutSection.querySelectorAll('p');
    const list = aboutSection.querySelector('.about-list');
    
    // Add initial classes for animation
    paragraphs.forEach((p, index) => {
        p.classList.add('animate-paragraph');
        p.style.animationDelay = `${index * 0.2}s`;
    });

    if (list) {
        const listItems = list.querySelectorAll('li');
        listItems.forEach((item, index) => {
            item.classList.add('animate-list-item');
            item.style.animationDelay = `${(paragraphs.length * 0.2) + (index * 0.15)}s`;
        });
    }

    // Add scroll reveal effect
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.2 });

    paragraphs.forEach(p => observer.observe(p));
    if (list) {
        observer.observe(list);
    }

    // Add hover effect for paragraphs
    paragraphs.forEach(p => {
        p.addEventListener('mouseenter', () => {
            p.classList.add('highlight');
        });
        p.addEventListener('mouseleave', () => {
            p.classList.remove('highlight');
        });
    });
}