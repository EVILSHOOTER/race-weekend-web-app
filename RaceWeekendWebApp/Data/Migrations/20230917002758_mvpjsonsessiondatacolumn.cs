using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RaceWeekendWebApp.Data.Migrations
{
    public partial class mvpjsonsessiondatacolumn : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "JSONSessionData",
                table: "RaceWeekend",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "JSONSessionData",
                table: "RaceWeekend");
        }
    }
}
