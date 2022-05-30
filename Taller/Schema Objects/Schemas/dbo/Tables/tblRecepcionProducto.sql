CREATE TABLE [dbo].[tblRecepcionProducto]
(
	[IdRecepcionProducto] INT NOT NULL PRIMARY KEY,
	[IdCliente] UNIQUEIDENTIFIER NOT NULL,
	[FechaElaboracion] DATE NOT NULL,
	[IdResponsableRecepcionProducto] INT NOT NULL,
	[NombreResponsableRecepcionProducto] VARCHAR(200) NOT NULL,
	[Notas] VARCHAR(MAX),
	[CreationDate] DATETIME DEFAULT(GETDATE()) NOT NULL,

    CONSTRAINT [FK_tblRecepcionProducto_tblCustomers] FOREIGN KEY ([IdCliente]) REFERENCES [tblCustomers]([id])
)
