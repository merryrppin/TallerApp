using Data.General.Entities;
using Services.General;
using Services.General.Entities.LoginEntities;
using System.Web.Http;

namespace Web.Controllers
{
    public class UserController : ApiController
    {
        private AdministrationService _administrationService;
        public UserController()
        {
            _administrationService = new AdministrationService();
        }

        [HttpPost]
        [Route("api/login")]
        public LoginEntity Login(LoginEntity loginEntity)
        {
            return _administrationService.Login(loginEntity.login, loginEntity.password);
        }
    }
}