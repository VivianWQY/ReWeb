using System;
using System.Collections.Generic;
using System.Globalization;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Mvc.Html;

namespace ReWeb.Infrastructs
{
    public static class BootstrapExtLocals
    {
        /// <summary>
        /// Returns a single-selection select element using the specified HTML helper and the name of the form field with the Fuelux style.
        /// </summary>
        /// 
        /// <returns>
        /// An HTML select element.
        /// </returns>
        /// <param name="htmlHelper">The HTML helper instance that this method extends.</param><param name="name">The name of the form field to return.</param><exception cref="T:System.ArgumentException">The <paramref name="name"/> parameter is null or empty.</exception>
        public static MvcHtmlString SelectList(this HtmlHelper htmlHelper, string name)
        {
            return htmlHelper.SelectList(name, null, null, null);
        }

        public static MvcHtmlString SelectList(this HtmlHelper htmlHelper, string name,  object htmlAttributes)
        {
            IDictionary<string, object> htmlAttributes1 = (IDictionary<string, object>)HtmlHelper.AnonymousObjectToHtmlAttributes(htmlAttributes);
            return htmlHelper.SelectList(name, null, null, htmlAttributes1);
        }

        public static MvcHtmlString SelectList(this HtmlHelper htmlHelper, string name,
                                               IEnumerable<SelectListItem> selectList, string optionLabel,
                                               IDictionary<string, object> htmlAttributes)
        {
            string fullHtmlFieldName = htmlHelper.ViewContext.ViewData.TemplateInfo.GetFullHtmlFieldName(name);
            fullHtmlFieldName = "Instance." + fullHtmlFieldName;//修改name
            selectList = selectList ?? GetSelectData(htmlHelper, name);

            //create down button
            var downButton = new TagBuilder("button");
            downButton.MergeAttribute("data-toggle", "dropdown");
            downButton.AddCssClass("btn dropdown-toggle");
            downButton.InnerHtml = "<span class=\"dropdown-label\" style=\"width: 182px\"></span><span class=\"caret\"></span>";//修改了长度
            //create select list
            var listTagBuilder = new TagBuilder("ul");
            listTagBuilder.AddCssClass("dropdown-menu");
            //generate select item
            var stringBuilder = new StringBuilder();

            foreach (SelectListItem selectListItem in selectList)
                stringBuilder.AppendLine(ListItemToSelectIem(selectListItem));
            listTagBuilder.InnerHtml = stringBuilder.ToString();

            //create outer tag
            var selectTagBuilder = new TagBuilder("div");
            //selectTagBuilder.MergeAttribute("data-resize", "auto");这个定义了所有下拉菜单的自动大小
            selectTagBuilder.AddCssClass("select btn-group");
            selectTagBuilder.MergeAttributes(htmlAttributes);
            selectTagBuilder.MergeAttribute("name", fullHtmlFieldName, true);
            selectTagBuilder.GenerateId(fullHtmlFieldName);

            selectTagBuilder.InnerHtml += downButton.ToString(TagRenderMode.Normal);
            selectTagBuilder.InnerHtml += listTagBuilder.ToString(TagRenderMode.Normal);

            ModelState modelState;
            if (htmlHelper.ViewData.ModelState.TryGetValue(fullHtmlFieldName, out modelState) &&
                modelState.Errors.Count > 0)
                selectTagBuilder.AddCssClass(HtmlHelper.ValidationInputCssClassName);
            return new MvcHtmlString(selectTagBuilder.ToString(TagRenderMode.Normal).Replace("Instance_", "Instance."));//不可定制化
        }

        private static string ListItemToSelectIem(SelectListItem item)
        {
            var tagBuilder = new TagBuilder("li")
                                 {
                                     InnerHtml = "<a href=\"#\">" + HttpUtility.HtmlEncode(item.Text) + "</a>"
                                 };
            if (item.Value != null)
                tagBuilder.MergeAttribute("data-value", item.Value);
            if (item.Selected)
            {
                tagBuilder.MergeAttribute("data-selected", "true");
            }
            return tagBuilder.ToString(TagRenderMode.Normal);
        }

        internal static string ListItemToOption(SelectListItem item)
        {
            var tagBuilder = new TagBuilder("option")
                                 {
                                     InnerHtml = HttpUtility.HtmlEncode(item.Text)
                                 };
            if (item.Value != null)
                tagBuilder.Attributes["value"] = item.Value;
            if (item.Selected)
                tagBuilder.Attributes["selected"] = "selected";
            return tagBuilder.ToString(TagRenderMode.Normal);
        }

        private static IEnumerable<SelectListItem> GetSelectData(this HtmlHelper htmlHelper, string name)
        {
            object obj = null;
            if (htmlHelper.ViewData != null)
                obj = htmlHelper.ViewData.Eval(name);
            if (obj == null)
            {
                throw new InvalidOperationException(string.Format(CultureInfo.CurrentCulture,
                                                                  "Missing select data with name {0} and type {1}",
                                                                  new object[]
                                                                      {
                                                                          name,
                                                                          "IEnumerable<SelectListItem>"
                                                                      }));
            }
            var enumerable = obj as IEnumerable<SelectListItem>;
            if (enumerable != null)
                return enumerable;
            throw new InvalidOperationException(string.Format(CultureInfo.CurrentCulture,
                                                              "Select data {0} is the {1} type, but {2} data type expected.",
                                                              (object) name, (object) obj.GetType().FullName,
                                                              (object) "IEnumerable<SelectListItem>"));
        }
    }
}