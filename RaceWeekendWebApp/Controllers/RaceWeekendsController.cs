using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using RaceWeekendWebApp.Data;
using RaceWeekendWebApp.Models;

namespace RaceWeekendWebApp.Controllers
{
    public class RaceWeekendsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public RaceWeekendsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: RaceWeekends
        public async Task<IActionResult> Index()
        {
              return _context.RaceWeekend != null ? 
                          View(await _context.RaceWeekend.ToListAsync()) :
                          Problem("Entity set 'ApplicationDbContext.RaceWeekend'  is null.");
        }

        // GET: RaceWeekends/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null || _context.RaceWeekend == null)
            {
                return NotFound();
            }

            var raceWeekend = await _context.RaceWeekend
                .FirstOrDefaultAsync(m => m.Id == id);
            if (raceWeekend == null)
            {
                return NotFound();
            }

            return View(raceWeekend);
        }

        // GET: RaceWeekends/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: RaceWeekends/Create
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create([Bind("Id,Name,SoftTyreSets,MediumTyreSets,HardTyreSets,Sessions,FreeReturnTyreSets,QualifyingReturnTyreSets, JSONSessionData")] RaceWeekend raceWeekend)
        {
            if (ModelState.IsValid)
            {
                _context.Add(raceWeekend);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(raceWeekend);
        }

        // GET: RaceWeekends/Edit/5
        [Authorize]
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null || _context.RaceWeekend == null)
            {
                return NotFound();
            }

            var raceWeekend = await _context.RaceWeekend.FindAsync(id);
            if (raceWeekend == null)
            {
                return NotFound();
            }
            return View(raceWeekend);
        }

        // POST: RaceWeekends/Edit/5
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        [Authorize]
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, [Bind("Id,Name,SoftTyreSets,MediumTyreSets,HardTyreSets,Sessions,FreeReturnTyreSets,QualifyingReturnTyreSets, JSONSessionData")] RaceWeekend raceWeekend)
        {
            if (id != raceWeekend.Id)
            {
                return NotFound();
            }

            if (ModelState.IsValid)
            {
                try
                {
                    _context.Update(raceWeekend);
                    await _context.SaveChangesAsync();
                }
                catch (DbUpdateConcurrencyException)
                {
                    if (!RaceWeekendExists(raceWeekend.Id))
                    {
                        return NotFound();
                    }
                    else
                    {
                        throw;
                    }
                }
                return RedirectToAction(nameof(Index));
            }
            return View(raceWeekend);
        }

        // GET: RaceWeekends/Delete/5
        [Authorize]
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null || _context.RaceWeekend == null)
            {
                return NotFound();
            }

            var raceWeekend = await _context.RaceWeekend
                .FirstOrDefaultAsync(m => m.Id == id);
            if (raceWeekend == null)
            {
                return NotFound();
            }

            return View(raceWeekend);
        }

        // POST: RaceWeekends/Delete/5
        [Authorize]
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            if (_context.RaceWeekend == null)
            {
                return Problem("Entity set 'ApplicationDbContext.RaceWeekend'  is null.");
            }
            var raceWeekend = await _context.RaceWeekend.FindAsync(id);
            if (raceWeekend != null)
            {
                _context.RaceWeekend.Remove(raceWeekend);
            }
            
            await _context.SaveChangesAsync();
            return RedirectToAction(nameof(Index));
        }

        private bool RaceWeekendExists(int id)
        {
          return (_context.RaceWeekend?.Any(e => e.Id == id)).GetValueOrDefault();
        }
    }
}
