# openmrs-module-appointment-frontend

This repository acts as the front end for the **Bahmni Appointment Scheduling**. It is written in **React** and **Angular**.

# **React**

## Build

```
npm run build-react
```

## Development

### Build with watch

```
npm run build-react-dev
```

### Run storybook

```
npm run storybook
```

## Test

```
npm run test-react
```

### Test with watch

```
npm run test-react-watch
```

***

## **Angular**

This repository acts as the front end for the **Bahmni Appointment Scheduling**. It is written in **AngularJS**.


## Build
```
bower install
npm install
grunt
```

## Test
```
grunt test
```
## Deploy
* Create a folder called 'appointments' under '/var/www'.
* Add an alias in httpd ssl.conf, like below:
  ```
  Alias /appointments-v2 /var/www/appointments
  ```

# Project Structure

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
    |-- react-components
    |	|-- __mocks__
    |	|-- api
    |	|-- components
    |	|-- containers
    |	|-- stories
    |	|-- utils
    |	|-- bahmni-theme.css
    |	|-- constants.js
    |	|-- jest.config.js
    |	|-- variable.scss
    |-- test
    |-- bower.json
    |-- package.json
</pre>