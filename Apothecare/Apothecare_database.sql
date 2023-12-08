-- MySQL dump 10.13  Distrib 8.0.35, for Win64 (x86_64)
--
-- Host: localhost    Database: Apothecare
-- ------------------------------------------------------
-- Server version	8.0.35

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `medicineinv`
--

DROP TABLE IF EXISTS `medicineinv`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `medicineinv` (
  `MedicineID` varchar(5) NOT NULL,
  `MedicineName` varchar(30) DEFAULT NULL,
  `UnitOfMedicine` varchar(10) DEFAULT NULL,
  `Price` decimal(6,2) DEFAULT NULL,
  `ExpirationDate` date DEFAULT NULL,
  `QuantityOfMedicine` int DEFAULT NULL,
  PRIMARY KEY (`MedicineID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `medicineinv`
--

LOCK TABLES `medicineinv` WRITE;
/*!40000 ALTER TABLE `medicineinv` DISABLE KEYS */;
INSERT INTO `medicineinv` VALUES ('0001','Ibuprofen','400mg',6.00,'2025-03-21',300),('0002','Paracetamol','250mg',5.00,'2025-06-19',400),('0003','Paracetamol','500mg',7.00,'2025-06-19',500),('0004','Cetirizine','10mg',3.00,'2026-05-23',300),('0005','Diphenhydramine','25mg',5.00,'2026-08-25',200),('0006','Diphenhydramine','50mg',7.00,'2024-10-11',300),('0007','Montelukast','10mg',25.00,'2026-08-18',200),('0008','Montelukast','4mg',4.00,'2025-09-12',250),('0009','Montelukast','5mg',9.00,'2025-07-07',150),('0010','Phenobarbital','60mg',19.00,'2024-06-19',150),('0011','Azithromycin','250mg',37.00,'2027-04-14',200),('0012','Amoxicillin','250mg',13.00,'2025-05-14',230),('0013','Amoxicillin','500mg',26.00,'2026-06-16',300),('0014','Cefalexin','500mg',3.00,'2026-01-12',400),('0015','Cefixime','200mg',7.00,'2024-12-23',150),('0016','Ciprofloxacin','500mg',2.00,'2026-12-14',250),('0017','Cloxacillin','250mg',2.00,'2025-09-15',300),('0018','Cloxacillin','500mg',5.00,'2025-09-15',300),('0019','Cotrimoxazole','200mg',10.00,'2026-07-19',400),('0020','Cotrimoxazole','400mg',17.00,'2025-06-19',300),('0021','Cotrimoxazole','800mg',9.00,'2024-12-28',500),('0022','Doxycycline','100mg',5.00,'2024-12-26',400),('0023','Erythromycin','500mg',7.00,'2025-12-28',350),('0024','Metronidazole','500mg',7.00,'2027-11-11',500),('0025','Amikacin','100mg',29.00,'2026-11-11',300),('0026','Ampicillin','250mg',17.00,'2025-11-11',350),('0027','Cefadroxil','500mg',4.00,'2024-11-11',500),('0028','Cefazolin','500mg',23.00,'2025-09-14',200),('0029','Cefepime','500mg',126.00,'2025-09-26',200),('0030','Cefoxitin','1g',77.00,'2024-08-26',200),('0031','Cefuroxime','250mg',70.00,'2026-05-13',300),('0032','Cefuroxime','500mg',135.00,'2025-03-18',200),('0033','Chloramphenicol','125mg',20.00,'2026-11-19',150),('0034','Chloramphenicol','500mg',45.00,'2025-06-28',200),('0035','Clarithromycin','500mg',24.00,'2026-04-12',350),('0036','Clindamycin','300mg',13.00,'2025-12-03',200),('0037','CoAmoxiclav','500mg',8.00,'2027-08-16',450),('0038','Levofloxacin','500mg',6.00,'2026-06-18',350),('0039','Meropenem','500mg',93.00,'2025-02-16',250),('0040','Nitrofurantoin','100mg',7.00,'2026-11-13',300),('0041','Ofloxacin','200mg',6.00,'2025-05-25',300),('0042','Oxacillin','500mg',22.00,'2024-06-02',250),('0043','Rifampicin','200mg',80.00,'2026-12-17',300),('0044','Rifampicin','450mg',95.00,'2025-12-12',300),('0045','Tetracycline','500mg',16.00,'2026-04-25',400),('0046','Griseofulvin','500mg',44.00,'2027-06-12',150),('0047','Itraconazole','100mg',65.00,'2024-12-13',200),('0048','Aciclovir','200mg',9.00,'2026-07-23',500),('0049','Oseltamivir','75mg',105.00,'2025-03-29',150),('0050','Amiodarone','200mg',12.00,'2026-07-23',200),('0051','Atenolol','50mg',44.00,'2024-12-23',150),('0052','Atenolol','100mg',62.00,'2025-05-21',200),('0053','Captopril','50mg',28.00,'2025-03-07',300),('0054','Carvedilol','25mg',30.00,'2027-04-06',450),('0055','Digoxin','250mg',50.00,'2024-11-11',150),('0056','Diltiazem','60mg',65.00,'2027-05-25',150),('0057','Dobutamine','50mg',105.00,'2024-03-26',250),('0058','Isosorbide','60mg',55.00,'2025-12-29',300),('0059','Methyldopa','250mg',49.00,'2026-12-30',300),('0060','Propranolol','40mg',35.00,'2026-11-30',500),('0061','Verapamil','240mg',42.00,'2027-06-19',450),('0062','Warfarin','5mg',11.00,'2027-06-19',450),('0063','Dexamethasone','250mg',37.00,'2025-06-23',300),('0064','Dexamethasone','500mg',70.00,'2024-12-30',150),('0065','Biperiden','2mg',24.00,'2025-04-23',230),('0066','Chlorpromazine','100mg',16.00,'2026-07-12',250),('0067','Haloperidol','5mg',35.00,'2027-05-16',200),('0068','Ceelin','100mg',280.00,'2026-04-19',150),('0069','Metoclopramide','10mg',22.00,'2025-05-21',200),('0070','Glibenclamide','5mg',18.00,'2026-07-28',160),('0071','Gliclazide','80mg',20.00,'2025-06-12',170),('0072','Glipizide','5mg',26.00,'2026-02-14',270),('0073','Metformin','500mg',39.00,'2025-09-24',340),('0074','Amlodipine','10mg',36.00,'2026-12-12',200),('0075','Aspirin','80mg',9.00,'2027-03-12',450),('0076','Clonidine','150mg',56.00,'2026-08-26',260),('0077','Enalapril','10mg',42.00,'2027-01-06',140),('0078','Felodipine','5mg',48.00,'2025-01-23',250),('0079','Hydrochlorothiazide','25mg',11.00,'2027-04-12',330),('0080','Losartan','50mg',57.00,'2026-03-25',180),('0081','Metoprolol','100mg',45.00,'2026-08-12',180),('0082','Nifedipine','10mg',26.00,'2027-03-11',200),('0083','Nimodipine','30mg',76.00,'2025-12-29',200),('0084','Fluticasone','125mg',215.00,'2026-11-28',120),('0085','Salbutamol','100mg',106.00,'2025-12-23',300),('0086','Decolgen','25mg',8.00,'2027-05-25',500),('0087','Neozep','2mg',8.00,'2027-06-13',500),('0088','Cilostazol','100mg',88.00,'2026-03-14',190),('0089','Furosemide','40mg',51.00,'2026-04-15',150),('0090','Spironolactone','50mg',65.00,'2026-09-24',150),('0091','Propan','100mg',27.00,'2027-08-13',200),('0092','Alaxan','200mg',9.00,'2027-12-17',500),('0093','Dolfenal','250mg',19.00,'2027-12-01',500),('0094','Ponstan','500mg',21.00,'2026-05-07',300),('0095','Tuseran','325mg',11.00,'2027-06-12',500),('0096','Diatabs','2mg',9.00,'2027-12-30',500),('0097','Solmux','500mg',13.00,'2027-11-11',500),('0098','Gardan','500mg',24.00,'2026-06-02',300),('0099','Buscopan','10mg',24.00,'2027-12-25',500),('0100','Advil','200mg',13.00,'2027-04-12',350),('0101','Rexidol','500mg',10.00,'2026-09-14',300),('0102','Erythromycin','500mg',19.00,'2026-10-12',300),('0103','MosegorVita','500mg',55.00,'2026-10-13',250),('0104','Lagundi','600mg',9.00,'2026-10-13',300),('0105','Symdex','325mg',6.00,'2026-10-12',300);
/*!40000 ALTER TABLE `medicineinv` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `salesofmedicine`
--

DROP TABLE IF EXISTS `salesofmedicine`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `salesofmedicine` (
  `SalesID` int NOT NULL AUTO_INCREMENT,
  `SalesDate` date DEFAULT NULL,
  `UnitPrice` decimal(6,2) DEFAULT NULL,
  `TotalPrice` decimal(6,2) DEFAULT NULL,
  `MedicineID` varchar(5) DEFAULT NULL,
  PRIMARY KEY (`SalesID`),
  KEY `MedicineID` (`MedicineID`),
  CONSTRAINT `salesofmedicine_ibfk_1` FOREIGN KEY (`MedicineID`) REFERENCES `medicineinv` (`MedicineID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `salesofmedicine`
--

LOCK TABLES `salesofmedicine` WRITE;
/*!40000 ALTER TABLE `salesofmedicine` DISABLE KEYS */;
/*!40000 ALTER TABLE `salesofmedicine` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `user` (
  `UserId` int NOT NULL AUTO_INCREMENT,
  `UserEmail` varchar(30) DEFAULT NULL,
  `Username` varchar(255) NOT NULL,
  `Password` varchar(255) NOT NULL,
  `CreatedAt` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`UserId`),
  UNIQUE KEY `Username` (`Username`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,'jmelopre@yahoo.com','Jake','scrypt:32768:8:1$gfCv4NhtI3snJi8O$f5bba510b150383276b806ddc94e07318bf01ea3ad50667e981de7681fd0d8b8f3eb089a180311340f46747820cbfb5d2b5ba3822f66a6ca9d4047ddcfc8e40d','2023-12-07 05:14:36');
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-12-07 14:31:06
