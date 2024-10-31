using CafeteriaOrderingPlatform.Data;
using CafeteriaOrderingPlatform.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace CafeteriaOrderingPlatform.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DishesController : ControllerBase
    {
        private readonly AppDbContext _context;
        private const string ImageUploadPath = "Frontend/Images/";

        public DishesController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/dishes
        // Retrieves all dishes from the database
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Dish>>> GetDishes()
        {
            return await _context.Dishes.ToListAsync();
        }

        // GET: api/dishes/{id}
        // Retrieves a specific dish by ID
        [HttpGet("{id}")]
        public async Task<ActionResult<Dish>> GetDish(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
            {
                return NotFound();
            }
            return dish;
        }

        // POST: api/dishes
        // Adds a new dish, optionally including an image file
        [HttpPost]
        public async Task<ActionResult<Dish>> PostDish([FromForm] Dish dish, IFormFile image)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            // Handle image upload if an image file is provided
            if (image != null)
            {
                // Ensure the image directory exists
                Directory.CreateDirectory(ImageUploadPath);

                // Generate a file name and save path
                var fileName = $"{dish.Name}.jpg";
                var filePath = Path.Combine(ImageUploadPath, fileName);

                // Save the uploaded image file
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                // Set the image path for database storage
                dish.ImageUrl = Path.Combine("Images", fileName);
            }

            _context.Dishes.Add(dish);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetDish), new { id = dish.Id }, dish);
        }

        // PUT: api/dishes/{id}
        // Updates an existing dish's details
        [HttpPut("{id}")]
        public async Task<IActionResult> PutDish(int id, [FromForm] Dish dish)
        {
            if (id != dish.Id)
            {
                return BadRequest("Dish ID mismatch.");
            }

            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Entry(dish).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!DishExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // DELETE: api/dishes/{id}
        // Deletes a specific dish by ID
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDish(int id)
        {
            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null)
            {
                return NotFound();
            }

            _context.Dishes.Remove(dish);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        // POST: api/dishes/{id}/rate
        // Rates a specific dish, updating its average rating
        [HttpPost("{id}/rate")]
        public async Task<IActionResult> RateDish(int id, [FromBody] int score)
        {
            // Ensure rating score is within valid range
            if (score < 1 || score > 5)
            {
                return BadRequest("Rating must be between 1 and 5.");
            }

            var dish = await _context.Dishes.FindAsync(id);
            if (dish == null) return NotFound();

            // Update average rating
            dish.Rating = dish.RatingCount == 0
                ? score
                : ((dish.Rating * dish.RatingCount) + score) / (dish.RatingCount + 1);

            dish.RatingCount++;

            await _context.SaveChangesAsync();
            return Ok(await _context.Dishes.FindAsync(id));
        }

        // Checks if a dish with a specific ID exists in the database
        private bool DishExists(int id)
        {
            return _context.Dishes.Any(e => e.Id == id);
        }
    }
}
