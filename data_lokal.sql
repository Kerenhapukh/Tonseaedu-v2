--
-- PostgreSQL database dump
--

\restrict tbqP0pr7RKAMbw0ncyf7KqczzTwftSVT9zJI06VDTJSoKgjWU3MboSzwfSqo2Up

-- Dumped from database version 18.3
-- Dumped by pg_dump version 18.3

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
-- Data for Name: categories; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.categories (id, name, slug, description) VALUES (1, 'Angka', 'angka', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (2, 'anggota tubuh', 'anggota-tubuh', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (3, 'umum', 'umum', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (4, 'Sapaan', 'sapaan', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (5, 'Waktu', 'waktu', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (6, 'Kata Kerja', 'kata-kerja', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (7, 'Keluarga', 'keluarga', NULL);
INSERT INTO public.categories (id, name, slug, description) VALUES (8, 'Kosakata Dasar', 'dasar', 'Belajar kata-kata sehari-hari bahasa Tonsea.');


--
-- Data for Name: kosakata; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (1, 'Esa', 'Satu ', 'https://youtu.be/TUGon9EEHcU?si=4hyi1O07-Y4Me2AF', 1, '2026-05-27 06:24:55.107', '2026-05-27 06:26:25.954', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (56, 'kesudu', 'Sepupu', '/uploads/audio/1784552471928_keluarga_7.mp3', 7, '2026-07-20 13:01:11.943', '2026-07-20 13:01:11.943', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (2, 'Dua', 'Rua', '/uploads/audio/1783950024998_voice_2.mp3', 1, '2026-05-27 06:25:13.685', '2026-07-13 13:40:25.009', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (5, 'Tedu', 'Tiga', '/uploads/audio/1783950055458_voice_3.mp3', 1, '2026-07-13 13:40:55.465', '2026-07-13 13:40:55.465', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (6, 'Epat', 'Empat', '/uploads/audio/1783950127620_voice_4.mp3', 1, '2026-07-13 13:42:07.627', '2026-07-13 13:42:07.627', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (7, 'Dima', 'Lima', '/uploads/audio/1783950146692_voice_5.mp3', 1, '2026-07-13 13:42:26.7', '2026-07-13 13:42:26.7', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (8, 'Enem', 'Enam', '/uploads/audio/1783950165224_voice_6.mp3', 1, '2026-07-13 13:42:45.233', '2026-07-13 13:42:45.233', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (9, 'Pitu', 'Tujuh', '/uploads/audio/1783950183222_voice_7.mp3', 1, '2026-07-13 13:43:03.243', '2026-07-13 13:43:03.243', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (11, 'Siouw', 'Sembilan ', '/uploads/audio/1783950224513_voice_9.mp3', 1, '2026-07-13 13:43:44.522', '2026-07-13 13:43:44.522', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (10, 'Wolu', 'Delapan', '/uploads/audio/1783950200924_voice_8.mp3', 1, '2026-07-13 13:43:20.93', '2026-07-13 13:45:29.958', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (59, 'Kuman', 'Makan', '/audio/kuman.mp3', 8, '2026-07-20 14:31:22.665', '2026-07-20 14:31:22.665', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (60, 'Tudu', 'Tidur', '/audio/tudu.mp3', 8, '2026-07-20 14:31:22.665', '2026-07-20 14:31:22.665', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (61, 'Meimo', 'Mari / Ayo', '/audio/meimo.mp3', 8, '2026-07-20 14:31:22.665', '2026-07-20 14:31:22.665', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (20, 'Wondo Leos', 'Selamat Pagi', '/uploads/audio/1784194850426_sapaan_1.mp3', 4, '2026-07-16 09:40:50.437', '2026-07-16 09:40:50.437', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (21, 'Tabea', 'Selamat Siang', '/uploads/audio/1784194880797_sapaan_2.mp3', 4, '2026-07-16 09:41:20.893', '2026-07-16 09:41:20.893', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (22, 'Tabea', 'Selamat Malam', '/uploads/audio/1784194900221_sapaan_2.mp3', 4, '2026-07-16 09:41:40.233', '2026-07-16 09:41:40.233', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (23, 'Epa Abar', 'Apa Kabar', '/uploads/audio/1784194933520_sapaan_3.mp3', 4, '2026-07-16 09:42:13.53', '2026-07-16 09:42:13.53', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (24, 'Pudu Leos', 'Terima Kasih', '/uploads/audio/1784194962873_sapaan_4.mp3', 4, '2026-07-16 09:42:42.887', '2026-07-16 09:42:42.887', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (25, 'Kudu Daket', 'Sama-sama', '/uploads/audio/1784194987629_sapaan_5.mp3', 4, '2026-07-16 09:43:07.64', '2026-07-16 09:43:07.64', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (26, 'Meke Ampung', 'Minta Maaf', '/uploads/audio/1784195012381_sapaan_6.mp3', 4, '2026-07-16 09:43:32.396', '2026-07-16 09:43:32.396', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (27, 'wu''uk ', 'Rambut', '/uploads/audio/1784529083620_anggota_tubuh_1.mp3', 2, '2026-07-20 06:31:23.831', '2026-07-20 06:31:23.831', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (28, 'nudu', 'Kepala', '/uploads/audio/1784529599700_anggota_tubuh_2.mp3', 2, '2026-07-20 06:39:59.721', '2026-07-20 06:39:59.721', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (29, 'kere', 'Jidat/Dahi', '/uploads/audio/1784529654689_anggota_tubuh_3.mp3', 2, '2026-07-20 06:40:54.705', '2026-07-20 06:40:54.705', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (30, 'kekundep', 'Kelopak Mata', '/uploads/audio/1784530101139_anggota_tubuh_4.mp3', 2, '2026-07-20 06:48:21.262', '2026-07-20 06:48:21.262', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (31, 'meren', 'Mata ', '/uploads/audio/1784530209932_anggota_tubuh_5.mp3', 2, '2026-07-20 06:50:09.955', '2026-07-20 06:50:09.955', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (32, 'ngirung', 'Hidung', '/uploads/audio/1784530240238_anggota_tubuh_6.mp3', 2, '2026-07-20 06:50:40.252', '2026-07-20 06:50:40.252', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (33, 'pading', 'Pipu', '/uploads/audio/1784530274381_anggota_tubuh_7.mp3', 2, '2026-07-20 06:51:14.397', '2026-07-20 06:51:14.397', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (34, 'wi''wi', 'Bibir', '/uploads/audio/1784530429849_anggota_tubuh_8.mp3', 2, '2026-07-20 06:53:49.934', '2026-07-20 06:53:49.934', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (35, 'tingkuku', 'Dagu', '/uploads/audio/1784530470600_tingkukun(1).mp3', 2, '2026-07-20 06:54:30.612', '2026-07-20 06:54:30.612', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (36, 'dunteng ', 'Telinga', '/uploads/audio/1784530509888_dunteng.mp3', 2, '2026-07-20 06:55:09.903', '2026-07-20 06:55:09.903', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (37, 'de''', 'Leher', '/uploads/audio/1784530545099_anggota_tubuh_10.mp3', 2, '2026-07-20 06:55:45.132', '2026-07-20 06:55:45.132', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (38, 'paduka', 'Bahu', '/uploads/audio/1784530587664_anggota_tubuh_11.mp3', 2, '2026-07-20 06:56:27.679', '2026-07-20 06:56:27.679', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (39, 'dengen', 'Tangan ', '/uploads/audio/1784530618961_anggota_tubuh_12.mp3', 2, '2026-07-20 06:56:58.972', '2026-07-20 06:56:58.972', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (40, 'kekepi', 'Siku', '/uploads/audio/1784530662856_anggota_tubuh_13.mp3', 2, '2026-07-20 06:57:42.868', '2026-07-20 06:57:42.868', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (41, 'wet-wet', 'Dada', '/uploads/audio/1784530746566_anggota_tubuh_14.mp3', 2, '2026-07-20 06:59:06.66', '2026-07-20 06:59:06.66', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (42, 'tian', 'Perut', '/uploads/audio/1784530945239_perut.mp3', 2, '2026-07-20 07:02:25.249', '2026-07-20 07:02:25.249', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (43, 'poot', 'Perut', '/uploads/audio/1784531061732_perut_poot.mp3', 2, '2026-07-20 07:04:21.832', '2026-07-20 07:04:21.832', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (44, 'kuku', 'Kaki', '/uploads/audio/1784531090755_anggota_tubuh_17.mp3', 2, '2026-07-20 07:04:50.776', '2026-07-20 07:04:50.776', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (45, 'kurur', 'Lutut', '/uploads/audio/1784531117390_anggota_tubuh_19.mp3', 2, '2026-07-20 07:05:17.434', '2026-07-20 07:05:17.434', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (46, 'jare', 'Jari', '/uploads/audio/1784531146782_anggota_tubuh_20.mp3', 2, '2026-07-20 07:05:46.789', '2026-07-20 07:05:46.789', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (47, 'wa''ang', 'Gigi', '/uploads/audio/1784531183864_anggota_tubuh_21.mp3', 2, '2026-07-20 07:06:23.877', '2026-07-20 07:06:23.877', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (48, 'dida', 'Lidah', '/uploads/audio/1784531200973_anggota_tubuh_22.mp3', 2, '2026-07-20 07:06:41.099', '2026-07-20 07:06:41.099', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (49, 'ke kundap', 'Alis', '/uploads/audio/1784531234391_anggota_tubuh_23.mp3', 2, '2026-07-20 07:07:14.399', '2026-07-20 07:07:14.399', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (50, 'ama', 'Ayah', '/uploads/audio/1784552326177_keluarga_1.mp3', 7, '2026-07-20 12:58:46.244', '2026-07-20 12:58:46.244', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (51, 'ina', 'Ibu', '/uploads/audio/1784552348154_keluarga_2.mp3', 7, '2026-07-20 12:59:08.172', '2026-07-20 12:59:08.172', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (52, 'pa kakan ', 'Kakak', '/uploads/audio/1784552369489_keluarga_3.mp3', 7, '2026-07-20 12:59:29.524', '2026-07-20 12:59:29.524', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (53, 'toari', 'Adik', '/uploads/audio/1784552387967_keluarga_4.mp3', 7, '2026-07-20 12:59:47.977', '2026-07-20 12:59:47.977', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (54, 'tete', 'Kakek (opa)', '/uploads/audio/1784552423951_keluarga_5.mp3', 7, '2026-07-20 13:00:23.969', '2026-07-20 13:00:23.969', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (55, 'nene', 'Nenek (oma)', '/uploads/audio/1784552448256_keluarga_6.mp3', 7, '2026-07-20 13:00:48.268', '2026-07-20 13:00:48.268', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (12, 'Mapudu''', 'Sepuluh', '/uploads/audio/1783950249089_voice_10.mp3', 1, '2026-07-13 13:44:09.097', '2026-07-22 11:59:21.276', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (62, 'dua nepudu', 'Dua Puluh', '/uploads/audio/1784721612316_20.mp3', 1, '2026-07-22 12:00:12.331', '2026-07-22 12:00:12.331', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (63, 'tedu nepudu', 'Tiga Puluh', '/uploads/audio/1784721761191_30.mp3', 1, '2026-07-22 12:02:41.2', '2026-07-22 12:02:41.2', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (64, 'epat nepudu', 'Empat Puluh', '/uploads/audio/1784721784233_40.mp3', 1, '2026-07-22 12:03:04.244', '2026-07-22 12:03:04.244', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (65, 'dima nepudu', 'Lima Puluh', '/uploads/audio/1784721808700_50.mp3', 1, '2026-07-22 12:03:28.708', '2026-07-22 12:03:28.708', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (66, 'enem nepudu', 'Enam Puluh', '/uploads/audio/1784721829742_60.mp3', 1, '2026-07-22 12:03:49.755', '2026-07-22 12:03:49.755', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (67, 'pitu nepudu', 'Tujuh Puluh', '/uploads/audio/1784721851524_70.mp3', 1, '2026-07-22 12:04:11.531', '2026-07-22 12:04:11.531', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (68, 'wadu nepudu ', 'Delapan Puluh', '/uploads/audio/1784721868132_80.mp3', 1, '2026-07-22 12:04:28.323', '2026-07-22 12:04:28.323', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (69, 'siou nepudu', 'Sembilan Puluh', '/uploads/audio/1784721894492_90.mp3', 1, '2026-07-22 12:04:54.5', '2026-07-22 12:04:54.5', NULL);
INSERT INTO public.kosakata (id, tonsea, indonesia, "audioUrl", "categoryId", "createdAt", "updatedAt", kelas) VALUES (70, 'matus', 'Seratus', '/uploads/audio/1784721911341_100.mp3', 1, '2026-07-22 12:05:11.353', '2026-07-22 12:05:11.353', NULL);


--
-- Data for Name: materi; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (4, 'Pengenalan Bahasa Tonsea', 'Pengertian

Bahasa Tonsea adalah salah satu bahasa daerah yang berasal dari wilayah Minahasa, Provinsi Sulawesi Utara. Bahasa ini digunakan oleh masyarakat subetnis Tonsea sebagai alat komunikasi dalam kehidupan sehari-hari serta menjadi bagian dari identitas budaya masyarakat setempat.

Sebagai salah satu bahasa daerah di Indonesia, Bahasa Tonsea memiliki kosakata, pengucapan, dan ungkapan yang khas. Selain digunakan untuk berkomunikasi, bahasa ini juga menjadi sarana untuk menyampaikan adat istiadat, cerita rakyat, lagu daerah, dan berbagai tradisi budaya yang diwariskan dari generasi ke generasi.

Saat ini penggunaan Bahasa Tonsea mulai berkurang, terutama di kalangan generasi muda. Oleh karena itu, diperlukan berbagai upaya pelestarian melalui pendidikan, kegiatan budaya, dan pemanfaatan teknologi agar Bahasa Tonsea tetap dikenal dan digunakan.

Rangkuman
Bahasa Tonsea merupakan salah satu bahasa daerah di Minahasa, Sulawesi Utara.
Bahasa Tonsea digunakan sebagai alat komunikasi masyarakat subetnis Tonsea.
Bahasa Tonsea merupakan bagian dari identitas dan warisan budaya daerah yang perlu dilestarikan.', 1, '2026-07-16 09:35:58.73', '2026-07-20 13:31:10.091', '7', 'Bab 1', 'Pelajari pengertian Bahasa Tonsea sebagai salah satu bahasa daerah di Minahasa, Sulawesi Utara, serta perannya sebagai identitas budaya dan alat komunikasi masyarakat Tonsea.', NULL, 0);
INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (3, 'Rerekenan (Angka Dasar & Belasan)', 'Rerekenan adalah angka yang digunakan untuk menyatakan jumlah (Cardinal number). Mari kita pelajari
bersama cara menuliskan dan membaca angka dalam Bahasa Tonsea.

a. Angka Dasar

Angka dasar bisa disebut juga sebagai angka satuan, dimulai dari 0 sampai 10.

Angka Bahasa Tonsea Bahasa Indonesia

0 - nol

1 esa satu

2 rua / dua 

3 tedu tiga

4 epat empat

5 dima lima

6 enem enam

7 pitu tujuh

8 wadu delapan

Angka Bahasa Tonsea Bahasa Indonesia

9 siouw sembilan

10 mapudu’ sepuluh

b. Angka Belasan

Setelah angka dasar, ada angka belasan. Angka belasan ini dimulai dari 11 sampai 19, menggunakan kata dasar mapudu’
diikuti kata sambung wo.

Angka Bahasa Tonsea Bahasa Indonesia

11 mapudu’ wo esa sebelas

12 mapudu’ wo dua dua belas

13 mapudu’ wo tedu tiga belas

14 mapudu’ wo epat empat belas

15 mapudu’ wo dima lima belas

16 mapudu’ wo enem enam belas

17 mapudu’ wo pitu tujuh belas

18 mapudu’ wo wadu delapan belas

Angka Bahasa Tonsea Bahasa Indonesia

19 mapudu’ wo siouw sembilan belas

c. Contoh Kalimat

Berikut adalah cara merangkai angka dengan kata benda dalam percakapan sehari-hari:
● esa pepantik (satu pensil / pulpen)
● dua kepaya (dua pepaya)
● tedu po’po’ (tiga kelapa)
● mapudu’ munte (sepuluh jeruk)
● mapudu’ wo wadu ateduu (delapan belas telur)', 1, '2026-07-12 13:20:31.593', '2026-07-20 13:26:19.813', '7', 'BAB 2', 'Materi pembelajaran muatan lokal Bahasa Daerah Tonsea untuk Kelas 7 SMP Semester Ganjil mengenai Rerekenan (Sistem Angka/Berhitung). Modul ini memuat daftar kosa kata angka dasar (0–10), angka belasan (11–19), serta contoh penerapannya dalam frasa dan kalimat sehari-hari untuk melatih kemampuan dasar berbahasa daerah siswa secara kontekstual', 'https://youtu.be/GCceqabKurM?si=PzMbYS82QpH4NdEl', 1);
INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (5, 'Pentingnya Melestarikan Bahasa Tonsea', 'Mengapa Bahasa Tonsea Perlu Dilestarikan?
1. Bahasa Tonsea adalah Identitas Budaya

Bahasa Tonsea merupakan salah satu bahasa daerah yang digunakan oleh masyarakat Minahasa, khususnya subetnis Tonsea. Bahasa ini menjadi bagian dari identitas masyarakat dan mencerminkan sejarah, adat istiadat, serta nilai-nilai kehidupan yang diwariskan dari generasi ke generasi.

2. Menjaga Warisan Leluhur

Setiap kata, ungkapan, dan cerita dalam Bahasa Tonsea mengandung nilai budaya yang diwariskan oleh para leluhur. Dengan mempelajari dan menggunakan Bahasa Tonsea, kita turut menjaga warisan budaya agar tetap dikenal oleh generasi sekarang maupun generasi yang akan datang.

3. Mencegah Kepunahan Bahasa

Perkembangan teknologi dan penggunaan bahasa asing maupun bahasa Indonesia dalam kehidupan sehari-hari menyebabkan penggunaan bahasa daerah semakin berkurang. Jika tidak dipelajari dan digunakan, Bahasa Tonsea berisiko semakin jarang digunakan bahkan dapat terancam punah.

4. Menumbuhkan Rasa Bangga terhadap Budaya Daerah

Mempelajari Bahasa Tonsea dapat meningkatkan rasa cinta dan bangga terhadap budaya sendiri. Generasi muda memiliki peran penting dalam menjaga keberlangsungan bahasa daerah sebagai bagian dari kekayaan bangsa Indonesia.

5. Mendukung Komunikasi dengan Masyarakat Lokal

Masih banyak masyarakat, terutama orang tua atau tokoh adat, yang menggunakan Bahasa Tonsea dalam kehidupan sehari-hari. Memahami bahasa ini membantu membangun komunikasi yang lebih baik serta mempererat hubungan antargenerasi.

Cara Melestarikan Bahasa Tonsea

Pelestarian Bahasa Tonsea dapat dilakukan melalui berbagai cara, antara lain:

Menggunakan Bahasa Tonsea dalam percakapan sehari-hari sesuai situasi.
Mempelajari kosakata dan ungkapan Bahasa Tonsea secara rutin.
Membaca cerita rakyat, puisi, atau lagu daerah berbahasa Tonsea.
Mengikuti kegiatan budaya yang menggunakan Bahasa Tonsea.
Memanfaatkan media pembelajaran berbasis web atau teknologi digital untuk belajar Bahasa Tonsea.
Peran Generasi Muda

Generasi muda memiliki peran penting dalam menjaga kelestarian Bahasa Tonsea. Dengan mempelajari, menggunakan, dan memperkenalkan Bahasa Tonsea kepada teman maupun keluarga, mereka turut membantu menjaga agar bahasa daerah tetap hidup dan dikenal oleh generasi berikutnya.

Rangkuman

Bahasa Tonsea merupakan salah satu warisan budaya yang memiliki nilai sejarah dan identitas masyarakat Minahasa. Melestarikan Bahasa Tonsea berarti menjaga budaya, menghargai warisan leluhur, memperkuat identitas daerah, serta memastikan bahasa tersebut tetap digunakan oleh generasi mendatang. Melalui pembelajaran dan penggunaan dalam kehidupan sehari-hari, setiap orang dapat berkontribusi dalam menjaga kelestarian Bahasa Tonsea.', 1, '2026-07-20 13:28:03.154', '2026-07-20 13:28:03.154', '7', 'BAB I', 'Apa itu Pelestarian Bahasa?

Pelestarian bahasa adalah upaya untuk menjaga agar suatu bahasa tetap digunakan, dipelajari, dan diwariskan kepada generasi berikutnya. Bahasa daerah merupakan salah satu kekayaan budaya Indonesia yang perlu dijaga keberadaannya agar tidak hilang seiring perkembangan zaman.', NULL, 0);
INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (6, 'Sejarah Singkat Bahasa Tonsea', 'Bahasa Tonsea telah digunakan oleh masyarakat Minahasa sejak zaman dahulu sebagai bahasa komunikasi dalam kehidupan sehari-hari. Bahasa ini berkembang bersamaan dengan kehidupan masyarakat Tonsea yang memiliki adat, tradisi, dan budaya yang khas.

Pada masa lalu, Bahasa Tonsea digunakan dalam berbagai kegiatan masyarakat, seperti musyawarah, upacara adat, penyampaian cerita rakyat, lagu daerah, dan komunikasi dalam keluarga. Bahasa ini diwariskan secara lisan dari orang tua kepada anak-anaknya sehingga tetap terjaga selama bertahun-tahun.

Seiring perkembangan zaman, penggunaan Bahasa Indonesia semakin luas dalam dunia pendidikan, pemerintahan, dan media. Akibatnya, penggunaan Bahasa Tonsea dalam kehidupan sehari-hari mulai berkurang, terutama di kalangan generasi muda.

Saat ini berbagai upaya dilakukan untuk menjaga keberadaan Bahasa Tonsea, seperti mengajarkannya di sekolah, mendokumentasikan kosakata, mengadakan kegiatan budaya, serta memanfaatkan teknologi digital sebagai media pembelajaran.

Rangkuman
- Bahasa Tonsea telah digunakan sejak lama oleh masyarakat Tonsea.
- Bahasa Tonsea diwariskan secara turun-temurun.
- Saat ini Bahasa Tonsea perlu dilestarikan karena penggunaannya mulai berkurang.', 1, '2026-07-20 13:32:18.495', '2026-07-20 13:32:18.495', '7', 'BAB I', 'Kenali asal-usul dan perkembangan Bahasa Tonsea dari masa ke masa, serta bagaimana bahasa ini diwariskan hingga menjadi bagian penting dari budaya masyarakat Tonsea.', NULL, 0);
INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (7, 'Wilayah Penggunaan Bahasa Tonsea', 'Bahasa Tonsea digunakan oleh masyarakat subetnis Tonsea yang berada di bagian utara wilayah Minahasa, Provinsi Sulawesi Utara. Bahasa ini masih digunakan dalam kehidupan sehari-hari, terutama oleh masyarakat yang tinggal di desa-desa dan oleh sebagian orang tua yang masih mempertahankan penggunaan bahasa daerah.

Beberapa wilayah yang dikenal sebagai daerah penggunaan Bahasa Tonsea antara lain:

Kecamatan Kema
Kecamatan Kauditan
Kecamatan Airmadidi
Kecamatan Kalawat
Kecamatan Dimembe
Beberapa wilayah di Kota Bitung yang memiliki masyarakat keturunan Tonsea.

Meskipun Bahasa Indonesia menjadi bahasa utama dalam pendidikan dan komunikasi resmi, Bahasa Tonsea masih digunakan dalam lingkungan keluarga, kegiatan adat, acara budaya, dan komunikasi antarmasyarakat.

Dengan mempelajari wilayah penggunaan Bahasa Tonsea, kita dapat memahami bahwa bahasa daerah merupakan bagian dari kekayaan budaya yang harus dijaga dan dilestarikan.

Rangkuman
Bahasa Tonsea digunakan di wilayah Minahasa bagian utara, Provinsi Sulawesi Utara.
Bahasa Tonsea masih digunakan dalam keluarga dan kegiatan adat.
Wilayah penggunaan Bahasa Tonsea menjadi bagian dari kekayaan budaya Minahasa yang perlu dijaga.', 1, '2026-07-20 13:33:11.056', '2026-07-20 13:33:11.056', '7', 'BAB I', 'Pelajari daerah-daerah di Sulawesi Utara yang menjadi wilayah penggunaan Bahasa Tonsea dan ketahui bagaimana bahasa ini masih digunakan dalam kehidupan masyarakat hingga saat ini.', NULL, 0);
INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (8, 'Pengenalan Angka Dasar', 'Dalam bahasa Tonsea, angka mirip dengan bahasa-bahasa di rumpun Minahasa lainnya. Contoh: Esa (1), Zua (2), Telu (3), Epat (4), Lima (5).', 8, '2026-07-20 14:31:22.65', '2026-07-20 14:31:22.65', NULL, NULL, NULL, NULL, 1);
INSERT INTO public.materi (id, judul, konten, "categoryId", "createdAt", "updatedAt", kelas, bab, ringkasan, "videoUrl", sequence) VALUES (9, 'Kata Kerja Sehari-hari', 'Beberapa kata kerja dasar yang sering digunakan: Kuman (Makan), Tudu (Tidur), Mangeran (Berjalan).', 8, '2026-07-20 14:31:22.654', '2026-07-20 14:31:22.654', NULL, NULL, NULL, NULL, 2);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users (id, "namaLengkap", username, password, role, kelas, "createdAt", "updatedAt", email, "namaSekolah", "nomorTelepon") VALUES (4, 'Admin TonseaEdu', 'tonseaedu@gmail.com', '$2b$10$F.3iUw3Rzhz2TEMx8hibdOeZj5PS5E2OFmcEz5p35zYr0O0aBPlkG', 'admin', NULL, '2026-07-04 08:26:30.674', '2026-07-04 08:26:30.674', 'tonseaedu@gmail.com', NULL, NULL);
INSERT INTO public.users (id, "namaLengkap", username, password, role, kelas, "createdAt", "updatedAt", email, "namaSekolah", "nomorTelepon") VALUES (5, 'Keren Waworuntu', 'kilawaworuntu@gmail.com', '$2b$10$vUn4zPrPE0p8tHsaXyboEumuKLvT3Iwx0zuBcO7WZWXfV.DLFe0P.', 'guru', NULL, '2026-07-04 09:14:22.078', '2026-07-04 09:14:22.078', 'kilawaworuntu@gmail.com', 'SMP Kr Karegesan', NULL);
INSERT INTO public.users (id, "namaLengkap", username, password, role, kelas, "createdAt", "updatedAt", email, "namaSekolah", "nomorTelepon") VALUES (7, 'Mikel Manoppo', 'mikel', '$2b$10$fI6KGpwjbYWu8ilrlOug3.3LIieiCX9A7gJejFR24TZ6cbR2vaxJS', 'siswa', '8', '2026-07-05 12:16:24.501', '2026-07-05 12:30:10.373', 'mikel', NULL, NULL);
INSERT INTO public.users (id, "namaLengkap", username, password, role, kelas, "createdAt", "updatedAt", email, "namaSekolah", "nomorTelepon") VALUES (6, 'Injilia Ticoalu', 'injilia', '$2b$10$OEVv0tKPLn5skzyA5btGgelQNloUCEfaH5rYU4ZYsIF9h0tOV1AH.', 'siswa', '7', '2026-07-05 12:15:58.41', '2026-07-05 12:30:17.543', 'injilia', NULL, NULL);
INSERT INTO public.users (id, "namaLengkap", username, password, role, kelas, "createdAt", "updatedAt", email, "namaSekolah", "nomorTelepon") VALUES (8, 'indri claudia kolang', 'indri', '$2b$10$esxRef.dhg29S4Jq5xoe7eLTdMiQV4pXifLbdnwBzaT4ZgaMKdN5y', 'siswa', '9', '2026-07-07 07:22:15.234', '2026-07-07 07:22:15.234', 'indri', NULL, NULL);
INSERT INTO public.users (id, "namaLengkap", username, password, role, kelas, "createdAt", "updatedAt", email, "namaSekolah", "nomorTelepon") VALUES (9, 'Keren Waworuntu', 'keren', '$2b$10$cFjPqOOQetv9JbpkwXoO6O48hotou15MJhcvteeMhRNTprwwtJSNG', 'siswa', '7', '2026-07-20 13:05:18.955', '2026-07-20 13:05:18.955', 'keren', NULL, NULL);


--
-- Data for Name: materi_progress; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.materi_progress (id, "userId", "materiId", status, "quizScore", "completedAt", "createdAt", "updatedAt") VALUES (1, 6, 4, 'completed', 80, '2026-07-20 11:57:35.215', '2026-07-20 11:57:35.222', '2026-07-20 11:57:35.222');
INSERT INTO public.materi_progress (id, "userId", "materiId", status, "quizScore", "completedAt", "createdAt", "updatedAt") VALUES (2, 6, 5, 'completed', 80, '2026-07-20 14:07:18.893', '2026-07-20 14:07:18.897', '2026-07-20 14:07:18.897');
INSERT INTO public.materi_progress (id, "userId", "materiId", status, "quizScore", "completedAt", "createdAt", "updatedAt") VALUES (3, 9, 4, 'locked', 40, NULL, '2026-07-20 14:22:15.403', '2026-07-20 14:22:15.403');


--
-- Data for Name: questions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (1, 'Bahasa Tonsea dari angka 7 adalah...', 'Pitu', '{Wadu,Pitu,Enem,Siouw}', 1, '2026-07-13 14:54:42.878', '2026-07-13 14:54:42.878', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (4, 'Jika angka 5 adalah "dima" dan angka 10 adalah "mapudu’", maka angka 15 disebut...', 'Mapudu'' wo dima', '{"Mapudu'' wo dima","Mapudu'' wo esa","Mapudu'' wo enem","Dima wo mapudu''"}', 1, '2026-07-13 15:03:47.195', '2026-07-13 15:03:47.195', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (5, 'Manakah penulisan angka "sembilan belas" yang benar dalam Bahasa Tonsea?', 'Mapudu'' wo siouw', '{"Mapudu'' wo wadu","Mapudu'' wo siouw","Mapudu'' wo pitu","Mapudu'' wo tedu"}', 1, '2026-07-13 15:04:44.95', '2026-07-13 15:04:44.95', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (21, 'Bahasa Tonsea digunakan di wilayah ....', 'Minahasa bagian utara', '{"Minahasa bagian utara","Pulau Jawa",Sumatra,Papua}', 3, '2026-07-20 13:53:07.304', '2026-07-20 13:53:07.304', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (2, 'Arti dari frasa "tedu po’po’" dalam Bahasa Indonesia adalah...', 'Tiga Kelapa', '{"Dua Pepaya","Tiga Kelapa","Sepuluh Jeruk","Tiga Pepaya"}', 1, '2026-07-13 15:02:05.392', '2026-07-20 12:05:17.691', NULL, NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (9, 'Apa penyebab utama terjadinya penurunan jumlah penutur Bahasa Tonsea pada generasi muda saat ini?', 'Karena adanya dominasi penggunaan Bahasa Melayu Manado dalam kehidupan sehari-hari', '{"Karena dialek antar wilayah terlalu berbeda jauh dan sulit dipahami","Karena adanya dominasi penggunaan Bahasa Melayu Manado dalam kehidupan sehari-hari","Karena hilangnya catatan sejarah pada abad ke-17","Karena hilangnya catatan sejarah pada abad ke-17"}', 3, '2026-07-20 12:09:28.43', '2026-07-20 13:42:33.732', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (8, 'Bahasa Tonsea memiliki beberapa variasi dialek lokal. Di bawah ini yang merupakan salah satu dialek tersebut adalah...', 'Dialek Maumbi', '{"Dialek Ternate","Dialek Melayu Manado","Dialek Maumbi","Dialek Maluku"}', 3, '2026-07-20 12:08:54.974', '2026-07-20 13:42:51.931', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (7, 'Daerah berikut ini yang TIDAK termasuk dalam wilayah pemukiman adat suku Tonsea berdasarkan materi adalah...', 'Tomohon', '{"Likupang Timur",Tomohon,"Kauditan ",Tatelu}', 3, '2026-07-20 12:08:06.53', '2026-07-20 13:43:12.593', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (6, 'Suku Tonsea merupakan salah satu sub-suku Minahasa yang berasal dari anak suku yang disebut...', 'Pakasa''an Tountewoh', '{"Pakasa''an Tountewoh","Pakasa''an Kema","Pakasa''an Airmadidi","Pakasa''an Minahasa Utara"}', 3, '2026-07-20 12:07:16.594', '2026-07-20 13:43:40.13', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (10, 'Bahasa Tonsea merupakan salah satu ....', 'Bahasa daerah di Minahasa', '{"Bahasa internasional","Bahasa daerah di Minahasa","Bahasa asing","Bahasa nasional"}', 3, '2026-07-20 13:45:45.617', '2026-07-20 13:45:45.617', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (11, 'Bahasa Tonsea berasal dari Provinsi ....', 'Sulawesi Utara', '{"Jawa Barat","Kalimantan Selatan","Sulawesi Utara",Bali}', 3, '2026-07-20 13:46:22.47', '2026-07-20 13:46:22.47', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (13, 'Bahasa Tonsea digunakan sebagai ....', 'Alat komunikasi masyarakat Tonsea', '{"Bahasa pemrograman","Bahasa resmi dunia","Alat komunikasi masyarakat Tonsea","Bahasa perdagangan internasional"}', 3, '2026-07-20 13:46:48.287', '2026-07-20 13:46:48.287', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (15, 'Selain sebagai alat komunikasi, Bahasa Tonsea juga berfungsi untuk ....', 'Menjaga dan melestarikan budaya daerah', '{"Menggantikan Bahasa Indonesia","Menjaga dan melestarikan budaya daerah","Bahasa resmi ASEAN","Bahasa pemrograman komputer"}', 3, '2026-07-20 13:48:09.253', '2026-07-20 13:48:09.253', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (16, 'Sejak kapan Bahasa Tonsea digunakan oleh masyarakat?', 'Sejak zaman dahulu', '{"Sejak zaman dahulu","Tahun 2020","Tahun 1945","Tahun 2000"}', 3, '2026-07-20 13:48:37.08', '2026-07-20 13:48:37.08', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (17, 'Pada masa lalu, Bahasa Tonsea diwariskan secara ....', 'Lisan dari orang tua kepada anak', '{"Melalui internet","Lisan dari orang tua kepada anak","Melalui televisi","Melalui media sosial"}', 3, '2026-07-20 13:49:00.169', '2026-07-20 13:49:00.169', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (20, 'Bahasa Tonsea merupakan warisan budaya yang ....', 'Perlu dijaga dan dilestarikan', '{"Harus dilupakan","Diganti dengan bahasa asing","Tidak penting dipelajari","Perlu dijaga dan dilestarikan"}', 3, '2026-07-20 13:50:51.035', '2026-07-20 13:50:51.035', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (22, 'Salah satu daerah yang menggunakan Bahasa Tonsea adalah ....', 'Airmadidi', '{Tomohon,Airmadidi,Kotamobagu,Gorontalo}', 3, '2026-07-20 13:54:01.136', '2026-07-20 13:54:01.136', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (23, 'Bahasa Tonsea masih sering digunakan dalam ....', 'Lingkungan keluarga dan kegiatan adat', '{"Permainan komputer","Lingkungan keluarga dan kegiatan adat","Siaran televisi nasional","Pertandingan olahraga"}', 3, '2026-07-20 13:54:44.534', '2026-07-20 13:54:44.534', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (24, 'Mempelajari wilayah penggunaan Bahasa Tonsea bertujuan agar?', 'Mengetahui persebaran bahasa dan ikut melestarikannya', '{"Mengetahui persebaran bahasa dan ikut melestarikannya","Menghafal nama kota di Indonesia","Mempelajari bahasa asing","Menggantikan Bahasa Indonesia"}', 3, '2026-07-20 13:55:45.971', '2026-07-20 13:55:45.971', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (25, 'Mengapa Bahasa Tonsea perlu dilestarikan?', 'Karena merupakan warisan budaya daerah', '{"Agar menjadi bahasa internasional","Agar menggantikan Bahasa Indonesia","Karena merupakan warisan budaya daerah","Agar digunakan di seluruh dunia"}', 3, '2026-07-20 13:56:34.29', '2026-07-20 13:56:34.29', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (14, 'Bahasa Tonsea merupakan bagian dari ....', 'Warisan budaya masyarakat', '{"Warisan budaya masyarakat","Nama Provinsi","Lambang negara","Lagu nasional"}', 3, '2026-07-20 13:47:43.034', '2026-07-20 13:57:33.241', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (19, 'Salah satu upaya melestarikan Bahasa Tonsea adalah ....

', 'Menggunakan dan mempelajarinya dalam kehidupan sehari-hari', '{"Tidak mempelajarinya","Menggunakan dan mempelajarinya dalam kehidupan sehari-hari","Menghapus kosakata","Melarang penggunaannya"}', 3, '2026-07-20 13:50:18.58', '2026-07-20 13:58:25.074', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (26, 'Siapa yang memiliki peran penting dalam melestarikan Bahasa Tonsea?', 'Generasi muda', '{"Generasi muda",Wisatawan,Atlet,Pedagang}', 3, '2026-07-20 13:58:50.885', '2026-07-20 13:58:50.885', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (27, 'Melestarikan Bahasa Tonsea berarti ....', 'Menjaga identitas budaya daerah', '{"Menjaga identitas budaya daerah","Menghilangkan budaya daerah","Mengganti semua bahasa daerah","Menghapus tradisi masyarakat"}', 3, '2026-07-20 13:59:34.656', '2026-07-20 13:59:34.656', '7', NULL);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (29, 'Kuman', 'Makan', '{Minum,Makan,Tidur,Jalan}', 8, '2026-07-20 14:31:22.673', '2026-07-20 14:31:22.673', NULL, 9);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (30, 'Tudu', 'Tidur', '{Mandi,Duduk,Tidur,Berdiri}', 8, '2026-07-20 14:31:22.673', '2026-07-21 00:41:41.282', '7', 9);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (28, 'Esa', 'Satu', '{Satu,Dua,Tiga,Empat}', 1, '2026-07-20 14:31:22.673', '2026-07-21 01:32:32.062', '7', 3);
INSERT INTO public.questions (id, pertanyaan, "correctAnswer", options, "categoryId", "createdAt", "updatedAt", kelas, "materiId") VALUES (3, 'Lambang bilangan dari "mapudu’ wo epat" adalah...', '14', '{12,14,15,19}', 1, '2026-07-13 15:02:51.501', '2026-07-21 01:33:03.553', '7', 3);


--
-- Data for Name: scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.scores (id, username, kelas, score, "totalQuestions", "createdAt") VALUES (1, 'injilia', '7', 4, 5, '2026-07-13 15:06:56.462');
INSERT INTO public.scores (id, username, kelas, score, "totalQuestions", "createdAt") VALUES (2, 'injilia', '7', 4, 5, '2026-07-13 15:07:35.456');
INSERT INTO public.scores (id, username, kelas, score, "totalQuestions", "createdAt") VALUES (3, 'injilia', '7', 7, 9, '2026-07-20 13:03:36.76');
INSERT INTO public.scores (id, username, kelas, score, "totalQuestions", "createdAt") VALUES (4, 'keren', '7', 3, 28, '2026-07-21 01:31:06.291');
INSERT INTO public.scores (id, username, kelas, score, "totalQuestions", "createdAt") VALUES (5, 'keren', '7', 2, 2, '2026-07-21 01:38:44.23');
INSERT INTO public.scores (id, username, kelas, score, "totalQuestions", "createdAt") VALUES (6, 'keren', '7', 1, 4, '2026-07-21 01:39:07.142');


--
-- Name: categories_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.categories_id_seq', 8, true);


--
-- Name: kosakata_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.kosakata_id_seq', 70, true);


--
-- Name: materi_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materi_id_seq', 9, true);


--
-- Name: materi_progress_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.materi_progress_id_seq', 3, true);


--
-- Name: questions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.questions_id_seq', 30, true);


--
-- Name: scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.scores_id_seq', 6, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

\unrestrict tbqP0pr7RKAMbw0ncyf7KqczzTwftSVT9zJI06VDTJSoKgjWU3MboSzwfSqo2Up

