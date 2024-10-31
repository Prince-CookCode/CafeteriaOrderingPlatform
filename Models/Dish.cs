namespace CafeteriaOrderingPlatform.Models
{
    public class Dish
    {
        public int Id { get; set; } // Primary Key
        public required string Name { get; set; } // Name of the dish
        public required string Description { get; set; } // Description of the dish
        public decimal Price { get; set; } // Price of the dish
        public double Rating { get; set; } // Average rating of the dish
        public int RatingCount { get; set; } // Number of ratings received
        public string? ImageUrl { get; set; } // URL of the dish image

        // Constructor without parameters for EF Core
        public Dish() { }

        // Constructor with parameters
        public Dish(string name, string description, decimal price, double rating, string? imageUrl = null)
        {
            Name = name;
            Description = description;
            Price = price;
            Rating = rating;
            RatingCount = 0;
            ImageUrl = imageUrl;


        }
    }
}
