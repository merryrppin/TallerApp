using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.General.Entities.SiigoEntities
{
    public class ResultPaginationSiigoEntity
    {
        public int page { get; set; }
        public int page_size { get; set; }
        public int total_results { get; set; }
    }
}
