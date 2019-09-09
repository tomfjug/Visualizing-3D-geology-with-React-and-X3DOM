# Visualizing 3D geology with React and X3DOM

This is a repository for a React application using X3DOM to create a 3D scene.The project consist of a front-end and a back-end server.
The front-end consit of a web page that contains a scene with the terrain of Svalbard. A user has the ability to move around with the mouse and keyboard. Svalbard is displayed by using the X3DOM tag BVHRefiner and image files in a WMTS format. It uses image files for textures and elevation, which can be found in the resources folder.

The application uses node.js, which requires an installation that can be found here https://nodejs.org/en/

In addition, the application has support for visulazing slices of semestic data, and well logs.
A user can upload their own well logs and slices to a be stored in MongoDB database or only during runtime.
If you want to use a database, you would need to run the back-end server and download MongoDB Comunity Server found at this link:
https://www.mongodb.com/download-center/community

The slices and wells are created from seperate reusable React Component. Both of them uses a dialog prompt for displaying additional information concerning them and a toggle used to decide whether an element should be displayed or hidden. Both the toggle and dialog prompt are created from their own React component. 
There are also simple javascript model classes, that are used to contain info for slices and well. An object of these classes are used as a prop in definition of the corresponding component. 

There are some React components cotaining simple 3D shapes, such as a box or a spheres. These provide an easy way to understand how X3DOM and React can be used togheter. Finaly, there are components exploring the possibility of using volume rendering from X3DOM to visualize a colection of slices. A user can use a slider to decide which slice get shown.

## Setup

Before running the application for the first time, the command "npm install -g webpack-dev-server" should be used from the project folder (called "Visualizing-3D-geology-with-React-and-X3DOM-master" by default)

To run the application use the command: "npm start" in the project folder (react_x3dom)

If you want to use the database run the command: "mongod"
Then run the command: "nodemon server" in the backend folder
