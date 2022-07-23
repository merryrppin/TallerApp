CREATE PROCEDURE GetQuotationForRecipt(@CustomerId UNIQUEIDENTIFIER, @QuotationId INT, @CreationDate VARCHAR(20))
AS
BEGIN

	SELECT Product.name, REPLACE(REPLACE(REPLACE(Customer.name,'"',''),'[',''),']','') AS CustomerName, QuotationProduct.IdProductoCotizacion,Product.code, QuotationProduct.DescripcionProducto, QuotationProduct.Cantidad, QuotationProduct.CantidadPendiente, QuotationProduct.ValorUnitario, QuotationProduct.TotalProducto, QuotationProduct.DescuentoTotal
	FROM [dbo].[tblCotizaciones] AS Quotation
		JOIN tblProductosCotizacion AS QuotationProduct ON Quotation.IdCotizacion = QuotationProduct.IdCotizacion
		JOIN tblProducts AS Product ON QuotationProduct.IdProducto = Product.id
		JOIN tblCustomers AS Customer ON Customer.id = Quotation.IdCliente
	WHERE (@CustomerId = Customer.id OR @CustomerId = 0x0)
		AND( @QuotationId = Quotation.IdCotizacion OR @QuotationId = -1)
		AND( @CreationDate = Quotation.FechaElaboracion OR @CreationDate = '')

END
GO