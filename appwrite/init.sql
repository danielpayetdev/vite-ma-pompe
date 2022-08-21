CREATE TABLE station (
    _id serial PRIMARY KEY,
    id integer,
    latitude numeric(18, 16),
    longitude numeric(18, 16),
    cp integer,
    pop varchar(1),
    adresse varchar(255),
    ville varchar(255),
    horaires jsonb,
    prix jsonb
);