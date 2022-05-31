CREATE PROCEDURE [dbo].[GetCotizacion]
	@IdCotizacion INT
AS
BEGIN
    SELECT cotizaciones.IdCotizacion, cotizaciones.FechaElaboracion, cotizaciones.IdCliente, cotizaciones.TotalBruto, cotizaciones.Descuentos, cotizaciones.SubTotal, cotizaciones.TotalNeto, cotizaciones.IdResponsableCotizacion, cotizaciones.NombreResponsableCotizacion
	FROM [dbo].[tblCotizaciones] AS cotizaciones
	WHERE IdCotizacion = @IdCotizacion;

	SELECT IdProductoCotizacion, IdProducto, DescripcionProducto, Cantidad, ValorUnitario, Descuento, Tax, TaxId, TotalProducto, DescuentoTotal, ImpuestoRetencion, ImpuestoCargo
	FROM [tblProductosCotizacion]
	WHERE IdCotizacion = @IdCotizacion;

	SELECT prodVal.IdProductoCotizacion, prodVal.IdProductProperty, prodVal.ValueOption
	FROM [tblProductosCotizacionValues] AS prodVal
		INNER JOIN [tblProductosCotizacion] AS ProdCot ON prodVal.IdProductoCotizacion = ProdCot.IdProductoCotizacion
	WHERE ProdCot.IdCotizacion = @IdCotizacion;
END