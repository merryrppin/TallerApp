CREATE TABLE [dbo].[tblCotizaciones]
(
	[IdCotizacion] INT NOT NULL PRIMARY KEY,
	[IdCliente] UNIQUEIDENTIFIER NOT NULL,
	[FechaElaboracion] DATE NOT NULL,
	[IdContactoCliente] INT NOT NULL,
	[NombreContactoCliente] VARCHAR(250) NOT NULL,
	[IdResponsableCotizacion] INT NOT NULL,
	[NombreResponsableCotizacion] VARCHAR(200) NOT NULL,
	[Encabezado] VARCHAR(MAX),
	[CondicionesComerciales] VARCHAR(MAX),
	[CreationDate] DATETIME DEFAULT(GETDATE()) NOT NULL,
	[TotalBruto] DECIMAL(20,4) NOT NULL,
	[Descuentos] DECIMAL(20,4) NOT NULL,
	[SubTotal] DECIMAL(20,4) NOT NULL,
	[TotalNeto] DECIMAL(20,4) NOT NULL,

    CONSTRAINT [FK_tblCotizaciones_tblCustomers] FOREIGN KEY ([IdCliente]) REFERENCES [tblCustomers]([id])
)
