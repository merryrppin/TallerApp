using Services.General;
using Services.General.Entities.StoredEntities;
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
    }
}