using Services.General;
using Services.General.Entities.LoginEntities;
using Services.General.Entities.PDFEntities;
using Services.General.Entities.StoredEntities;
using System.Threading.Tasks;
using System.Web.Http;


namespace Web.Controllers
{
    public class GeneralController : ApiController
    {
        private AdministrationService _administrationService;
        private PDFService _PDFService;
        public GeneralController()
        {
            _administrationService = new AdministrationService();
            _PDFService = new PDFService();
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
        [Route("api/CreateReceipt")]
        public Task<string> CreateReceipt(LoginEntity loginresp)
        {
            return _administrationService.CreateReceipt(loginresp);
        }

        [HttpPost]
        [Route("api/PrintPDF")]
        public string PrintPDF(PDFEntity PDFEntityInput)
        {
            return _PDFService.PrintPDF(PDFEntityInput);
        }
    }
}