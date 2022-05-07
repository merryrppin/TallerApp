CREATE PROCEDURE [dbo].[SaveOrUpdateCustomers]
	@JsonCustomers NVARCHAR(MAX)
AS

	SELECT id,[type],person_type,id_type,identification,branch_office,check_digit,[name],comercial_name,
	active,vat_responsible,fiscal_responsibilities,address,phones,contacts,comments
	INTO #tmpCustomers
	FROM OPENJSON(@JsonCustomers)
	WITH ( id uniqueidentifier '$.id',
	[type] varchar(50) '$.type',
	person_type varchar(50) '$.person_type',
	id_type NVARCHAR(MAX) '$.id_type',
	identification BIGINT '$.identification',
	branch_office int '$.branch_office',
	check_digit int '$.check_digit',
	[name] NVARCHAR(MAX) '$.name',
	comercial_name VARCHAR(100) '$.comercial_name',
	active bit '$.active',
	vat_responsible bit '$.vat_responsible',
	fiscal_responsibilities NVARCHAR(MAX) '$.fiscal_responsibilities',
	address NVARCHAR(MAX) '$.address',
	phones NVARCHAR(MAX) '$.phones',
	contacts NVARCHAR(MAX) '$.contacts',
	comments NVARCHAR(MAX) '$.comments')

	MERGE tblCustomers AS tblc
	USING (SELECT * FROM #tmpCustomers) AS SOURCE
	ON tblc.id = SOURCE.id
	WHEN MATCHED THEN
		UPDATE SET 	[type] = SOURCE.[type] ,
					person_type = SOURCE.person_type ,
					id_type = SOURCE.id_type ,
					identification = SOURCE.identification,
					branch_office = SOURCE.branch_office ,
					check_digit = SOURCE.check_digit ,
					[name] = SOURCE.[name],
					comercial_name = SOURCE.comercial_name,
					active = SOURCE.active ,
					vat_responsible = SOURCE.vat_responsible ,
					fiscal_responsibilities = SOURCE.fiscal_responsibilities ,
					address = SOURCE.address,
					phones = SOURCE.phones ,
					contacts = SOURCE.contacts ,
					comments = SOURCE.comments
	WHEN NOT MATCHED THEN 
		INSERT (id ,[type],person_type,id_type,identification,branch_office,check_digit,[name],comercial_name,active,
					vat_responsible,fiscal_responsibilities,address,phones,contacts,comments )
		VALUES (SOURCE.id ,SOURCE.[type] ,
					SOURCE.person_type ,SOURCE.id_type ,SOURCE.identification,SOURCE.branch_office ,SOURCE.check_digit ,SOURCE.[name],SOURCE.comercial_name,SOURCE.active ,SOURCE.vat_responsible ,
					SOURCE.fiscal_responsibilities,SOURCE.address,SOURCE.phones ,SOURCE.contacts ,SOURCE.comments);


GO
