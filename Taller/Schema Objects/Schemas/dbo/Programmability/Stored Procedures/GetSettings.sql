CREATE PROCEDURE GetSettings
AS
BEGIN
	SELECT NIT, CodeDebit, CodeCredit FROM tblSettings
END