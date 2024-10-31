document.addEventListener("DOMContentLoaded", () => {
    const userRole = sessionStorage.getItem("userRole");

    // Show worker actions if the user is a worker
    if (userRole === "worker") {
        document.getElementById("workerActions").style.display = "block";
    }

    // Initial fetch without sorting
    fetchDishes(userRole);
});

async function fetchDishes(userRole, sortOption = '') {
    try {
        const response = await fetch('https://localhost:7133/api/dishes');
        if (!response.ok) throw new Error('Failed to fetch dishes');

        const dishes = await response.json(); // Parse response JSON data

        // Sort dishes based on the selected sorting option
        if (sortOption === 'ratingHighToLow') {
            dishes.sort((a, b) => b.rating - a.rating);
        } else if (sortOption === 'ratingLowToHigh') {
            dishes.sort((a, b) => a.rating - b.rating);
        } else if (sortOption === 'priceHighToLow') {
            dishes.sort((a, b) => b.price - a.price);
        } else if (sortOption === 'priceLowToHigh') {
            dishes.sort((a, b) => a.price - b.price);
        }

        const dishesDiv = document.getElementById('dishes');
        dishesDiv.innerHTML = ''; // Clear existing dishes display

        // Dynamically create and display each dish element
        dishes.forEach(dish => {
            const dishElement = document.createElement('div');
            dishElement.classList.add('dish');

            // Use name-based image path if ImageUrl is not provided
            const imageUrl = dish.ImageUrl || `Images/${dish.name}.jpg`;

            dishElement.innerHTML = `
                <a href="dish-detail.html?id=${dish.id}">
                    <img src="${imageUrl}" alt="${dish.name}" style="width: 100%; height: auto;">
                </a>
                <h2>${dish.name}</h2>
                <p>Price: R${dish.price}</p>
                <p>Rating: ${dish.rating ? Math.floor(dish.rating) : "Not rated yet"} Over 5</p>
                <p>Click To View Description!</p>
                ${userRole === "student" ? `<button class="rate-button" onclick="showRatingForm(${dish.id})">Rate This Dish</button>` : ''}
                ${userRole === "worker" ? `
                    <button onclick="deleteDish(${dish.id})">Delete</button>
                    <button onclick="showUpdateForm(${dish.id}, '${dish.name}', '${dish.description}', ${dish.price})">Update</button>
                ` : ''}
            `;
            dishesDiv.appendChild(dishElement);
        });
    } catch (error) {
        console.error('Error fetching dishes:', error);
        alert('Error fetching dishes. Please try again later.');
    }
}

function searchDishes() {
    const searchInput = document.getElementById("searchInput").value.toLowerCase();
    const dishElements = document.querySelectorAll('.dish');

    // Filter dishes based on search input
    dishElements.forEach(dishElement => {
        const dishName = dishElement.querySelector('h2').textContent.toLowerCase();
        dishElement.style.display = dishName.includes(searchInput) ? "block" : "none";
    });
}

function showRatingForm(dishId) {
    const ratingForm = document.createElement('div');
    ratingForm.innerHTML = `
        <div class="modal">
            <label for="rating">Rate this dish (1-5):</label>
            <input type="number" id="ratingInput" min="1" max="5" />
            <button onclick="rateDish(${dishId})">Submit Rating</button>
            <button onclick="closeRatingForm()">Cancel</button>
        </div>
    `;
    document.getElementById('dishes').appendChild(ratingForm);
}

function closeRatingForm() {
    const modal = document.querySelector('.modal');
    if (modal) modal.remove();
}

async function rateDish(dishId) {
    const score = parseInt(document.getElementById('ratingInput').value);
    if (isNaN(score) || score < 1 || score > 5) {
        alert('Please enter a valid rating between 1 and 5.');
        return;
    }

    try {
        await fetch(`https://localhost:7133/api/dishes/${dishId}/rate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(score)
        });
        alert('Thank you for rating the dish!');
        closeRatingForm();
        fetchDishes(sessionStorage.getItem("userRole")); // Refresh dishes after rating
    } catch (error) {
        console.error('Error rating dish:', error);
        alert('Error rating the dish. Please try again later.');
    }
}

function showCreateForm() {
    document.getElementById("createDishForm").style.display = "block";
}

async function createDish() {
    const name = document.getElementById("dishName").value;
    const description = document.getElementById("dishDescription").value;
    const price = document.getElementById("dishPrice").value;
    const imageFile = document.getElementById("dishImage").files[0];

    if (!name || !description || !price || !imageFile) {
        alert("Please complete all fields.");
        return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", imageFile);

    try {
        await fetch('https://localhost:7133/api/dishes', {
            method: 'POST',
            body: formData // Use FormData for file upload
        });
        alert('Dish created successfully!');
        document.getElementById("createDishForm").reset();
        document.getElementById("createDishForm").style.display = "none";
        fetchDishes(sessionStorage.getItem("userRole"));
    } catch (error) {
        console.error('Error creating dish:', error);
        alert('Error creating the dish. Please try again later.');
    }
}

function showUpdateForm(id, name, description, price) {
    const updateForm = document.getElementById("updateDishForm");
    updateForm.style.display = "block";
    document.getElementById("updateDishId").value = id;
    document.getElementById("updateDishName").value = name;
    document.getElementById("updateDishDescription").value = description;
    document.getElementById("updateDishPrice").value = price;
}

async function updateDish() {
    const id = document.getElementById("updateDishId").value;
    const name = document.getElementById("updateDishName").value;
    const description = document.getElementById("updateDishDescription").value;
    const price = document.getElementById("updateDishPrice").value;

    const updatedDish = new FormData();
    updatedDish.append("id", id);
    updatedDish.append("name", name);
    updatedDish.append("description", description);
    updatedDish.append("price", price);

    try {
        await fetch(`https://localhost:7133/api/dishes/${id}`, {
            method: 'PUT',
            body: updatedDish // Use FormData for the update
        });
        alert('Dish updated successfully!');
        document.getElementById("updateDishForm").reset();
        document.getElementById("updateDishForm").style.display = "none";
        fetchDishes(sessionStorage.getItem("userRole"));
    } catch (error) {
        console.error('Error updating dish:', error);
        alert('Error updating the dish. Please try again later.');
    }
}

async function deleteDish(dishId) {
    if (!confirm("Are you sure you want to delete this dish?")) return;

    try {
        await fetch(`https://localhost:7133/api/dishes/${dishId}`, { method: 'DELETE' });
        alert('Dish deleted successfully!');
        fetchDishes(sessionStorage.getItem("userRole"));
    } catch (error) {
        console.error('Error deleting dish:', error);
        alert('Error deleting the dish. Please try again later.');
    }
}

function sortDishes() {
    const sortOption = document.getElementById('sortSelect').value;
    fetchDishes(sessionStorage.getItem("userRole"), sortOption);
}

function logout() {
    sessionStorage.removeItem("userRole"); // Clear session data
    window.location.href = "login.html"; // Redirect to login page
}
