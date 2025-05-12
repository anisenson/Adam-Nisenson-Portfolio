  document.addEventListener('DOMContentLoaded', () => {
    const portfolioGallery = document.getElementById('portfolioGallery');
    const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
    const sortDateBtn = document.getElementById('sortDateBtn');
    let projectsData = [];
    let isAscendingSort = true;
    let currentFilter = 'all';

    // Fetch project data
    fetch('portfolio-data.json')
      .then(response => response.json())
      .then(data => {
        projectsData = data.projects;
        renderProjects(projectsData);
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
              ${project.technologies.map(tech => `<span class="badge bg-secondary me-1">${tech}</span>`).join('')}
            </div>
            <div class="project-meta">
              <div class="project-date">
                <i class="bi bi-calendar"></i> ${new Date(project.dateCreated).toLocaleDateString()}
              </div>
              <div class="project-links">
                <a href="${project.githubLink}" target="_blank"><i class="bi bi-github"></i> View Code</a>
                <a href="${project.liveLink}" target="_blank"><i class="bi bi-box-arrow-up-right"></i> Live Demo</a>
              </div>
            </div>
          </div>
        </div>
      `).join('');
    }

    // Filter projects
    filterButtons.forEach(button => {
      button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        currentFilter = button.getAttribute('data-filter');
        applyFiltersAndSort();
      });
    });

    // Sort by date
    sortDateBtn.addEventListener('click', () => {
      isAscendingSort = !isAscendingSort;
      sortDateBtn.innerHTML = isAscendingSort
        ? 'Date created <i class="bi bi-arrow-down"></i>'
        : 'Date created <i class="bi bi-arrow-up"></i>';
      applyFiltersAndSort();
    });

    function applyFiltersAndSort() {
      let filteredProjects = currentFilter === 'all'
        ? projectsData
        : projectsData.filter(project => project.type === currentFilter);

      filteredProjects.sort((a, b) => {
        return isAscendingSort
          ? new Date(a.dateCreated) - new Date(b.dateCreated)
          : new Date(b.dateCreated) - new Date(a.dateCreated);
      });

      renderProjects(filteredProjects);
    }
  });