namespace API.DTOs
{
    public class ModeratePhotoDto
    {
        public int Id { get; set; }

        public string Url { get; set; }

        public string UserName { get; set;}

        public bool IsApproved {get; set; }

    }
}