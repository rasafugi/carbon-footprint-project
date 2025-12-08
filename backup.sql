-- MySQL dump 10.13  Distrib 8.0.44, for Win64 (x86_64)
--
-- Host: localhost    Database: carbon_project
-- ------------------------------------------------------
-- Server version	8.0.44

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `carbon_logs`
--

DROP TABLE IF EXISTS `carbon_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `carbon_logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `log_type` enum('Quick','Detailed') COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `input_data` json NOT NULL,
  `total_carbon` float NOT NULL,
  `breakdown` json NOT NULL,
  `suggestions` text COLLATE utf8mb4_unicode_520_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `carbon_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `carbon_logs`
--

LOCK TABLES `carbon_logs` WRITE;
/*!40000 ALTER TABLE `carbon_logs` DISABLE KEYS */;
INSERT INTO `carbon_logs` VALUES (1,1,'Quick','{\"diet\": \"balanced\", \"commute\": \"scooter_gas\", \"shopping\": \"medium\"}',1761,'{\"diet\": 1387.0, \"transport\": 230.0, \"consumption\": 144.0}','飲食碳排是您的主要來源。嘗試響應「週一無肉日」，減少紅肉攝取。','2025-12-08 14:12:57'),(2,1,'Quick','{\"diet\": \"vegetarian\", \"commute\": \"bike\", \"shopping\": \"high\"}',979.5,'{\"diet\": 547.5, \"transport\": 0.0, \"consumption\": 432.0}','飲食碳排是您的主要來源。嘗試響應「週一無肉日」，減少紅肉攝取。','2025-12-08 14:17:28'),(3,1,'Quick','{\"diet\": \"vegetarian\", \"commute\": \"bike\", \"shopping\": \"high\"}',979.5,'{\"diet\": 547.5, \"transport\": 0.0, \"consumption\": 432.0}','飲食碳排是您的主要來源。嘗試響應「週一無肉日」，減少紅肉攝取。','2025-12-08 14:40:29'),(4,1,'Quick','{\"diet\": \"meat_heavy\", \"commute\": \"public\", \"shopping\": \"medium\"}',2691.5,'{\"diet\": 2372.5, \"transport\": 175.0, \"consumption\": 144.0}','選擇在地當季食材，減少食物里程帶來的隱含碳排。','2025-12-08 14:40:39'),(5,1,'Quick','{\"diet\": \"balanced\", \"commute\": \"scooter_gas\", \"shopping\": \"medium\"}',1761,'{\"diet\": 1387.0, \"transport\": 230.0, \"consumption\": 144.0}','減少購買瓶裝水與手搖飲，自備環保杯是降低垃圾量的第一步。','2025-12-08 16:31:27');
/*!40000 ALTER TABLE `carbon_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `emission_records`
--

DROP TABLE IF EXISTS `emission_records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `emission_records` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `activity_name` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `co2_amount` float NOT NULL,
  `record_date` date DEFAULT (curdate()),
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `emission_records_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `emission_records`
--

LOCK TABLES `emission_records` WRITE;
/*!40000 ALTER TABLE `emission_records` DISABLE KEYS */;
/*!40000 ALTER TABLE `emission_records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `email` varchar(100) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `full_name` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `gender` enum('Male','Female','Other') COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `gender_other` varchar(50) COLLATE utf8mb4_unicode_520_ci DEFAULT NULL,
  `city` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `district` varchar(20) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `birthdate` date NOT NULL,
  `occupation` varchar(50) COLLATE utf8mb4_unicode_520_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_520_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rasa','asd@gmail.com','scrypt:32768:8:1$pSwIuulPw94rTnxw$50861a5b954f0b54f4f0446badd5808fb62c64ad98899272e19ff8f8707d772539fd76bc62e26017fb615804dba0bd779a79d276ec3b3cc611437c406d9c97f9','梅銪虔','Male',NULL,'高雄市','仁武區','1999-07-30','其他 / 學生 / 待業','2025-12-08 08:16:35');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-09  0:40:04
