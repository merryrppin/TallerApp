using Services.General;
using Services.General.Entities.LoginEntities;
using Services.General.Entities.StoredEntities;
using System.Threading.Tasks;
using System.Web.Http;


namespace Web.Controllers
{
    public class GeneralController : ApiController
    {
        private AdministrationService _administrationService;
        public GeneralController()
        {
            _administrationService = new AdministrationService();
        }

        [HttpPost]
        [Route("api/executeStoredProcedure")]
        public StoredObjectResponse ExecuteStoredProcedure(StoredObjectParams StoredObjectParams)
        {
            return _administrationService.ExecuteStoredProcedure(StoredObjectParams);
        }

        [HttpPost]
        [Route("api/GetNumberCC")]
        public string GetNumberCC(LoginEntity loginresp)
        {
            return _administrationService.GetNumberCC(loginresp).Result;
        }

        [HttpPost]
        [Route("api/CreateCustomer")]
        public Task<string> CreateCustomer(LoginEntity loginresp)
        {
            return _administrationService.CreateCustomer(loginresp);
            


        }
    }
}