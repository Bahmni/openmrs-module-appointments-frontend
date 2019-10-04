# React Appointment Components

This library is a way to modernize the Appointment UI app based on Angular 1.0.  This library is based on <a href="https://github.com/DimiMikadze/create-react-library/tree/master/src/lib" target="_blank">create-react-library</a>. 


## Getting Started

Clone repo

````
git clone https://github.com/Bahmni/openmrs-module-appointment-frontend.git
````

Navigate to react-appointment-components directory

Install dependencies

`npm install` or `yarn install`

Start development server

`npm start` or `yarn start`

Runs the demo app in development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Library files

All library files are located inside `src/lib`  

## Demo app

Is located inside `src/demo` directory, here you can test your library while developing

## Testing

`npm run test` or `yarn run test`

## Build library

`npm run build` or `yarn run build`

Produces production version of library under the `build` folder.

## Publish library

`npm publish`

## Troubleshooting

#### Usage of other libraries within your library

- Add the library as a peer dependency in package.json (effectively requiring the calling project to provide this dependency)
- Add the library as a dev dependency in package.json (effectively allowing this library to successfully build without complaining about not having this dependency)
- Add the library to the externals config in your webpack.config file(s). By default, only react and react-dom are there, meaning that those are the only two libraries that you can use within your new shared library.