using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Data.General.Entities
{
    [Table("tblGeneralListOption", Schema = "param")]
    public class GeneralListOption
    {
        [Key]
        public int GeneralListOptionId { get; set; }
        public GeneralList GeneralList { get; set; }
        public int GeneralListId { get; set; }
        [Required]
        [MaxLength(100)]
        public string Name { get; set; }
        [MaxLength(500)]
        public string Description { get; set; }
        [Required]
        public int Order { get; set; }
        public FieldValueType FieldValueType { get; set; }
        public int FieldValueTypeId { get; set; }
        public string TextValue { get; set; }
        public double? NumValue { get; set; }
        public bool? LogicValue { get; set; }
        [Required]
        public bool Active { get; set; }
    }
}
