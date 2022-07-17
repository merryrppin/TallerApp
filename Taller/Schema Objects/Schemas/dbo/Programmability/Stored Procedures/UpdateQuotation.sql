CREATE PROCEDURE UpdateQuotation(@IdProductoCotizacion UNIQUEIDENTIFIER, @UserName VARCHAR(100),@Quantity INT)
AS
BEGIN
	BEGIN TRY
	BEGIN TRANSACTION

	UPDATE tblProductosCotizacion
	SET CantidadPendiente = @Quantity
	WHERE IdProductoCotizacion = @IdProductoCotizacion

	IF @@ROWCOUNT > 0
	BEGIN
		INSERT INTO tblLog (ModifiedBy,[Action])
		SELECT @UserName, CONCAT('IdProductoCotizacion: ', @IdProductoCotizacion, ' Se modifica la cantidad de la cotización a ', @Quantity) 
	END

	COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0 BEGIN
			ROLLBACK TRANSACTION
			DECLARE @ErrorMessage VARCHAR(MAX) = CONCAT('Error actualizando la cotización: ', ERROR_MESSAGE());
			RAISERROR(@ErrorMessage,16,1)
		END
	END CATCH
END
