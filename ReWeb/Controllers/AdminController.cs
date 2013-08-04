using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using ReWeb.Infrastructs;
using ReWeb.Models;
using System.Web.Script.Serialization;
using ReWeb.Infrastructs.ActionResults;
using ReWeb.Infrastructs.Global;


namespace ReWeb.Controllers
{

    [Authorize(Roles = "Admin")]
    public class AdminController : Controller
    {
        private ModelsContainer db = new ModelsContainer();

        //
        // GET: /Admin/
        
        public ActionResult Index()
        {
            ViewBag.Manage = "current";
            var submittedInstances = from uist in db.UserInstance where uist.Status == (int)Status.Submitted select uist;
            var accpetedInstances = from uist in db.UserInstance where (uist.Status == (int)Status.Accepted || uist.Status == (int)Status.Returned) select uist;
            var checkedInstances = from uist in db.UserInstance where (uist.Status == (int)Status.Checked) select uist;
            return View(Tuple.Create<List<UserInstance>, List<UserInstance>,List<UserInstance>>(submittedInstances.ToList(), checkedInstances.ToList(), accpetedInstances.ToList()));
        }

        //
        // GET: /Admin/Details/5

        public ActionResult Details(string id)
        {
            UserInstance userinstance = db.UserInstance.Single(u => u.ID == id);
            if (userinstance == null)
            {
                return HttpNotFound();
            }
            return View(userinstance);
        }

        //
        // GET: /Admin/Create

        public ActionResult Create()
        {
            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH");
            return View();
        }

        //
        // POST: /Admin/Create

        [HttpPost]
        public ActionResult Create(UserInstance userinstance)
        {
            if (ModelState.IsValid)
            {
                db.UserInstance.AddObject(userinstance);
                db.SaveChanges();
                return RedirectToAction("Index");
            }

            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH", userinstance.InstanceID);
            return View(userinstance);
        }

        //
        // GET: /Admin/Edit/5

        public ActionResult Edit(string id)
        {
            UserInstance userinstance = db.UserInstance.Single(u => u.ID == id);
            if (userinstance == null)
            {
                return HttpNotFound();
            }
            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH", userinstance.InstanceID);
            return View(userinstance);
        }

        //
        // POST: /Admin/Edit/5

        [HttpPost]
        public ActionResult Edit(UserInstance userinstance)
        {
            if (ModelState.IsValid)
            {
                db.UserInstance.Attach(userinstance);
                db.ObjectStateManager.ChangeObjectState(userinstance, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH", userinstance.InstanceID);
            return View(userinstance);
        }

        //
        // GET: /Admin/Delete/5

        public ActionResult Delete(string id)
        {
            UserInstance userinstance = db.UserInstance.Single(u => u.ID == id);
            if (userinstance == null)
            {
                return HttpNotFound();
            }
            return View(userinstance);
        }

        //
        // POST: /Admin/Delete/5

        [HttpPost, ActionName("Delete")]
        public ActionResult DeleteConfirmed(string id)
        {
            UserInstance userinstance = db.UserInstance.Single(u => u.ID == id);
            db.UserInstance.DeleteObject(userinstance);
            db.SaveChanges();
            return RedirectToAction("Index");
        }

        public ActionResult Member()
        {
            ViewBag.Member = "current";
            string[] members = Roles.GetUsersInRole("Admin");
            List<EditUserModel> adminList = new List<EditUserModel>();
            foreach(string m in members)
            {
                var u = Membership.GetUser(m);
                EditUserModel member = new EditUserModel();
                member.UserName = u.UserName;
                adminList.Add(member);
            }

            List<EditUserModel> userList = new List<EditUserModel>();
            var alluser = Membership.GetAllUsers().Cast<MembershipUser>();
            var users = alluser.Where(m => !members.Contains(m.UserName));
            
            foreach (var user in users)
            {
                EditUserModel member = new EditUserModel();
                member.UserName = user.UserName;
                string guid = (user.ProviderUserKey).ToString();
                Guid uid = new Guid(guid);
                member.Guid = guid;
                member.Email = user.Email;
                member.UserName = user.UserName;
                UserInformation info = db.UserInformation.Single(u => u.UserID == uid);
                member.TrueName = info.trueName;
                member.Phone = info.phone;
                member.TelePhone = info.telephone;
                member.Roles = Roles.GetRolesForUser(user.UserName);
                userList.Add(member);
            }
            return View(Tuple.Create<List<EditUserModel>, List<EditUserModel>>(userList, adminList));
        }

        [HttpPost, ActionName("AdminUser")]
        public ActionResult AdminUser(string id)
        {
            Roles.AddUserToRole(id,"Admin");
            return View();
        }
        [HttpPost, ActionName("UnAdminUser")]
        public ActionResult UnAdminUser(string id)
        {
            Roles.RemoveUserFromRole(id,"Admin");
            return View();
        }

        [HttpPost]
        public JsonResult CeateAdmin(string id, string password)
        {
            ModelsContainer db = new ModelsContainer();
            MembershipCreateStatus createStatus;
            var user = Membership.CreateUser(id, password, null, null, null, true, null,
                                  out createStatus);
            if (createStatus == MembershipCreateStatus.Success)
            {
                Roles.AddUserToRole(id, "Admin");
                UserInformation userInformation = new UserInformation();
                userInformation.phone = "";
                userInformation.telephone = "";
                userInformation.trueName = "管理员";
                userInformation.UserID = new Guid(Convert.ToString(user.ProviderUserKey));
                userInformation.UserType = 3;
                db.UserInformation.AddObject(userInformation);
                db.SaveChanges();
                return new JsonResult { Data = id };
            }
            else
            {
                return new JsonResult { Data = "failed" };
            }
            
        }

        [HttpGet, ActionName("ExportAll")]
        public FileResultLocal ExportAll()
        {
            FileResultLocal file = new FileResultLocal();
            file.FileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + ".txt";
            var instanceList = from uist in db.UserInstance where uist.Status == (int)Status.Checked select uist.Instance;
            var usintList = from uist in db.UserInstance where uist.Status == (int)Status.Checked select uist;
            string data = "";

            foreach (var u in usintList)
            {
                var json = JsonSerializer.SerializeUserInstance(u);
                data += json;
                data += "\r\n";
            }
            
            data += "###";
            data += "\r\n";

            foreach (var ist in instanceList)
            {
                //序列化代码
                var json = new JavaScriptSerializer().Serialize(ist);
                data += json;
                data += "\r\n";
            }

            file.Data = data;
            var userinstanceList = from uist in db.UserInstance where uist.Status == (int)Status.Checked select uist;
            foreach (UserInstance u in userinstanceList)
            {
                u.AcceptedTime = DateTime.Now;
                u.Status = (int)Status.Accepted;
                u.RetreatReason = "";
                db.ObjectStateManager.ChangeObjectState(u, EntityState.Modified);
            }
            db.SaveChanges();
            return file;
        }
        [HttpGet, ActionName("ExportChecked")]
        public FileResultLocal ExportChecked(string ids)
        {
            string[] idList = ids.Split(',');
            FileResultLocal file = new FileResultLocal();
            file.FileName = DateTime.Now.Year + "-" + DateTime.Now.Month + "-" + DateTime.Now.Day + ".txt";
            string data = "";

            foreach (string id in idList)
            {
                var uist = db.UserInstance.Single(u => u.ID == id);
                var json = JsonSerializer.SerializeUserInstance(uist);
                data += json;
                data += "\r\n";
                uist.AcceptedTime = DateTime.Now;
                uist.Status = (int)Status.Accepted;
                uist.RetreatReason = "";
                db.ObjectStateManager.ChangeObjectState(uist, EntityState.Modified);
            }
            data += "###";
            data += "\r\n";
            foreach (string id in idList)
            {
                var uinst = db.UserInstance.Single(u => u.ID == id);
                var ist = uinst.Instance;
                var json = new JavaScriptSerializer().Serialize(ist);

                data += json;
                data += "\r\n";
            }
            file.Data = data;
            db.SaveChanges();
            return file;
        }

        [HttpPost]
        public JsonResult ResetPassword(string id)
        {
            MembershipUser currentUser = Membership.GetUser(id, true /* userIsOnline */);

            string newpassword = currentUser.ResetPassword();
            currentUser.ChangePassword(newpassword,"123456");

            return new JsonResult { Data = "ok"};
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}