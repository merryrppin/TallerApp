using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Services.General.Enums.Enums;

namespace Services.General.Entities.StoredEntities
{
    public class StoredParams
    {
        public string Name { get; set; }
        public string Value { get; set; }
        public int TypeOfParameter { get; set; }
        public StoredParams()
        {
            TypeOfParameter = (int)EnumTypeOfParameter.StringType;
        }
    }
}
