using System;

namespace Services.General.Entities.LoginEntities
{
    public class LoginEntity
    {
        public int UserId { get; set; }
        public string UserFirstName { get; set; }
        public string UserLastName { get; set; }
        public string UserCompleteName { get; set; }
        public string login { get; set; }
        public string password { get; set; }
        public int CompanyId { get; set; }
        public string CompanyName { get; set; }
        public string Country { get; set; }
        public string NIT { get; set; }
        public string usuariosiigo { get; set; }
        public string accesskey { get; set; }
        public string access_token { get; set; }
        public string daydiff { get; set; }
        public DateTime creationdatetoken { get; set; }
        public string Customers { get; set; }
        public string Receipt { get; set; }
        public string Invoice { get; set; }

    }
}
