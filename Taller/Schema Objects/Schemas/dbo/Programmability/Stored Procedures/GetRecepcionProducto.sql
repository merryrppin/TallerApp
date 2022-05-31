CREATE PROCEDURE [dbo].[GetRecepcionProducto]
	@IdRecepcionProducto INT
AS
BEGIN
    SELECT recepcionProd.IdRecepcionProducto, recepcionProd.FechaElaboracion, recepcionProd.IdCliente, recepcionProd.IdResponsableRecepcionProducto, recepcionProd.NombreResponsableRecepcionProducto, recepcionProd.Notas
	FROM [dbo].[tblRecepcionProducto] AS recepcionProd
	WHERE IdRecepcionProducto = @IdRecepcionProducto;

	SELECT IdRecepcionProducto, IdProducto, DescripcionProducto, Cantidad
	FROM [tblProductosRecepcionProducto]
	WHERE IdRecepcionProducto = @IdRecepcionProducto;

	SELECT prodVal.IdProductoRecepcionProducto, prodVal.IdProductProperty, prodVal.ValueOption
	FROM [tblProductosRecepcionProductoValues] AS prodVal
		INNER JOIN [tblProductosRecepcionProducto] AS ProdRP ON prodVal.IdProductoRecepcionProducto = ProdRP.IdProductoRecepcionProducto
	WHERE ProdRP.IdRecepcionProducto = @IdRecepcionProducto;
END