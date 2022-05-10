CREATE PROCEDURE [dbo].[GetAllActiveUsers] AS
BEGIN
	SELECT UserId, UserFirstName, UserLastName, UserEmail 
		FROM [tblUsers]
END
