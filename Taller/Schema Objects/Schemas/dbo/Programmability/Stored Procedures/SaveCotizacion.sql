CREATE PROCEDURE [dbo].[SaveCotizacion]
	@jsonCotizacion VARCHAR(MAX),
	@jsonProductos VARCHAR(MAX)
AS
BEGIN
	
	DECLARE @IdCotizacion UNIQUEIDENTIFIER = (SELECT NEWID());
	
	SELECT [IdCliente], [FechaElaboracion], [IdContactoCliente], [NombreContactoCliente], [IdResponsableCotizacion], [NombreResponsableCotizacion], [Encabezado], [CondicionesComerciales], [TotalBruto], [Descuentos], [SubTotal], [TotalNeto]
	INTO #tmpCotizacion
	FROM OPENJSON(@jsonCotizacion)
	WITH ( 
		[IdCliente] UNIQUEIDENTIFIER '$.cliente',
		[FechaElaboracion] DATE '$.fechaElaboracion',
		[IdContactoCliente] INT '$.contacto',
		[NombreContactoCliente] VARCHAR(MAX) '$.nombreContacto',
		[IdResponsableCotizacion] INT '$.responsableCotizacionId',
		[NombreResponsableCotizacion] VARCHAR(200) '$.responsableCotizacion',
		[Encabezado] VARCHAR(MAX) '$.encabezado',
		[CondicionesComerciales] VARCHAR(MAX) '$.condicionesComerciales',
		[TotalBruto] DECIMAL(20,4) '$.totalBruto',
		[Descuentos] DECIMAL(20,4) '$.descuentos',
		[SubTotal] DECIMAL(20,4) '$.subTotal',
		[TotalNeto] DECIMAL(20,4) '$.totalNeto'
	);
	
	SELECT [IdProducto], [DescripcionProducto], [Cantidad], [ValorUnitario], [Descuento], [Tax], [TaxId], [TotalProducto], [DescuentoTotal], [ImpuestoRetencion], [ImpuestoCargo]
	INTO #tmpProductosCotizacion
	FROM OPENJSON(@jsonCotizacion)
	WITH (
		[IdProducto] UNIQUEIDENTIFIER '$.productoId',
		[DescripcionProducto] VARCHAR(MAX) '$.descripcion',
		[Cantidad] INT '$.cantidad',
		[ValorUnitario] DECIMAL(20, 4) '$.valorunitario',
		[Descuento] DECIMAL(20, 4) '$.descuento',
		[Tax] UNIQUEIDENTIFIER '$.taxes',
		[TaxId] UNIQUEIDENTIFIER '$.taxId',
		[TotalProducto] UNIQUEIDENTIFIER '$.totalProducto',
		[DescuentoTotal] UNIQUEIDENTIFIER '$.descuentoTotal',
		[ImpuestoRetencion] UNIQUEIDENTIFIER '$.impuestoRetencion',
		[ImpuestoCargo] UNIQUEIDENTIFIER '$.impuestoCargo'
	);
	
	BEGIN TRY	
		BEGIN TRANSACTION
			INSERT INTO [tblCotizaciones]([IdCotizacion], [IdCliente], [FechaElaboracion], [IdContactoCliente], [NombreContactoCliente], [IdResponsableCotizacion], [NombreResponsableCotizacion], [Encabezado], 
				[CondicionesComerciales], [TotalBruto], [Descuentos], [SubTotal], [TotalNeto])
			SELECT @IdCotizacion, [IdCliente], [FechaElaboracion], [IdContactoCliente], [NombreContactoCliente], [IdResponsableCotizacion], [NombreResponsableCotizacion], [Encabezado], 
				[CondicionesComerciales], [TotalBruto], [Descuentos], [SubTotal], [TotalNeto]
			FROM #tmpCotizacion;

			INSERT INTO [tblProductosCotizacion]([IdCotizacion], [IdProducto], [DescripcionProducto], [Cantidad], [ValorUnitario], [Descuento], [Tax], [TaxId], [TotalProducto], [DescuentoTotal], 
				[ImpuestoRetencion], [ImpuestoCargo])
			SELECT @IdCotizacion, [IdProducto], [DescripcionProducto], [Cantidad], [ValorUnitario], [Descuento], [Tax], [TaxId], [TotalProducto], [DescuentoTotal], [ImpuestoRetencion], [ImpuestoCargo]
			FROM #tmpProductosCotizacion;
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		RAISERROR('Error al insertar la cotizacion', 17, 1);
	END CATCH
	
	DROP TABLE IF EXISTS #tmpCotizacion
	DROP TABLE IF EXISTS #tmpProductosCotizacion
END