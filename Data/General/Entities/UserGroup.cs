using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblUserGroup", Schema = "dbo")]
    public class UserGroup
    {
        [Key]
        public int UserGroupId { get; set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        [MaxLength(500)]
        [Required]
        public string Description { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
