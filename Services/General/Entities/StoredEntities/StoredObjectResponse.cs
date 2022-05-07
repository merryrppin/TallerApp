using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.General.Entities.StoredEntities
{
    public class StoredObjectResponse
    {
        public Exception Exception { get; set; }
        public string ValueResponse { get; set; }
        public List<StoredTableResponse> Value { get; set; }
    }
}
