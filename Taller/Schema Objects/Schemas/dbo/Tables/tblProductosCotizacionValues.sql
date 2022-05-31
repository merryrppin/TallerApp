CREATE TABLE [dbo].[tblProductosCotizacionValues]
(
	[IdProductosCotizacionValues] UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
	[IdProductoCotizacion] UNIQUEIDENTIFIER NOT NULL,
	[IdProductProperty] UNIQUEIDENTIFIER NOT NULL,
	[ValueOption] VARCHAR(MAX), 
    CONSTRAINT [FK_tblProductosCotizacionValues_tblProductosCotizacion] FOREIGN KEY ([IdProductoCotizacion]) REFERENCES [tblProductosCotizacion]([IdProductoCotizacion]),
    CONSTRAINT [FK_tblProductosCotizacionValues_tblProductProperties] FOREIGN KEY ([IdProductProperty]) REFERENCES [tblProductProperties]([IdProductProperty]), 
)
