-- CreateTable
CREATE TABLE "Subscription" (
    "chan" TEXT NOT NULL PRIMARY KEY,
    "user" TEXT NOT NULL,
    "guild" TEXT NOT NULL,
    "created" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "History" (
    "identifier" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "time" TEXT NOT NULL,
    "lat" REAL NOT NULL,
    "lon" REAL NOT NULL,
    "depth" INTEGER NOT NULL,
    "magnitude" REAL NOT NULL
);
