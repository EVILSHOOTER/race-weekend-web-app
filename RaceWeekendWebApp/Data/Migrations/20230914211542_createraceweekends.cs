using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RaceWeekendWebApp.Data.Migrations
{
    public partial class createraceweekends : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "RaceWeekend",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SoftTyreSets = table.Column<int>(type: "int", nullable: false),
                    MediumTyreSets = table.Column<int>(type: "int", nullable: false),
                    HardTyreSets = table.Column<int>(type: "int", nullable: false),
                    Sessions = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    FreeReturnTyreSets = table.Column<int>(type: "int", nullable: false),
                    QualifyingReturnTyreSets = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RaceWeekend", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RaceWeekend");
        }
    }
}
