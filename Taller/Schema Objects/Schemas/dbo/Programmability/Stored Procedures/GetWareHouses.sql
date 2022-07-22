CREATE PROCEDURE [dbo].[GetWareHouses]
AS
BEGIN
	SELECT Id, [Name], Active FROM tblWareHouses
END
