using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblUser", Schema = "dbo")]
    public class User
    {
        public User()
        {
            Active = true;
        }
        [Key]
        public int UserId { get; set; }
        [MaxLength(200)]
        [Required]
        public string UserFirstName { get; set; }
        [MaxLength(200)]
        [Required]
        public string UserLastName { get; set; }
        [MaxLength(200)]
        [Required]
        public string UserEmail { get; set; }
        [MaxLength(250)]
        [Required]
        public string Login { get; set; }
        [MaxLength(250)]
        [Required]
        public string Password { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
