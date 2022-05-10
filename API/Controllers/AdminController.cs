using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    public class AdminController : BaseApiController
    {

        private readonly UserManager<AppUser> _userManager;

        private readonly IUnitOfWork _unitOfWork;


        public AdminController(UserManager<AppUser> userManager,
        IPhotoService photoService, IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
            _userManager = userManager;
        }

        [Authorize(Policy = "RequireAdminRole")]
        [HttpGet("users-with-roles")]
        public async Task<ActionResult> GetUsersWithRoles()
        {
            var users = await _userManager.Users
                .Include(r => r.UserRoles)
                .ThenInclude(r => r.Role)
                .OrderBy(u => u.UserName)
                .Select(u => new 
                {
                    u.Id,
                    UserName = u.UserName,
                    Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
                })
                .ToListAsync();

            return Ok(users);
        }

        [HttpPost("edit-roles/{username}")]
        public async Task<ActionResult> EditUserRoles(string username,
         [FromQuery] string roles) 
        {
            var selectedRoles = roles.Split(",").ToArray();

            var user = await _userManager.FindByNameAsync(username);

            if (user == null) return NotFound("Could not find user");

            var userRoles = await _userManager.GetRolesAsync(user);

            var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));

            if (!result.Succeeded)
            {
                return BadRequest("Failed to remove from roles");
            }

            return Ok(await _userManager.GetRolesAsync(user));

        }

        [HttpGet("photos-to-approve")]
        public async Task<ActionResult<IEnumerable>> GetUnapprovedPhotos() 
        {
            var users = await _unitOfWork.userRepository.GetUsersAsync();
            return Ok(users);
        }

        //Route to moderate Photos to be either approved or unnapproved based on route params

        [HttpPut("moderate-photo")]
        public async Task<ActionResult> GetPhotosForModeration(ModeratePhotoDto moderatePhotoDto)
        {
            var user = await _unitOfWork.userRepository.GetUserByUsernameAsync(moderatePhotoDto.UserName);
            var photo = user.Photos.FirstOrDefault(x => x.Id == moderatePhotoDto.Id);
            if(moderatePhotoDto.IsApproved)
            {
                photo.IsApproved = false;
                if(await _unitOfWork.Complete()){
                    return Ok("Unapproved Photo");
                }
                return BadRequest("Failed to UnApprove Photo");
            }
            else
            {
                photo.IsApproved = true;
                if(await _unitOfWork.Complete())
                {
                    return Ok("Approved Photo");                    
                }
                return BadRequest("Failed to Approve Photo");
            }
        }
    }
}