using Data.General.Entities;
using Services.General;
using Services.General.Entities.LoginEntities;
using System.Threading.Tasks;
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
        public async Task<LoginEntity> LoginAsync(LoginEntity loginEntity)
        {
            return await _administrationService.LoginAsync(loginEntity.login, loginEntity.password);
        }

        [HttpPost]
        [Route("api/encryptstring")]
        public string EncryptString(LoginEntity LoginEntity)
        {
            return _administrationService.EncryptString(LoginEntity);
        }
    }
}