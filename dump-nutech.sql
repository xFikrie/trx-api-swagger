--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

-- Started on 2025-04-14 23:41:50

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: pg_database_owner
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO pg_database_owner;

--
-- TOC entry 4873 (class 0 OID 0)
-- Dependencies: 4
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: pg_database_owner
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 220 (class 1259 OID 27994)
-- Name: balance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.balance (
    balance_id character varying NOT NULL,
    user_id character varying NOT NULL,
    saldo integer
);


ALTER TABLE public.balance OWNER TO postgres;

--
-- TOC entry 218 (class 1259 OID 27980)
-- Name: banner; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.banner (
    banner_id character varying NOT NULL,
    name character varying,
    image character varying,
    description character varying
);


ALTER TABLE public.banner OWNER TO postgres;

--
-- TOC entry 219 (class 1259 OID 27987)
-- Name: services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.services (
    service_id character varying NOT NULL,
    code character varying,
    name character varying,
    icon character varying,
    tarif integer
);


ALTER TABLE public.services OWNER TO postgres;

--
-- TOC entry 221 (class 1259 OID 28001)
-- Name: transaction_history; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_history (
    invoice_number character varying NOT NULL,
    transaction_type character varying,
    description character varying,
    total_amount integer,
    created_on timestamp without time zone,
    user_id character varying NOT NULL
);


ALTER TABLE public.transaction_history OWNER TO postgres;

--
-- TOC entry 217 (class 1259 OID 27973)
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    user_id character varying NOT NULL,
    email character varying,
    first_name character varying,
    last_name character varying,
    password character varying,
    profile_image character varying
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- TOC entry 4866 (class 0 OID 27994)
-- Dependencies: 220
-- Data for Name: balance; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.balance VALUES ('a908f240-4a56-4e03-ab54-958d2d03c44a', '7172be73-aec1-4a23-9bdf-a3589e9c3b35', 632000);


--
-- TOC entry 4864 (class 0 OID 27980)
-- Dependencies: 218
-- Data for Name: banner; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.banner VALUES ('d05f3153-e2f5-45c6-a329-cdf03c62368c', 'Banner 2', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-2.png', 'Lerem Ipsum Dolor sit amet');
INSERT INTO public.banner VALUES ('8038febc-60d2-4818-842f-66cd97782d15', 'Banner 1', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-1.png', 'Lerem Ipsum Dolor sit amet');
INSERT INTO public.banner VALUES ('c5dce961-cd33-4f0e-b31e-e4762ccec8bb', 'Banner 3', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-3.png', 'Lerem Ipsum Dolor sit amet');
INSERT INTO public.banner VALUES ('1215b216-0a77-4d00-8e01-33ccac0ef648', 'Banner 4', 'https://minio.nutech-integrasi.com/take-home-test/banner/Banner-4.png', 'Lerem Ipsum Dolor sit amet');


--
-- TOC entry 4865 (class 0 OID 27987)
-- Dependencies: 219
-- Data for Name: services; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.services VALUES ('8322f409-70a6-4ace-a15a-c4a68fe9cfd2', 'PAJAK', 'Pajak PBB', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO public.services VALUES ('fa667141-be81-42dd-b1cb-c0b74350002a', 'PLN', 'Listrik', 'https://nutech-integrasi.app/dummy.jpg', 10000);
INSERT INTO public.services VALUES ('f66d5a15-641e-440f-9444-4ff8c0e9672c', 'PDAM', 'PDAM Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO public.services VALUES ('9ab8beb8-f84d-4d43-bda6-8b18b9322f43', 'PULSA', 'Pulsa', 'https://nutech-integrasi.app/dummy.jpg', 40000);
INSERT INTO public.services VALUES ('5b071c12-3380-4025-9669-ec69dd84457c', 'PGN', 'PGN Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO public.services VALUES ('62f662d9-16d9-4bd1-a966-a170404907a8', 'MUSIK', 'Musik Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO public.services VALUES ('ed22c962-7049-47d5-bb98-8c58b6a51c09', 'TV', 'TV Berlangganan', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO public.services VALUES ('e358fff6-d9ba-44c6-9ec4-9b92b289bc36', 'PAKET_DATA', 'Paket data', 'https://nutech-integrasi.app/dummy.jpg', 50000);
INSERT INTO public.services VALUES ('53aeb840-96ed-4a39-b3eb-1ae2db46239b', 'VOUCHER_GAME', 'Voucher Game', 'https://nutech-integrasi.app/dummy.jpg', 100000);
INSERT INTO public.services VALUES ('af77db1c-14b9-4377-a651-5fd0f6f68a66', 'VOUCHER_MAKANAN', 'Voucher Makanan', 'https://nutech-integrasi.app/dummy.jpg', 100000);
INSERT INTO public.services VALUES ('04638655-378a-42da-8908-2d072c365fa2', 'QURBAN', 'Qurban', 'https://nutech-integrasi.app/dummy.jpg', 200000);
INSERT INTO public.services VALUES ('3c44c4ad-d3af-407f-a66c-f580a698aa1a', 'ZAKAT', 'Zakat', 'https://nutech-integrasi.app/dummy.jpg', 300000);


--
-- TOC entry 4867 (class 0 OID 28001)
-- Dependencies: 221
-- Data for Name: transaction_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.transaction_history VALUES ('INV1744638918905', 'TOPUP', 'Top Up balance', 1000000, '2025-04-14 20:55:18.905', '7172be73-aec1-4a23-9bdf-a3589e9c3b35');
INSERT INTO public.transaction_history VALUES ('INV1744640548801', 'TOPUP', 'Top Up balance', 2000, '2025-04-14 21:22:28.801', '7172be73-aec1-4a23-9bdf-a3589e9c3b35');
INSERT INTO public.transaction_history VALUES ('INV1744641116528', 'TOPUP', 'Top Up balance', 30000, '2025-04-14 21:31:56.528', '7172be73-aec1-4a23-9bdf-a3589e9c3b35');
INSERT INTO public.transaction_history VALUES ('INV1744642254266', 'PAYMENT', 'Qurban', 200000, '2025-04-14 21:50:54.266', '7172be73-aec1-4a23-9bdf-a3589e9c3b35');
INSERT INTO public.transaction_history VALUES ('INV1744642298386', 'PAYMENT', 'Qurban', 200000, '2025-04-14 21:51:38.386', '7172be73-aec1-4a23-9bdf-a3589e9c3b35');


--
-- TOC entry 4863 (class 0 OID 27973)
-- Dependencies: 217
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" VALUES ('5d92e5f3-be7d-4e20-91f6-9a01295a61cc', 'asd@gmail.com', 'as', 'asd', 'p@asda', NULL);
INSERT INTO public."user" VALUES ('28ce71f4-19d3-4e90-90ba-6869e0146d74', 'asd@gmail.com', 'any', 'any', 'P@ssw0rd', NULL);
INSERT INTO public."user" VALUES ('3bcf9dd6-db9d-46a7-8e81-bd611991bc22', 'asdasd@gmail.com', 'any', 'any', 'b5ebd7a3a8c76b2d9f4430baa0ca4898', NULL);
INSERT INTO public."user" VALUES ('29448b41-922a-4adb-a4a9-9f6dfbc6b43f', 'qwe@gmail.com', 'any', 'any', 'b5ebd7a3a8c76b2d9f4430baa0ca4898', NULL);
INSERT INTO public."user" VALUES ('750172aa-a6db-460c-86e7-95eecba2d7d3', 'qwe1@gmail.com', 'any', 'any', 'e42bd5a5cb08d66efc843e06ce7f37ec', NULL);
INSERT INTO public."user" VALUES ('1dbe08e5-2a2f-4965-99d5-4e76f9c2b771', 'qwe2@gmail.com', 'any', 'any', 'b5ebd7a3a8c76b2d9f4430baa0ca4898', NULL);
INSERT INTO public."user" VALUES ('a261f366-de72-4111-b120-f26ca249b670', 'qwe3@gmail.com', 'any', 'any', '42675a8658404a4b64dea3282459f86d', NULL);
INSERT INTO public."user" VALUES ('7172be73-aec1-4a23-9bdf-a3589e9c3b35', 'qwe4@gmail.com', 'halox', '123', '42675a8658404a4b64dea3282459f86d', 'boredapeyachtclub_1642817958102_0.jpg-1744648292452-461a3d95-dea1-4b81-843f-4860e7931d80.jpg');


--
-- TOC entry 4717 (class 2606 OID 28000)
-- Name: balance balance_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.balance
    ADD CONSTRAINT balance_pk PRIMARY KEY (balance_id);


--
-- TOC entry 4713 (class 2606 OID 27986)
-- Name: banner banner_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.banner
    ADD CONSTRAINT banner_pk PRIMARY KEY (banner_id);


--
-- TOC entry 4715 (class 2606 OID 27993)
-- Name: services services_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.services
    ADD CONSTRAINT services_pk PRIMARY KEY (service_id);


--
-- TOC entry 4711 (class 2606 OID 27979)
-- Name: user user_pk; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pk PRIMARY KEY (user_id);


-- Completed on 2025-04-14 23:41:50

--
-- PostgreSQL database dump complete
--

