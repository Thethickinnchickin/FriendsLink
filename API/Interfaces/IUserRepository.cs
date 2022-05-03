using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;
using API.Helpers;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);


        Task<IEnumerable<AppUser>> GetUsersAsync();

        //Getting User By their Id

        Task<AppUser> GetUserByIdAsync(int id);

        //Getting Users By their username

        Task<AppUser> GetUserByUsernameAsync(string username);

        //Getting Users and Mapping Data to Member Dto
        Task<PagedList<MemberDto>> GetMembersAsync(UserParams userParams);

        //Getting Member From Mapping Data to Member Dto
        Task<MemberDto> GetMemberAsync(string username);

        Task<string> GetUserGender(string username);
        
    }
}