CREATE PROCEDURE SaveReceipt(@JsonProductQuotationId VARCHAR(MAX),@ReceiptId UNIQUEIDENTIFIER, @ReceiptName VARCHAR(100), @Username VARCHAR(100))
AS
BEGIN

	SELECT ProductQuotationId
	INTO #ProductQuotation
	FROM OPENJSON(@JsonProductQuotationId)
	WITH (ProductQuotationId UNIQUEIDENTIFIER '$.ProductQuotationId')
	
	BEGIN TRY
	BEGIN TRANSACTION

		INSERT INTO tblReceipt (ReceiptId, [Name], CreationDate, CreatedBy)
		SELECT @ReceiptId,@ReceiptName, GETDATE(), @Username

		IF @@ROWCOUNT > 0
		BEGIN
			INSERT INTO tblReceiptDetail (ReceiptId, QuotationId, ProductQuotationId, OriginalQuantity, QuantityPending, UnitValue, TotalValue, TotalDiscount)
			SELECT @ReceiptId, ProductosCotizacion.IdCotizacion, ProductosCotizacion.IdProductoCotizacion, ProductosCotizacion.Cantidad, ProductosCotizacion.CantidadPendiente,
			ProductosCotizacion.ValorUnitario, ProductosCotizacion.TotalProducto, ProductosCotizacion.DescuentoTotal
			FROM [dbo].[tblProductosCotizacion]  AS ProductosCotizacion
			INNER JOIN #ProductQuotation AS tempProductQuotation ON ProductosCotizacion.IdProductoCotizacion = tempProductQuotation.ProductQuotationId
		END

	COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0 BEGIN
			ROLLBACK TRANSACTION
			DECLARE @ErrorMessage VARCHAR(MAX) = CONCAT('Error guardando comprobante contable: ', ERROR_MESSAGE());
			RAISERROR(@ErrorMessage,16,1)
		END
	END CATCH
END