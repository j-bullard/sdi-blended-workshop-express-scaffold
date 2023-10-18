# API Servers Workshop

##### [Fork and clone this repository ](https://github.com/gSchool/sdi-blended-workshop-express-scaffold)

This project will evaluate your ability to create a valid Express application with CRUD capabilities. The goal of this checkpoint is not to finish quickly, but rather to do the best you can so we can gauge where everyone in the class is at and how well you're absorbing the material. Take your time and don't stress out!

**You will be:**
- Creating a RESTful API
- Handling dynamic endpoints with full CRUD functionality
- Serving data from an existing dataset to simulate an API service providing data from a database
- Using the `csv.js` suite of packages to manipulate .csv files

### Project Instructions:

1. Fork the [sdi-blended-express-workshop repository](https://github.com/gSchool/sdi-blended-workshop-express-scaffold) to your own GitHub to submit your code for this project.
1. The project is already initiated for you - after cloning and opening it, run `$ npm install` in the VSCode terminal within the repository.
1. Review and understand all starter files.
1. Review and understand the imports and *app.use()* methods in `app.js`.
1. Install all necessary packages as evident from the imports, as well as the required packages to build and test an Express API (`express`, `supertest`, and others outlined in the Learn materials for this unit). 
1. The packages [`csv-parse/sync`](https://csv.js.org/parse/api/sync/) and [`csv-stringify/sync`](https://csv.js.org/stringify/api/sync/) are used to help you manipulate .csv files - research the documentation to understand how to utilize them.      
1. Submit a link to your forked repository below.


#### Project Specs
- Create a RESTful API that supplies data from the `dummy.csv` file and `data` directory.
  - All CRUD (Create, Read, Update, Delete) methods should be handled
  - Any errors should be gracefully resolved
    - Errors involving the dummy data should be handled via [Node.js error-first callback syntax](https://www.geeksforgeeks.org/error-first-callback-in-node-js/#:~:text=16%20Feb%2C%202022-,Error%2DFirst%20Callback%20in%20Node.,returned%20by%20the%20first%20argument.)
- Multiple endpoints should handle various routes
  - `/books` route
    - `GET` request should return an array of all books
    - `POST` request should add a new book object to the `dummy.csv` file and a new csv file that correlates to new `id` to the `data` directory.
  - Specific id routes (i.e. `http://localhost:8080/books/2`) 
    - `GET` request should return data for the specific book from the `data` directory
    - `PATCH` request should update the book data in the `dummy.csv` file and in the csv file in the `data` directory that matches the `id` passed. The updated object should be sent back with the response.
    - `DELETE` request should remove the book data in the `dummy.csv` file and delete the csv file in the `data` directory that matches the `id` passed. A confirmation message should be sent back with the response.
- Any unauthorized methods to specific endpoints should send back an appropriate error message with the response.
- Appropriate unit testing using the `SuperTest` framework should guide your development.


#### Stretch Goals

- Create a "tracker cookie" as a session cookie that stores the ID of every get or post request of a book the client accesses
- Create an endpoint that allows for filtering books by their genres. The filtering should be dictated by query parameters passed in the URL
- Create a front-end to display the data coming from your API
- Using cookies, display books that have recently been viewed first

