using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using RaceWeekendWebApp.Models;

namespace RaceWeekendWebApp.Data
{
    public class ApplicationDbContext : IdentityDbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<RaceWeekendWebApp.Models.RaceWeekend>? RaceWeekend { get; set; }
    }
}