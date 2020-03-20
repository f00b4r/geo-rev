DATA_DIR = ./data

GEONAMES_LINK = https://download.geonames.org/export/dump/cities500.zip
GEONAMES_PATH = ${DATA_DIR}/cities500.csv

all : build

##########################
# CLEANERS
##########################

clean :
	rm -Rf node_modules dist data

##########################
# DEPENDENCIES
##########################

deps : with_npm with_geonames

with_npm :
	npm install

with_geonames :
ifeq (,$(wildcard ${GEONAMES_PATH}))
	mkdir -p ${DATA_DIR}
	wget ${GEONAMES_LINK} -O ${DATA_DIR}/geonames.zip
	unzip ${DATA_DIR}/geonames.zip -d ${DATA_DIR} && rm ${DATA_DIR}/geonames.zip
	cat ${DATA_DIR}/cities500.txt | cut -f2,5,6,9 -s --output-delimiter=';' > ${GEONAMES_PATH} && rm ${DATA_DIR}/cities500.txt
endif

##########################
# BUILD
##########################

build : deps
	npm run build
	npm run test
