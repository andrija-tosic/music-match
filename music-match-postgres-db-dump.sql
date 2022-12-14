--
-- PostgreSQL database dump
--

-- Dumped from database version 14.5 (Debian 14.5-1.pgdg110+1)
-- Dumped by pg_dump version 14.5 (Debian 14.5-1.pgdg110+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: genre_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.genre_type_enum AS ENUM (
    'rap',
    'hip-hop',
    'trap',
    'experimental',
    'rock',
    'indie rock',
    'pop',
    'rnb',
    'alternative rock',
    'psychedelic rock'
);


ALTER TYPE public.genre_type_enum OWNER TO postgres;

--
-- Name: release_type_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.release_type_enum AS ENUM (
    'ep',
    'single',
    'album',
    'compilation'
);


ALTER TYPE public.release_type_enum OWNER TO postgres;

--
-- Name: user_role_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.user_role_enum AS ENUM (
    'user',
    'admin'
);


ALTER TYPE public.user_role_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: artist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist (
    id integer NOT NULL,
    name character varying NOT NULL,
    "imageUrl" character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.artist OWNER TO postgres;

--
-- Name: artist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.artist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.artist_id_seq OWNER TO postgres;

--
-- Name: artist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.artist_id_seq OWNED BY public.artist.id;


--
-- Name: artist_releases_release; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.artist_releases_release (
    "artistId" integer NOT NULL,
    "releaseId" integer NOT NULL
);


ALTER TABLE public.artist_releases_release OWNER TO postgres;

--
-- Name: genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.genre (
    id integer NOT NULL,
    type public.genre_type_enum NOT NULL
);


ALTER TABLE public.genre OWNER TO postgres;

--
-- Name: genre_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.genre_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.genre_id_seq OWNER TO postgres;

--
-- Name: genre_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.genre_id_seq OWNED BY public.genre.id;


--
-- Name: playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.playlist (
    id integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    "imageUrl" character varying DEFAULT ''::character varying NOT NULL
);


ALTER TABLE public.playlist OWNER TO postgres;

--
-- Name: playlist_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.playlist_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.playlist_id_seq OWNER TO postgres;

--
-- Name: playlist_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.playlist_id_seq OWNED BY public.playlist.id;


--
-- Name: playlist_track; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.playlist_track (
    id integer NOT NULL,
    number integer NOT NULL,
    "addedByUserId" integer,
    "trackId" integer,
    "playlistId" integer
);


ALTER TABLE public.playlist_track OWNER TO postgres;

--
-- Name: playlist_track_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.playlist_track_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.playlist_track_id_seq OWNER TO postgres;

--
-- Name: playlist_track_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.playlist_track_id_seq OWNED BY public.playlist_track.id;


--
-- Name: release; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.release (
    id integer NOT NULL,
    name character varying NOT NULL,
    "releaseDate" date NOT NULL,
    "imageUrl" character varying DEFAULT ''::character varying NOT NULL,
    type public.release_type_enum NOT NULL
);


ALTER TABLE public.release OWNER TO postgres;

--
-- Name: release_genres_genre; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.release_genres_genre (
    "releaseId" integer NOT NULL,
    "genreId" integer NOT NULL
);


ALTER TABLE public.release_genres_genre OWNER TO postgres;

--
-- Name: release_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.release_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.release_id_seq OWNER TO postgres;

--
-- Name: release_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.release_id_seq OWNED BY public.release.id;


--
-- Name: track; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.track (
    id integer NOT NULL,
    name character varying NOT NULL,
    number integer NOT NULL,
    duration integer NOT NULL,
    "releaseId" integer
);


ALTER TABLE public.track OWNER TO postgres;

--
-- Name: track_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.track_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.track_id_seq OWNER TO postgres;

--
-- Name: track_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.track_id_seq OWNED BY public.track.id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    username character varying NOT NULL,
    "passwordHash" character varying NOT NULL,
    name character varying NOT NULL,
    "imageUrl" character varying DEFAULT ''::character varying NOT NULL,
    role public.user_role_enum DEFAULT 'user'::public.user_role_enum NOT NULL
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Name: user_followers_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_followers_user (
    "userId_1" integer NOT NULL,
    "userId_2" integer NOT NULL
);


ALTER TABLE public.user_followers_user OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_id_seq OWNER TO postgres;

--
-- Name: user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_id_seq OWNED BY public."user".id;


--
-- Name: user_liked_playlists_playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_liked_playlists_playlist (
    "userId" integer NOT NULL,
    "playlistId" integer NOT NULL
);


ALTER TABLE public.user_liked_playlists_playlist OWNER TO postgres;

--
-- Name: user_liked_tracks_track; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_liked_tracks_track (
    "userId" integer NOT NULL,
    "trackId" integer NOT NULL
);


ALTER TABLE public.user_liked_tracks_track OWNER TO postgres;

--
-- Name: user_playlists_playlist; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_playlists_playlist (
    "userId" integer NOT NULL,
    "playlistId" integer NOT NULL
);


ALTER TABLE public.user_playlists_playlist OWNER TO postgres;

--
-- Name: artist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist ALTER COLUMN id SET DEFAULT nextval('public.artist_id_seq'::regclass);


--
-- Name: genre id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre ALTER COLUMN id SET DEFAULT nextval('public.genre_id_seq'::regclass);


--
-- Name: playlist id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist ALTER COLUMN id SET DEFAULT nextval('public.playlist_id_seq'::regclass);


--
-- Name: playlist_track id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_track ALTER COLUMN id SET DEFAULT nextval('public.playlist_track_id_seq'::regclass);


--
-- Name: release id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release ALTER COLUMN id SET DEFAULT nextval('public.release_id_seq'::regclass);


--
-- Name: track id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track ALTER COLUMN id SET DEFAULT nextval('public.track_id_seq'::regclass);


--
-- Name: user id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user" ALTER COLUMN id SET DEFAULT nextval('public.user_id_seq'::regclass);


--
-- Data for Name: artist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artist (id, name, "imageUrl") FROM stdin;
1	Arctic Monkeys	https://i.scdn.co/image/ab676161000051747da39dea0a72f581535fb11f
6	Halid Be┼íli─ç	https://ecitaonica.blob.core.windows.net/music-match/5f993ff6-d8d7-4a1f-b393-23bd5a596667.jpg
2	Kanye West	https://ecitaonica.blob.core.windows.net/music-match/9a2e12f5-141c-4228-9004-cc9ced0067db.jpg
8	Oliver Dragojevi─ç	https://ecitaonica.blob.core.windows.net/music-match/9952a4d2-03f8-464d-a307-01fa290f6e0d.jpg
16	Dr. Dre	https://ecitaonica.blob.core.windows.net/music-match/3028295a-8a2b-4219-900b-e3447aed1792.jpg
17	Oliver Mandi─ç	https://ecitaonica.blob.core.windows.net/music-match/9e1aede6-768e-40da-a65d-264e4e5c4c82.jpeg
18	Novi artist	
\.


--
-- Data for Name: artist_releases_release; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.artist_releases_release ("artistId", "releaseId") FROM stdin;
1	1
2	9
6	10
8	14
16	15
1	20
17	21
18	22
\.


--
-- Data for Name: genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.genre (id, type) FROM stdin;
1	rock
2	hip-hop
3	indie rock
32	alternative rock
33	pop
34	experimental
35	rap
\.


--
-- Data for Name: playlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.playlist (id, name, description, "imageUrl") FROM stdin;
38	Gym ≡ƒÆ¬≡ƒÅï∩╕Å		
37	Ex Yu		https://ecitaonica.blob.core.windows.net/music-match/a470f8af-496a-4021-a01b-0a7d4801f206.jpg
8	Arkti─ìki majmuni	Opis	
39	Nova plejlista		https://ecitaonica.blob.core.windows.net/music-match/bba2195f-0858-4621-a2c3-6394925b208b.jpg
\.


--
-- Data for Name: playlist_track; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.playlist_track (id, number, "addedByUserId", "trackId", "playlistId") FROM stdin;
122	1	4	17	37
124	1	4	6	38
125	2	4	11	38
126	3	4	18	38
128	4	4	27	37
123	2	4	16	37
127	3	4	26	37
88	3	1	1	8
85	2	1	13	8
87	1	1	2	8
129	4	3	1	38
130	4	3	29	8
\.


--
-- Data for Name: release; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.release (id, name, "releaseDate", "imageUrl", type) FROM stdin;
10	Prvi poljubac	1984-09-16	https://ecitaonica.blob.core.windows.net/music-match/5f993ff6-d8d7-4a1f-b393-23bd5a596667.jpg	single
9	Yeezus	2013-07-16	https://images.genius.com/f4daff29a000bf818c5e53355c12d672.1000x1000x1.png	album
14	Svirajte no─ças za moju du┼íu	1988-09-18	https://i.scdn.co/image/ab67616d00001e0289e39b0eac883ec93636fcd0	album
15	The Chronic	1992-12-15	https://ecitaonica.blob.core.windows.net/music-match/02082470-ded8-4f6c-b48e-a1f53122e8ac.jpg	album
20	Humbug	2009-09-22	https://ecitaonica.blob.core.windows.net/music-match/c7d42c1b-f1d1-4cbb-b216-5907d0382099.jpg	album
21	Sve najbolje	1987-09-22	https://ecitaonica.blob.core.windows.net/music-match/9e1aede6-768e-40da-a65d-264e4e5c4c82.jpeg	album
1	AM	2022-09-05	https://ecitaonica.blob.core.windows.net/music-match/a5dd8393-3e7c-4116-9cf7-387c426378f8.jpg	album
22	Novi album	2009-09-23		album
\.


--
-- Data for Name: release_genres_genre; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.release_genres_genre ("releaseId", "genreId") FROM stdin;
10	1
1	32
1	3
14	1
9	2
9	34
9	35
15	2
15	35
20	32
20	3
21	1
22	1
22	3
22	34
\.


--
-- Data for Name: track; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.track (id, name, number, duration, "releaseId") FROM stdin;
1	I Wanna Be Yours	1	250	1
2	Arabella	2	300	1
7	Prvi poljubac	1	30	10
6	I Am A God	2	45	9
13	Mad Sounds	3	30	1
17	─Éeni	1	115	14
16	Cesarica	2	120	14
11	New Slaves	1	256	9
18	Nuthin' But a "G" Thang	1	193	15
24	My Propeller	1	234	20
25	Crying Lightning	2	275	20
26	Pitaju Me, Pitaju, Oko Moje	1	263	21
27	Do─æe Mi Da Vrisnem Tvoje Ime	2	243	21
28	nova	4	30	\N
29	Prva pesma	1	253	22
30	Druga pesma	2	30	22
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, username, "passwordHash", name, "imageUrl", role) FROM stdin;
1	admin	$2b$09$33sYvpJYONJ6I10R.OHS.OC5am6m8BlLy.GeG4evUggIsZ6MA9HYS	Admin		admin
3	andrija	$2b$09$xHMS5ZHG.eX7CEgkWTji7.n8tt3oYA7QVS6wAsm4wHj6W7tXLRv3.	Andrija	https://ecitaonica.blob.core.windows.net/music-match/profilna.jpg	user
4	andrija2	$2b$09$/XrWTgfM/ZMcTsIzqzkPue0hVnrQ59TiY3XCzyi2uLZEyHLM6Nt52	Andrija Alter Ego	https://ecitaonica.blob.core.windows.net/music-match/profilna.jpg	user
\.


--
-- Data for Name: user_followers_user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_followers_user ("userId_1", "userId_2") FROM stdin;
3	1
1	3
3	4
4	3
\.


--
-- Data for Name: user_liked_playlists_playlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_liked_playlists_playlist ("userId", "playlistId") FROM stdin;
3	8
1	8
4	37
3	37
\.


--
-- Data for Name: user_liked_tracks_track; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_liked_tracks_track ("userId", "trackId") FROM stdin;
3	6
1	6
1	11
1	1
1	16
4	17
4	16
3	24
3	25
3	13
4	26
4	27
3	17
3	1
1	29
1	30
3	2
1	2
\.


--
-- Data for Name: user_playlists_playlist; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_playlists_playlist ("userId", "playlistId") FROM stdin;
3	8
4	37
4	38
3	38
3	39
4	39
\.


--
-- Name: artist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.artist_id_seq', 18, true);


--
-- Name: genre_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.genre_id_seq', 35, true);


--
-- Name: playlist_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.playlist_id_seq', 42, true);


--
-- Name: playlist_track_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.playlist_track_id_seq', 130, true);


--
-- Name: release_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.release_id_seq', 22, true);


--
-- Name: track_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.track_id_seq', 30, true);


--
-- Name: user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_id_seq', 4, true);


--
-- Name: genre PK_0285d4f1655d080cfcf7d1ab141; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT "PK_0285d4f1655d080cfcf7d1ab141" PRIMARY KEY (id);


--
-- Name: track PK_0631b9bcf521f8fab3a15f2c37e; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track
    ADD CONSTRAINT "PK_0631b9bcf521f8fab3a15f2c37e" PRIMARY KEY (id);


--
-- Name: release PK_1a2253436964eea9c558f9464f4; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release
    ADD CONSTRAINT "PK_1a2253436964eea9c558f9464f4" PRIMARY KEY (id);


--
-- Name: user_playlists_playlist PK_2fc6689076fa6692babf56969ac; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_playlists_playlist
    ADD CONSTRAINT "PK_2fc6689076fa6692babf56969ac" PRIMARY KEY ("userId", "playlistId");


--
-- Name: playlist PK_538c2893e2024fabc7ae65ad142; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist
    ADD CONSTRAINT "PK_538c2893e2024fabc7ae65ad142" PRIMARY KEY (id);


--
-- Name: artist PK_55b76e71568b5db4d01d3e394ed; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist
    ADD CONSTRAINT "PK_55b76e71568b5db4d01d3e394ed" PRIMARY KEY (id);


--
-- Name: playlist_track PK_7699d7c43d267e3485653ee9bda; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_track
    ADD CONSTRAINT "PK_7699d7c43d267e3485653ee9bda" PRIMARY KEY (id);


--
-- Name: user_liked_playlists_playlist PK_91f9af8350ac7e37534c94f84c8; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_playlists_playlist
    ADD CONSTRAINT "PK_91f9af8350ac7e37534c94f84c8" PRIMARY KEY ("userId", "playlistId");


--
-- Name: user_followers_user PK_980ff03f415077df184596dcf73; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_followers_user
    ADD CONSTRAINT "PK_980ff03f415077df184596dcf73" PRIMARY KEY ("userId_1", "userId_2");


--
-- Name: artist_releases_release PK_a4e95a3b9464207e2ac16d509b3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_releases_release
    ADD CONSTRAINT "PK_a4e95a3b9464207e2ac16d509b3" PRIMARY KEY ("artistId", "releaseId");


--
-- Name: user PK_cace4a159ff9f2512dd42373760; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY (id);


--
-- Name: release_genres_genre PK_edca311f84de1f0f04a859c25ff; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release_genres_genre
    ADD CONSTRAINT "PK_edca311f84de1f0f04a859c25ff" PRIMARY KEY ("releaseId", "genreId");


--
-- Name: user_liked_tracks_track PK_f77eae4b496daba31546742ee64; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_tracks_track
    ADD CONSTRAINT "PK_f77eae4b496daba31546742ee64" PRIMARY KEY ("userId", "trackId");


--
-- Name: user UQ_78a916df40e02a9deb1c4b75edb; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE (username);


--
-- Name: genre UQ_e77022de21db1689778c6736ee2; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.genre
    ADD CONSTRAINT "UQ_e77022de21db1689778c6736ee2" UNIQUE (type);


--
-- Name: IDX_022812e0449d885b2028037216; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_022812e0449d885b2028037216" ON public.track USING btree (name);


--
-- Name: IDX_06166e7377475121f6e9d16c4d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_06166e7377475121f6e9d16c4d" ON public.release_genres_genre USING btree ("genreId");


--
-- Name: IDX_065d4d8f3b5adb4a08841eae3c; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_065d4d8f3b5adb4a08841eae3c" ON public."user" USING btree (name);


--
-- Name: IDX_110f993e5e9213a7a44f172b26; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_110f993e5e9213a7a44f172b26" ON public.user_followers_user USING btree ("userId_2");


--
-- Name: IDX_1611591912d5ff07c4c5c56419; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_1611591912d5ff07c4c5c56419" ON public.user_liked_playlists_playlist USING btree ("userId");


--
-- Name: IDX_26312a1e34901011fc6f63545e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_26312a1e34901011fc6f63545e" ON public.user_followers_user USING btree ("userId_1");


--
-- Name: IDX_296eec80d3b2b33551489a0c21; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_296eec80d3b2b33551489a0c21" ON public.playlist USING btree (name);


--
-- Name: IDX_3ac79cb59c8c96c0b093b9592e; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_3ac79cb59c8c96c0b093b9592e" ON public.artist_releases_release USING btree ("releaseId");


--
-- Name: IDX_7a5f90927ced990b0eca0569c2; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7a5f90927ced990b0eca0569c2" ON public.user_liked_tracks_track USING btree ("trackId");


--
-- Name: IDX_7b56808e237523ce8ac47d3988; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_7b56808e237523ce8ac47d3988" ON public.user_liked_playlists_playlist USING btree ("playlistId");


--
-- Name: IDX_a15d6a6bcd37b4ea765fe98064; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a15d6a6bcd37b4ea765fe98064" ON public.user_playlists_playlist USING btree ("userId");


--
-- Name: IDX_a2645aad2a5dcce57b2334e602; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a2645aad2a5dcce57b2334e602" ON public.artist_releases_release USING btree ("artistId");


--
-- Name: IDX_a741a823760dd0ca4b6b39793a; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_a741a823760dd0ca4b6b39793a" ON public.user_liked_tracks_track USING btree ("userId");


--
-- Name: IDX_b6e1080bb21d077ef31d32d615; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_b6e1080bb21d077ef31d32d615" ON public.release_genres_genre USING btree ("releaseId");


--
-- Name: IDX_c77230903be90a74ac8c895c7d; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_c77230903be90a74ac8c895c7d" ON public.release USING btree (name);


--
-- Name: IDX_d374b3f7f7148b196a31d57253; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_d374b3f7f7148b196a31d57253" ON public.user_playlists_playlist USING btree ("playlistId");


--
-- Name: IDX_dd5a88442cd2e068463fa03e49; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX "IDX_dd5a88442cd2e068463fa03e49" ON public.artist USING btree (name);


--
-- Name: release_genres_genre FK_06166e7377475121f6e9d16c4d9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release_genres_genre
    ADD CONSTRAINT "FK_06166e7377475121f6e9d16c4d9" FOREIGN KEY ("genreId") REFERENCES public.genre(id);


--
-- Name: user_followers_user FK_110f993e5e9213a7a44f172b264; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_followers_user
    ADD CONSTRAINT "FK_110f993e5e9213a7a44f172b264" FOREIGN KEY ("userId_2") REFERENCES public."user"(id);


--
-- Name: user_liked_playlists_playlist FK_1611591912d5ff07c4c5c56419f; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_playlists_playlist
    ADD CONSTRAINT "FK_1611591912d5ff07c4c5c56419f" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_followers_user FK_26312a1e34901011fc6f63545e2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_followers_user
    ADD CONSTRAINT "FK_26312a1e34901011fc6f63545e2" FOREIGN KEY ("userId_1") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: artist_releases_release FK_3ac79cb59c8c96c0b093b9592e0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_releases_release
    ADD CONSTRAINT "FK_3ac79cb59c8c96c0b093b9592e0" FOREIGN KEY ("releaseId") REFERENCES public.release(id) ON DELETE CASCADE;


--
-- Name: playlist_track FK_4059be7a917b28c39060827b2da; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_track
    ADD CONSTRAINT "FK_4059be7a917b28c39060827b2da" FOREIGN KEY ("addedByUserId") REFERENCES public."user"(id);


--
-- Name: playlist_track FK_4a8364886ef4f5988bf7c3a19c8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_track
    ADD CONSTRAINT "FK_4a8364886ef4f5988bf7c3a19c8" FOREIGN KEY ("playlistId") REFERENCES public.playlist(id) ON DELETE CASCADE;


--
-- Name: user_liked_tracks_track FK_7a5f90927ced990b0eca0569c24; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_tracks_track
    ADD CONSTRAINT "FK_7a5f90927ced990b0eca0569c24" FOREIGN KEY ("trackId") REFERENCES public.track(id);


--
-- Name: user_liked_playlists_playlist FK_7b56808e237523ce8ac47d39888; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_playlists_playlist
    ADD CONSTRAINT "FK_7b56808e237523ce8ac47d39888" FOREIGN KEY ("playlistId") REFERENCES public.playlist(id) ON DELETE CASCADE;


--
-- Name: track FK_82f53ac4b0335b49d639927e219; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.track
    ADD CONSTRAINT "FK_82f53ac4b0335b49d639927e219" FOREIGN KEY ("releaseId") REFERENCES public.release(id) ON DELETE CASCADE;


--
-- Name: user_playlists_playlist FK_a15d6a6bcd37b4ea765fe980642; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_playlists_playlist
    ADD CONSTRAINT "FK_a15d6a6bcd37b4ea765fe980642" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: artist_releases_release FK_a2645aad2a5dcce57b2334e6026; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.artist_releases_release
    ADD CONSTRAINT "FK_a2645aad2a5dcce57b2334e6026" FOREIGN KEY ("artistId") REFERENCES public.artist(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_liked_tracks_track FK_a741a823760dd0ca4b6b39793a0; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_liked_tracks_track
    ADD CONSTRAINT "FK_a741a823760dd0ca4b6b39793a0" FOREIGN KEY ("userId") REFERENCES public."user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: release_genres_genre FK_b6e1080bb21d077ef31d32d6158; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.release_genres_genre
    ADD CONSTRAINT "FK_b6e1080bb21d077ef31d32d6158" FOREIGN KEY ("releaseId") REFERENCES public.release(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: user_playlists_playlist FK_d374b3f7f7148b196a31d57253a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_playlists_playlist
    ADD CONSTRAINT "FK_d374b3f7f7148b196a31d57253a" FOREIGN KEY ("playlistId") REFERENCES public.playlist(id) ON DELETE CASCADE;


--
-- Name: playlist_track FK_dd416fc96a9a3d3384f9f508b30; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.playlist_track
    ADD CONSTRAINT "FK_dd416fc96a9a3d3384f9f508b30" FOREIGN KEY ("trackId") REFERENCES public.track(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

