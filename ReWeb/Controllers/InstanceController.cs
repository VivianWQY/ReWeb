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
    [Authorize]
    public class InstanceController : Controller
    {
        private ModelsContainer db = new ModelsContainer();

        public InstanceController()
        {
            ViewBag.Instance = "current";
            ViewBag.ZJLX = new SelectList(new[] { "居民身份证", "企业法人营业执照", "组织机构代码证", "个人独资企业营业执照", "合伙企业营业执照", "个体工商户营业执照", "军官证", "护照", "其它" }, "居民身份证");
            ViewBag.DWXZ = new SelectList(new[] { "行政", "全民事业", "社会团体", "个人", "军队", "其他", "国有企业", "集体企业", "股份合作企业", "联营企业", "有限责任公司", "股份有限公司", "私营企业", "合资经营企业（港或澳、台资）", "合作经营企业（港或澳、台资）", "港、澳、台商独资经营企业", "港、澳、台商投资股份有限公司", "中外合资经营企业", "中外合作经营企业", "外资企业", "外商投资股份有限公司", "其他企业" }, "个人");
            ViewBag.QSXZ = new SelectList(new[] { "国有土地使用权", "集体土地所有权", "集体土地使用权", "土地他项权利", "其他" }, "国有土地使用权");
            ViewBag.TDYT = new SelectList(new[] { "城镇住宅用地", "农村宅基地", "机关团体用地", "科研设计", "新闻出版用地", "科教用地", "医卫慈善用地", "文体娱乐用地", "公共设施用地", "公园与绿地", "风景名胜设施用地", "军事设施用地", "使领馆用地", "监教场所用地", "宗教用地", "殡葬用地", "铁路用地", "公路用地", "街巷用地", "农村道路", "机场用地" }, "城镇住宅用地");
            ViewBag.SYQLX = new SelectList(new[] { "出让", "划拨", "批准拨用", "租赁", "授权经营", "入股", "四荒地拍卖", "农用地承包", "集体土地入股", "集体土地联营", "集体企业兼并", "集体企业破产", "自留地", "自留山", "其他来源" }, "出让");

            var uid = new Guid(Convert.ToString(Membership.GetUser().ProviderUserKey));
            var userInstanceList = from userInstance in db.UserInstance where userInstance.CreateUser == uid select userInstance;
            ViewBag.UserInstanceList = userInstanceList.ToList();
            UserInformation userInfo = (from userInformation in db.UserInformation where userInformation.UserID == uid select userInformation).FirstOrDefault();
            ViewBag.TrueName = userInfo.trueName;
            ViewBag.Phone = userInfo.phone;
            ViewBag.TelePhone = userInfo.telephone;
            ViewBag.UserType = userInfo.UserType;
        }

        //
        // GET: /Instance/

        public ActionResult Index()
        {
            var uid = new Guid(Convert.ToString(Membership.GetUser().ProviderUserKey));
            UserInformation userInfo = (from userInformation in db.UserInformation where userInformation.UserID == uid select userInformation).FirstOrDefault();
            ViewBag.TrueName = userInfo.trueName;

            var userInstanceList = from uist in db.UserInstance where uist.CreateUser == uid select uist;
            return View(userInstanceList.ToList().OrderByDescending(u => u.ID));
        }

        //
        // GET: /Instance/Details/5

        public ActionResult Retreat(string id)
        {
            UserInstance userinstance = db.UserInstance.FirstOrDefault(u => u.ID == id);
            Instance instance = userinstance.Instance;

            ViewBag.ZJLX = new SelectList(new[] { "居民身份证", "企业法人营业执照", "组织机构代码证", "个人独资企业营业执照", "合伙企业营业执照", "个体工商户营业执照", "军官证", "护照", "其它" }, instance.ZJLX);
            ViewBag.DWXZ = new SelectList(new[] { "行政", "全民事业", "社会团体", "个人", "军队", "其他", "国有企业", "集体企业", "股份合作企业", "联营企业", "有限责任公司", "股份有限公司", "私营企业", "合资经营企业（港或澳、台资）", "合作经营企业（港或澳、台资）", "港、澳、台商独资经营企业", "港、澳、台商投资股份有限公司", "中外合资经营企业", "中外合作经营企业", "外资企业", "外商投资股份有限公司", "其他企业" }, instance.DWXZ);
            ViewBag.QSXZ = new SelectList(new[] { "国有土地使用权", "集体土地所有权", "集体土地使用权", "土地他项权利", "其他" }, instance.QSXZ);
            ViewBag.TDYT = new SelectList(new[] { "城镇住宅用地", "农村宅基地", "机关团体用地", "科研设计", "新闻出版用地", "科教用地", "医卫慈善用地", "文体娱乐用地", "公共设施用地", "公园与绿地", "风景名胜设施用地", "军事设施用地", "使领馆用地", "监教场所用地", "宗教用地", "殡葬用地", "铁路用地", "公路用地", "街巷用地", "农村道路", "机场用地" }, instance.TDYT);
            ViewBag.SYQLX = new SelectList(new[] { "划拨", "出让", "批准拨用", "租赁", "授权经营", "入股", "四荒地拍卖", "农用地承包", "集体土地入股", "集体土地联营", "集体企业兼并", "集体企业破产", "自留地", "自留山", "其他来源" }, instance.SYQLX);

            SavingModels savingmodels = new SavingModels();
            savingmodels.UserInstance = userinstance;
            savingmodels.Instance = instance;
            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH", userinstance.InstanceID);
            return View(savingmodels);
        }

        //
        // GET: /Instance/Create

        public ActionResult Create()
        {
            return View();
        }

        //
        // POST: /Instance/Create

        [HttpPost]
        public ActionResult Create(SavingModels savingmodels, string submitButton)
        {
            if (ModelState.IsValid)
            {
                UserInstance userInstance = new UserInstance();
                userInstance.CreateUser = new Guid(Convert.ToString(Membership.GetUser().ProviderUserKey));
                userInstance.CreateTime = DateTime.Now;
                userInstance.Instance = savingmodels.Instance;
                if (savingmodels.Instance.ZZRQ == null)
                {
                    savingmodels.Instance.ZZRQ = new DateTime(1900, 1, 1);
                }
                userInstance.FWZL = savingmodels.Instance.FWZL;
                userInstance.QLRMC = savingmodels.Instance.QLRMC;
                userInstance.ID = IDgenerator.generate();
                switch (submitButton)
                {
                    case "保存":
                        userInstance.Status = (int)Status.Saved;
                        break;
                    case "保存并新建下一个业务>>":
                        userInstance.Status = (int)Status.Saved;
                        break;
                    case "提交":
                        userInstance.Status = (int)Status.Submitted;
                        userInstance.CommitTime = DateTime.Now;
                        break;
                }
                db.Instance.AddObject(savingmodels.Instance);
                db.UserInstance.AddObject(userInstance);
                db.SaveChanges();
                if (submitButton == "保存并新建下一个业务>>")
                {
                    return View("create", savingmodels);
                }
                return RedirectToAction("Index");
            }
            return View();
        }

        //
        // GET: /Instance/Edit/5

        public ActionResult Edit(string id)
        {
            UserInstance userinstance = db.UserInstance.FirstOrDefault(u => u.ID == id);
            //判断是否存在
            if (userinstance == null)
            {
                return HttpNotFound();
            }
            if (!CheckUser(userinstance.CreateUser))
            {
                return RedirectToAction("Login", "Member");
            }

            Instance instance = userinstance.Instance;

            ViewBag.ZJLX = new SelectList(new[] { "居民身份证", "企业法人营业执照", "组织机构代码证", "个人独资企业营业执照", "合伙企业营业执照", "个体工商户营业执照", "军官证", "护照", "其它" }, instance.ZJLX);
            ViewBag.DWXZ = new SelectList(new[] { "行政", "全民事业", "社会团体", "个人", "军队", "其他", "国有企业", "集体企业", "股份合作企业", "联营企业", "有限责任公司", "股份有限公司", "私营企业", "合资经营企业（港或澳、台资）", "合作经营企业（港或澳、台资）", "港、澳、台商独资经营企业", "港、澳、台商投资股份有限公司", "中外合资经营企业", "中外合作经营企业", "外资企业", "外商投资股份有限公司", "其他企业" }, instance.DWXZ);
            ViewBag.QSXZ = new SelectList(new[] { "国有土地使用权", "集体土地所有权", "集体土地使用权", "土地他项权利", "其他" }, instance.QSXZ);
            ViewBag.TDYT = new SelectList(new[] { "城镇住宅用地", "农村宅基地", "机关团体用地", "科研设计", "新闻出版用地", "科教用地", "医卫慈善用地", "文体娱乐用地", "公共设施用地", "公园与绿地", "风景名胜设施用地", "军事设施用地", "使领馆用地", "监教场所用地", "宗教用地", "殡葬用地", "铁路用地", "公路用地", "街巷用地", "农村道路", "机场用地" }, instance.TDYT);
            ViewBag.SYQLX = new SelectList(new[] { "划拨", "出让", "批准拨用", "租赁", "授权经营", "入股", "四荒地拍卖", "农用地承包", "集体土地入股", "集体土地联营", "集体企业兼并", "集体企业破产", "自留地", "自留山", "其他来源" }, instance.SYQLX);

            SavingModels savingmodels = new SavingModels();
            savingmodels.UserInstance = userinstance;
            savingmodels.Instance = instance;
            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH", userinstance.InstanceID);
            return View(savingmodels);
        }

        //
        // POST: /Instance/Edit/5

        [HttpPost]
        public ActionResult Edit(SavingModels savingmodels, string submitButton)
        {
            if (ModelState.IsValid)
            {
                //UserInstance从数据库中获取
                var userInstance = db.UserInstance.FirstOrDefault(u => u.InstanceID == savingmodels.Instance.ID);

                if (userInstance == null)
                {
                    return HttpNotFound();
                }

                if (!CheckUser(userInstance.CreateUser))
                {
                    return RedirectToAction("Login", "Member");
                }
                //userInstance.CreateTime = DateTime.Now;
                switch (submitButton)
                {
                    case "保存":
                        userInstance.Status = (int)Status.Saved;
                        break;
                    case "提交":
                        userInstance.Status = (int)Status.Submitted;
                        userInstance.CommitTime = DateTime.Now;
                        break;
                }
                //db.UserInstance.Attach(userInstance);
                db.Instance.Attach(savingmodels.Instance);
                db.ObjectStateManager.ChangeObjectState(userInstance, EntityState.Modified);
                db.ObjectStateManager.ChangeObjectState(savingmodels.Instance, EntityState.Modified);

                db.SaveChanges();
                return RedirectToAction("Index");
            }
            ViewBag.InstanceID = new SelectList(db.Instance, "ID", "DJH", savingmodels.UserInstance.InstanceID);
            return View();
        }

        [HttpPost]
        public JsonResult Submit(string id)
        {
            string[] idList = id.Split(',');
            foreach (string s in idList)
            {
                var userInstance = db.UserInstance.Single(u => u.ID == s);
                userInstance.Status = (int)Status.Submitted;
                userInstance.CommitTime = DateTime.Now;
                db.ObjectStateManager.ChangeObjectState(userInstance, EntityState.Modified);
            }
            db.SaveChanges();
            return new JsonResult() { Data = "ok" };
        }

        //
        // GET: /Instance/Delete/5

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
        // POST: /Instance/Delete/5

        [HttpPost, ActionName("Delete")]
        public JsonResult DeleteConfirmed(string id)
        {
            UserInstance userinstance = db.UserInstance.Single(u => u.ID == id);
            if (!CheckUser(userinstance.CreateUser))
            {
                RedirectToAction("Login", "Member");
                return null;
            }

            db.Instance.DeleteObject(userinstance.Instance);
            db.UserInstance.DeleteObject(userinstance);
            db.SaveChanges();
            return new JsonResult() { Data = "ok" };
        }

        [HttpPost]
        public ActionResult Retreat(SavingModels savingmodels)
        {
            if (ModelState.IsValid)
            {
                //UserInstance从数据库中获取
                var userInstance = db.UserInstance.FirstOrDefault(u => u.InstanceID == savingmodels.Instance.ID);
                userInstance.Status = (int)Status.Returned;
                userInstance.RetreatReason = savingmodels.UserInstance.RetreatReason;
                userInstance.ReturnTime = DateTime.Now;
                db.ObjectStateManager.ChangeObjectState(userInstance, EntityState.Modified);
                db.SaveChanges();
                return RedirectToAction("Index", "Admin");
            }

            return View();
        }

        [HttpPost]
        public JsonResult WinRetreat(string id)
        {
            var userInstance = db.UserInstance.Single(u => u.ID == id);
            userInstance.Status = (int)Status.Returned;
            userInstance.RetreatReason = "资料不全。";
            userInstance.ReturnTime = DateTime.Now;
            db.ObjectStateManager.ChangeObjectState(userInstance, EntityState.Modified);
            db.SaveChanges();
            return new JsonResult() { Data = "ok" };
        }

        [HttpPost]
        public JsonResult Pass(string id)
        {
            var userInstance = db.UserInstance.Single(u => u.ID == id);
            userInstance.Status = (int)Status.Checked;
            db.ObjectStateManager.ChangeObjectState(userInstance, EntityState.Modified);
            db.SaveChanges();
            return new JsonResult() { Data = "ok" };
        }


        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }

        #region 公用方法
        /// <summary>
        /// 判断所属业务是否为当前用户的
        /// </summary>
        /// <returns></returns>
        protected bool CheckUser(Guid requestUser)
        {
            return (requestUser == new Guid(Convert.ToString(Membership.GetUser().ProviderUserKey)));
        }

        #endregion
    }
}