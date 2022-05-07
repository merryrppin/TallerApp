using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblGeneralList", Schema = "param")]
    public class GeneralList
    {
        [Key]
        public int GeneralListId { get; set; }
        [Required]
        [MaxLength(100)]
        public string ListName { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        public FieldValueType FieldValueType { get; set; }
        public int FieldValueTypeId { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
