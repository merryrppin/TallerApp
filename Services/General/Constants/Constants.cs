using System;
using System.Collections.Generic;
using System.Collections.ObjectModel;
using static Services.General.Enums.Enums;

namespace Services.General.Constants
{
    public class Constants
    {
        public static readonly Dictionary<int, string> ListErrors = new Dictionary<int, string>(){
            { (int)EnumGeneralErrors.GeneralError, "generalError" },
            { (int)EnumGeneralErrors.UserExist, "errorUserExist" },
        };
    }
}
