CREATE PROCEDURE GetAccountingReceiptTypes
AS
BEGIN

	SELECT Id, Code, Name, Type, Active, CostCenter FROM tblAccountingReceiptTypes

END
