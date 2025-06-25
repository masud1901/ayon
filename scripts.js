async function loadContent() {
  try {
    const response = await fetch("data.json");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    console.log("Loading content...");

    if (data.about) renderAbout(data.about);
    if (data.researchUpdates) renderResearchUpdates(data.researchUpdates);
    if (data.achievements) {
      console.log("Rendering achievements...", data.achievements);
      renderAchievements(data.achievements);
    }
    if (data.affiliations) {
      console.log("Rendering affiliations...", data.affiliations);
      renderAffiliations(data.affiliations);
    }
    
    // Load projects if on the projects page
    if (window.location.pathname.includes('projects.html') && (data.activeProjects || data.completedProjects)) {
      console.log("Rendering projects...");
      renderProjects(data.activeProjects || [], data.completedProjects || []);
    }

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
  const affiliationsContainer = document.querySelector(".affiliations-container");
  if (!affiliationsContainer) {
    console.error("Affiliations container element not found");
    return;
  }

  affiliationsContainer.innerHTML = affiliations
    .map(
      (affiliation) => `
      <div class="affiliation-card">
        <h3 class="affiliation-title">${affiliation.organization}</h3>
        <div class="affiliation-role">${affiliation.role}</div>
        <div class="affiliation-period">${affiliation.period}</div>
        <p class="affiliation-description">${affiliation.description}</p>
      </div>
    `
    )
    .join("");
}

function renderResearchUpdates(updates) {
  const updatesContainer = document.querySelector(".research-updates");
  if (!updatesContainer) return;

  updatesContainer.innerHTML = updates
    .map(
      (update) => `
      <div class="update-card">
        <div class="update-date">${update.date}</div>
        <h3 class="update-title">${update.title}</h3>
        <p class="update-description">${update.description}</p>
        ${
          update.link
            ? `<a href="${update.link}" class="update-link" target="_blank">Learn more</a>`
            : ""
        }
      </div>
    `
    )
    .join("");
}

function initializeAboutSection() {
  const readMoreBtn = document.querySelector(".read-more-btn");
  if (readMoreBtn) {
    readMoreBtn.addEventListener("click", function () {
      const bioText = document.querySelector(".bio-text");
      bioText.classList.toggle("expanded");
      this.textContent = bioText.classList.contains("expanded")
        ? "Read Less"
        : "Read More";
    });
  }
}

// Initialize everything when DOM is loaded
document.addEventListener("DOMContentLoaded", function () {
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

document.addEventListener("DOMContentLoaded", () => {
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

// Projects rendering function
function renderProjects(activeProjects, completedProjects) {
  const projectsContainer = document.getElementById('projects-container');
  if (!projectsContainer) {
    console.error("Projects container not found");
    return;
  }
  
  // Clear existing content if we have projects to display
  if ((activeProjects && activeProjects.length > 0) || 
      (completedProjects && completedProjects.length > 0)) {
    projectsContainer.innerHTML = '';
    
    // Add empty state element (hidden by default)
    const emptyState = document.createElement('div');
    emptyState.className = 'empty-projects';
    emptyState.id = 'empty-state';
    emptyState.style.display = 'none';
    emptyState.innerHTML = `
      <i class="fas fa-laptop-code"></i>
      <h3>No projects found</h3>
      <p>Projects will appear here once they're added to the database.</p>
    `;
    projectsContainer.appendChild(emptyState);
    
    // Render active projects
    if (activeProjects && activeProjects.length > 0) {
      activeProjects.forEach((project, index) => {
        const projectElement = createActiveProjectCard(project, index);
        projectsContainer.appendChild(projectElement);
      });
    }
    
    // Render completed projects
    if (completedProjects && completedProjects.length > 0) {
      completedProjects.forEach((project, index) => {
        const projectElement = createCompletedProjectCard(project, index);
        projectsContainer.appendChild(projectElement);
      });
    }
    
    // Show empty state if no projects
    if ((!activeProjects || activeProjects.length === 0) && 
        (!completedProjects || completedProjects.length === 0)) {
      document.getElementById('empty-state').style.display = 'block';
    }
    
    // Initialize AOS for new elements
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
    
    // Initialize filter functionality
    initializeProjectFilters();
  }
}

function createActiveProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'project-card active-project';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-duration', '800');
  card.setAttribute('data-aos-delay', (index * 50).toString());
  
  // Determine appropriate icon for placeholder
  let iconClass = 'fa-laptop-code';
  if (project.title.toLowerCase().includes('clickshot') || project.title.toLowerCase().includes('screenshot')) {
    iconClass = 'fa-camera';
  } else if (project.title.toLowerCase().includes('sleep') || project.title.toLowerCase().includes('apnea')) {
    iconClass = 'fa-bed';
  } else if (project.title.toLowerCase().includes('monte carlo') || project.title.toLowerCase().includes('election')) {
    iconClass = 'fa-chart-bar';
  } else if (project.title.toLowerCase().includes('federated') || project.title.toLowerCase().includes('learning')) {
    iconClass = 'fa-network-wired';
  }
  
  // Create tags HTML
  const tagsHTML = project.tags && project.tags.length > 0
    ? project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '';
  
  // Create collaborators HTML if they exist
  const collaboratorsHTML = project.collaborators && project.collaborators.length > 0
    ? `<div class="project-collaborators">
         <span class="collaborator-label">Collaborators: </span>
         ${project.collaborators.join(', ')}
       </div>`
    : '';
  
  // Create timeline HTML
  const timelineHTML = `
    <div class="project-timeline">
      <span class="project-status">${project.status}</span>
      <span class="project-dates">${project.startDate} - ${project.expectedCompletion || 'Ongoing'}</span>
    </div>
  `;
  
  card.innerHTML = `
    <div class="project-content">
      <div class="project-icon">
        <i class="fas ${iconClass}"></i>
      </div>
      <h3>${project.title}</h3>
      ${timelineHTML}
      <p>${project.description}</p>
      ${collaboratorsHTML}
      <div class="project-tags">
        ${tagsHTML}
      </div>
      <div class="project-links">
        ${project.link && project.link !== '#' ? 
          `<a href="${project.link}" target="_blank" class="project-link">
            <i class="fab fa-github"></i> View Project
          </a>` : ''}
      </div>
    </div>
  `;
  
  return card;
}

function createCompletedProjectCard(project, index) {
  const card = document.createElement('div');
  card.className = 'project-card completed-project';
  card.setAttribute('data-aos', 'fade-up');
  card.setAttribute('data-aos-duration', '800');
  card.setAttribute('data-aos-delay', (index * 50).toString());
  
  // Determine appropriate icon for placeholder
  let iconClass = 'fa-laptop-code';
  if (project.title.toLowerCase().includes('mosquito')) {
    iconClass = 'fa-microscope';
  } else if (project.title.toLowerCase().includes('alzheimer')) {
    iconClass = 'fa-brain';
  } else if (project.title.toLowerCase().includes('ecg') || project.title.toLowerCase().includes('heart')) {
    iconClass = 'fa-heartbeat';
  } else if (project.title.toLowerCase().includes('quantum')) {
    iconClass = 'fa-atom';
  }
  
  // Create tags HTML
  const tagsHTML = project.tags && project.tags.length > 0
    ? project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')
    : '';
  
  // Create highlights HTML if they exist
  const highlightsHTML = project.highlights && project.highlights.length > 0
    ? `<div class="project-highlights">
         <ul>
           ${project.highlights.map(highlight => `<li>${highlight}</li>`).join('')}
         </ul>
       </div>`
    : '';
  
  card.innerHTML = `
    <div class="project-content">
      <div class="project-icon">
        <i class="fas ${iconClass}"></i>
      </div>
      <h3>${project.title}</h3>
      ${project.completionDate ? `<div class="project-completion">Completed: ${project.completionDate}</div>` : ''}
      <p>${project.description}</p>
      ${highlightsHTML}
      <div class="project-tags">
        ${tagsHTML}
      </div>
      <div class="project-links">
        ${project.link && project.link !== '#' ? 
          `<a href="${project.link}" target="_blank" class="project-link">
            <i class="fab fa-github"></i> View Project
          </a>` : ''}
      </div>
    </div>
  `;
  
  return card;
}

function initializeProjectFilters() {
  const filterButtons = document.querySelectorAll('.filter-button');
  if (!filterButtons.length) return;
  
  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Remove active class from all buttons
      filterButtons.forEach(btn => btn.classList.remove('active'));
      
      // Add active class to clicked button
      button.classList.add('active');
      
      // Get filter value
      const filter = button.getAttribute('data-filter');
      
      // Filter projects
      filterProjects(filter);
    });
  });
}

function filterProjects(filter) {
  const projectCards = document.querySelectorAll('.project-card');
  
  // Add fade-out effect to all cards first
  projectCards.forEach(card => {
    card.style.opacity = '0';
    card.style.transition = 'opacity 0.3s ease';
  });
  
  // Wait for fade-out to complete
  setTimeout(() => {
    // Handle individual cards visibility
    projectCards.forEach(card => {
      if (filter === 'all') {
        card.style.display = 'flex';
      } else if (filter === 'active' && card.classList.contains('active-project')) {
        card.style.display = 'flex';
      } else if (filter === 'completed' && card.classList.contains('completed-project')) {
        card.style.display = 'flex';
      } else {
        card.style.display = 'none';
      }
    });
    
    // Fade in visible cards
    setTimeout(() => {
      projectCards.forEach(card => {
        if (card.style.display === 'flex') {
          card.style.opacity = '1';
        }
      });
    }, 50);
  }, 300);
}