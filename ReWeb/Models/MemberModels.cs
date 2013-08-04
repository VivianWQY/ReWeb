
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using System.Web.Mvc;

namespace ReWeb.Models
{
    public class ChangePasswordModel
    {
        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "当前密码")]
        public string OldPassword { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} 至少需要 {2} 字符。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "新密码")]
        public string NewPassword { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "确认新密码")]
        [Compare("NewPassword", ErrorMessage = "两次输入的密码不符，请检查新密码。")]
        public string ConfirmPassword { get; set; }
    }

    public class LogOnModel
    {
        [Required]
        [Display(Name = "身份证号")]
        public string UserName { get; set; }

        [Required]
        [DataType(DataType.Password)]
        [Display(Name = "密码")]
        public string Password { get; set; }

        [Display(Name = "记住我")]
        public bool RememberMe { get; set; }

        [Required]
        [Display(Name = "验证码")]
        public string VerifyCode { get; set; }
    }

    public class EditUserModel
    {
        [Required]
        [Display(Name = "唯一标识")]
        public string  Guid { get; set; }

        [Required]
        [Display(Name = "身份证号")]
        [RegularExpression(@"^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$",
        ErrorMessage = "请输入合法的身份证号。")]
        public string UserName { get; set; }

        [Required]
        [Display(Name = "真实姓名")]
        public string TrueName { get; set; }

        [Display(Name = "邮箱地址")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Display(Name = "手机")]
        [RegularExpression(@"^1[3|4|5|8]\d{9}$",
        ErrorMessage = "请输入合法的手机号。")]
        public string Phone { get; set; }

        [Display(Name = "固定电话")]
        [RegularExpression(@"^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$",
        ErrorMessage = "请输入合法的电话号。")]
        public string TelePhone { get; set; }

        [Display(Name = "角色")]
        public string[] Roles { get; set; }

    }



    public class RegisterModel
    {
        [Required]
        [Display(Name = "身份证号")]
        [RegularExpression(@"^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$",
        ErrorMessage = "请输入合法的身份证号。")]
        public string UserName { get; set; }

        [Required]
        [Display(Name = "真实姓名")]
        public string TrueName { get; set; }

        [Required]
        [Display(Name = "用户类型")]
        public int UserType { get; set; }
        
        [Display(Name = "邮箱地址")]
        [DataType(DataType.EmailAddress)]
        public string Email { get; set; }

        [Required]
        [StringLength(100, ErrorMessage = "{0} 至少需要 {2} 字符。", MinimumLength = 6)]
        [DataType(DataType.Password)]
        [Display(Name = "密码")]
        public string Password { get; set; }

        [DataType(DataType.Password)]
        [Display(Name = "确认密码")]
        [Compare("Password", ErrorMessage = "两次输入的密码不符，请检查新密码。")]
        public string ConfirmPassword { get; set; }

        [Display(Name = "手机")]
        [RegularExpression(@"^1[3|4|5|8]\d{9}$",
        ErrorMessage = "请输入合法的手机号。")]
        public string Phone { get; set; }

        [Display(Name = "固定电话")]
        [RegularExpression(@"^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$",
        ErrorMessage = "请输入合法的电话号。")]
        public string TelePhone { get; set; }

    }
}
