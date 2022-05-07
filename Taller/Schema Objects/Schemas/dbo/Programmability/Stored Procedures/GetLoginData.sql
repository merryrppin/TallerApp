CREATE PROCEDURE [dbo].[GetLoginData]
	@login VARCHAR(250),
	@password VARCHAR(250)
AS BEGIN
	SELECT u.UserId, u.UserFirstName, u.UserLastName, CONCAT(u.UserFirstName, ' ', u.UserLastName) AS UserCompleteName
	FROM tblUsers AS u
	WHERE [Login] = @login AND [Password] = @password

	SELECT TOP 1 CompanyId, CompanyName, Country, NIT
	FROM tblCompanies
END