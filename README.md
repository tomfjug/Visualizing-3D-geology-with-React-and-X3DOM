# Visualizing 3D geology with React and X3DOM

This is a repository for a React application using X3DOM to create a 3D scene.The project consist of a front-end and back-end server
The front-end consit of web page shows the terrain of Svalbard, with the ability to move around with the mouse and keyboard. Svalbard is displayed by using the X3D node BVHRefiner, and images files in a WMTS format. It uses images files for textures and elevation, which can be found in the resource folder.

The application uses node.js, which requires an installation that can be found here https://nodejs.org/en/

In addition, the application has support for visulazing slices of semestic data, and well logs.
A user can upload their own well logs and slices to a be stored in MongoDB database or only during runtime.
If you want to use a database, you would need to use the back-end and download MongoDB Comunity Server found at this link:
https://www.mongodb.com/download-center/community

The slices and wells are created from seperate reusable React Component. Both of them uses a dialog prompt for displaying additional information concerning them and a toggle used to decide wheter an element should be displayed or hidden. Both the toggle and dialog prompt are created from their own React component. 
There are also simple javascript model classes, that are used to contain info for slices and well. An object of these classes are used as a prop in definition of the corresponding component. 

There is also some simple components cotaining simple shapes 3D shapes, such as a box or a spheres. These provide a simple way to understand how X3DOM and React can be used. There are also components exploring the possibility of using volume rendering from X3DOM to visualize a colection of slices. A user can use a slider to decide which slice get shown.

Before the application can be able to run the type the command "npm install -g webpack-dev-server" from the project folder (called "Visualizing-3D-geology-with-React-and-X3DOM-master" by default)

To run the application use the command: "npm start" in the project folder (react_x3dom)

If you want to use the database run the command: "mongod"
Then run the command: "nodemon server" in the backend folder
