using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblFieldValueType", Schema = "param")]
    public class FieldValueType
    {
        [Key]
        public int FieldValueTypeId { get; set; }
        [MaxLength(100)]
        public string TextValue { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
