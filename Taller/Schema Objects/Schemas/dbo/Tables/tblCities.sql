CREATE TABLE [dbo].[tblCities]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(), 
    [citycode] INT NOT NULL, 
    [cityname] VARCHAR(100) NOT NULL, 
    [statecode] INT NOT NULL, 
    [statename] VARCHAR(100) NOT NULL, 
    [countrycode] VARCHAR(10) NOT NULL, 
    [countryname] VARCHAR(20) NOT NULL
)
