# openmrs-module-appointment-frontend

This repository acts as the front end for the **Bahmni Appointment Scheduling**. It is written in **AngularJS**.


# Build
```
bower install
npm install
grunt
```

# Test
```
grunt test
```
# Deploy
* Create a folder called 'appointments' under '/var/www'.
* Add an alias in httpd ssl.conf, like below:
  ```
  Alias /appointments-v2 /var/www/appointments
  ```


# Project structure

<pre>
|-- .tx
|   
|-- scripts
|	
`-- ui
    |-- Gruntfile.js
    |-- app
    |	|-- appointment
    |   |-- common
    |   |-- images
    |   |-- i18n
    |   |-- lib
    |   |-- styles
    |-- test
    |-- bower.json
    |-- package.json
</pre>