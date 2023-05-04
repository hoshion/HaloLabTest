-- CreateTable
CREATE TABLE "Sensor" (
    "codename" TEXT NOT NULL,
    "x" DOUBLE PRECISION NOT NULL,
    "y" DOUBLE PRECISION NOT NULL,
    "z" DOUBLE PRECISION NOT NULL,
    "outputRate" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "SensorData" (
    "id" SERIAL NOT NULL,
    "sensor" TEXT NOT NULL,
    "time" TIMESTAMP(3) NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL,
    "transparency" INTEGER NOT NULL,

    CONSTRAINT "SensorData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Fish" (
    "data_id" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,

    CONSTRAINT "Fish_pkey" PRIMARY KEY ("data_id","name")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_codename_key" ON "Sensor"("codename");

-- AddForeignKey
ALTER TABLE "Fish" ADD CONSTRAINT "Fish_data_id_fkey" FOREIGN KEY ("data_id") REFERENCES "SensorData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
