using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace ReWeb.Controllers
{
    
    public class HomeController : Controller
    {

        public HomeController()
        {
            ViewBag.Home = "current";
        }
        
        public ActionResult Index()
        {
            ViewBag.Message = "Modify this template to jump-start your ASP.NET MVC application.";
            ViewBag.Description = ""; 
            return View();
        }

        public ActionResult About()
        {
            ViewBag.Message = "Your app description page.";
            ViewBag.About = "current";
            ViewBag.Home = "";
            return View();
        }

    }
}
