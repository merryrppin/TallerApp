CREATE PROCEDURE [dbo].[SaveRecepcionProducto]
	@jsonRecepcionProducto VARCHAR(MAX),
	@jsonProductos VARCHAR(MAX),
	@jsonValoresProductos VARCHAR(MAX)
AS
BEGIN
	
	DECLARE @IdRecepcionProducto INT = (SELECT ISNULL(MAX(IdRecepcionProducto), 0) + 1 FROM tblRecepcionProducto);
	
	SELECT [IdCliente], [FechaElaboracion], [IdContactoCliente], [NombreContactoCliente], [IdResponsableRecepcionProducto], [NombreResponsableRecepcionProducto], [Notas]
	INTO #tmpRecepcionProducto
	FROM OPENJSON(@jsonRecepcionProducto)
	WITH ( 
		[IdCliente] UNIQUEIDENTIFIER '$.cliente',
		[FechaElaboracion] DATE '$.fechaElaboracion',
		[IdContactoCliente] INT '$.contacto',
		[NombreContactoCliente] VARCHAR(MAX) '$.nombreContacto',
		[IdResponsableRecepcionProducto] INT '$.responsableRecepcionProductoId',
		[NombreResponsableRecepcionProducto] VARCHAR(200) '$.responsableRecepcionProducto',
		[Notas] VARCHAR(MAX) '$.notas'
	);

	
	SELECT NEWID() AS [IdProductoRecepcionProducto], [IdProductoTempId], [DescripcionProducto], [Cantidad], [ProductoId]
	INTO #tmpProductosRecepcionProducto
	FROM OPENJSON(@jsonProductos)
	WITH (
		[IdProductoTempId] BIGINT '$.productTempId',
		[DescripcionProducto] VARCHAR(MAX) '$.descripcion',
		[Cantidad] INT '$.cantidad',
		[ProductoId] UNIQUEIDENTIFIER '$.productoId'
	);
	
	SELECT [IdProductoTempId], [IdProduct], [IdProductProperty], [Value]
	INTO #tmpValoresProductosRecepcionProducto
	FROM OPENJSON(@jsonValoresProductos)
	WITH (
		[IdProductoTempId] BIGINT '$.productTempId',
		[IdProduct] UNIQUEIDENTIFIER '$.IdProduct',
		[IdProductProperty] UNIQUEIDENTIFIER '$.IdProductProperty',
		[Value] VARCHAR(MAX)
	);

	BEGIN TRY	
		BEGIN TRANSACTION
			INSERT INTO [tblRecepcionProducto]([IdRecepcionProducto], [IdCliente], [FechaElaboracion], [IdResponsableRecepcionProducto], [NombreResponsableRecepcionProducto], [Notas])
			SELECT @IdRecepcionProducto, [IdCliente], [FechaElaboracion], [IdResponsableRecepcionProducto], [NombreResponsableRecepcionProducto], [Notas]
			FROM #tmpRecepcionProducto;

			INSERT INTO [tblProductosRecepcionProducto]([IdProductoRecepcionProducto], [IdRecepcionProducto], [IdProducto], [DescripcionProducto], [Cantidad])
			SELECT [IdProductoRecepcionProducto], @IdRecepcionProducto, [ProductoId], [DescripcionProducto], [Cantidad]
			FROM #tmpProductosRecepcionProducto;
			
			INSERT INTO [dbo].[tblProductosRecepcionProductoValues] ([IdProductoRecepcionProducto], [IdProductProperty], [ValueOption])
				SELECT  prodCot.[IdProductoRecepcionProducto], IdProductProperty, [Value]
			FROM #tmpValoresProductosRecepcionProducto AS valProdCot
			INNER JOIN #tmpProductosRecepcionProducto AS prodCot ON valProdCot.[IdProductoTempId] = prodCot.[IdProductoTempId];

			SELECT @IdRecepcionProducto AS IdRecepcionProducto;
		COMMIT TRANSACTION
	END TRY
	BEGIN CATCH
		ROLLBACK TRANSACTION
		RAISERROR('Error al insertar la Recepcion del Producto', 17, 1);
	END CATCH
	
	DROP TABLE IF EXISTS #tmpRecepcionProducto
	DROP TABLE IF EXISTS #tmpProductosRecepcionProducto
	DROP TABLE IF EXISTS #tmpValoresProductosRecepcionProducto
END