CREATE PROCEDURE [dbo].[GetRecepcionProductoPDF]
	@IdRecepcionProducto INT
AS
BEGIN
    SELECT recepcionProd.IdRecepcionProducto, recepcionProd.FechaElaboracion, recepcionProd.IdCliente, recepcionProd.IdResponsableRecepcionProducto, recepcionProd.NombreResponsableRecepcionProducto, recepcionProd.Notas, customers.[name] AS nameCustomer
	FROM [dbo].[tblRecepcionProducto] AS recepcionProd
	JOIN tblCustomers AS customers ON customers.id = recepcionProd.IdCliente
	WHERE IdRecepcionProducto = @IdRecepcionProducto;

	SELECT recProd.IdRecepcionProducto, recProd.IdProducto, recProd.DescripcionProducto, recProd.Cantidad, prod.[name]
	FROM [tblProductosRecepcionProducto] AS recProd
	INNER JOIN tblProducts AS prod ON recProd.IdProducto = prod.id
	WHERE IdRecepcionProducto = @IdRecepcionProducto;

	;WITH cte_values AS (
		SELECT DISTINCT prodVal.ValueOption, PropOpt.TextOption
		FROM [tblProductosRecepcionProductoValues] AS prodVal
			INNER JOIN [tblProductosRecepcionProducto] AS ProdRP ON prodVal.IdProductoRecepcionProducto = ProdRP.IdProductoRecepcionProducto
			INNER JOIN [tblProductProperties] AS ProdProp ON prodVal.IdProductProperty = ProdProp.IdProductProperty
			LEFT JOIN [tblProductPropertyOptions] AS PropOpt ON prodVal.ValueOption = PropOpt.IdProductPropertyOption
		WHERE ProdRP.IdRecepcionProducto = @IdRecepcionProducto AND  ProdProp.HasOptions = 1)
	SELECT prodVal.IdProductoRecepcionProducto, ProdProp.TextProperty, ProdProp.HasOptions, prodVal.IdProductProperty, prodVal.ValueOption, cteVal.TextOption
	FROM [tblProductosRecepcionProductoValues] AS prodVal
		INNER JOIN [tblProductosRecepcionProducto] AS ProdRP ON prodVal.IdProductoRecepcionProducto = ProdRP.IdProductoRecepcionProducto
		INNER JOIN [tblProductProperties] AS ProdProp ON prodVal.IdProductProperty = ProdProp.IdProductProperty
		LEFT JOIN cte_values AS cteVal ON prodVal.ValueOption = cteVal.ValueOption
	WHERE ProdRP.IdRecepcionProducto = @IdRecepcionProducto;
END
