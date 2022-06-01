using Services.General.Entities.PDFEntities;
using Services.General.Entities.StoredEntities;
using Services.General.PDF;
using System;
using System.Collections.Generic;
using System.Text;
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

        public string PrintPDF(PDFEntity PDFEntityInput)
        {
            switch (PDFEntityInput.PDFType)
            {
                case (int)EnumPDFType.RecepcionProducto:
                    return GetDataRecepcionProducto(PDFEntityInput);
                default:
                    return null;
            }
        }

        private string GetDataRecepcionProducto(PDFEntity PDFEntityInput)
        {
            StoredObjectParams StoredObjectParams = new StoredObjectParams
            {
                StoredProcedureName = "GetRecepcionProductoPDF",
                StoredParams = new List<StoredParams> {
                    new StoredParams {Name = "IdRecepcionProducto", Value = PDFEntityInput.Id.ToString(), TypeOfParameter = (int)EnumTypeOfParameter.IntType }
                }
            };
            StoredObjectResponse StoredObjectResponse = administrationService.ExecuteStoredProcedure(StoredObjectParams);
            if (StoredObjectResponse.Exception != null)
            {
                throw StoredObjectResponse.Exception;
            }
            RecepcionProductoPDF recepcionProductoPDF = new RecepcionProductoPDF(StoredObjectResponse);
            byte[] bytes = recepcionProductoPDF.GeneratePDF();
            return Convert.ToBase64String(bytes, 0, bytes.Length);
        }
    }
}
