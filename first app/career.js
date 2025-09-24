const careersDataStatic = {
    Science: [{
            title: 'Astronomer',
            description: 'Studies celestial bodies and the universe.',
            education: 'MSc/PhD Astronomy',
            skills: 'Math, Programming',
            salary: '₹8-18 LPA'
        },
        {
            title: 'Geologist',
            description: 'Studies the Earth\'s structure and materials.',
            education: 'BSc/MSc Geology',
            skills: 'Field work',
            salary: '₹4-14 LPA'
        },
        {
            title: 'Marine Biologist',
            description: 'Studies marine organisms and sea ecosystems.',
            education: 'MSc Marine Biology',
            skills: 'Diving, Research',
            salary: '₹5-15 LPA'
        },
        {
            title: 'Data Scientist',
            description: 'Analyzes complex data to extract insights and support decision-making.',
            education: 'BSc/MSc Data Science, Statistics, Mathematics',
            skills: 'Python, R, Machine Learning, Statistics',
            salary: '₹6-25 LPA'
        }
    ],
    Commerce: [{
            title: 'Chartered Accountant',
            description: 'Financial and tax expertise.',
            education: 'CA',
            skills: 'Accountancy, Analytics',
            salary: '₹8-25 LPA'
        },
        {
            title: 'Business Intelligence Engineer',
            description: 'Develops BI solutions and creates business insights from data.',
            education: 'MBA/MSc Business Analytics',
            skills: 'SQL, Tableau, Power BI, Analytics',
            salary: '₹8-20 LPA'
        }
    ],
    Arts: [{
        title: 'Psychologist',
        description: 'Studies human behavior and mind.',
        education: 'BA/MA Psychology',
        skills: 'Counseling, Listening',
        salary: '₹6-18 LPA'
    }],
    Technology: [{
            title: 'Software Engineer',
            description: 'Designs and develops software.',
            education: 'B.Tech/BCA',
            skills: 'Coding, Creativity',
            salary: '₹10-35 LPA'
        },
        {
            title: 'Data Engineer',
            description: 'Builds and maintains data pipelines and infrastructure.',
            education: 'B.Tech/MSc Computer Science',
            skills: 'Python, SQL, Cloud Platforms, ETL',
            salary: '₹8-30 LPA'
        },
        {
            title: 'Machine Learning Engineer',
            description: 'Develops and deploys machine learning models and systems.',
            education: 'B.Tech/MSc AI/ML',
            skills: 'Python, TensorFlow, PyTorch, MLOps',
            salary: '₹12-40 LPA'
        },
        {
            title: 'Data Architect',
            description: 'Designs data architecture and management strategies for organizations.',
            education: 'B.Tech/MSc + 5+ years experience',
            skills: 'Data Modeling, System Architecture, Cloud',
            salary: '₹15-45 LPA'
        },
        {
            title: 'Analytics Engineer',
            description: 'Bridges data engineering and analytics to create reliable data models.',
            education: 'B.Tech/MSc Analytics',
            skills: 'SQL, dbt, Python, Data Modeling',
            salary: '₹10-28 LPA'
        },
        {
            title: 'Applied Scientist',
            description: 'Applies scientific methods to solve complex business problems using data.',
            education: 'PhD/MSc in relevant field',
            skills: 'Research, ML, Statistics, Domain Expertise',
            salary: '₹15-50 LPA'
        },
        {
            title: 'Machine Learning Researcher',
            description: 'Conducts research to advance machine learning techniques and applications.',
            education: 'PhD/MSc ML/AI',
            skills: 'Research, Publications, Advanced ML',
            salary: '₹12-45 LPA'
        },
        {
            title: 'BI Developer',
            description: 'Develops business intelligence solutions and dashboards.',
            education: 'B.Tech/MSc Business Analytics',
            skills: 'SQL, Tableau, Power BI, SSRS',
            salary: '₹6-22 LPA'
        }
    ],
    Other: []
};

// Job category mapping from JSON to our career streams
const jobCategoryMapping = {
    'Data Science and Research': 'Science',
    'Data Engineering': 'Technology',
    'Machine Learning and AI': 'Technology',
    'Data Architecture and Modeling': 'Technology',
    'BI and Visualization': 'Technology',
    'Data Analysis': 'Technology',
    'Leadership and Management': 'Commerce'
};

// Global variables
const streamsDiv = document.getElementById('streams');
const careersDiv = document.getElementById('careers');
const modal = document.getElementById('career-details');
const modalContentDiv = document.getElementById('details-content');
const closeModalBtn = document.getElementById('closeModal');
const themeToggle = document.getElementById('themeToggle');

let mergedData = {};
let selectedStream = null;
let salaryData = {};

// Load and process JSON salary data
async function loadSalaryData() {
    try {
        const response = await fetch('crr.json');
        const jsonData = await response.json();

        // Process salary data by job title
        const salaryMap = {};

        jsonData.forEach(item => {
            const title = item.job_title;
            const salaryUSD = item.salary_in_usd;
            const experienceLevel = item.experience_level;
            const workSetting = item.work_setting;
            const companySize = item.company_size;

            if (!salaryMap[title]) {
                salaryMap[title] = {
                    salaries: [],
                    avgSalary: 0,
                    minSalary: Infinity,
                    maxSalary: 0,
                    experienceLevels: {},
                    workSettings: {},
                    companySizes: {}
                };
            }

            salaryMap[title].salaries.push(salaryUSD);
            salaryMap[title].minSalary = Math.min(salaryMap[title].minSalary, salaryUSD);
            salaryMap[title].maxSalary = Math.max(salaryMap[title].maxSalary, salaryUSD);

            // Track experience levels
            salaryMap[title].experienceLevels[experienceLevel] =
                (salaryMap[title].experienceLevels[experienceLevel] || 0) + 1;

            // Track work settings
            salaryMap[title].workSettings[workSetting] =
                (salaryMap[title].workSettings[workSetting] || 0) + 1;

            // Track company sizes
            salaryMap[title].companySizes[companySize] =
                (salaryMap[title].companySizes[companySize] || 0) + 1;
        });

        // Calculate averages
        Object.keys(salaryMap).forEach(title => {
            const data = salaryMap[title];
            data.avgSalary = Math.round(data.salaries.reduce((a, b) => a + b, 0) / data.salaries.length);

            // Convert to INR (approximate rate: 1 USD = 83 INR)
            data.avgSalaryINR = Math.round(data.avgSalary * 83);
            data.minSalaryINR = Math.round(data.minSalary * 83);
            data.maxSalaryINR = Math.round(data.maxSalary * 83);

            // Format for display
            data.salaryRangeINR = `₹${(data.minSalaryINR/100000).toFixed(1)}-${(data.maxSalaryINR/100000).toFixed(1)} LPA`;
            data.salaryRangeUSD = `$${(data.minSalary/1000).toFixed(0)}K-${(data.maxSalary/1000).toFixed(0)}K`;
        });

        salaryData = salaryMap;
        console.log('Salary data loaded:', salaryData);

    } catch (error) {
        console.error('Error loading salary data:', error);
    }
}

async function loadCareersSystem() {
    // Load salary data first
    await loadSalaryData();

    try {
        // Try to load career.json if it exists, otherwise use static data
        let jsonData = [];
        try {
            const jsonResponse = await fetch('proper.json');
            jsonData = await jsonResponse.json();
        } catch (e) {
            console.log('career.json not found, using static data only');
        }

        const groupMap = {};
        jsonData.forEach((item, i) => {
            if (i === 0 && item.C === 'Job profession') return;
            const title = (item.C || '').replace(/\s+/g, ' ').trim();
            if (!title) return;
            if (!groupMap[title]) groupMap[title] = [];
            groupMap[title].push(item);
        });

        mergedData = {};
        Object.keys(careersDataStatic).forEach(stream => {
            mergedData[stream] = [];
            careersDataStatic[stream].forEach(careerObj => {
                const title = careerObj.title.trim();
                const arr = groupMap[title] || [];
                addCareerToMerged(stream, careerObj, arr);
            });
        });

        // Add any careers from groupMap that weren't in static data
        Object.keys(groupMap).forEach(title => {
            const exists = Object.values(mergedData).flat().some(c => c.title === title);
            if (!exists) {
                const arr = groupMap[title];
                addCareerToMerged('Other', {
                    title,
                    description: '',
                    education: '',
                    skills: '',
                    salary: ''
                }, arr);
            }
        });

        // Sort the "Other" stream alphabetically
        if (mergedData.Other) {
            mergedData.Other.sort((a, b) => a.title.toLowerCase().localeCompare(b.title.toLowerCase()));
        }

        renderStreamTabs();
        selectedStream = Object.keys(mergedData)[0];
        renderCareers();

        // Export merged data for potential use by other scripts
        window.careersData = mergedData;
        window.salaryData = salaryData;

    } catch (err) {
        console.error('Error loading data:', err);
        careersDiv.innerHTML = '<p>Error loading careers.</p>';
    }
}

function addCareerToMerged(stream, careerObj, arr) {
    if (!mergedData[stream]) mergedData[stream] = [];

    const skills = {
        Linguistic: 0,
        Musical: 0,
        Bodily: 0,
        Logical: 0,
        Spatial: 0,
        Interpersonal: 0,
        Intrapersonal: 0,
        Naturalist: 0
    };

    const count = arr.length;
    let best = '-',
        avg = '-',
        poor = '-';

    if (count) {
        arr.forEach(s => {
            skills.Linguistic += +s.E;
            skills.Musical += +s.F;
            skills.Bodily += +s.G;
            skills.Logical += +s.H;
            skills.Spatial += +s.I;
            skills.Interpersonal += +s.J;
            skills.Intrapersonal += +s.K;
            skills.Naturalist += +s.L;
        });

        best = arr[0].Q || '-';
        avg = arr.N || '-';
        poor = arr.O || '-';
    }

    const labels = ["Linguistic", "Musical", "Bodily", "Logical", "Spatial", "Interpersonal", "Intrapersonal", "Naturalist"];
    const radarData = labels.map(l => count ? +(skills[l] / count).toFixed(1) : 0);

    // Enhanced salary information using JSON data
    let enhancedSalary = careerObj.salary;
    let salaryDetails = null;

    if (salaryData[careerObj.title]) {
        const data = salaryData[careerObj.title];
        enhancedSalary = data.salaryRangeINR;
        salaryDetails = {
            avgSalaryINR: data.avgSalaryINR,
            salaryRangeUSD: data.salaryRangeUSD,
            experienceLevels: data.experienceLevels,
            workSettings: data.workSettings,
            companySizes: data.companySizes,
            dataPoints: data.salaries.length
        };
    }

    mergedData[stream].push({
        ...careerObj,
        salary: enhancedSalary,
        salaryDetails: salaryDetails,
        sampleCount: count,
        radarLabels: labels,
        radarData,
        bestScore: best,
        avgScore: avg,
        poorScore: poor
    });
}

function renderStreamTabs() {
    streamsDiv.innerHTML = '';
    Object.keys(mergedData).forEach(s => {
        const btn = document.createElement('button');
        btn.className = 'stream-btn ' + (s === selectedStream ? 'active' : '');
        btn.textContent = `${s} (${mergedData[s].length})`;
        btn.onclick = () => {
            selectedStream = s;
            renderCareers();
            // Update active state
            document.querySelectorAll('.stream-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        };
        streamsDiv.appendChild(btn);
    });
}

function renderCareers() {
    careersDiv.innerHTML = '';
    const careers = mergedData[selectedStream] || [];

    careers.forEach((c, index) => {
        const card = document.createElement('div');
        card.className = 'career-card';

        // Add animation delay for staggered appearance
        card.style.animationDelay = `${index * 0.1}s`;

        // Enhanced salary display
        let salaryDisplay = c.salary || 'N/A';
        let salaryBadge = '';

        if (c.salaryDetails && c.salaryDetails.dataPoints > 0) {
            salaryBadge = `<div class="salary-badge">Live Data (${c.salaryDetails.dataPoints} samples)</div>`;
        }

        card.innerHTML = `
            ${salaryBadge}
            <h3>${c.title}</h3>
            <p>${c.description || 'No description available.'}</p>
            <div class="career-stats">
                <p><strong>💰 Salary:</strong> ${salaryDisplay}</p>
                <p><strong>🎯 Best Score:</strong> ${c.bestScore}</p>
                <p><strong>📊 Avg Score:</strong> ${c.avgScore}</p>
            </div>
        `;

        card.onclick = () => showDetails(c);
        careersDiv.appendChild(card);
    });
}

function showDetails(c) {
    let salarySection = `
        <div class="detail-section">
            <h4>💰 Salary Information</h4>
            <p><strong>Range:</strong> ${c.salary || 'N/A'}</p>
    `;

    if (c.salaryDetails) {
        const details = c.salaryDetails;
        salarySection += `
            <p><strong>USD Range:</strong> ${details.salaryRangeUSD}</p>
            <p><strong>Average (INR):</strong> ₹${(details.avgSalaryINR/100000).toFixed(1)} LPA</p>
            <p><strong>Data Points:</strong> ${details.dataPoints} salary records</p>
            
            <h5>Experience Levels:</h5>
            <ul>
                ${Object.entries(details.experienceLevels).map(([level, count]) => 
                    `<li>${level}: ${count} records</li>`
                ).join('')}
            </ul>
            
            <h5>Work Settings:</h5>
            <ul>
                ${Object.entries(details.workSettings).map(([setting, count]) => 
                    `<li>${setting}: ${count} records</li>`
                ).join('')}
            </ul>
        `;
    }
    
    salarySection += '</div>';
    
    modalContentDiv.innerHTML = `
        <h2>${c.title}</h2>
        
        <div class="detail-section">
            <h4>📋 Overview</h4>
            <p>${c.description || 'No description available.'}</p>
        </div>
        
        <div class="detail-section">
            <h4>🎓 Education Requirements</h4>
            <p>${c.education || 'N/A'}</p>
        </div>
        
        <div class="detail-section">
            <h4>🛠️ Key Skills</h4>
            <p>${c.skills || 'N/A'}</p>
        </div>
        
        ${salarySection}
        
        <div class="detail-section">
            <h4>📊 Performance Scores</h4>
            <p><strong>Best Score:</strong> ${c.bestScore}</p>
            <p><strong>Average Score:</strong> ${c.avgScore}</p>
            <p><strong>Poor Score:</strong> ${c.poorScore}</p>
            <p><strong>Sample Count:</strong> ${c.sampleCount}</p>
        </div>
        
        <div class="action-buttons">
            <button onclick="searchCareer('${c.title}')" class="action-btn">🔍 Search Online</button>
            <button onclick="compareCareer('${c.title}')" class="action-btn">📊 Compare</button>
        </div>
    `;

    modal.style.display = 'flex';
}

// Additional utility functions
function searchCareer(title) {
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(title + ' career requirements salary India')}`;
    window.open(searchUrl, '_blank');
}

function compareCareer(title) {
    alert(`Comparison feature for "${title}" coming soon!`);
}

function exportCareerData() {
    const dataStr = JSON.stringify(mergedData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'careers_data_export.json';
    link.click();
}

// Event listeners
closeModalBtn.onclick = () => modal.style.display = 'none';
window.onclick = e => { if (e.target === modal) modal.style.display = 'none'; };

themeToggle.onclick = () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
};

// Load saved theme
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

// Navigation buttons
document.addEventListener('DOMContentLoaded', () => {
    const nextBtn = document.getElementById('nextBtn');
    const backBtn = document.getElementById('backBtn');
    const exportBtn = document.getElementById('exportBtn');
    
    if (nextBtn) nextBtn.onclick = () => window.location.href = 'college.html';
    if (backBtn) backBtn.onclick = () => window.history.back();
    if (exportBtn) exportBtn.onclick = exportCareerData;
});


// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'flex') {
        modal.style.display = 'none';
    }
});
fetch('career.json')
    .then(response => {
        if (!response.ok) throw new Error(`Failed to load JSON data: ${response.statusText}`);
        return response.json();
    })
// Initialize the system when page loads
window.onload = loadCareersSystem;