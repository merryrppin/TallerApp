CREATE PROCEDURE [dbo].[GetLoginData]
	@login VARCHAR(250),
	@password VARCHAR(250)
AS BEGIN
	SELECT u.UserId, u.UserFirstName, u.UserLastName, CONCAT(u.UserFirstName, ' ', u.UserLastName) AS UserCompleteName, 
		siigo.usuario AS usuariosiigo, siigo.accesskey, siigo.accesstoken, DATEDIFF(DAY, siigo.creationdatetoken, GETDATE()) AS daydiff
	FROM tblUsers AS u
	CROSS JOIN [param].[tblSessionSiigo] AS siigo
	WHERE [Login] = @login AND [Password] = @password
END