// Login and Edit Profile Logic
if (document.getElementById('loginForm')) {
  const loginForm = document.getElementById('loginForm');
  const loginMessage = document.getElementById('loginMessage');
  loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const number = document.getElementById('loginNumber').value;
    const password = document.getElementById('loginPassword').value;
    const farmers = JSON.parse(localStorage.getItem('farmers')) || [];
    const farmer = farmers.find(f => f.number === number && f.password === password);
    if (farmer) {
      // Store logged in farmer in sessionStorage
      sessionStorage.setItem('loggedInFarmer', JSON.stringify(farmer));
      loginMessage.style.color = '#2e7d32';
      loginMessage.textContent = 'Login successful! Redirecting to edit profile...';
      setTimeout(() => {
        window.location.href = 'edit-profile.html';
      }, 1200);
    } else {
      loginMessage.style.color = 'crimson';
      loginMessage.textContent = 'Invalid number or password.';
    }
  });
}

// Edit Profile Page Logic
if (window.location.pathname.endsWith('edit-profile.html')) {
  const farmer = JSON.parse(sessionStorage.getItem('loggedInFarmer'));
  if (!farmer) {
    window.location.href = 'login.html';
  } else {
    document.addEventListener('DOMContentLoaded', function() {
      document.getElementById('editName').value = farmer.name;
      document.getElementById('editNumber').value = farmer.number;
      document.getElementById('editPassword').value = farmer.password;
      document.getElementById('editLocation').value = farmer.location;
      document.getElementById('editCrop').value = farmer.crop;
      if (farmer.image) {
        document.getElementById('editPreviewImage').src = farmer.image;
      }
    });
    document.getElementById('editImage').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
          document.getElementById('editPreviewImage').src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    document.getElementById('editForm').addEventListener('submit', function(event) {
      event.preventDefault();
      const farmers = JSON.parse(localStorage.getItem('farmers')) || [];
      const idx = farmers.findIndex(f => f.number === farmer.number && f.password === farmer.password);
      if (idx !== -1) {
        farmers[idx] = {
          name: document.getElementById('editName').value,
          number: document.getElementById('editNumber').value,
          password: document.getElementById('editPassword').value,
          location: document.getElementById('editLocation').value,
          crop: document.getElementById('editCrop').value,
          image: document.getElementById('editPreviewImage').src
        };
        localStorage.setItem('farmers', JSON.stringify(farmers));
        sessionStorage.setItem('loggedInFarmer', JSON.stringify(farmers[idx]));
        document.getElementById('editMessage').style.color = '#2e7d32';
        document.getElementById('editMessage').textContent = 'Profile updated!';
      }
    });
  }
}
// Homepage farmer profile grid and search logic
if (document.getElementById('farmerProfiles')) {
  const farmerProfiles = document.getElementById('farmerProfiles');
  const searchInput = document.getElementById('searchInput');
  const searchBtn = document.getElementById('searchBtn');
  let farmers = JSON.parse(localStorage.getItem('farmers')) || [];

  function renderFarmers(profiles) {
    farmerProfiles.innerHTML = '';
    profiles.forEach(farmer => {
      const card = document.createElement('div');
      card.className = 'profile-card';
      if (farmer.image) {
        const img = document.createElement('img');
        img.src = farmer.image;
        img.alt = farmer.name + "'s image";
        img.className = 'profile-img';
        card.appendChild(img);
      }
      const details = document.createElement('div');
      details.innerHTML = `<strong>${farmer.name}</strong><br>Location: ${farmer.location}<br>Main Crop: ${farmer.crop}`;
      card.appendChild(details);
      farmerProfiles.appendChild(card);
    });
  }

  // Initial render
  renderFarmers(farmers);

  // Search functionality
  function doSearch() {
    const keyword = searchInput.value.toLowerCase();
    const filtered = farmers.filter(farmer =>
      farmer.name.toLowerCase().includes(keyword) ||
      farmer.location.toLowerCase().includes(keyword) ||
      farmer.crop.toLowerCase().includes(keyword)
    );
    renderFarmers(filtered);
  }
  searchInput.addEventListener('input', doSearch);
  searchBtn.addEventListener('click', doSearch);
}
const form = document.getElementById('farmerForm');
const farmerList = document.getElementById('farmerList');

// Load stored farmers from localStorage
window.onload = () => {
  const storedFarmers = JSON.parse(localStorage.getItem('farmers')) || [];
  storedFarmers.forEach(farmer => addFarmerToUI(farmer));
};

// Add farmer to UI
function addFarmerToUI(farmer) {
  const li = document.createElement('li');
  if (farmer.image) {
    const img = document.createElement('img');
    img.src = farmer.image;
    img.alt = farmer.name + "'s image";
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.objectFit = 'cover';
    img.style.borderRadius = '50%';
    img.style.marginRight = '10px';
    li.appendChild(img);
  }
  li.appendChild(document.createTextNode(`${farmer.name} from ${farmer.location} grows ${farmer.crop}`));
  farmerList.appendChild(li);
}

form.addEventListener('submit', function(event) {
  event.preventDefault();

  const name = document.getElementById('name').value;
  const number = document.getElementById('number').value;
  const password = document.getElementById('password').value;
  const location = document.getElementById('location').value;
  const crop = document.getElementById('crop').value;
  const imageInput = document.getElementById('farmerImage');
  const file = imageInput && imageInput.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      saveFarmer({
        name,
        number,
        password,
        location,
        crop,
        image: e.target.result
      });
    };
    reader.readAsDataURL(file);
  } else {
    saveFarmer({
      name,
      number,
      password,
      location,
      crop,
      image: ''
    });
  }
});

function saveFarmer(farmer) {
  const farmers = JSON.parse(localStorage.getItem('farmers')) || [];
  farmers.push(farmer);
  localStorage.setItem('farmers', JSON.stringify(farmers));
  addFarmerToUI(farmer);
  form.reset();
}


function searchFarmers() {
  const nameInput = document.getElementById('searchName').value.toLowerCase();
  const locationInput = document.getElementById('searchLocation').value.toLowerCase();

  const farmers = JSON.parse(localStorage.getItem('farmers')) || [];
  const filteredFarmers = farmers.filter(farmer =>
    farmer.name.toLowerCase().includes(nameInput) &&
    farmer.location.toLowerCase().includes(locationInput)
  );

  farmerList.innerHTML = ''; // Clear list
  filteredFarmers.forEach(addFarmerToUI);
}