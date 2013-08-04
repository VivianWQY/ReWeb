using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Text;
using ReWeb.Infrastructs.Models;
using System.Drawing;

namespace ReWeb.Infrastructs.ActionResults
{
    public class ImageResult : ActionResult
    {
        public VerifyCode verifyCode { get; private set; }
        public string Code { get; private set; }

        public ImageResult(string code,VerifyCode v)
        {
            Code = code;
            verifyCode = v;
        }

        public override void ExecuteResult(ControllerContext context)
        {
            System.IO.MemoryStream ms = new System.IO.MemoryStream();
            Bitmap image = verifyCode.CreateImageCode(Code);

            image.Save(ms, System.Drawing.Imaging.ImageFormat.Jpeg);

            context.HttpContext.Response.ClearContent();
            context.HttpContext.Response.ContentType = "image/Jpeg";
            context.HttpContext.Response.BinaryWrite(ms.GetBuffer());

            ms.Close();
            ms = null;
            image.Dispose();
            image = null;

        }

    }
}
