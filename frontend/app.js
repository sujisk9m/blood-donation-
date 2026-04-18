window.onload = () => {
  updateNavVisibility(); // Hides restricted tabs initially
  showSection('home');
  generateDNA();
  generateBloodCells();
};

/* ====================================
   NAVIGATION & UI STATE
==================================== */
let currentUser = null; 

function showSection(id) {
  document.querySelectorAll("main section").forEach(s => s.style.display = "none");
  const target = document.getElementById(id);
  if(target) target.style.display = "block";

  // Close mobile menu if open
  const nav = document.getElementById("navbar");
  if (nav.classList.contains("active")) nav.classList.remove("active");
}

function toggleMenu() { 
  document.getElementById("navbar").classList.toggle("active"); 
}

// 🟢 THIS SHOWS/HIDES TABS BASED ON LOGIN
function updateNavVisibility() {
  const isGuest = currentUser === null;
  
  document.querySelectorAll('.guest-item').forEach(el => {
    el.style.display = isGuest ? 'inline-block' : 'none';
  });

  document.querySelectorAll('.auth-item').forEach(el => {
    el.style.display = isGuest ? 'none' : 'inline-block';
  });

  // Hide Rewards tab specifically if User is Hospital/Public
  if (currentUser && currentUser.role !== "Donor") {
    document.getElementById("navRewards").style.display = "none";
    document.getElementById("dashRewardsBtn").style.display = "none";
  }
}

/* ====================================
   MOCK DATABASES (3 User Roles)
==================================== */
let donors = [
  { id: "DONOR-100", name: "Rahul Kumar", role: "Donor", bloodGroup: "O+", location: "Anna Nagar, Chennai", phone: "9876543210", donations: 1 },
  { id: "DONOR-101", name: "Priya Singh", role: "Donor", bloodGroup: "B+", location: "Whitefield, Bangalore", phone: "9123456789", donations: 0 }
];

let publicUsers = [{ id: "USER-100", name: "John Doe", role: "Public" }];
let hospitals = [{ id: "HOSP-100", name: "Apollo City Hospital", role: "Hospital" }];

/* ====================================
   LOGIN & LOGOUT SYSTEM
==================================== */
function updateLoginHint() {
  const role = document.getElementById("loginRole").value;
  const hint = document.getElementById("loginHint");
  if(role === "Donor") hint.innerHTML = "Hint: Try <b>DONOR-100</b>";
  else if(role === "Public") hint.innerHTML = "Hint: Try <b>USER-100</b>";
  else if(role === "Hospital") hint.innerHTML = "Hint: Try <b>HOSP-100</b>";
}

function login() {
  const role = document.getElementById("loginRole").value;
  const id = document.getElementById("loginId").value.toUpperCase();
  
  if(!id) return alert("Please enter your User ID");

  let foundUser = null;
  if(role === "Donor") foundUser = donors.find(u => u.id === id);
  else if (role === "Public") foundUser = publicUsers.find(u => u.id === id);
  else if (role === "Hospital") foundUser = hospitals.find(u => u.id === id);

  if(foundUser) {
    currentUser = foundUser;
    updateNavVisibility(); // Unlocks the restricted tabs!
    openDashboard();       // Sends you to the dashboard!
  } else {
    alert(`Invalid ID for ${role}. Please try again or register.`);
  }
}

function logout() {
  currentUser = null;
  updateNavVisibility();
  showSection('home');
  alert("Logged out successfully.");
}

function openDashboard() {
  showSection('dashboard');
  document.getElementById("dashWelcome").innerText = `Welcome, ${currentUser.name} (${currentUser.role})`;
  
  document.getElementById("donorControls").style.display = "none";
  document.getElementById("hospitalControls").style.display = "none";
  document.getElementById("publicControls").style.display = "none";

  if(currentUser.role === "Donor") {
    document.getElementById("donorControls").style.display = "block";
    document.getElementById("dashRewardsBtn").style.display = "inline-block";
    updateRewardsTab();
  } else if (currentUser.role === "Hospital") {
    document.getElementById("hospitalControls").style.display = "block";
  } else if (currentUser.role === "Public") {
    document.getElementById("publicControls").style.display = "block";
  }
}

/* ====================================
   REGISTRATION LOGIC
==================================== */
function registerDonor() {
  const name = document.getElementById("regName").value;
  const bg = document.getElementById("regBloodGroup").value;
  const loc = document.getElementById("regLocation").value;
  const mobile = document.getElementById("regMobile").value;

  if(!name || !bg || !loc || !mobile) return alert("Please fill all details!");

  const newId = "DONOR-" + (100 + donors.length);
  donors.push({ id: newId, name: name, role: "Donor", bloodGroup: bg, location: loc, phone: mobile, donations: 0 });

  alert(`Registration Successful!\nYour Donor ID is: ${newId}\nPlease use this ID to Login.`);
  showSection('login');
}

/* ====================================
   FEATURES (Search, Emergency, Rewards)
==================================== */
function searchDonors() {
  const bg = document.getElementById("searchBlood").value;
  const city = document.getElementById("searchCity").value.toLowerCase();
  const box = document.getElementById("donorResults");

  if(!bg || !city) return alert("Please select blood group and enter area.");

  const results = donors.filter(d => d.bloodGroup === bg && d.location.toLowerCase().includes(city));

  box.innerHTML = "";
  if(results.length === 0) {
    box.innerHTML = `<p style="color:red;">No donors found in this area for ${bg}.</p>`;
  } else {
    results.forEach(d => {
      box.innerHTML += `
        <div class="donor-card">
          <strong>${d.name}</strong> (${d.bloodGroup})<br>
          📍 ${d.location} <br>
          📞 <a href="tel:${d.phone}">${d.phone}</a>
        </div>
      `;
    });
  }
}

function broadcastEmergency() {
  const patient = document.getElementById("emgPatient").value;
  const bg = document.getElementById("emgBlood").value;
  const loc = document.getElementById("emgLocation").value;

  if(!patient || !loc) return alert("Please fill Patient Name and Location.");

  const matchingDonors = donors.filter(d => d.bloodGroup === bg);
  
  if(matchingDonors.length === 0) {
    alert(`URGENT: No exact match found, broadcasting to ALL registered donors in network!`);
  } else {
    let phoneList = matchingDonors.map(d => d.phone).join(", ");
    alert(`🚨 BROADCAST SUCCESSFUL!\n\nAutomated SMS sent to ${matchingDonors.length} matching donors.\nNumbers reached: ${phoneList}`);
  }
  showSection('dashboard');
}

function simulateGiveBlood() {
  if(!currentUser || currentUser.role !== "Donor") return;
  let donorRef = donors.find(d => d.id === currentUser.id);
  donorRef.donations += 1;
  currentUser.donations = donorRef.donations;
  alert("Thank you for saving a life! +1 Donation added to your account.");
  updateRewardsTab();
}

function updateRewardsTab() {
  if(currentUser && currentUser.role === "Donor") {
    document.getElementById("donorPoints").innerText = `Your Donations: ${currentUser.donations}`;
    document.getElementById("rewardStatus").innerText = currentUser.donations >= 3 ? "Eligible for Silver Badge!" : "Donate 3 times to earn a badge.";
  }
}

function claimReward() {
  if(!currentUser || currentUser.role !== "Donor") return alert("Only Donors can claim rewards.");
  if(currentUser.donations > 0) alert(`Congratulations ${currentUser.name}! You claimed a reward voucher.\nCheck your mobile SMS.`);
  else alert("You need to donate blood at least once to claim a reward.");
}

/* ====================================
   BACKGROUND ANIMATIONS
==================================== */
function generateDNA() {
  const bg = document.getElementById('dna-bg');
  for (let i = 0; i < 20; i++) {
    let bar = document.createElement('div');
    bar.className = 'dna-bar';
    bar.style.animationDelay = `${i * -0.15}s`;
    bg.appendChild(bar);
  }
}

function generateBloodCells() {
  const bg = document.getElementById('cells-bg');
  for (let i = 0; i < 15; i++) {
    let cell = document.createElement('div');
    cell.className = 'blood-cell';
    let size = Math.random() * 30 + 10; 
    cell.style.width = `${size}px`;
    cell.style.height = `${size}px`;
    cell.style.left = `${Math.random() * 100}vw`;
    cell.style.top = `${Math.random() * 100}vh`;
    cell.style.animationDelay = `${Math.random() * 5}s`;
    cell.style.animationDuration = `${Math.random() * 10 + 10}s`; 
    bg.appendChild(cell);
  }
}