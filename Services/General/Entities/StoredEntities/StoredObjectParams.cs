using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.General.Entities.StoredEntities
{
    public class StoredObjectParams
    {
        public List<StoredParams> StoredParams { get; set; }
        public string StoredProcedureName { get; set; }
    }
}
