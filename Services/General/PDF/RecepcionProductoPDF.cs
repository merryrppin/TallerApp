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
            RecepcionProductoProductsValuesInfo = StoredObjectResponse.Value[2];
        }

        public byte[] GeneratePDF()
        {
            byte[] pdfBytes;
            
            using (var mem = new MemoryStream())
            {
                using (PdfWriter wri = PdfWriter.GetInstance(doc, mem))
                {
                    doc.Open();//Open Document to write
                    iTextSharp.text.Image img = iTextSharp.text.Image.GetInstance(@"C:\Alexis\AgroEquipos\Services\General\PDF\Images\AgroequiposLogo.png");
                    img.ScaleToFit(140f, 120f);
                    img.SpacingBefore = 10f;
                    img.SpacingAfter = 1f;
                    img.Alignment = Element.ALIGN_LEFT;
                    var p = new Paragraph();
                    p.Add("Agroequipos Alpujarra\n");
                    p.Add("principal\n");
                    p.Add("NIT. 901492867\n");
                    p.Add("CL 44 50 51\n");
                    p.Add("info@agroequiposalpujarra.com\n");
                    p.Add("3229090");
                    PdfPTable table = new PdfPTable(3);
                    table.TotalWidth = 600f;
                    table.WidthPercentage = 100;
                    table.DefaultCell.Border = Rectangle.NO_BORDER;
                    table.AddCell(img);
                    table.AddCell(p);
                    table.AddCell("Solicitud Taller No. 502 Fecha de Expedición 02-05-2022");

                    PdfPTable table1 = new PdfPTable(7);
                    table1.TotalWidth = 600f;
                    table1.WidthPercentage = 100;
                    table1.AddCell(new PdfPCell(new Phrase("Cliente")));
                    table1.AddCell(new PdfPCell(new Phrase(RecepcionProductoInfo.Rows[0][4].ToString())) { Colspan = 3 });
                    table1.AddCell(new PdfPCell(new Phrase("CC")));
                    table1.AddCell(new PdfPCell(new Phrase(RecepcionProductoInfo.Rows[0][7].ToString())) { Colspan = 3 });
                    PdfPTable nested = new PdfPTable(1);
                    nested.AddCell("Telefono");
                    nested.AddCell(new PdfPCell(new Phrase(RecepcionProductoInfo.Rows[0][9].ToString())));
                    nested.AddCell("Direccion");
                    nested.AddCell(new PdfPCell(new Phrase(RecepcionProductoInfo.Rows[0][8].ToString())));
                    nested.AddCell("Correo");
                    nested.AddCell(new PdfPCell(new Phrase(RecepcionProductoInfo.Rows[0][10].ToString())));
                    table1.AddCell(nested);
                    doc.Add(table);
                    doc.Add(table1);
                    
                    doc.Close();
                }
                pdfBytes = mem.ToArray();
            }
            return pdfBytes;
        }
    }
}
