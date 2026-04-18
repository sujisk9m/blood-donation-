async function searchDonors() {
  const bg = document.getElementById("searchBlood").value;
  const city = document.getElementById("searchCity").value.toLowerCase();
  const box = document.getElementById("donorResults");

  if(!bg || !city) return alert("Please select blood group and enter area.");

  // ✅ GET REAL DATA FROM BACKEND
  const res = await fetch("http://localhost:5000/donor/all");
  const donors = await res.json();

  const results = donors.filter(d => 
    d.bloodGroup === bg && 
    d.location.toLowerCase().includes(city)
  );

  box.innerHTML = "";

  if(results.length === 0) {
    box.innerHTML = `<p style="color:red;">No donors found ❌</p>`;
  } else {
    results.forEach(d => {
      box.innerHTML += `
        <div class="donor-card">
          <strong>${d.name}</strong> (${d.bloodGroup})<br>
          📍 ${d.location}<br>
          📞 <a href="tel:${d.mobileNumber}">${d.mobileNumber}</a>
        </div>
      `;
    });
  }
}