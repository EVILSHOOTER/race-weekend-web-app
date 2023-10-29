using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RaceWeekendWebApp.Data.Migrations
{
    public partial class addnamescolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "RaceWeekend",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "RaceWeekend");
        }
    }
}
