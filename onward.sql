-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Aug 04, 2023 at 06:06 PM
-- Server version: 8.0.31
-- PHP Version: 8.0.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `onward`
--

-- --------------------------------------------------------

--
-- Table structure for table `containers`
--

DROP TABLE IF EXISTS `containers`;
CREATE TABLE IF NOT EXISTS `containers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `reference_alt` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `docto_no` varchar(255) DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL,
  `status_bpo` varchar(255) DEFAULT NULL,
  `bpo_livemapurl` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `LiveMapUrl` varchar(255) DEFAULT NULL,
  `order_time` varchar(255) DEFAULT NULL,
  `close_date` varchar(255) DEFAULT NULL,
  `checkout_date` varchar(255) DEFAULT NULL,
  `departure_data` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  `entry_number` varchar(255) DEFAULT NULL,
  `total_amount` varchar(255) DEFAULT NULL,
  `fda` varchar(255) DEFAULT NULL,
  `cbp` varchar(255) DEFAULT NULL,
  `usda` varchar(255) DEFAULT NULL,
  `lfd` varchar(255) DEFAULT NULL,
  `lfd_fee` varchar(255) DEFAULT NULL,
  `estimated_date` varchar(255) DEFAULT NULL,
  `delivery_date` varchar(255) DEFAULT NULL,
  `obs` varchar(255) DEFAULT NULL,
  `ContainerNumber` varchar(255) DEFAULT NULL,
  `Message` varchar(255) DEFAULT NULL,
  `StatusId` varchar(255) DEFAULT NULL,
  `ReferenceNo` varchar(255) DEFAULT NULL,
  `ShippingLine` varchar(255) DEFAULT NULL,
  `FromCountry` varchar(255) DEFAULT NULL,
  `Pol` varchar(255) DEFAULT NULL,
  `Pod` varchar(255) DEFAULT NULL,
  `Vessel` varchar(255) DEFAULT NULL,
  `VesselIMO` varchar(255) DEFAULT NULL,
  `GateOutDate` varchar(255) DEFAULT NULL,
  `FormatedTransitTime` varchar(255) DEFAULT NULL,
  `last_api_request` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  `container` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `containers`
--

INSERT INTO `containers` (`id`, `uid`, `reference`, `reference_alt`, `source`, `company`, `docto_no`, `customer`, `status_bpo`, `bpo_livemapurl`, `Status`, `LiveMapUrl`, `order_time`, `close_date`, `checkout_date`, `departure_data`, `trans_type`, `entry_number`, `total_amount`, `fda`, `cbp`, `usda`, `lfd`, `lfd_fee`, `estimated_date`, `delivery_date`, `obs`, `ContainerNumber`, `Message`, `StatusId`, `ReferenceNo`, `ShippingLine`, `FromCountry`, `Pol`, `Pod`, `Vessel`, `VesselIMO`, `GateOutDate`, `FormatedTransitTime`, `last_api_request`, `createdAt`, `updatedAt`, `container`) VALUES
(1, '6458e7eb-d4d3-4be8-b365-399ae1e38b46', '0016_TN_ELMANA_FL_2023', '_017', 'EUFORIA', 'CGI', NULL, 'SURTIDORA EL MANA LLC', 'TRANSITO TERR. A PTO.', NULL, NULL, NULL, NULL, '2023-06-30', '2023-07-28', '2023-08-04', NULL, '', NULL, '', '', '', '', '', '2023-08-08', '', 'Se cuenta con nueva programación de zarpe.', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-03 18:35:43', '2023-08-03 20:07:57', NULL),
(3, 'df080ecb-b6e8-448a-9090-0743f084dbf1', 'CA-0010', '_002', 'EUFORIA', 'CGI', NULL, 'ROYAL L&C DISTRIBUTION INC', 'ENTREGADO', NULL, 'Discharged', 'https://shipsgo.com/live-map-container-tracking?query=MRSU5103923', NULL, '2023-04-17', '2023-05-02', '2023-05-12', NULL, 'HG8-1592622-2', NULL, 'FDA - EXAM', 'OK', 'OK', '2023-05-26', '', '2023-06-14', '2023-06-14', 'Revisión de FDA el miercoles 12 de julio, FDA se llevo muestras del producto, aún no está liberado al 100%', 'MRSU5103923', 'Success', '50', 'CA-0010 / ROYAL L&C DISTRIBUTION INC', 'SEALAND', 'GUATEMALA', 'PUERTO QUETZAL', 'LOS ANGELES', 'MAERSK NORTHAMPTON', '9215919', '2023-06-02', '10 days', '2023-08-03 12:47', '2023-08-03 18:47:13', '2023-08-03 18:47:13', NULL),
(4, '9a2963cb-d36a-4693-ae39-3be2cc62be77', 'WA-0019', '_005', 'EUFORIA', 'CGI', NULL, 'EL QUETZAL TIENDA LATINA MINI MART', 'ENTREGADO', NULL, 'Discharged', 'https://shipsgo.com/live-map-container-tracking?query=TRHU5233853', NULL, '2023-05-03', '2023-05-04', '2023-05-21', NULL, 'HG8-1592667-7', NULL, 'LIBERADO', 'OK', 'OK', '2023-06-20', '', '2023-06-28', '2023-06-28', 'Se dividió la carga en dos unidades por cuestión de peso. La primera se entrego el 28/06 y la segunda el 30/06. ', 'TRHU5233853', 'Success', '50', 'WA-0019 / EL QUETZAL TIENDA LATINA MINI MART', 'SEALAND', 'GUATEMALA', 'PUERTO QUETZAL', 'OAKLAND', 'SEALAND BALBOA', '9376012', '2023-06-13', '19 days', '2023-08-03 12:47', '2023-08-03 18:47:49', '2023-08-03 18:47:49', NULL),
(5, '3088b1e1-9f58-4127-8d8d-491c6353a6ce', 'FL-20037', '_016', 'EUFORIA', 'CGI', NULL, 'ANTIGUA FOOD DISTRIBUTION LLC', 'TRANSITO TERR. A PTO.', NULL, NULL, NULL, NULL, '2023-06-28', '2023-07-28', '2023-08-04', NULL, '', NULL, '', '', '', '', '', '2023-08-08', '', 'Se cuenta con nueva programación de zarpe. ', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-03 18:48:17', '2023-08-03 18:48:17', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `histories`
--

DROP TABLE IF EXISTS `histories`;
CREATE TABLE IF NOT EXISTS `histories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `reference` varchar(255) DEFAULT NULL,
  `reference_alt` varchar(255) DEFAULT NULL,
  `source` varchar(255) DEFAULT NULL,
  `company` varchar(255) DEFAULT NULL,
  `docto_no` varchar(255) DEFAULT NULL,
  `customer` varchar(255) DEFAULT NULL,
  `status_bpo` varchar(255) DEFAULT NULL,
  `bpo_livemapurl` varchar(255) DEFAULT NULL,
  `Status` varchar(255) DEFAULT NULL,
  `LiveMapUrl` varchar(255) DEFAULT NULL,
  `order_time` varchar(255) DEFAULT NULL,
  `close_date` varchar(255) DEFAULT NULL,
  `checkout_date` varchar(255) DEFAULT NULL,
  `departure_data` varchar(255) DEFAULT NULL,
  `trans_type` varchar(255) DEFAULT NULL,
  `entry_number` varchar(255) DEFAULT NULL,
  `total_amount` varchar(255) DEFAULT NULL,
  `fda` varchar(255) DEFAULT NULL,
  `cbp` varchar(255) DEFAULT NULL,
  `usda` varchar(255) DEFAULT NULL,
  `lfd` varchar(255) DEFAULT NULL,
  `lfd_fee` varchar(255) DEFAULT NULL,
  `estimated_date` varchar(255) DEFAULT NULL,
  `delivery_date` varchar(255) DEFAULT NULL,
  `obs` varchar(255) DEFAULT NULL,
  `container` varchar(255) DEFAULT NULL,
  `ContainerNumber` varchar(255) DEFAULT NULL,
  `Message` varchar(255) DEFAULT NULL,
  `StatusId` varchar(255) DEFAULT NULL,
  `ReferenceNo` varchar(255) DEFAULT NULL,
  `ShippingLine` varchar(255) DEFAULT NULL,
  `FromCountry` varchar(255) DEFAULT NULL,
  `Pol` varchar(255) DEFAULT NULL,
  `Pod` varchar(255) DEFAULT NULL,
  `Vessel` varchar(255) DEFAULT NULL,
  `VesselIMO` varchar(255) DEFAULT NULL,
  `GateOutDate` varchar(255) DEFAULT NULL,
  `FormatedTransitTime` varchar(255) DEFAULT NULL,
  `last_api_request` varchar(255) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `histories`
--

INSERT INTO `histories` (`id`, `uid`, `reference`, `reference_alt`, `source`, `company`, `docto_no`, `customer`, `status_bpo`, `bpo_livemapurl`, `Status`, `LiveMapUrl`, `order_time`, `close_date`, `checkout_date`, `departure_data`, `trans_type`, `entry_number`, `total_amount`, `fda`, `cbp`, `usda`, `lfd`, `lfd_fee`, `estimated_date`, `delivery_date`, `obs`, `container`, `ContainerNumber`, `Message`, `StatusId`, `ReferenceNo`, `ShippingLine`, `FromCountry`, `Pol`, `Pod`, `Vessel`, `VesselIMO`, `GateOutDate`, `FormatedTransitTime`, `last_api_request`, `createdAt`, `updatedAt`) VALUES
(1, '675284e2-469a-4fc4-9215-86135d2cbf5e', 'FL-20031', '_012', 'EUFORIA', 'CGI', NULL, 'SURTIDORA EL MANA LCC', 'PAGADO', NULL, 'Untracked', 'https://shipsgo.com/live-map-container-tracking?query=KOSU4513268', NULL, '2023-06-01', '2023-06-22', '2023-06-26', NULL, 'HG8-1593311-1', NULL, 'OK', 'OK', 'OK', '2023-07-03', '', '2023-07-03', '2023-07-03', 'Se realizo la entrega el día lunes 03/07 de 19 pallets/ 20 pallets.  Pallet restante 20/20 fue entregada el 11/07 ', 'KOSU4513268', 'KOSU4513268', 'Success', '60', 'FL-20031 / SURTIDORA EL MANA LCC', 'OTHERS', '', '', '', '', '', '', '', '2023-08-03 15:38', '2023-08-03 21:38:05', '2023-08-03 21:38:05'),
(2, '79598203-da9f-4cbb-9eb8-266be8826894', 'WA-0025', '_011', 'EUFORIA', 'CGI', NULL, 'EL QUETZAL TIENDA LATINA MINI MART', 'ANULADO', NULL, NULL, NULL, NULL, '2023-05-19', '', '', NULL, '', NULL, '', '', '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-03 21:38:58', '2023-08-03 21:38:58'),
(3, 'b4865400-0c28-47cc-a1e5-dc4699114f12', 'MD-0024', '_013', 'EUFORIA', 'CGI', NULL, 'ALFA INTERNATIONAL FOOD DISTRIBUTION LLC', 'ANULADO', NULL, NULL, NULL, NULL, '2023-06-03', '', '', NULL, '', NULL, '', '', '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-03 21:39:26', '2023-08-03 21:39:26'),
(4, 'f90b2702-00d5-4513-9866-e21428f4dd83', 'FL-0012', '_003', 'EUFORIA', 'CGI', NULL, 'SURTIDORA EL MANA LCC', 'PAGADO', NULL, 'Untracked', 'https://shipsgo.com/live-map-container-tracking?query=KOSU4931000', NULL, '2023-03-22', '2023-04-18', '2023-04-21', NULL, 'HG8-1592447-4', NULL, 'LIBERADO', 'OK', 'OK', '2023-05-01', '', '2023-04-28', '2023-04-28', '', 'KOSU4931000', 'KOSU4931000', 'Success', '60', 'FL-0012 / SURTIDORA EL MANA LCC', 'OTHERS', '', '', '', '', '', '', '', '2023-08-03 15:39', '2023-08-03 21:39:53', '2023-08-03 21:39:53'),
(5, '875013f5-10e5-4f41-a458-8b5cb18fc0da', 'DE-0018', '_004', 'EUFORIA', 'CGI', NULL, 'EL NOPALITO DISTRIBUTORS INC', 'PAGADO', NULL, 'Untracked', 'https://shipsgo.com/live-map-container-tracking?query=KOSU4942175', NULL, '2023-03-22', '2023-04-14', '2023-04-18', NULL, 'HG8-1592421-9', NULL, 'LIBERADO', 'OK', 'OK', '2023-04-29', '', '2023-04-27', '2023-04-27', '', 'KOSU4942175', 'KOSU4942175', 'Success', '60', 'DE-0018 / EL NOPALITO DISTRIBUTORS INC', 'OTHERS', '', '', '', '', '', '', '', '2023-08-03 15:40', '2023-08-03 21:40:30', '2023-08-03 21:40:30'),
(6, '39914929-e2f6-4a8b-bd17-599011726a8d', 'MD-0015', '_001', 'EUFORIA', 'CGI', NULL, 'ALFA INTERNATIONAL FOOD DISTRIBUTION  LLC', 'PAGADO', NULL, 'Untracked', 'https://shipsgo.com/live-map-container-tracking?query=KOSU4956939', NULL, '2023-03-24', '2023-04-14', '2023-04-18', NULL, 'HG8-1592421-9', NULL, 'LIBERADO', 'OK', 'OK', '2023-04-29', '', '2023-04-27', '2023-04-27', '', 'KOSU4956939', 'KOSU4956939', 'Success', '60', 'MD-0015 / ALFA INTERNATIONAL FOOD DISTRIBUTION, LLC.', 'OTHERS', '', '', '', '', '', '', '', '2023-08-03 15:41', '2023-08-03 21:41:39', '2023-08-03 21:41:39'),
(7, '83ad53cd-da71-4b1a-81b7-486fe97fccc3', 'FL-0021', '_009', 'EUFORIA', 'CGI', NULL, 'ANTIGUA FOOD DISTRIBUTION LLC', 'PAGADO', NULL, 'Untracked', 'https://shipsgo.com/live-map-container-tracking?query=KOSU4971548', NULL, '2023-05-18', '2023-05-18', '2023-05-21', NULL, 'HG8-1592855-8', NULL, 'LIBERADO', 'OK', 'OK', '2023-05-30', '', '2023-05-31', '2023-05-31', '', 'KOSU4971548', 'KOSU4971548', 'Success', '60', 'FL-0021 / ANTIGUA FOOD DISTRIBUTION LLC', 'OTHERS', '', '', '', '', '', '', '', '2023-08-03 15:42', '2023-08-03 21:42:04', '2023-08-03 21:42:04'),
(8, 'd2ba71d5-6c12-4805-8d68-affff64425a2', 'CA-0022', '_010', 'EUFORIA', 'CGI', NULL, 'DEL VALLE IMPORT & EXPORT 3  INC', 'PAGADO', NULL, 'Discharged', 'https://shipsgo.com/live-map-container-tracking?query=MRSU3978607', NULL, '2023-05-09', '2023-05-30', '2023-06-10', NULL, 'HG8-1593106-5', NULL, 'LIBERADO', 'OK', 'OK', '2023-07-03', '', '2023-07-03', '2023-07-03', '', 'MRSU3978607', 'MRSU3978607', 'Success', '50', 'CA-0022 / DEL VALLE IMPORT & EXPORT 3, INC', 'SEALAND', 'GUATEMALA', 'PUERTO QUETZAL', 'LOS ANGELES', 'MAERSK NEWCASTLE', '9215878', '2023-07-01', '12 days', '2023-08-03 15:42', '2023-08-03 21:42:45', '2023-08-03 21:42:45'),
(9, 'd345ae92-c04c-4919-81c8-281d04a96f63', 'DE-0023', '_008', 'EUFORIA', 'CGI', NULL, 'EL NOPALITO DISTRIBUTORS INC', 'PAGADO', NULL, 'Untracked', 'https://shipsgo.com/live-map-container-tracking?query=KOSU4923792', NULL, '2023-05-05', '2023-05-18', '2023-05-21', NULL, 'HG8-1592855-8', NULL, 'LIBERADO', 'OK', 'OK', '2023-05-30', '', '2023-06-02', '2023-06-02', '', 'KOSU4923792', 'KOSU4923792', 'Success', '60', 'DE-0023 / EL NOPALITO DISTRIBUTORS INC', 'OTHERS', '', '', '', '', '', '', '', '2023-08-03 15:43', '2023-08-03 21:43:11', '2023-08-03 21:43:11'),
(10, '915fde8b-7418-44e2-848b-9ddab5c710af', 'DE-20035', '_014', 'EUFORIA', 'CGI', NULL, 'EL NOPALITO DISTRIBUTORS INC', 'ANULADO', NULL, NULL, NULL, NULL, '2023-06-07', '', '', NULL, '', NULL, '', '', '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-03 21:43:33', '2023-08-03 21:43:33'),
(11, '07bcc1b3-61da-4fdf-8a0e-72972435efae', 'MD-20036 ', '_015', 'EUFORIA', 'CGI', NULL, 'ALFA INTERNATIONAL FOOD DISTRIBUTION LLC', 'ANULADO', NULL, NULL, NULL, NULL, '2023-06-08', '', '', NULL, '', NULL, '', '', '', '', '', '', '', '', '', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2023-08-03 21:44:00', '2023-08-03 21:44:00');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `role` varchar(255) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `last_login` datetime DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uid`, `name`, `email`, `role`, `password`, `last_login`, `createdAt`, `updatedAt`) VALUES
(2, 'aBC4zYE0AtMOsC4eYXGXruwhAMG3', NULL, 'testing@testing.com', 'user', '123456789', NULL, '2023-08-03 17:44:32', '2023-08-03 17:44:32'),
(3, 'WYWWeHnbKge7skG7nqUQ6vdTGde2', NULL, 'jtest@devstack.us', 'admin', '123456', NULL, '2023-08-03 17:44:56', '2023-08-03 17:44:56');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
