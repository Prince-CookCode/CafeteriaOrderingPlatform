document.addEventListener("DOMContentLoaded", async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const dishId = urlParams.get('id');

    try {
        const response = await fetch(`https://localhost:7133/api/dishes/${dishId}`);
        if (!response.ok) {
            throw new Error('Failed to fetch dish details');
        }
        const dish = await response.json();

        // Populate the dish details on the page
        document.getElementById('dishName').innerText = dish.name;
        document.getElementById('dishImage').src = dish.ImageUrl || `Images/${dish.name}.jpg`;
        document.getElementById('dishImage').alt = dish.name;
        document.getElementById('dishDescription').innerText = dish.description;
        document.getElementById('dishPrice').innerText = `Price: R${dish.price}`;
    } catch (error) {
        console.error('Error fetching dish details:', error);
        alert('Error fetching dish details. Please try again later.');
    }
});
