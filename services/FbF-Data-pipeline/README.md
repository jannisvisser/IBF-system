# FbF-Data-pipeline

This repository consists of 2 parts.

1. Data pipeline: This is a series of scripts (which will be run daily) which extracts all input data (static + dynamic), transforms them to create flood extents and calculated affected population, and loads the output to locations where they can be served to the dashoard.
2. Geoserver: Geoserver is one of the locations where output of the data-pipeline is served: namely the raster-files.

## Prerequisites

1. Install Docker
2. Install python 3.6 >

## General instalation

1. Clone this directory to `<your_local_directory>`/Fbf-Data-pipeline/
2. Change `/pipeline/secrets.py.template` to `secrets.py` and fill in the necessary passwords.
3. Find 2 data-zips in https://rodekruis.sharepoint.com/sites/510-CRAVK-510/Gedeelde%20%20documenten/%5BPRJ%5D%20FbF%20-%20Zambia%20-%20(PMF,%20RPII)/Developers/Data/ and unzip geodata.zip and data.zip respectively to replace folders /geoserver/geodata/ and /pipeline/data/.
4. NOTE on 2 data-folders: it might conceptually be more logical to have all data (input + calculations) in one place together (/pipeline/data). From there we would (after all calculations) serve all raster data (input + calculations) to Geoserver, by copying it to the designated geoserver-datafolder (and server all other data by uploading it to Postgres). However, we deemed it redundant to have this copying-step in between and store the raster data in 2 places. Instead we put all raster (input + calculations) immediately in the geoserver-datafolder.  

## Set up Data pipeline

1. Build Docker image (from root folder) and run container with volume

```
docker build . -t fbf
docker run --net=host --name=fbf -v ${PWD}:/home/fbf --restart always -it fbf

```

2. Within container run setup: this will a.o. upload static data to the database.

```
python3 runSetup.py
```

3. All other scripts are summarized in cronJob (as it will be run daily).  Test it through:

```
python3 runCron.py
```

4. To set up the cron job to really run daily

```
crontab -e (to open file)
*/15 * * * * <your_local_directory>/FbF-Data-pipeline/cronjob.sh (add this line at end of file)
```

## Setup geoserver

1. Unzip geoserver data folder (described above)
2. `docker run --name "geoserver" -p 8081:8080 -v $HOME/FbF-Data-pipeline/geoserver:/opt/geoserver/data_dir --restart always kartoza/geoserver`
3. To restart it later `docker container start geoserver`



### Logging loggly and SMTPHandler for logging (OPTIONAL)
 1. Create a gmail account add to EMAIL_USERNAME in settings.py add your password to secrets.py 
 2. Create loggly account and set your token in python.conf; replace YOURTOKEN in the variable args 'https://logs-01.loggly.com/inputs/YOURTOKEN/tag/python' (see https://www.loggly.com/docs/python-http/ point 2)
 3. Add email addresses that want to receive an email when an error occurs to LOGGING_TO_EMAIL_ADDRRESSES in settings.py 
 4. In settings.py set LOGGING to True

 ### Sending notification with mailchimp (OPTIONAL)
 1. Create account: https://mailchimp.com/help/create-an-account/ add username to `secrets.py` 
 2. Create maillist: https://mailchimp.com/help/create-audience/ and add list id to `secrets.py` https://mailchimp.com/help/find-audience-id/
 3. Create API key:  https://mailchimp.com/help/about-api-keys/#Find-or-Generate-Your-API-Key add it to `secrets.py`
 4. Set EMAIL_NOTIFICATION to `True` in `settings.py`