--
-- Database: `vmail`
--
CREATE DATABASE IF NOT EXISTS `vmail` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `vmail`;

-- --------------------------------------------------------

--
-- Table structure for table `accounts`
--

CREATE TABLE `accounts` (
  `id` int(10) UNSIGNED NOT NULL,
  `username` varchar(64) NOT NULL,
  `domain` varchar(150) NOT NULL,
  `password` varchar(199) NOT NULL,
  `quota` int(10) UNSIGNED DEFAULT '0',
  `enabled` tinyint(1) DEFAULT '0',
  `sendonly` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `aliases`
--

CREATE TABLE `aliases` (
  `id` int(10) UNSIGNED NOT NULL,
  `source_username` varchar(64) NOT NULL,
  `source_domain` varchar(150) NOT NULL,
  `destination_username` varchar(64) NOT NULL,
  `destination_domain` varchar(150) NOT NULL,
  `enabled` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `domains`
--

CREATE TABLE `domains` (
  `id` int(10) UNSIGNED NOT NULL,
  `domain` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tlspolicies`
--

CREATE TABLE `tlspolicies` (
  `id` int(10) UNSIGNED NOT NULL,
  `domain` varchar(150) NOT NULL,
  `policy` enum('none','may','encrypt','dane','dane-only','fingerprint','verify','secure') NOT NULL,
  `params` varchar(150) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `adminuser`
--

CREATE TABLE `adminuser` (
  `id` int(10) UNSIGNED NOT NULL,
  `us` varchar(150) NOT NULL,
  `pw` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `domainaccess`
--

CREATE TABLE `domainaccess` (
  `user` int(10) UNSIGNED NOT NULL,
  `domain` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
--
-- Indexes for dumped tables
--

--
-- Indexes for table `accounts`
--
ALTER TABLE `accounts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`,`domain`),
  ADD KEY `domain` (`domain`);

--
-- Indexes for table `aliases`
--
ALTER TABLE `aliases`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `source_username` (`source_username`,`source_domain`,`destination_username`,`destination_domain`),
  ADD KEY `source_domain` (`source_domain`);

--
-- Indexes for table `domains`
--
ALTER TABLE `domains`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`);

--
-- Indexes for table `tlspolicies`
--
ALTER TABLE `tlspolicies`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `domain` (`domain`);

--
-- Indexes for table `adminuser`
--
ALTER TABLE `adminuser`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `domainaccess`
--
ALTER TABLE `domainaccess`
  ADD PRIMARY KEY (`user`,`domain`),
  ADD KEY `domainid` (`domain`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `accounts`
--
ALTER TABLE `accounts`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `aliases`
--
ALTER TABLE `aliases`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `domains`
--
ALTER TABLE `domains`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tlspolicies`
--
ALTER TABLE `tlspolicies`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `adminuser`
--
ALTER TABLE `adminuser`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `accounts`
--
ALTER TABLE `accounts`
  ADD CONSTRAINT `accounts_ibfk_1` FOREIGN KEY (`domain`) REFERENCES `domains` (`domain`);

--
-- Constraints for table `aliases`
--
ALTER TABLE `aliases`
  ADD CONSTRAINT `aliases_ibfk_1` FOREIGN KEY (`source_domain`) REFERENCES `domains` (`domain`);


--
-- Constraints for table `domainaccess`
--
ALTER TABLE `domainaccess`
  ADD CONSTRAINT `domainid` FOREIGN KEY (`domain`) REFERENCES `domains` (`id`);

ALTER TABLE `domainaccess`
  ADD CONSTRAINT `adminuserid` FOREIGN KEY (`user`) REFERENCES `adminuser` (`id`);


--
-- Dumping data for table `adminuser`
--

INSERT INTO `adminuser` (`id`, `us`, `pw`) VALUES
(1, 'admin', 'c7ad44cbad762a5da0a452f9e854fdc1e0e7a52a38015f23f3eab1d80b931dd472634dfac71cd34ebc35d16ab7fb8a90c81f975113d6c7538dc69dd8de9077ec');
