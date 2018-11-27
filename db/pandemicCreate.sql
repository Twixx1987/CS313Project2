CREATE TABLE pandemic_user 
(
	user_id serial NOT NULL PRIMARY KEY,
	user_name varchar(80) NOT NULL,
	password varchar(255) NOT NULL
);

CREATE TABLE pandemic_version (
	version_id serial PRIMARY KEY,
	version_name varchar(80)
);

CREATE TABLE pandemic_roles (
	role_id serial PRIMARY KEY,
	version_id integer NOT NULL REFERENCES pandemic_version (version_id),
	role_name varchar(80),
	abilities text
);

CREATE TABLE pandemic_game (
	game_id serial PRIMARY KEY,
	player_count integer NOT NULL CHECK (player_count > 1),
	game_open boolean DEFAULT true,
	game_complete boolean DEFAULT false,
	host_user integer NOT NULL REFERENCES pandemic_user (user_id),
	epidemic_count integer NOT NULL,
	outbreak_count integer NOT NULL,
	eradicate_count integer NOT NULL,
	cure_count integer NOT NULL,
	win boolean
);

CREATE TABLE pandemic_player (
	player_id serial PRIMARY KEY,
	game_id integer REFERENCES pandemic_game (game_id),
	user_id integer REFERENCES pandemic_user (user_id),
	role_id integer REFERENCES pandemic_roles (role_id)
);

CREATE TABLE pandemic_selection (
    selection_id serial NOT NULL PRIMARY KEY,
    game_id integer NOT NULL REFERENCES pandemic_game (game_id),
    user_id integer NOT NULL REFERENCES pandemic_user (user_id),
    role_id integer NOT NULL REFERENCES pandemic_roles (role_id),
    CONSTRAINT pandemic_selection_game_id_role_id_key UNIQUE (game_id, role_id),
    CONSTRAINT pandemic_selection_game_id_user_id_key UNIQUE (game_id, user_id)
);