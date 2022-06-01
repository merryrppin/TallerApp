using iTextSharp.text;
using iTextSharp.text.pdf;
using Services.General.Entities.StoredEntities;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Services.General.PDF
{
    public class RecepcionProductoPDF
    {
        StoredTableResponse RecepcionProductoInfo;
        StoredTableResponse RecepcionProductoProductsInfo;
        StoredTableResponse RecepcionProductoProductsValuesInfo;
        readonly Document doc;
        public RecepcionProductoPDF(StoredObjectResponse StoredObjectResponse)
        {
            FillDataPDF(StoredObjectResponse);
            doc = new Document(iTextSharp.text.PageSize.A4, 10, 10, 42, 35);
        }

        private void FillDataPDF(StoredObjectResponse StoredObjectResponse)
        {
            RecepcionProductoInfo = StoredObjectResponse.Value[0];
            RecepcionProductoProductsInfo = StoredObjectResponse.Value[1];
            RecepcionProductoProductsValuesInfo = StoredObjectResponse.Value[2;
        }

        public byte[] GeneratePDF()
        {
            byte[] pdfBytes;
            using (var mem = new MemoryStream())
            {
                using (PdfWriter wri = PdfWriter.GetInstance(doc, mem))
                {
                    doc.Open();//Open Document to write
                    Paragraph paragraph = new Paragraph("This is my first line using Paragraph.");
                    Phrase pharse = new Phrase("This is my second line using Pharse.");
                    Chunk chunk = new Chunk(" This is my third line using Chunk.");

                    doc.Add(paragraph);
                    doc.Add(pharse);
                    doc.Add(chunk);
                    doc.Close();
                }
                pdfBytes = mem.ToArray();
            }
            return pdfBytes;
        }
    }
}
