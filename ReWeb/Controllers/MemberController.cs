using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using ReWeb.Infrastructs;
using ReWeb.Models;
using System.Web.Security;
using ReWeb.Infrastructs.ActionResults;
using ReWeb.Infrastructs.Models;
using System.Drawing;


namespace ReWeb.Controllers
{
    public class MemberController : BaseController
    {

        [Authorize]
        public ActionResult Index()
        {
            var uid = new Guid(Convert.ToString(Membership.GetUser().ProviderUserKey));
            var userInstanceList = from userInstance in Db.UserInstance where userInstance.CreateUser == uid select userInstance;
            ViewBag.UserInstanceList = userInstanceList.ToList();
            UserInformation userInfo = (from userInformation in Db.UserInformation where userInformation.UserID == uid select userInformation).FirstOrDefault();
            ViewBag.TrueName = userInfo.trueName;
            ViewBag.Phone = userInfo.phone;
            ViewBag.TelePhone = userInfo.telephone;
            return View();
        }

        //
        // GET: /Account/login

        public ActionResult Login()
        {
            //Response.Cookies.Add(new HttpCookie("CheckCode", ""));
            return View();
        }

        //
        // POST: /Account/login

        [HttpPost]
        public ActionResult Login(LogOnModel model, string returnUrl)
        {
            if (ModelState.IsValid)
            {
                VerifyMessage result =  VerfiyCodeStatus(model.VerifyCode,Session);
                if (!result.res)
                {
                    ModelState.AddModelError("", result.Msg);
                    return View(model);
                }
                if (Membership.ValidateUser(model.UserName, model.Password))
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, model.RememberMe);
                    if (Url.IsLocalUrl(returnUrl) && returnUrl.Length > 1 && returnUrl.StartsWith("/")
                        && !returnUrl.StartsWith("//") && !returnUrl.StartsWith("/\\"))
                    {
                        return Redirect(returnUrl);
                    }
                    return RedirectToAction("Index", "Home");
                }
                ModelState.AddModelError("", "身份证号和密码不匹配");
            }
            return View(model);
        }

        [HttpPost]
        public JsonResult Check(string username)
        {
            return new JsonResult { Data = Membership.GetUser(username) == null };
        }

        //
        // GET: /Account/logout

        public ActionResult Logout()
        {
            FormsAuthentication.SignOut();

            return RedirectToAction("Index", "Home");
        }

        //
        // GET: /Account/Register

        public ActionResult Register()
        {
            return View();
        }

        public ActionResult Instances()
        {
            return RedirectToAction("index", "Instances");
        }

        //
        // POST: /Account/Register

        [HttpPost]
        public ActionResult Register(RegisterModel model)
        {
            if (ModelState.IsValid)
            {
                ModelsContainer db = new ModelsContainer();
                // Attempt to register the user
                MembershipCreateStatus createStatus;
                var user = Membership.CreateUser(model.UserName, model.Password, model.Email, null, null, true, null,
                                      out createStatus);

                if (createStatus == MembershipCreateStatus.Success)
                {
                    FormsAuthentication.SetAuthCookie(model.UserName, false /* createPersistentCookie */);

                    UserInformation userInformation = new UserInformation();
                    userInformation.phone = model.Phone;
                    userInformation.telephone = model.TelePhone;
                    userInformation.trueName = model.TrueName;
                    userInformation.UserID = new Guid(Convert.ToString(user.ProviderUserKey));
                    userInformation.UserType = model.UserType;
                    db.UserInformation.AddObject(userInformation);
                    db.SaveChanges();

                    return RedirectToAction("Index", "Home");
                }

                ModelState.AddModelError("", ErrorCodeToString(createStatus));
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ChangePassword

        [Authorize]
        public ActionResult ChangePassword()
        {
            return View();
        }

        //
        // POST: /Account/ChangePassword

        [Authorize]
        [HttpPost]
        public ActionResult ChangePassword(ChangePasswordModel model)
        {
            if (ModelState.IsValid)
            {
                // ChangePassword will throw an exception rather
                // than return false in certain failure scenarios.
                bool changePasswordSucceeded = false;
                try
                {
                    MembershipUser currentUser = Membership.GetUser(User.Identity.Name, true /* userIsOnline */);
                    if (currentUser != null)
                        changePasswordSucceeded = currentUser.ChangePassword(model.OldPassword, model.NewPassword);
                }
                catch (Exception)
                {
                    changePasswordSucceeded = false;
                }

                if (changePasswordSucceeded)
                {
                    return RedirectToAction("ChangePasswordSuccess");
                }
                ModelState.AddModelError("", "当前密码不正确或者新密码不符合要求");
            }

            // If we got this far, something failed, redisplay form
            return View(model);
        }

        //
        // GET: /Account/ChangePasswordSuccess

        public ActionResult ChangePasswordSuccess()
        {
            return View();
        }

        public PartialViewResult Information()
        {
            ModelsContainer db = new ModelsContainer();
            if (User.Identity.IsAuthenticated)
            {

                var uid = new Guid(Convert.ToString(Membership.GetUser().ProviderUserKey));
                UserInformation model = (from userInformation in Db.UserInformation where userInformation.UserID == uid select userInformation).FirstOrDefault();
                //Return the fully populated ViewModel
                return this.PartialView(model);
            }
            //return the model with IsAuthenticated only set since none of the 
            //other properties are needed
            return this.PartialView();
        }

        public ImageResult VerifyCodeAction()
        {
            VerifyCode v = new VerifyCode();
            v.Length = 4;
            v.FontSize = 20;
            v.Chaos = true;
            v.BackgroundColor = Color.White;
            v.ChaosColor =  Color.LightGray;
            v.CodeSerial = "2,3,4,5,6,7,8,9,a,b,c,d,e,f,g,h,k,m,n,p,q,r,s,t,u,v,w,x,y,z,A,B,C,D,E,F,G,H,K,M,N,P,Q,R,S,T,U,V,W,X,Y,Z";
            v.Colors = new Color[] {Color.Black,Color.Red,Color.DarkBlue,Color.Green,Color.Orange,Color.Brown,Color.DarkCyan,Color.Purple};
            v.Fonts = new string[] {"Arial", "Georgia"};
            v.Padding = 2;
            string code = v.CreateVerifyCode();                //取随机码

            ImageResult res = new ImageResult(code,v);

            Session["CheckCode"] = code.ToUpper();// 使用Session取验证码的值

            return res;
        }


        #region 公共方法
        private struct VerifyMessage
        {
            public string Msg;
            public bool res;
        }
        private static VerifyMessage VerfiyCodeStatus(string code,HttpSessionStateBase session)
        {
            VerifyMessage result;
            result.Msg = "验证码输入正确";
            result.res = true;
            if (String.Compare((string)(session["CheckCode"]), code.Trim(), true) != 0)
            {
                result.Msg = "对不起，验证码错误！";
                result.res = false;
                return result;
            }

            return result;
        }
        #endregion


        #region Status Codes

        private static string ErrorCodeToString(MembershipCreateStatus createStatus)
        {
            // See http://go.microsoft.com/fwlink/?LinkID=177550 for
            // a full list of status codes.
            switch (createStatus)
            {
                case MembershipCreateStatus.DuplicateUserName:
                    return "该身份证号已存在，请输入其他用户名。";

                case MembershipCreateStatus.DuplicateEmail:
                    return
                        "该邮箱已经注册过，请检查邮箱输入是否正确，如果忘记密码，请使用找回密码功能。";

                case MembershipCreateStatus.InvalidPassword:
                    return "密码不符合要求，请重新输入密码。";

                case MembershipCreateStatus.InvalidEmail:
                    return "邮箱格式不符合要求，请重新检查邮箱。";

                case MembershipCreateStatus.InvalidAnswer:
                    return "密码找回答案不符合要求，请检查答案并重试。";

                case MembershipCreateStatus.InvalidQuestion:
                    return "密码找回问题不符合要求，请检查问题并重试。";

                case MembershipCreateStatus.InvalidUserName:
                    return "身份证号不符合规范。";

                case MembershipCreateStatus.ProviderError:
                    return
                        "注册服务出现异常，请检查您的输入重试。如果问题依旧存在，请致电客服寻求帮助。";

                case MembershipCreateStatus.UserRejected:
                    return
                        "账户创建被终止，请检查您的输入并重试。如果问题依旧存在，请致电客服寻求帮助。";

                default:
                    return
                        "出现未知错误，请检查您的输入或者致电客服寻求帮助。";
            }
        }

        #endregion
    }
}
