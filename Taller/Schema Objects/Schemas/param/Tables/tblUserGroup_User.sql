CREATE TABLE [param].[tblUserGroup_User]
(
	[UserGroup_UserId] INT NOT NULL PRIMARY KEY IDENTITY, 
    [UserId] INT NOT NULL, 
    [UserGroupId] INT NOT NULL, 
    CONSTRAINT [FK_tblUserGroup_User_tblUser] FOREIGN KEY ([UserId]) REFERENCES [dbo].[tblUsers]([UserId]), 
    CONSTRAINT [FK_tblUserGroup_User_tblUserGroup] FOREIGN KEY ([UserGroupId]) REFERENCES [param].[tblUserGroup]([UserGroupId])
)
