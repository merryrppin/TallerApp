using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblMenu", Schema = "param")]
    public class Menu
    {
        [Key]
        public int MenuId { get; set; }
        [MaxLength(100)]
        [Required]
        public string Name { get; set; }
        [MaxLength(500)]
        [Required]
        public string Description { get; set; }
        [MaxLength(100)]
        public string Icon { get; set; }
        [MaxLength(300)]
        public string Url { get; set; }
        //public Menu ParentMenu { get; set; }
        //[ForeignKey("MenuId")]
        public int? ParentMenuId { get; set; }
        public int Order { get; set; }
        [Required]
        public bool Active { get; set; }
        [Required]
        public int Level { get; set; }
    }
}
