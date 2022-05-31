using Services.General.Entities.PDFEntities;
using Services.General.Entities.StoredEntities;
using System.Collections.Generic;
using static Services.General.Enums.Enums;

namespace Services.General
{
    public class PDFService
    {
        private AdministrationService administrationService;

        public PDFService()
        {
            administrationService = new AdministrationService();
        }

        public void PrintPDF(PDFEntity PDFEntityInput)
        {
            string json = "";
            switch (PDFEntityInput.PDFType)
            {
                case (int)EnumPDFType.RecepcionProducto:
                    GetDataRecepcionProducto(PDFEntityInput);
                    return;
                default:
                    json = "";
                    return;
            }
        }

        private void GetDataRecepcionProducto(PDFEntity PDFEntityInput)
        {
            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "GetRecepcionProducto",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "IdRecepcionProducto", Value = PDFEntityInput.Id.ToString(), TypeOfParameter = (int)EnumTypeOfParameter.IntType }
                }
            };
            StoredObjectResponse StoredObjectResponse = administrationService.ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
        }
    }
}
