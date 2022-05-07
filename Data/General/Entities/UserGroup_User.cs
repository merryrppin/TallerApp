using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblUserGroup_User", Schema = "dbo")]
    public class UserGroup_User
    {
        [Key]
        public int UserGroup_UserId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public UserGroup UserGroup { get; set; }
        public int UserGroupId { get; set; }
    }
}
