using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReWeb.Infrastructs.Global
{
    enum Status
    { 
        Saved = 1,
        Submitted = 2,
        Accepted = 3,
        Returned =4,
        Checked=5
    }
    enum UserType
    {
        Individual = 1,
        Enterprise = 2,
    }

}