using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReWeb.Infrastructs
{
    public class IDgenerator
    {
        /// <summary>
        /// ID生成函数
        /// </summary>
        /// <returns></returns>
        public static string generate() 
        {
            string year = DateTime.Now.Year.ToString();
            string month = (DateTime.Now.Month < 10) ? "0" + (DateTime.Now.Month) : "" + DateTime.Now.Month;
            string day = (DateTime.Now.Day < 10) ? "0" + DateTime.Now.Day : "" + DateTime.Now.Day;
            string date = year + month + day;
            ModelsContainer db = new ModelsContainer();
            var userinstances = db.UserInstance.Where(u => u.ID.StartsWith(date)).ToList();
            if (userinstances.Count == 0){
                return date + "0001";
            }
            else {
                userinstances.Sort((x,y)=>y.ID.CompareTo(x.ID));
                return (Int64.Parse(userinstances[0].ID) + 1).ToString();
            }
        }

    }
}