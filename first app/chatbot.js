const chatWindow = document.getElementById('chat-window');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const nextBtn = document.getElementById('next-btn');

const questions = [

    "Hi! 👋 I'm your AI counselor. What's your favorite subject in school?",
    "Do you enjoy working with people, technology, nature, numbers, creative ideas, business, or healthcare?",
    "Which of these sounds most exciting: starting a business, helping patients, designing games, writing stories, building robots, investigating crimes, managing money, or performing on stage?",
    "Would you prefer work that's steady and structured or one that's dynamic and always changing?",
    "Pick a career area you want to know about (you can choose more!): 💻 Tech, 📈 Business, 💡 Creative, 🔬 Science, 🏥 Healthcare, 🌱 Environment, ⚖️ Law, 🚀 Engineering, 🎭 Arts, 🗺️ Travel, 👩‍🏫 Teaching, 💼 Government, 🏀 Sports & Fitness, ✈️ Aviation.",
    "Tell me briefly about a project, activity, or hobby you really enjoyed.",
    "How important are these to you: high salary, work-life balance, creativity, social impact, job security, or adventure?"
    // ... add more questions as needed!
];


let current = 0;
let answers = [];
let suggestions = [];

function botSay(message) {
    chatWindow.innerHTML += `<div class="chat-bot"><div class="msg">${message}</div></div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

function userSay(message) {
    chatWindow.innerHTML += `<div class="chat-user"><div class="msg">${message}</div></div>`;
    chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Rules-based suggestion
function analyze(answers) {
    let t = answers.join(" ").toLowerCase();
    if (t.includes("math")) return ["Accountant", "Data Scientist", "Actuary"];
    if (t.includes("biology")) return ["Doctor (Physician)", "Biochemist"];
    if (t.includes("art") || t.includes("creative")) return ["Graphic Designer", "Animator", "Fashion Designer"];
    if (t.includes("technology") || t.includes("tech") || t.includes("coding")) return ["Software Developer", "Web Developer"];
    if (t.includes("help") || t.includes("people")) return ["Psychologist", "Teacher", "Nurse"];
    if (t.includes("structure") || t.includes("steady")) return ["Banker", "Civil Engineer", "Quality Analyst"];
    if (t.includes("nature") || t.includes("outdoor")) return ["Zoologist", "Geologist", "Environmental Scientist"];
    if (t.includes("build") || t.includes("engineer")) return ["Civil Engineer", "Mechanical Engineer", "Aerospace Engineer"];
    return ["Teacher", "Software Developer", "Marketing Manager"];

}

botSay(questions[current]);

chatForm.onsubmit = e => {
    e.preventDefault();
    let input = chatInput.value.trim();
    if (!input) return;
    userSay(input);
    answers.push(input);
    current++;
    chatInput.value = "";
    if (current < questions.length) {
        setTimeout(() => botSay(questions[current]), 650);
    } else {
        setTimeout(() => {
            suggestions = analyze(answers);
            botSay(`Thanks! Based on your interests, here are some suitable careers:<ul>${suggestions.map(c=>'• '+c).join('<br>')}</ul><br>Click <strong>Next</strong> to explore career options.`);
            nextBtn.style.display = "block";
        }, 700);
        chatForm.style.display = "none";
    }
};

// "Next" button takes user to career options page
nextBtn.onclick = () => {
    window.location.href = 'career option.html';
};

// "Go to Dashboard" button (bottom)
// (Already in HTML, just needs listener if JS handling, or use inline onclick)
document.getElementById('dashboard-btn').onclick = () => {
    window.location.href = 'dashboard.html';
};