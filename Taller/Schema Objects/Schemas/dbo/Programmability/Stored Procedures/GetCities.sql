CREATE PROCEDURE [dbo].[GetCities]
AS
	SELECT country_code,country_name,state_code,state_name,city_code,city_name FROM tblCities

GO
