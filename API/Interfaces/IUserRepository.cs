using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities;

namespace API.Interfaces
{
    public interface IUserRepository
    {
        void Update(AppUser user);

        Task<bool> SaveAllAsync();

        Task<IEnumerable<AppUser>> GetUsersAsync();

        Task<AppUser> GetUserByIdAsync(int id);

        Task<AppUser> GetUserByUsernameAsync(string username);

        //Getting Users and Mapping Data to Member Dto
        Task<IEnumerable<MemberDto>> GetMembersAsync();

        //Getting Member From Mapping Data to Member Dto
        Task<MemberDto> GetMemberAsync(string username);
        
    }
}