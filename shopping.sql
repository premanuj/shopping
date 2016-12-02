-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2016 at 12:39 PM
-- Server version: 5.6.16
-- PHP Version: 5.5.11

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Database: `shopping`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int(11) NOT NULL,
  `adminname` varchar(50) NOT NULL,
  `email` varchar(80) NOT NULL,
  `password` varchar(50) NOT NULL,
  `access_token` varchar(100) NOT NULL,
  `verification_token` varchar(100) NOT NULL,
  `verification_status` varchar(100) NOT NULL,
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `adminname` (`adminname`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `access_token` (`access_token`),
  UNIQUE KEY `verification_token` (`verification_token`),
  UNIQUE KEY `verification_status` (`verification_status`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`admin_id`, `adminname`, `email`, `password`, `access_token`, `verification_token`, `verification_status`) VALUES
(0, 'admin', 'admin@admin.com', 'admin', 'admin', 'admin', 'admin');

-- --------------------------------------------------------

--
-- Table structure for table `offer_list`
--

CREATE TABLE IF NOT EXISTS `offer_list` (
  `offer_id` int(11) NOT NULL AUTO_INCREMENT,
  `list_id` int(11) NOT NULL,
  `client_id` int(11) DEFAULT NULL,
  `freelancer_id` int(11) DEFAULT NULL,
  `review` varchar(255) DEFAULT NULL,
  `status` enum('open','expired','accepted','paid') NOT NULL DEFAULT 'open',
  `date` datetime NOT NULL,
  PRIMARY KEY (`offer_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=4 ;

--
-- Dumping data for table `offer_list`
--

INSERT INTO `offer_list` (`offer_id`, `list_id`, `client_id`, `freelancer_id`, `review`, `status`, `date`) VALUES
(1, 1, 1, NULL, 'this is review of client with id=1', 'open', '2016-11-23 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_list`
--

CREATE TABLE IF NOT EXISTS `shopping_list` (
  `list_id` int(11) NOT NULL AUTO_INCREMENT,
  `items` varchar(255) NOT NULL,
  `store` varchar(255) NOT NULL,
  `notes` varchar(255) NOT NULL,
  `delivery_address` varchar(255) NOT NULL,
  `delivery_time_from` datetime NOT NULL,
  `delivery_time_to` datetime NOT NULL,
  `payment_type` enum('paypal','cash','twint','') NOT NULL,
  `estimated_weight` varchar(255) NOT NULL,
  `rating` enum('0','1','2','3','4','5') NOT NULL DEFAULT '0',
  `user_id` varchar(255) NOT NULL,
  `status` enum('active','in_progress','finish','deactive') NOT NULL DEFAULT 'active',
  PRIMARY KEY (`list_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=5 ;

--
-- Dumping data for table `shopping_list`
--

INSERT INTO `shopping_list` (`list_id`, `items`, `store`, `notes`, `delivery_address`, `delivery_time_from`, `delivery_time_to`, `payment_type`, `estimated_weight`, `rating`, `user_id`, `status`) VALUES
(1, 'LCD', 'store1', 'i need this item', 'this is my address', '1899-11-30 00:00:00', '2016-11-23 00:00:00', 'cash', '15kg', '2', '1', 'finish');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(50) NOT NULL,
  `status` enum('request','verified','approved','') NOT NULL DEFAULT 'request',
  `image_url` varchar(255) NOT NULL,
  `access_token` varchar(100) NOT NULL,
  `verification_token` varchar(100) NOT NULL,
  `verification_status` enum('0','1') NOT NULL DEFAULT '0',
  `about_me` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `access_token` (`access_token`),
  UNIQUE KEY `verification_token` (`verification_token`),
  KEY `verification_status` (`verification_status`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=21 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `email`, `password`, `status`, `image_url`, `access_token`, `verification_token`, `verification_status`, `about_me`) VALUES
(1, 'username', 'email', '5f4dcc3b5aa765d61d8327deb882cf99', 'request', 'profile_img', 'fds', 'fds', '', 'dfsgsgs bfdg'),
(2, 'hjol', 'jo', '079e31e321b4644d505252f0abd6aedd', 'request', 'hojl', '$2a$10$L.DxiwruVuyj9JVkaWkmxejFoEClEQ08/maTid.4.CONb0JVjTs/S', '$2a$10$ECzp8v0600MVKnNyrVNn4Oq5R.eNoSHHosMjRrIm6DSLmma1dW/4S', '', 'hojl'),
(3, 'nk', 'njk', 'b83e31c14f7f81509f751fba24b71367', 'request', 'nk', '$2a$10$knaZ0WSa01tggPvHjv37o.hpyUEHZybYr3fCtSXsOV7grItD/fCbq', '$2a$10$l0SOHpMgsoHWozLlHY7vG.RRGyKhTPJG1N7SSrkvDvtzKrNayBrr2', '', 'nk'),
(11, 'jol', 'joljolkjoj', '016c0199d0e92d47d1fe790304fac459', 'request', 'kjmol', '$2a$10$qv9m84DN1bDcZYdorRyFY.7I1TMRY03CWGGuzXcP4fmOFIiJEmCrO', '$2a$10$peuKIHjrxFI2LuM9fNt6EOV7NjezDaAAma/2tznf/PURXQtCX1R.C', '', 'kjmol'),
(13, 'tamang', 'tamangashish245@gmail.com', '006cc1cd4f3d69d6e780ace2701c60f4', 'request', 'fdag', '$2a$10$nQMfSeTuele2sblOBGssKefPmB72Z7ORjaXSUqwB28ZY7555BGIP.', '$2a$10$iJ1w1qtPDmWTFx.ki1KpHe3lyNnjAxCK6iEMzXpLu2nRT/mWmgwSC', '', 'fae'),
(14, 'joljhukl', 'jolhikhikj', '2b9f8d99cbf934dd581c8e2ccf8a26bf', 'request', 'jolk', '$2a$10$izz3jd4dameMPyMbmUF/2uzZYqxPNk5WDiX34m/0gmmK4Cd2nod4u', '$2a$10$04OlWdimavBp69ACPpsZDu2D7Ubnnj4ttOzDnlZDXtcHWvbFRbpl6', '0', 'kjmol'),
(16, 'bnkj', 'fdsnkj', '59e604d06e9b282b882a36fb742faa94', 'request', 'kjnm ', '$2a$10$PFpI3bfuwxlQeEeOMGVmke0Z0PCZx69ojMe..PpI0aYuj.F9d16jK', '$2a$10$HkQDWS1fyXkvRYpMalNIb.gIqhwhIfvE7PxqhhHWgUnQYR70PTdZy', '0', ' kj,mn '),
(20, 'jiohnkjnoljk', 'mesubedianuj@gmail.com', 'b763cc85153b17d5c7e6f9a91b9e2e8f', 'request', 'mnlk', '$2a$10$/iJEQoguN7/FQYMuB9bbAu0YzWHw1wzC3AEI61uHoPNHPb0ClQbHy', '$2a$10$rWZcPH9.vlCs.Sln4nXwh.sT4NfKdoAgAySrqMFHwxlSxs98dvt8W', '0', 'mlk');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
