using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ReWeb.Controllers
{
    public class ErrorController : Controller
    {
        //
        // GET: /Error/

        public ActionResult HttpError404(String error = "我们正在努力修复中..")
        {
            ViewBag.Description = error;
            ViewBag.Title = "您要查找的页面不存在";
            return View("Error");
        }

    }
}
