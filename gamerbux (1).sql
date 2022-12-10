-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Хост: 127.0.0.1:3306
-- Время создания: Ноя 24 2022 г., 10:43
-- Версия сервера: 8.0.27
-- Версия PHP: 7.4.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `gamerbux`
--

-- --------------------------------------------------------

--
-- Структура таблицы `categories`
--

DROP TABLE IF EXISTS `categories`;
CREATE TABLE IF NOT EXISTS `categories` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(128) COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `categories`
--

INSERT INTO `categories` (`id`, `category_name`) VALUES
(1, 'Laptops'),
(2, 'Parts');

-- --------------------------------------------------------

--
-- Структура таблицы `order_item`
--

DROP TABLE IF EXISTS `order_item`;
CREATE TABLE IF NOT EXISTS `order_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `order_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ordered_product_id_idx` (`product_id`),
  KEY `fk_order_id_idx` (`order_id`)
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


--
-- Триггеры `order_item`
--
DROP TRIGGER IF EXISTS `decreaseAmountOnOrderInsert`;
DELIMITER $$
CREATE TRIGGER `decreaseAmountOnOrderInsert` AFTER INSERT ON `order_item` FOR EACH ROW UPDATE `products` SET `amountLeft` = `amountLeft` - 1 WHERE `id` = NEW.product_id
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Структура таблицы `products`
--

DROP TABLE IF EXISTS `products`;
CREATE TABLE IF NOT EXISTS `products` (
  `id` int NOT NULL AUTO_INCREMENT,
  `categoryId` int NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `price` float NOT NULL,
  `description` text COLLATE utf8mb4_general_ci NOT NULL,
  `amountLeft` int NOT NULL,
  `ImageUrl` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `fk_category_id_idx` (`categoryId`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `products`
--

INSERT INTO `products` (`id`, `categoryId`, `name`, `price`, `description`, `amountLeft`, `ImageUrl`, `createdAt`) VALUES
(1, 1, 'Nešiojamas kompiuteris Lenovo Legion 5 15ACH6 82JW009XPB, AMD Ryzen 5 5600H, 8 GB, 512 GB, 15.6 \"', 803.3, 'NEŠIOJAMAS KOMPIUTERIS LENOVO LEGION 5 15ACH6 82JW00A6PB, AMD RYZEN 5 5600H, 8 GB, 512 GB, 15.6 \"\r\n\r\nDidžiausias našumas, įspūdingas akumuliatoriaus veikimo laikas\r\nSakoma, kad gyvenimas pilnas kompromisų. Sakoma, kad tame pačiame nešiojamajame kompiuteryje negali būti didelio našumo ir ilgo akumuliatoriaus veikimo laiko. Sakoma, kad didelio našumo žaidimų nešiojamasis kompiuteris turi būti didelis, gremėzdiškas ir sunkus. Jie klysta. Dabar galite mėgautis elitiniu žaidimų našumu ploname ir lengvame nešiojamajame kompiuteryje, kurio akumuliatorius veikia nuostabiai ilgai, dėka naujųjų AMD Ryzen™ 5000 H serijos mobiliųjų procesorių. Daugiau niekada nebesileiskite į kompromisus dėl savo žaidimų nešiojamojo kompiuterio.\r\n\r\nAukščiausias našumas žaidėjams ir kūrėjams\r\nNVIDIA GeForce RTX™ 30 serijos nešiojamųjų kompiuterių GPU užtikrina aukščiausią našumą žaidėjams ir kūrėjams. Juose naudojama Ampere – NVIDIA 2-osios kartos RTX architektūra – su naujais Ray Tracing branduoliais, Tensor branduoliais ir srautiniais daugiaprocesoriais, užtikrinančiais didžiulį našumo šuolį. Patirkite realistiškiausią spindulių sekimo grafiką, pažangiausias naujas funkcijas ir dirbtinio intelekto galią ploname ir lengvame dizaine.\r\n\r\nXbox Game Pass: atraskite savo mėgstamiausią žaidimą\r\nŽaiskite daugiau nei 100 aukštos kokybės kompiuterinių žaidimų už vieną mažą mėnesinę įmoką. Įskaičiuota EA Play paslauga suteikia dar daugiau iš mėgstamų žaidimų – prieigą prie geriausių Electronic Arts žaidimų asmeniniame kompiuteryje, daugiau apdovanojimų ir daugiau išskirtinio turinio! Naudokitės Xbox programa asmeniniame kompiuteryje ir atsisiųskite bei žaiskite naujus žaidimus tą pačią dieną, kai jie išleidžiami. Žaidimų biblioteka nuolat papildoma, todėl visada turėsite ką naujo žaisti.\r\n\r\nNaujo lygio šiluminis valdymas\r\nDėl Legion 5 (15\" AMD) Legion Coldfront 3.0 yra vėsus ir tylus. Naujausia versija, pratęsianti maksimalaus taktinio dažnio su nuliniu droseliu per ilgas sesijas palikimą, dar labiau pakelia kartelę dėl pažangios įsiurbimo sistemos, dvigubo ventiliatoriaus konstrukcijos, su keturių kanalų išmetimo sistemomis, ir patobulintomis šiluminėmis briaunomis bei įsiurbimo angomis po kiekvienu klaviatūros jungikliu ir radiatoriais. Naujasis išmanusis režimas naudoja dirbtinį intelektą, kad reikliausi žaidimai veiktų sklandžiai ir be jokios delsos, o Q Control 4.0 leidžia pasirinkti turbininį maitinimą arba ilgesnį akumuliatoriaus veikimo laiką.\r\n\r\nPažvelkite į Legion AI Engine\r\nLegion AI Engine yra kol kas novatoriškiausias mūsų žaidimų sprendimas. Į Legion 5 (15\" AMD) įtrauktas jo automatinio optimizavimo režimas protingai nustato jūsų paleidžiamus žaidimus ir optimizuoja sistemos veikimą dinamiškai paskirstydamas CPU/GPU galią. Rezultatas – didžiausias įmanomas FPS, nesvarbu, ar jūsų žaidimas yra intensyvus CPU, ar GPU. Naudodami Auto-Detect režimą galėsite mėgautis maksimalia kadrų kaita 16 populiariausių AAA žaidimų, išskirtinai skirtų Legion įrenginiams.\r\n\r\nGreitas atnaujinimas – greitiems refleksams\r\nNesvarbu, mėgstate akinamai greitą žaidimų ekrano atnaujinimo dažnį ir atsako laiką ar hiperrealistinį vaizdą, Legion 5 (15\" AMD) jums patiks. Pagilinkite savo įsijautimą į žaidimus su iki 15\" WQHD plačiaekraniu ekranu, sukurtu iki Dolby Vision™ grafinei pirotechnikai ir 100 % sRGB spalvų tikslumui, arba padidinkite savo konkurencinį pranašumą su stulbinančiu 165 Hz siekiančiu atnaujinimo greičiu ir 3 ms atsako laiku per Overdrive palaikymą.\r\n\r\nTikslus sprendimas\r\nTaktilinė, jautri, tiksli. Kompiuteryje Legion 5 (15\" AMD) įdiegta Legion TrueStrike klaviatūra. TrueStrike užtikrina puikų išdėstymą su specialiais medijos klavišais, atskira skaičių klaviatūra, didesniais rodyklių klavišais ir vientisais takeliais, apšviestais ryškiu baltu arba pasirenkamu RGB apšvietimu. Šiose išskirtinėse Legion klaviatūrose, sukurtose iš ilgametės žaidimų patirties, yra minkšto nusileidimo jungikliai su 1,5 mm klavišų eiga, kuriuose naudojamas antrojo perėjimo dizainas, t. y. kiekvienas paspaudimas yra gilesnis ir vienodai stiprus, todėl įvesties patirtis yra geresnė.\r\n\r\n3D garsas žaidimams\r\nŽaidėjai turi specialių garso poreikių. Juk tipiniam kompiuterio naudotojui nereikia jaudintis, kad jį užgaus ir sugėdins kažkieno žaidimų kanalas. Nahimic smarkiai pagerina jūsų žaidimų patirtį, nes suteikia precedento neturintį, įtraukiantį 3D garsą, sukurtą specialiai žaidėjams. Susikurkite konkurencinį pranašumą prieš priešus naudodamiesi garso sekimo funkcija, kurioje pateikiamas vaizdinis indikatorius, nurodantis kryptis, iš kurių sklinda dominuojantys garsai. Patirkite krištolo skaidrumo bendravimą su komandos draugais kaip niekada anksčiau. Nahimic ne tik leidžia jums žaisti žaidimą – jis leidžia jums juo gyventi.', 21, 'https://ksd-images.lt/display/aikido/cache/6c3141dd1a450f96d09b12b51bd5b881.jpeg?h=2000&w=2000', '2022-11-20 15:01:47'),
(2, 1, 'Nešiojamas kompiuteris TUF A15 FA506IHR-HN047W, AMD Ryzen 5 4600H, 8 GB, 512 GB, 15.6 \"', 719.25, 'NEŠIOJAMAS KOMPIUTERIS TUF A15 FA506IHR-HN047W, AMD RYZEN 5 4600H, 8 GB, 512 GB, 15.6 \"\r\n\r\n\r\nKOMPAKTIŠKAS DIZAINAS\r\nNaujasis korpuso dizainas yra 4,5 % mažesnis nei ankstesnės kartos, tačiau dėl to neatsisakoma pilno dydžio klaviatūros.\r\n\r\nBŪSENOS ATASKAITA\r\nKeturių krypčių indikatoriai, įmontuoti klaviatūros dugne, leidžia stebėti pagrindinę sistemos informaciją.\r\n\r\nJUTIKLINIS KILIMĖLIS\r\n26 % didesnis jutiklinis skydelis taip pat pasižymi anime įkvėptu atspalviu.\r\n\r\nPASIRUOŠĘS VISKAM\r\nSu TUF Gaming A15 iš karto įsitraukite į veiksmą. Su Windows 11 operacine sistema, AMD Ryzen™ 7 6800H procesoriumi ir iki 16 GB stulbinamai greitos 4800 MHz DDR5 operatyviosios atminties, su srautiniu duomenų siuntimu ir daugiafunkcėmis užduotimis susidorosite lengvai. Pasitelkite visą nešiojamojo kompiuterio grafikos procesoriaus GeForce RTX™ 3070 žaidimų našumą su specialiu MUX jungikliu. Kai jūsų žaidimų biblioteka užsipildys, tuščias M.2 NVMe PCIe Gen 4x4 SSD lizdas leis lengvai atnaujinti saugyklos talpą', 31, 'https://ksd-images.lt/display/aikido/cache/e4eb38368d18c49a28385d6894378171.jpeg?h=2000&w=2000', '2022-11-20 16:32:31'),
(3, 1, 'Nešiojamas kompiuteris Lenovo IdeaPad Gaming 3 15ACH6 82K200QYPB, AMD Ryzen 5 5600H, 16 GB, 512 GB, 15.6 \"', 783.02, 'More for less\r\nThe IdeaPad 3 is priced as an everyday-use laptop—but engineered as something much more. 10th Gen Intel® Core™ processing—as well as powerful memory and storage options—means this PC delivers beyond expectations. Bonus: The numeric keypad will speed up your productivity, whether you’re working on your personal budget or preparing a spreadsheet.\r\n\r\nGreat for entertainment\r\nNarrow bezels on two sides make the most of the 15.6\" IdeaPad 3’s up to HD touchscreen display—and give the laptop itself a clean, contemporary look. Dual speakers with Dolby Audio™ optimize sound so you’ll love what you hear as well as what you see.\r\n\r\nPrivacy at your fingertips\r\nThe IdeaPad 3 laptop is packed with advanced technology, but sometimes the straightforward approach works best. That’s why we designed the webcam with a physical shutter. When you’re done with your video chat, simply close the shutter—and make your webcam hacker-proof.', 32, 'https://ksd-images.lt/display/aikido/cache/9e454c94d7a6afde0ca5040b683d5222.jpeg?h=2000&w=2000', '2022-11-20 16:48:47'),
(4, 2, 'Vaizdo plokštė MSI GeForce RTX 3060 GAMING X 12G, 12 GB, GDDR6', 479, 'Vaizdo plokštė MSI GeForce RTX 3060 GAMING X 12G, 12 GB, GDDR6', 7, 'https://ksd-images.lt/display/aikido/store/911821f8f51c852e25e4e0f9df98d175.jpg?h=2000&w=2000', '2022-11-20 17:52:19');

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(512) COLLATE utf8mb4_general_ci NOT NULL,
  `email` varchar(64) COLLATE utf8mb4_general_ci NOT NULL,
  `firstname` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `lastname` varchar(30) COLLATE utf8mb4_general_ci NOT NULL,
  `isAdmin` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `username`, `password`, `email`, `firstname`, `lastname`, `isAdmin`, `createdAt`) VALUES
(1, 'Test1', '$2b$10$v4UlJcVrHyO7.11X3oCWQevW1GHpki60QUXcKePNBlD2sgpgwHlkC ', 'test1@gmail.com', 'Marco', 'Polo', 0, '2022-11-20 15:13:42'),
(4, 'Test2', '$2b$10$1AFrGw2Ag1pRsE2lX2iKoezcHbV4012gDtgAMWnMElab4B8jNrqVy', 'test2@gmail.com', 'John', 'Doe', 0, '2022-11-21 20:57:51'),
(5, 'testttt', '$2b$10$J9uF.Tyvpiw2b5q6Upak4uu7te4nWaI0FuJ9JOmncdiiFnRs8RKMy', 'test@gmail.com', 'Biba', 'Bux', 0, '2022-11-21 20:59:07'),
(6, 'BiiiibaBuux', '$2b$10$nZK2u.JwEBXMr/UbNP88nOiT/EWZRF2x46Q1dKrfblAGrfgBCtLN.', 'biba@bux.com', 'Biiiba', 'Buuux', 0, '2022-11-21 21:07:26'),
(7, 'Biiiibiabiabux', '$2b$10$0c8fdWVPWwk3Yj.7PRQO2uM4lD0mMC/.uGjar.3rItkomxwIpP/Ma', 'buxbiba@bux.com', 'Test', 'Test', 0, '2022-11-21 21:08:25'),
(8, 'Gatsby', '$2b$10$jQkmQI33RfMuwe0yD3t90uSgMX0aOn0AJ65oSiYJ.MMPt1Si7PTR6', 'bettertest@gmail.com', 'Harry', 'Potter', 0, '2022-11-22 22:22:54');

-- --------------------------------------------------------

--
-- Структура таблицы `user_order`
--

DROP TABLE IF EXISTS `user_order`;
CREATE TABLE IF NOT EXISTS `user_order` (
  `id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `delivery_adress` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci,
  `status` varchar(50) COLLATE utf8mb4_general_ci NOT NULL DEFAULT 'Created',
  `step` tinyint NOT NULL DEFAULT '0',
  `order_price` double NOT NULL,
  `placed_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `closed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_ordered_userid_idx` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Дамп данных таблицы `user_order`
--

INSERT INTO `user_order` (`id`, `user_id`, `delivery_adress`, `status`, `step`, `order_price`, `placed_at`, `closed_at`) VALUES
(1, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:11:05', NULL),
(2, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:14:38', NULL),
(3, 8, 'Some adress', 'Paid', 1, 1262.02, '2022-11-24 00:19:00', NULL),
(4, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:38:27', NULL),
(5, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:39:21', NULL),
(6, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:43:07', NULL),
(7, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:45:14', NULL),
(8, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 00:45:48', NULL),
(9, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 04:57:12', NULL),
(10, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 05:05:43', NULL),
(11, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 05:05:53', NULL),
(12, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 05:06:23', NULL),
(13, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 05:17:59', NULL),
(14, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 05:49:50', NULL),
(15, 8, 'Some adress', 'Created', 0, 1262.02, '2022-11-24 05:52:21', NULL),
(16, 8, '{\"firstname\":\"Harry\",\"lastname\":\"Potter\"}', 'Paid', 1, 479, '2022-11-24 06:01:47', NULL),
(17, 8, 'Some adress', 'Paid', 0, 1262.02, '2022-11-24 06:57:54', NULL),
(18, 8, 'Some adress', 'Paid', 1, 479, '2022-11-24 06:59:53', NULL),
(19, 8, 'Some adress', 'Created', 0, 2349.06, '2022-11-24 09:01:23', NULL),
(20, 8, 'Some adress', 'Created', 0, 803.3, '2022-11-24 09:02:33', NULL),
(21, 8, 'Some adress', 'Created', 0, 803.3, '2022-11-24 09:03:47', NULL),
(22, 8, '{\"firstname\":\"Harry\",\"lastname\":\"Potter\",\"address1\":\"Hey\",\"address2\":\"How\",\"city\":\"Are\",\"state\":\"You\",\"zip\":\"Doing\",\"country\":\"mate\"}', 'Paid', 1, 803.3, '2022-11-24 09:06:48', NULL),
(23, 8, NULL, 'Created', 0, 783.02, '2022-11-24 09:11:34', NULL),
(24, 8, NULL, 'Created', 0, 803.3, '2022-11-24 09:13:04', NULL),
(25, 8, '{\"firstname\":\"Harry\",\"lastname\":\"Potter\",\"address1\":\"asdsa\",\"address2\":\"dsadasd\",\"city\":\"asdasd\",\"state\":\"asdasd\",\"zip\":\"sadsa\",\"country\":\"sadasd\"}', 'Paid', 1, 783.02, '2022-11-24 09:18:03', NULL);

--
-- Ограничения внешнего ключа сохраненных таблиц
--

--
-- Ограничения внешнего ключа таблицы `order_item`
--
ALTER TABLE `order_item`
  ADD CONSTRAINT `fk_order_id` FOREIGN KEY (`order_id`) REFERENCES `user_order` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_ordered_product_id` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_category_id` FOREIGN KEY (`categoryId`) REFERENCES `categories` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Ограничения внешнего ключа таблицы `user_order`
--
ALTER TABLE `user_order`
  ADD CONSTRAINT `fk_ordered_userid` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
