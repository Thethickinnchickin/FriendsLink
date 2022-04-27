using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.Helpers
{
    public class PaginationParams
    {
        public int PageNumber { get; set;} = 1;

        public int PageSize { get; set; } = 5;
    }
}