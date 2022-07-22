CREATE PROCEDURE GetCodesReceipt
AS BEGIN

	SELECT 
		Receipt.Name,customers.name AS CustomerName,customers.id AS CustomerId, cotizaciones.TotalBruto,
		cotizaciones.Descuentos,cotizaciones.SubTotal,cotizaciones.TotalNeto 
	FROM [dbo].[tblCotizaciones] AS cotizaciones
		INNER JOIN tblReceiptDetail AS ReceiptDetail ON cotizaciones.IdCotizacion = ReceiptDetail.QuotationId
		INNER JOIN tblReceipt AS Receipt ON ReceiptDetail.ReceiptId = ReceiptDetail.ReceiptId
		INNER JOIN tblCustomers AS customers ON customers.id = cotizaciones.IdCliente

END