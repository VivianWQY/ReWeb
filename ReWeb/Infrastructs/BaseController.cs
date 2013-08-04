using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ReWeb.Infrastructs
{
    public abstract class BaseController : Controller
    {
        internal readonly ModelsContainer Db = new ModelsContainer();

        protected override void Dispose(bool disposing)
        {
            Db.Dispose();
            base.Dispose(disposing);
        }
    }
}
