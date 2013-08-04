using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace ReWeb.Infrastructs
{
    /// <summary>
    /// UserInstance序列化函数
    /// </summary>
    public class JsonSerializer
    {
        public static string SerializeUserInstance(UserInstance u)
        {
            string data = "{";

            data += '"' + "ID" + '"' + ':';
            data += '"' + u.ID + '"';
            data += ',';

            data += '"' + "InstanceID" + '"' + ':';
            data += u.InstanceID;
            data += ',';

            data += '"' + "QLRMC" + '"' + ':';
            if (u.QLRMC != null)
            {
                data += '"' + u.QLRMC.TrimEnd() + '"';
            }
            else
            {
                data += "null";
            }
            data += ',';

            data += '"' + "FWZL" + '"' + ':';
            if (u.FWZL != null)
            {
                data += '"' + u.FWZL.TrimEnd() + '"';
            }
            else
            {
                data += "null";
            }
            data += ',';
            data += '"' + "AcceptedTime" + '"' + ':';
            data += '"' + DateTime.Now.ToString() + '"';
            data += "}";
            return data;
        }
    }
}