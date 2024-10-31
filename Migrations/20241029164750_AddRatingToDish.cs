using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CafeteriaOrderingPlatform.Migrations
{
    /// <inheritdoc />
    public partial class AddRatingToDish : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "Rating",
                table: "Dishes",
                type: "REAL",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<int>(
                name: "RatingCount",
                table: "Dishes",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Rating",
                table: "Dishes");

            migrationBuilder.DropColumn(
                name: "RatingCount",
                table: "Dishes");
        }
    }
}
