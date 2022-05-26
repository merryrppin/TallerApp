CREATE PROCEDURE [dbo].[GetCustomers] AS
BEGIN
	SELECT [id], [type], [person_type], [id_type], [identification], [branch_office], [check_digit], [name], [comercial_name], [active], [vat_responsible], [fiscal_responsibilities], [address], [phones], [contacts], [comments]
	FROM [dbo].[tblCustomers] 
	--WHERE person_type = 'Company'
END