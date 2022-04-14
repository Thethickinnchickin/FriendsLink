using API.Data;
using API.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class DebugController: BaseApiController
    {

        private DataContext _context;
        public DebugController(DataContext context)
        {
            _context = context;
        }

        [Authorize]
        [HttpGet("auth")]
        public ActionResult<string> GetSecret()
        {
            return "secret text";
        }

        //Route to get a not found response

        [HttpGet("not-found")]
        public ActionResult<AppUser> GetNotFound()
        {
            var thing = _context.Users.Find(-1);

            if(thing == null) return NotFound();

            return Ok(thing);
        }

        //Route to get a Server Error 

        [HttpGet("server-error")]
        public ActionResult<string> GetServerError()
        {
            try 
            {
                var thing = _context.Users.Find(-1);

                var thingToReturn = thing.ToString();

                return thingToReturn;
            } catch (Exception ex)
            {
                return StatusCode(500, "Computer says no!");
            }

        }

        //Route to get a bad-request

        [HttpGet("bad-request")]
        public ActionResult<string> GetBadRequest()
        {
            return BadRequest("This was not a good request");
        }
    }
}