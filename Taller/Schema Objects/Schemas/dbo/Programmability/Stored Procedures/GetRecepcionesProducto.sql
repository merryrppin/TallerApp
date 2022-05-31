CREATE PROCEDURE [dbo].[GetRecepcionesProducto] AS
BEGIN
    SELECT recepcionProducto.IdRecepcionProducto, recepcionProducto.FechaElaboracion, customers.[name]
	FROM [dbo].[tblRecepcionProducto] AS recepcionProducto
	JOIN tblCustomers AS customers
	ON customers.id = recepcionProducto.IdCliente
END