using System;
using System.Text;

namespace Services.Secure
{
    class Encode_Decode //Método de encriptar y desencriptar temporal
    {
        // encoding
        public static string Encrypt(string strData)
        {
            if (string.IsNullOrEmpty(strData))
            {
                return strData;
            }

            byte[] textBytes = Encoding.UTF8.GetBytes(strData);
            return Convert.ToBase64String(textBytes);
        }


        // decoding
        public static string Decrypt(string strData)
        {
            if (string.IsNullOrEmpty(strData))
            {
                return strData;
            }

            byte[] base64EncodedBytes = Convert.FromBase64String(strData);
            return Encoding.UTF8.GetString(base64EncodedBytes);
        }
    }
}
