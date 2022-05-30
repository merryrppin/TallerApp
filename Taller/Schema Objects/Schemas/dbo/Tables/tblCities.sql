CREATE TABLE [dbo].[tblCities]
(
	[id] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(), 
    [city_code] VARCHAR(50) NOT NULL, 
    [city_name] VARCHAR(100) NOT NULL, 
    [state_code] VARCHAR(50) NOT NULL, 
    [state_name] VARCHAR(100) NOT NULL, 
    [country_code] VARCHAR(10) NOT NULL, 
    [country_name] VARCHAR(20) NOT NULL
)
