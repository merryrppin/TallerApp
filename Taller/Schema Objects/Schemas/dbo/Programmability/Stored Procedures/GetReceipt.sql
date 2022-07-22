CREATE PROCEDURE GetReceipt(@CustomerId UNIQUEIDENTIFIER, @ReceiptName VARCHAR(100), @CreationDate VARCHAR(20))
AS
BEGIN
	SELECT Receipt.Name ReceiptName, Product.name AS ProductName ,QuotationProduct.IdProductoCotizacion,Product.code, QuotationProduct.DescripcionProducto, ReceiptDetail.OriginalQuantity AS Cantidad, 
			ReceiptDetail.QuantityPending AS CantidadPendiente, ReceiptDetail.UnitValue AS ValorUnitario, ReceiptDetail.TotalValue AS TotalProducto, ReceiptDetail.TotalDiscount AS DescuentoTotal
	FROM tblReceipt AS Receipt
		INNER JOIN tblReceiptDetail AS ReceiptDetail ON Receipt.ReceiptId = ReceiptDetail.ReceiptId
		INNER JOIN tblProductosCotizacion AS QuotationProduct ON ReceiptDetail.ProductQuotationId = QuotationProduct.IdProductoCotizacion
		INNER JOIN tblCotizaciones AS Quotation ON  QuotationProduct.IdCotizacion = Quotation.IdCotizacion
		INNER JOIN tblProducts AS Product ON QuotationProduct.IdProducto = Product.id
		INNER JOIN tblCustomers AS Customer ON Customer.id = Quotation.IdCliente
	WHERE (@CustomerId = Customer.id OR @CustomerId = 0x0)
		AND( @ReceiptName = Receipt.[Name] OR @ReceiptName = '')
		AND( @CreationDate = Receipt.CreationDate OR @CreationDate = '')

END
GO