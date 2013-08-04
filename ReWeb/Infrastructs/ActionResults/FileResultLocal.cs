using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;

namespace ReWeb.Infrastructs.ActionResults
{
    public class FileResultLocal : ActionResult
    {
        public String FileName { get; set; }
        public String Data { get; set; }

        public override void ExecuteResult(ControllerContext context)
        {
            context.HttpContext.Response.Clear();
            context.HttpContext.Response.ClearHeaders();
            context.HttpContext.Response.Buffer = false;
            context.HttpContext.Response.ContentType = "application/octet-stream";
            context.HttpContext.Response.AppendHeader("Content-Disposition", "attachment; filename=\"" + FileName+"\"");
            context.HttpContext.Response.AppendHeader("Content-Length", Encoding.UTF8.GetBytes(Data).Length.ToString());
            context.HttpContext.Response.Write(Data);
            context.HttpContext.Response.Flush();
        }
    }
}