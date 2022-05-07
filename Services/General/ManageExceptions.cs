using Services.General.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Services.General.Enums.Enums;

namespace Services.General
{
    public class ManageExceptions
    {
        public void SaveLogException(Exception ex, GeneralResponse GeneralResponse = null)
        {
            if(GeneralResponse != null)
            {
                GeneralResponse.BooleanResponse = false;
                GeneralResponse.GeneralError = Constants.Constants.ListErrors[(int)EnumGeneralErrors.GeneralError];
            }
        }
    }
}
