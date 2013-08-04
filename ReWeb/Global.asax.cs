using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using ReWeb.Controllers;

namespace ReWeb
{
    // Note: For instructions on enabling IIS6 or IIS7 classic mode, 
    // visit http://go.microsoft.com/?LinkId=9394801

    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            WebApiConfig.Register(GlobalConfiguration.Configuration);
            FilterConfig.RegisterGlobalFilters(GlobalFilters.Filters);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }

        protected void Application_Error(object sender, EventArgs e)
        {
            var exception = Server.GetLastError();
            var httpException = exception as HttpException;
            if (httpException != null)
            {
                Response.Clear();
                var routeData = new RouteData();
                routeData.Values.Add("controller", "Error");
                switch (httpException.GetHttpCode())
                {
                    case 404:
                        routeData.Values.Add("action", "HttpError404");
                        break;
                    case 500:
                        routeData.Values.Add("action", "HttpError404");
                        routeData.Values.Add("error", exception);
                        break;
                    default:
                        break;
                }
                //routeData.Values.Add("error", exception);
                Server.ClearError();
                Response.TrySkipIisCustomErrors = true;

                IController error = new ErrorController();
                error.Execute(new RequestContext(new HttpContextWrapper(Context), routeData));
            }
        }

    }

}