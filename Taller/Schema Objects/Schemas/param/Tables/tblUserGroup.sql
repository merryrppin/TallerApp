CREATE TABLE [param].[tblUserGroup]
(
	[UserGroupId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [Name] VARCHAR(100) NOT NULL, 
    [Description] VARCHAR(500) NULL, 
    [Active] BIT NOT NULL DEFAULT 1
)
