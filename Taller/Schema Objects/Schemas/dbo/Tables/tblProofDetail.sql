CREATE TABLE tblProofDetail
(
ProofDetailId INT IDENTITY PRIMARY KEY,
ProofId INT,
QuotationId INT,
ProductQuotationId UNIQUEIDENTIFIER,
OriginalQuantity INT,
QuantityPending INT,
UnitValue DECIMAL(20,4) NOT NULL,
TotalValue DECIMAL(20,4) NOT NULL, 
TotalDiscount DECIMAL(20,4) NOT NULL,
CONSTRAINT [FK_tblProofDetail_tblProof] FOREIGN KEY ([ProofId]) REFERENCES [tblProof]([ProofId]), 
CONSTRAINT [FK_tblProofDetail_tblCotizaciones] FOREIGN KEY ([QuotationId]) REFERENCES [tblCotizaciones]([IdCotizacion]), 
CONSTRAINT [FK_tblProofDetail_tblProductosCotizacion] FOREIGN KEY ([ProductQuotationId]) REFERENCES [tblProductosCotizacion]([IdProductoCotizacion])
)