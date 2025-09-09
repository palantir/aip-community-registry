## Build stage
FROM ubuntu:22.04 AS build

ENV DEBIAN_FRONTEND=noninteractive
ENV NOMINATIM_VERSION=3.7.2

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    cmake \
    g++ \
    git \
    libboost-all-dev \
    libbz2-dev \
    libexpat1-dev \
    liblua5.3-dev \
    libpq-dev \
    libproj-dev \
    libtool \
    libxml2-dev \
    php-cli \
    postgresql-server-dev-all \
    sudo \
    wget \
    zlib1g-dev \
    && apt-get clean

# Install & build Nominatim
RUN git clone --branch v${NOMINATIM_VERSION} --depth 1 https://github.com/osm-search/Nominatim.git /srv/nominatim && \
    cd /srv/nominatim && \
    git submodule update --init --recursive
RUN wget https://www.nominatim.org/data/country_grid.sql.gz -O /srv/nominatim/data/country_osm_grid.sql.gz
RUN mkdir -p /srv/nominatim/build && cd /srv/nominatim/build && cmake /srv/nominatim && make


## Runtime stage
FROM ubuntu:22.04

COPY --from=build /srv/nominatim /srv/nominatim
WORKDIR /srv/nominatim

ENV DEBIAN_FRONTEND=noninteractive
ENV PGDATA=/srv/nominatim/pgdata
ENV LANG=C.UTF-8
ENV LC_ALL=C.UTF-8

# Install dependencies
RUN apt-get update && \
    apt-get install -y \
    apache2 \
    libapache2-mod-php \
    libboost-all-dev \
    php \
    php-pgsql \
    php-intl \
    postgis \
    postgresql-client \
    postgresql-contrib \
    python3 \
    python3-argparse-manpage \
    python3-datrie \
    python3-dotenv \
    python3-icu \
    python3-jinja2 \
    python3-pip \
    python3-psutil \
    python3-psycopg2 \
    python3-setuptools \
    python3-tidylib \
    && apt-get clean

# Enable Nominatim transliteration
RUN phpenmod intl

# Create a non-root user with UID 5000 & set permissions
RUN useradd -u 5000 -m nominatim
RUN mkdir -p ${PGDATA} /var/run/postgresql /var/log/apache2 && \
    chown -R nominatim:nominatim /srv/nominatim /var/run/postgresql /var/log/apache2 /var/lock/apache2 /var/run/apache2 && \
    chmod 700 ${PGDATA} /

# Configure Apache to use a port other than 80
ARG PORT=8080
COPY ./nominatim.conf /etc/apache2/conf-available/nominatim.conf
RUN sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf && \
    sed -i "s/:80/:${PORT}/" /etc/apache2/sites-available/000-default.conf && \
    a2enconf nominatim
EXPOSE ${PORT}

# Switch to the non-root user, initialize PostgreSQL & import OSM data
USER 5000

ARG OSM_FILE=./data/saint-helena-latest.osm.pbf
COPY ${OSM_FILE} /srv/nominatim/nominatim/data.osm.pbf

ARG NUM_THREADS=4
RUN /usr/lib/postgresql/14/bin/initdb -D ${PGDATA} && \
    /usr/lib/postgresql/14/bin/pg_ctl -D ${PGDATA} start && \
    createuser www-data && \
    ./build/nominatim import --osm-file /srv/nominatim/nominatim/data.osm.pbf --threads ${NUM_THREADS} && \
    /usr/lib/postgresql/14/bin/pg_ctl -D ${PGDATA} stop


# Attach OpenAPI spec for search & reverse
LABEL server.openapi='{ "openapi": "3.0.0", "info": { "title": "OpenStreetMap Nominatim API", "version": "3.7.2" }, "servers": [ { "url": "http://localhost:8000" } ], "paths": { "/nominatim/search": { "get": { "summary": "Look up a location from a textual description or address", "operationId": "nominatimSearch", "description": "The search API allows you to look up a location from a textual description or address. Nominatim supports structured and free-form search queries.", "parameters": [ { "schema": { "type": "string" }, "in": "query", "name": "q", "description": "Free-form query string to search for." } ], "responses": { "200": { "description": "Successful response", "content": { "application/json": { "schema": { "type": "array", "items": { "type": "object", "properties": { "place_id": { "type": "integer", "example": 101105 }, "licence": { "type": "string", "example": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright" }, "osm_type": { "type": "string", "example": "node" }, "osm_id": { "type": "integer", "example": 5610346984 }, "boundingbox": { "type": "array", "items": { "type": "string" }, "example": [ "-13.6358324", "-13.6357324", "-172.1948828", "-172.1947828" ] }, "lat": { "type": "string", "example": "-13.6357824" }, "lon": { "type": "string", "example": "-172.1948328" }, "display_name": { "type": "string", "example": "Sa'asa'ai Gas Station, North Coast Road, SV02, Sa'asa'ai, Faʻasaleleaga, Sāmoa" }, "place_rank": { "type": "integer", "example": 30 }, "category": { "type": "string", "example": "amenity" }, "type": { "type": "string", "example": "fuel" }, "importance": { "type": "number", "format": "float", "example": 0.101 } } } } } } } } } }, "/nominatim/reverse": { "get": { "summary": "Generate an address from a coordinate given as latitude and longitude", "operationId": "nominatimReverse", "description": "The reverse geocoding API returns exactly one result or an error when the coordinate is in an area with no OSM data coverage.", "parameters": [ { "schema": { "type": "number", "minimum": 0 }, "in": "query", "name": "lat", "description": "Latitude of a coordinate in WGS84 projection." }, { "schema": { "type": "number", "minimum": 0 }, "in": "query", "name": "lon", "description": "Longitude of a coordinate in WGS84 projection." } ], "responses": { "200": { "description": "Successful response", "content": { "application/json": { "schema": { "type": "array", "items": { "type": "object", "properties": { "place_id": { "type": "integer", "example": 101105 }, "licence": { "type": "string", "example": "Data © OpenStreetMap contributors, ODbL 1.0. https://osm.org/copyright" }, "osm_type": { "type": "string", "example": "node" }, "osm_id": { "type": "integer", "example": 5610346984 }, "boundingbox": { "type": "array", "items": { "type": "string" }, "example": [ "-13.6358324", "-13.6357324", "-172.1948828", "-172.1947828" ] }, "lat": { "type": "string", "example": "-13.6357824" }, "lon": { "type": "string", "example": "-172.1948328" }, "display_name": { "type": "string", "example": "Sa'asa'ai Gas Station, North Coast Road, SV02, Sa'asa'ai, Faʻasaleleaga, Sāmoa" }, "place_rank": { "type": "integer", "example": 30 }, "category": { "type": "string", "example": "amenity" }, "type": { "type": "string", "example": "fuel" }, "importance": { "type": "number", "format": "float", "example": 0.101 } } } } } } } } } } } }'

# Start Postgres and Apache
CMD ["sh", "-c", "/usr/lib/postgresql/14/bin/pg_ctl -D ${PGDATA} start && apache2ctl -S && apache2ctl -D FOREGROUND"]
