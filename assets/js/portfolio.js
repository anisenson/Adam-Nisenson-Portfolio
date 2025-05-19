document.addEventListener('DOMContentLoaded', () => {
  const portfolioGallery = document.getElementById('portfolioGallery');
  const filterButtons = document.querySelectorAll('.portfolio-filter-btn');
  const sortDateBtn = document.getElementById('sortDateBtn');
  const searchInput = document.getElementById('portfolioSearchInput');
  let projectsData = [];
  let isAscendingSort = false; // Initially show newest first
  let currentFilter = 'all';
  let currentSearch = '';

  // Fetch project data
  fetch('portfolio-data.json')
    .then(response => response.json())
    .then(data => {
      projectsData = data.projects;
      applyFiltersAndSort();
    });

  // Helper to convert "MM-YYYY" to a readable date (e.g. "Apr 2023")
  function formatMonthYear(dateString) {
    const [month, year] = dateString.split('-');
    const date = new Date(Number(year), Number(month) - 1); // subtract 1 from month
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }


  // Render projects to DOM
  function renderProjects(projects) {
    portfolioGallery.innerHTML = projects.map(project =>
      `<div class="portfolio-item" data-type="${project.type}">
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
              <i class="bi bi-calendar"></i> ${formatMonthYear(project.dateCreated)}
            </div>
            <div class="project-links">
              <a href="${project.githubLink}" target="_blank" class="mx-2"><i class="bi bi-github"></i> View Code</a>
              <a href="${project.liveLink}" target="_blank"><i class="bi bi-box-arrow-up-right"></i> Live Demo</a>
            </div>
          </div>
        </div>
      </div>`
    ).join('');
  }

  // Filter buttons
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
    sortDateBtn.innerHTML = `Date created <i class="bi bi-arrow-${isAscendingSort ? 'up' : 'down'}"></i>`;
    sortDateBtn.classList.add('active');
    applyFiltersAndSort();
  });

  // Search
  searchInput.addEventListener('input', () => {
    currentSearch = searchInput.value.toLowerCase();
    applyFiltersAndSort();
  });

  // Filter, sort, and render
  function applyFiltersAndSort() {
    let filteredProjects = projectsData.filter(project => {
      const matchFilter = currentFilter === 'all' || project.type === currentFilter;
      const matchSearch = project.title.toLowerCase().includes(currentSearch);
      return matchFilter && matchSearch;
    });

    filteredProjects.sort((a, b) => {
      const [aMonth, aYear] = a.dateCreated.split('-');
      const [bMonth, bYear] = b.dateCreated.split('-');
      const dateA = new Date(Number(aYear), Number(aMonth) - 1);
      const dateB = new Date(Number(bYear), Number(bMonth) - 1);
      return isAscendingSort ? dateA - dateB : dateB - dateA;
    });


    renderProjects(filteredProjects);
  }
});
