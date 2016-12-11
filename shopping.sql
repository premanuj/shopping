-- phpMyAdmin SQL Dump
-- version 4.1.12
-- http://www.phpmyadmin.net
--
-- Host: 127.0.0.1
-- Generation Time: Dec 11, 2016 at 10:26 AM
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
(1, 'admin', 'admin@admin.com', '21232f297a57a5a743894a0e4a801fc3', 'admin', 'admin', 'admin');

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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=38 ;

--
-- Dumping data for table `offer_list`
--

INSERT INTO `offer_list` (`offer_id`, `list_id`, `client_id`, `freelancer_id`, `review`, `status`, `date`) VALUES
(31, 26, 1, NULL, NULL, 'open', '2016-12-11 11:28:44'),
(35, 30, 27, NULL, NULL, 'open', '2016-12-11 11:46:50'),
(36, 30, 27, 13, NULL, 'paid', '0000-00-00 00:00:00'),
(37, 30, 27, 26, NULL, 'open', '0000-00-00 00:00:00');

-- --------------------------------------------------------

--
-- Table structure for table `shopping_list`
--

CREATE TABLE IF NOT EXISTS `shopping_list` (
  `list_id` int(11) NOT NULL AUTO_INCREMENT,
  `list_name` varchar(50) NOT NULL,
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
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=31 ;

--
-- Dumping data for table `shopping_list`
--

INSERT INTO `shopping_list` (`list_id`, `list_name`, `items`, `store`, `notes`, `delivery_address`, `delivery_time_from`, `delivery_time_to`, `payment_type`, `estimated_weight`, `rating`, `user_id`, `status`) VALUES
(26, 'listname', 'item1 #& item2 #& item3 #& item4', 'item1 #& item2 #& item3 #& item4', 'notes', 'tis is deeivert address', '1899-11-30 00:00:00', '2016-11-23 00:00:00', 'cash', '1kg', '0', '27', 'in_progress'),
(27, 'listname', 'item1 #& item2 #& item3 #& item4', 'item1 #& item2 #& item3 #& item4', 'notes', 'tis is deeivert address', '1899-11-30 00:00:00', '2016-11-23 00:00:00', 'cash', '1kg', '0', '27', 'finish'),
(28, 'listname', 'item1 #& item2 #& item3 #& item4', 'item1 #& item2 #& item3 #& item4', 'notes', 'tis is deeivert address', '1899-11-30 00:00:00', '2016-11-23 00:00:00', 'cash', '1kg', '0', '27', 'active'),
(29, 'listname', 'item1 #& item2 #& item3 #& item4', 'item1 #& item2 #& item3 #& item4', 'notes', 'tis is deeivert address', '1899-11-30 00:00:00', '2016-11-23 00:00:00', 'cash', '1kg', '0', '27', 'active'),
(30, 'listname', 'item1 #& item2 #& item3 #& item4', 'item1 #& item2 #& item3 #& item4', 'notes', 'tis is deeivert address', '1899-11-30 00:00:00', '2016-11-23 00:00:00', 'cash', '1kg', '0', '27', 'active');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(80) NOT NULL,
  `status` enum('request','verified','approved','') NOT NULL DEFAULT 'request',
  `image_url` varchar(255) NOT NULL,
  `access_token` varchar(100) NOT NULL,
  `verification_token` varchar(100) NOT NULL,
  `verification_status` enum('0','1','2') NOT NULL DEFAULT '0',
  `about_me` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  UNIQUE KEY `access_token` (`access_token`),
  UNIQUE KEY `verification_token` (`verification_token`),
  KEY `verification_status` (`verification_status`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=28 ;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`user_id`, `username`, `email`, `password`, `status`, `image_url`, `access_token`, `verification_token`, `verification_status`, `about_me`) VALUES
(13, 'tamang', 'tamangashish245@gmail.com', '006cc1cd4f3d69d6e780ace2701c60f4', 'request', 'fdag', '$2a$10$nQMfSeTuele2sblOBGssKefPmB72Z7ORjaXSUqwB28ZY7555BGIP.', '$2a$10$iJ1w1qtPDmWTFx.ki1KpHe3lyNnjAxCK6iEMzXpLu2nRT/mWmgwSC', '', 'fae'),
(26, 'jmkl', 'jkl', 'c7017093ec5da2cb9ad974ffd3d2d1d7', 'request', '8ba7c02ac784f963b8352975a532b2a0', '$2a$10$ESwi3Sj4CDam3hgKjYjKQ.bWyFyMxIZlVubaXfv5Q/Ibjt9WuUFIu', '$2a$10$BIfwKxtexnwGByIMcP4GK.iOKXm8zv3LkaxL4Rq4g9P4SAEqH65sm', '0', 'mlk'),
(27, 'shiva', 'shivapandey04@gmail.com', '1a1dc91c907325c69271ddf0c944bc72', 'request', 'a80d3d8ecfb5e9d4cf39c9fbe2cc4fd5', '$2a$10$p4QLp4r8Tjfa2zkJWNCByukR7WGLJ7XExUaHeN9JSf2HYkqdG6ZSi', '$2a$10$QKuupliHWlPANHMu6qH0qOuk79/FANZvpCONNQbHrxOBBfrKKzO/y', '1', '');

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
