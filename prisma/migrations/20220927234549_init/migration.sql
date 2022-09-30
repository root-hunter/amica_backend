-- CreateTable
CREATE TABLE "Paziente" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codiceFiscale" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "dataNascita" DATETIME NOT NULL,
    "ms" INTEGER NOT NULL,
    "gradoIstruzione" TEXT NOT NULL,
    "lavoro" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Terapista" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "codiceFiscale" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cognome" TEXT NOT NULL,
    "specialistica" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "CategoriaEsercizio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Esercizio" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "categoriaEsercizioId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Esercizio_categoriaEsercizioId_fkey" FOREIGN KEY ("categoriaEsercizioId") REFERENCES "CategoriaEsercizio" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "EsercizoPaziente" (
    "pazienteId" TEXT NOT NULL,
    "esercizioId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("pazienteId", "esercizioId"),
    CONSTRAINT "EsercizoPaziente_pazienteId_fkey" FOREIGN KEY ("pazienteId") REFERENCES "Paziente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "EsercizoPaziente_esercizioId_fkey" FOREIGN KEY ("esercizioId") REFERENCES "Esercizio" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "PatologiaPaziente" (
    "pazienteId" TEXT NOT NULL,
    "patologiaId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("pazienteId", "patologiaId"),
    CONSTRAINT "PatologiaPaziente_pazienteId_fkey" FOREIGN KEY ("pazienteId") REFERENCES "Paziente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "PatologiaPaziente_patologiaId_fkey" FOREIGN KEY ("patologiaId") REFERENCES "Patologia" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Patologia" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "Farmaco" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nome" TEXT NOT NULL,
    "descrizione" TEXT,
    "effettiCollaterali" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "FarmacoPaziente" (
    "pazienteId" TEXT NOT NULL,
    "farmacoId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    PRIMARY KEY ("pazienteId", "farmacoId"),
    CONSTRAINT "FarmacoPaziente_pazienteId_fkey" FOREIGN KEY ("pazienteId") REFERENCES "Paziente" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "FarmacoPaziente_farmacoId_fkey" FOREIGN KEY ("farmacoId") REFERENCES "Farmaco" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Paziente_codiceFiscale_key" ON "Paziente"("codiceFiscale");

-- CreateIndex
CREATE UNIQUE INDEX "Terapista_codiceFiscale_key" ON "Terapista"("codiceFiscale");
