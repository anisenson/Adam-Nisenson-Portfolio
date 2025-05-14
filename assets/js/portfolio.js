document.addEventListener('DOMContentLoaded', () => {
  const portfolioGallery = document.getElementById('portfolioGallery');
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const sortDateBtn = document.getElementById('sortDateBtn');
  const searchInput = document.getElementById('portfolioSearchInput');
  let projectsData = [];
  let isAscendingSort = false; // Initially set to false for descending order (latest first)
  let currentFilter = 'all';
  let currentSearch = '';

  // Fetch project data
  fetch('portfolio-data.json')
    .then(response => response.json())
    .then(data => {
      projectsData = data.projects;
      applyFiltersAndSort();
    });

  // Render projects
  function renderProjects(projects) {
    portfolioGallery.innerHTML = projects.map(project => `
      <div class="portfolio-item" data-type="${project.type}">
        <img src="${project.imageUrl}" alt="${project.title}" class="portfolio-item-image">
        <div class="portfolio-item-content">
          <h3>${project.title}</h3>
          <p class="project-type">${project.type}</p>
          <p class="project-description">${project.description}</p>
          <div class="project-technologies">
            ${project.technologies.map(tech => 
              `<span class="badge tech-badge ${tech.toLowerCase().replace(/\s+/g, '-')}">${tech}</span>`
            ).join('')}
          </div>
          <div class="project-meta">
            <div class="project-date">
              <i class="bi bi-calendar"></i> ${new Date(project.dateCreated).toLocaleDateString()}
            </div>
            <div class="project-links">
              <a href="${project.githubLink}" target="_blank" class="mx-2"><i class="bi bi-github"></i> View Code</a>
              <a href="${project.liveLink}" target="_blank"><i class="bi bi-box-arrow-up-right"></i> Live Demo</a>
            </div>
          </div>
        </div>
      </div>
    `).join('');
  }

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active')); // Remove active from all
    button.classList.add('active'); // Add active to clicked one
    currentFilter = button.getAttribute('data-filter');
    applyFiltersAndSort();
  });
});

  // Sort by date
  sortDateBtn.addEventListener('click', () => {
    isAscendingSort = !isAscendingSort;
    // Toggle the icon and highlight the button
    if (isAscendingSort) {
      sortDateBtn.innerHTML = 'Date created <i class="bi bi-arrow-up"></i>';
      sortDateBtn.classList.add('active');
    } else {
      sortDateBtn.innerHTML = 'Date created <i class="bi bi-arrow-down"></i>';
      sortDateBtn.classList.add('active');
    }
    applyFiltersAndSort();
  });

  // Search input
  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value.toLowerCase();
    applyFiltersAndSort();
  });

  function applyFiltersAndSort() {
    let filteredProjects = projectsData.filter(project => {
      const matchFilter = currentFilter === 'all' || project.type === currentFilter;
      const matchSearch = project.title.toLowerCase().includes(currentSearch);
      return matchFilter && matchSearch;
    });

    filteredProjects.sort((a, b) => {
      return isAscendingSort
        ? new Date(a.dateCreated) - new Date(b.dateCreated)
        : new Date(b.dateCreated) - new Date(a.dateCreated);
    });

    renderProjects(filteredProjects);
  }
});
