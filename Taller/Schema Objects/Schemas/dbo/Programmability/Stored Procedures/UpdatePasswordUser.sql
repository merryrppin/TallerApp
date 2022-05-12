CREATE PROCEDURE [dbo].[UpdatePasswordUser]
	@UserId INT,
	@PasswordEncrypt VARCHAR(200) 
AS
BEGIN
	UPDATE [dbo].[tblUsers] SET [Password] = @PasswordEncrypt WHERE UserId = @UserId
END
