CREATE PROCEDURE [dbo].[UpdateSessionSiigo]
	@accesstoken VARCHAR(MAX),
	@creationdatetoken DATETIME
AS BEGIN
	UPDATE [param].[tblSessionSiigo] SET accesstoken = @accesstoken, creationdatetoken = @creationdatetoken
END
