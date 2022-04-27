using Microsoft.EntityFrameworkCore;
using API.Entities;

namespace API.Data 
{
    public class DataContext : DbContext 
    {
        public DataContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<AppUser> Users { get; set; } 

        public DbSet<UserLike> Likes { get; set; }

        public DbSet<Message> Messages { get; set; }


        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //Creating keys of source user and liked user ID for data model

            builder.Entity<UserLike>()
                .HasKey(k => new { k.SourceUserId, k.LikedUserId});

            builder.Entity<UserLike>()
                .HasOne(s => s.SourceUser)
                .WithMany(l => l.LikedUsers)
                .HasForeignKey(s => s.SourceUserId)
                .OnDelete(DeleteBehavior.Cascade);
            
            builder.Entity<UserLike>()
                .HasOne(s => s.LikedUser)
                .WithMany(l => l.LikedByUsers)
                .HasForeignKey(s => s.LikedUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Entity<Message>()
                .HasOne(u => u.Sender)
                .WithMany( m => m.MessagesSent)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}