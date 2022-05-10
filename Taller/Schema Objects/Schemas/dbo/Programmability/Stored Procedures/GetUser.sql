CREATE PROCEDURE [dbo].[GetUser]
	@UserId INT AS
BEGIN
	SELECT [UserId], [UserFirstName], [UserLastName], [UserEmail], [Login] FROM [tblUsers] WHERE UserId = @UserId;
END