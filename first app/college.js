// college.js - fully updated with card click to open modal details

let colleges = [];

let selectedStream = "";
let selectedState = "";
let searchText = "";

const resultsEl = document.getElementById('results');
const statusEl = document.getElementById('status');
const streamFilter = document.getElementById('stream-filter');
const stateFilter = document.getElementById('state-filter');
const searchInput = document.getElementById('search-input');

const darkToggle = document.getElementById('dark-toggle');
const themeSwitcher = document.getElementById('theme-switcher');
const profileModal = document.getElementById('profile-modal');
const avatarBtn = document.getElementById('avatar-btn');
const closeProfile = document.getElementById('close-profile');

let filteredColleges = []; // current filtered colleges for modal reference

// Utility: Escape HTML to prevent injection
function escapeHtml(text) {
    return String(text).replace(/[&<>"']/g, match => {
        switch (match) {
            case '&':
                return '&amp;';
            case '<':
                return '&lt;';
            case '>':
                return '&gt;';
            case '"':
                return '&quot;';
            case "'":
                return '&#39;';
            default:
                return match;
        }
    });
}

function safe(value) {
    if (value === undefined || value === null || value === "--") return "N/A";
    return String(value);
}

// Format fees nicely, add ₹ and commas if needed
function formatFee(fee) {
    if (!fee || fee === "--") return "N/A";
    // Assuming your fee strings have commas, just prepend ₹
    return `₹${fee}`;
}

// Format rating to 1 decimal place, handle N/A
function formatRating(r) {
    if (r === undefined || r === null) return "N/A";
    const val = parseFloat(r);
    return isNaN(val) ? "N/A" : val.toFixed(1);
}

// Populate Stream and State filters dynamically from data
function populateFilters(data) {
    const streamsSet = new Set();
    const statesSet = new Set();

    data.forEach(c => {
        if (c.Stream) streamsSet.add(c.Stream.trim());
        if (c.State) statesSet.add(c.State.trim());
    });

    const streams = Array.from(streamsSet).sort();
    const states = Array.from(statesSet).sort();

    streamFilter.innerHTML =
        `<option value="">All Streams</option>` +
        streams.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');

    stateFilter.innerHTML =
        `<option value="">All States</option>` +
        states.map(s => `<option value="${escapeHtml(s)}">${escapeHtml(s)}</option>`).join('');
}

// Render college cards based on filtered data and search
function render() {
    filteredColleges = colleges.filter(college => {
        const matchesStream = selectedStream ? college.Stream.toLowerCase() === selectedStream.toLowerCase() : true;
        const matchesState = selectedState ? college.State.toLowerCase() === selectedState.toLowerCase() : true;
        const matchesSearch = searchText ? college.College_Name.toLowerCase().includes(searchText) : true;
        return matchesStream && matchesState && matchesSearch;
    });

    statusEl.textContent = `${filteredColleges.length} college${filteredColleges.length !== 1 ? 's' : ''} found`;

    if (filteredColleges.length === 0) {
        resultsEl.innerHTML = `<p>No colleges found for the selected filters.</p>`;
        return;
    }

    resultsEl.innerHTML = filteredColleges.map((c, idx) => `
    <article class="college-card" tabindex="0" role="button"
      aria-label="View details for ${escapeHtml(c.College_Name)}"
      data-index="${idx}">
      <h3>${escapeHtml(c.College_Name)}</h3>
      <p><strong>Stream:</strong> ${escapeHtml(c.Stream)}</p>
      <p><strong>State:</strong> ${escapeHtml(c.State)}</p>
      <p><strong>UG Fee:</strong> ${formatFee(c.UG_fee)}</p>
      <p><strong>PG Fee:</strong> ${formatFee(c.PG_fee)}</p>
      <p class="rating">⭐ Rating: ${formatRating(c.Rating)}</p>
    </article>
  `).join('');

    // Add click and keyboard event listeners on cards once rendered
    document.querySelectorAll('.college-card').forEach(card => {
        card.addEventListener('click', () => {
            const idx = card.getAttribute('data-index');
            openCollegeModal(filteredColleges[idx]);
        });
        card.addEventListener('keydown', e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                const idx = card.getAttribute('data-index');
                openCollegeModal(filteredColleges[idx]);
            }
        });
    });
}

// Function to open profile modal with college details
function openCollegeModal(college) {
    if (!college) return;

    // Modal container content element
    const modalContent = profileModal.querySelector('.modal-content');

    // Construct modal inner HTML with college details
    modalContent.innerHTML = `
    <button id="close-profile" aria-label="Close profile modal" title="Close">✖</button>
    <h3 class="card-title">${escapeHtml(college.College_Name)}</h3>
    <p><strong>Stream:</strong> ${escapeHtml(college.Stream)}</p>
    <p><strong>State:</strong> ${escapeHtml(college.State)}</p>
    <p><strong>UG Fee:</strong> ${formatFee(college.UG_fee)}</p>
    <p><strong>PG Fee:</strong> ${formatFee(college.PG_fee)}</p>
    <p><strong>Rating:</strong> ${formatRating(college.Rating)} ⭐</p>
    <p><strong>Academic:</strong> ${safe(college.Academic)}</p>
    <p><strong>Accommodation:</strong> ${safe(college.Accommodation)}</p>
    <p><strong>Faculty:</strong> ${safe(college.Faculty)}</p>
    <p><strong>Infrastructure:</strong> ${safe(college.Infrastructure)}</p>
    <p><strong>Placement:</strong> ${safe(college.Placement)}</p>
    <p><strong>Social Life:</strong> ${safe(college.Social_Life)}</p>
  `;

    // Show modal
    profileModal.style.display = 'flex';
    profileModal.classList.add('open');
    profileModal.setAttribute('aria-hidden', 'false');

    // Attach new close button event listener (since content replaced)
    const closeBtn = modalContent.querySelector('#close-profile');
    closeBtn.addEventListener('click', closeModal);
}

// Close modal helper
function closeModal() {
    profileModal.classList.remove('open');
    profileModal.style.display = 'none';
    profileModal.setAttribute('aria-hidden', 'true');
}

// Event for clicking outside modal content to close
window.addEventListener('click', e => {
    if (e.target === profileModal) {
        closeModal();
    }
});

// Filter event listeners
streamFilter.addEventListener('change', e => {
    selectedStream = e.target.value;
    render();
});
stateFilter.addEventListener('change', e => {
    selectedState = e.target.value;
    render();
});
searchInput.addEventListener('input', e => {
    searchText = e.target.value.trim().toLowerCase();
    render();
});

// Dark mode toggle button
darkToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
    localStorage.setItem('dark-mode', document.body.classList.contains('dark-mode') ? 'true' : 'false');
});

// Load and apply saved dark mode preference
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    darkToggle.textContent = '☀️';
}

// Theme switcher logic
themeSwitcher.addEventListener('change', e => {
    const theme = e.target.value;
    document.body.classList.remove('theme-blue', 'theme-purple', 'theme-green');
    document.body.classList.add(`theme-${theme}`);
    localStorage.setItem('theme', theme);
});

// Apply saved theme or default to blue
const savedTheme = localStorage.getItem('theme') || 'blue';
document.body.classList.add(`theme-${savedTheme}`);
themeSwitcher.value = savedTheme;

// Profile modal open triggered by avatar button (opens default info)
avatarBtn.addEventListener('click', () => {
    // Show generic profile info if desired, else open first college or message
    profileModal.style.display = 'flex';
    profileModal.classList.add('open');
    profileModal.setAttribute('aria-hidden', 'false');
    // For demo, put generic content inside modal content
    const modalContent = profileModal.querySelector('.modal-content');
    modalContent.innerHTML = `
    <button id="close-profile" aria-label="Close profile modal" title="Close">✖</button>
    <h3 class="card-title">Your Profile</h3>
    <p>This is a demo profile modal. Add user details here.</p>
  `;
    // Attach close event listener for new button inside modal
    modalContent.querySelector('#close-profile').addEventListener('click', closeModal);
});

// Load college.json and start app
fetch('college.json')
    .then(response => {
        if (!response.ok) throw new Error(`Failed to load JSON data: ${response.statusText}`);
        return response.json();
    })
    .then(data => {
        colleges = Array.isArray(data) ? data : [];
        populateFilters(colleges);
        render();
    })
    .catch(error => {
        console.error('Error loading college.json:', error);
        if (statusEl) statusEl.textContent = 'Failed to load college data. Please run a local server.';
    });