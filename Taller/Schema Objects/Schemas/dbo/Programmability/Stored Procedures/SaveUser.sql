CREATE PROCEDURE [dbo].[SaveUser]
	@jsonUser VARCHAR(MAX) AS
BEGIN

	DECLARE @UserId INT;
	DECLARE @UserFirstName VARCHAR(200);
	DECLARE @UserLastName VARCHAR(200);
	DECLARE @UserEmail VARCHAR(200);
	DECLARE @Login VARCHAR(200);
	DECLARE @Password VARCHAR(200);

	SELECT @UserId = UserId, @UserFirstName = UserFirstName, @UserLastName = UserLastName, @UserEmail = UserEmail, @Login = [Login], @Password = [Password]
	FROM OPENJSON(@jsonUser)
	WITH (
		UserId INT '$.UserId',
		UserFirstName VARCHAR(200) '$.UserFirstName',
		UserLastName VARCHAR(200) '$.UserLastName',
		UserEmail VARCHAR(200) '$.UserEmail',
		[Login] VARCHAR(200) '$.Login',
		[Password] VARCHAR(200) '$.PasswordEncrypt');

	IF (@UserId = -1) BEGIN
		--INSERT
		IF EXISTS(SELECT UserId FROM [tblUsers] WHERE UserEmail = @UserEmail OR [Login] = @Login) BEGIN
			RAISERROR('El usuario que está intentando agregar, ya existe', 17, 1);
			RETURN;
		END

		INSERT INTO [tblUsers]([UserFirstName], [UserLastName], [UserEmail], [Login], [Password])
		VALUES (@UserFirstName, @UserLastName, @UserEmail, @Login, @Password);
		
	END ELSE BEGIN
		--UPDATE
		UPDATE [tblUsers]
		 SET [UserFirstName] = @UserFirstName, [UserLastName] = @UserLastName, [UserEmail] = @UserEmail, [Login] = @Login
		WHERE UserId = @UserId;
	END
	
END