using Microsoft.EntityFrameworkCore;
using CafeteriaOrderingPlatform.Models;


namespace CafeteriaOrderingPlatform.Data
{
    public class AppDbContext : DbContext
    {
        public DbSet<Dish> Dishes { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            optionsBuilder.UseSqlite("Data Source=cafeteria.db");
        }
    }
}

