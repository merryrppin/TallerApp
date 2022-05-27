CREATE PROCEDURE [dbo].[SaveCotizacion]
	@jsonCotizacion VARCHAR(MAX),
	@jsonProductos VARCHAR(MAX),
	@jsonValoresProductos VARCHAR(MAX)
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

	
	SELECT NEWID() AS [IdProductoCotizacion], [IdProductoTempId], [DescripcionProducto], [Cantidad], [ValorUnitario], [Descuento], [Tax], [TaxId], [TotalProducto], [DescuentoTotal], [ImpuestoRetencion], [ImpuestoCargo], [ProductoId]
	INTO #tmpProductosCotizacion
	FROM OPENJSON(@jsonProductos)
	WITH (
		[IdProductoTempId] BIGINT '$.productTempId',
		[DescripcionProducto] VARCHAR(MAX) '$.descripcion',
		[Cantidad] INT '$.cantidad',
		[ValorUnitario] DECIMAL(20, 4) '$.valorunitario',
		[Descuento] DECIMAL(20, 4) '$.descuento',
		[Tax] DECIMAL(20,4) '$.taxes',
		[TaxId] INT '$.taxId',
		[TotalProducto] DECIMAL(20,4) '$.totalProducto',
		[DescuentoTotal] DECIMAL(20,4) '$.descuentoTotal',
		[ImpuestoRetencion] DECIMAL(20,4) '$.impuestoRetencion',
		[ImpuestoCargo] DECIMAL(20,4) '$.impuestoCargo',
		[ProductoId] UNIQUEIDENTIFIER '$.productoId'
	);
	
	SELECT [IdProductoTempId], [IdProduct], [IdProductProperty], [Value]
	INTO #tmpValoresProductosCotizacion
	FROM OPENJSON(@jsonValoresProductos)
	WITH (
		[IdProductoTempId] BIGINT '$.productTempId',
		[IdProduct] UNIQUEIDENTIFIER '$.IdProduct',
		[IdProductProperty] UNIQUEIDENTIFIER '$.IdProductProperty',
		[Value] VARCHAR(MAX)
	);

	BEGIN TRY	
		BEGIN TRANSACTION
			INSERT INTO [tblCotizaciones]([IdCotizacion], [IdCliente], [FechaElaboracion], [IdContactoCliente], [NombreContactoCliente], [IdResponsableCotizacion], [NombreResponsableCotizacion], [Encabezado], 
				[CondicionesComerciales], [TotalBruto], [Descuentos], [SubTotal], [TotalNeto])
			SELECT @IdCotizacion, [IdCliente], [FechaElaboracion], [IdContactoCliente], [NombreContactoCliente], [IdResponsableCotizacion], [NombreResponsableCotizacion], [Encabezado], 
				[CondicionesComerciales], [TotalBruto], [Descuentos], [SubTotal], [TotalNeto]
			FROM #tmpCotizacion;
			
			INSERT INTO [tblProductosCotizacion]([IdProductoCotizacion], [IdCotizacion], [IdProducto], [DescripcionProducto], [Cantidad], [ValorUnitario], [Descuento], [Tax], [TaxId], [TotalProducto], [DescuentoTotal], 
				[ImpuestoRetencion], [ImpuestoCargo])
			SELECT [IdProductoCotizacion], @IdCotizacion, [ProductoId], [DescripcionProducto], [Cantidad], [ValorUnitario], [Descuento], [Tax], [TaxId], [TotalProducto], ISNULL([DescuentoTotal], 0), ISNULL([ImpuestoRetencion], 0), ISNULL([ImpuestoCargo], 0)
			FROM #tmpProductosCotizacion;

			
			INSERT INTO [dbo].[tblProductosCotizacionValues] ([IdProductoCotizacion], [IdProduct], [IdProductProperty], [ValueOption])
				SELECT  prodCot.[IdProductoCotizacion], IdProduct, IdProductProperty, [Value]
			FROM #tmpValoresProductosCotizacion AS valProdCot
			INNER JOIN #tmpProductosCotizacion AS prodCot ON valProdCot.[IdProductoTempId] = prodCot.[IdProductoTempId];
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		RAISERROR('Error al insertar la cotizacion', 17, 1);
	END CATCH
	
	DROP TABLE IF EXISTS #tmpCotizacion
	DROP TABLE IF EXISTS #tmpProductosCotizacion
	DROP TABLE IF EXISTS #tmpValoresProductosCotizacion
END