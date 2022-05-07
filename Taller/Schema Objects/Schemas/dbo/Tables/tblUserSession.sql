CREATE TABLE [dbo].[tblUserSession]
(
	[UserSessionId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL, 
    [UserSession] UNIQUEIDENTIFIER NOT NULL, 
    [SessionCreatedUTC] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    [SessionExpire] DATETIME NULL, 
    [SessionActive] BIT NOT NULL DEFAULT 1, 
    [Ip] VARCHAR(50) NULL, 
    CONSTRAINT [FK_tblUserSession_tblUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[tblUsers]([UserId])
)
