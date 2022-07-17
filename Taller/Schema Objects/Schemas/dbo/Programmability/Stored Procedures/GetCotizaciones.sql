CREATE PROCEDURE GetCotizaciones

AS
BEGIN
    -- SET NOCOUNT ON added to prevent extra result sets from
    -- interfering with SELECT statements.
    SET NOCOUNT ON

    -- Insert statements for procedure here
    SELECT cotizaciones.IdCotizacion,cotizaciones.FechaElaboracion,customers.name,customers.id AS CustomerId, cotizaciones.TotalBruto,
    cotizaciones.Descuentos,cotizaciones.SubTotal,cotizaciones.TotalNeto 
	FROM [dbo].[tblCotizaciones] AS cotizaciones
	JOIN tblCustomers AS customers
	ON customers.id = cotizaciones.IdCliente

END
GO
