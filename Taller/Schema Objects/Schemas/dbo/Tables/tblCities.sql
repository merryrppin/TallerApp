CREATE TABLE [dbo].[tblCities]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(), 
    [city_code] INT NOT NULL, 
    [city_name] VARCHAR(100) NOT NULL, 
    [state_code] INT NOT NULL, 
    [state_name] VARCHAR(100) NOT NULL, 
    [country_code] VARCHAR(10) NOT NULL, 
    [country_name] VARCHAR(20) NOT NULL
)
