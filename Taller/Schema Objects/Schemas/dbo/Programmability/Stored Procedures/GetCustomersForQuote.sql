CREATE PROCEDURE [dbo].[GetCustomersForQuote] AS
BEGIN
	SELECT DISTINCT  [id], [type], [person_type], [id_type], [identification], [branch_office], [check_digit], [name], [comercial_name], [active], [vat_responsible], [fiscal_responsibilities], [address], [phones], [contacts], [comments]
	FROM tblCustomers
		INNER JOIN tblCotizaciones AS Cotizaciones ON tblCustomers.id = Cotizaciones.IdCliente
END