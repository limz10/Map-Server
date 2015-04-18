# Map-Server
A server app for The Real Marauder's Map which includes the following:

1. A `/sendLocation` API that users can `POST` to. This API takes a `POST` request from the user and, if the input is correct, returns the data to the MongoDB. This works as it should.

2. A `/locations.json` API that users can `GET`. The user can make a `GET` request with a specific login, and this API will return a JSON of the latest entry for that specific login. If no login is provided, it returns empty. This works as it should.

3. An index page (`/`). When the user visits the index page, all of the current entries are listed. This works as it should.

Credit to Ming's example code.  Also, credit to Mengtian Li, who inspired me to use collection.update()


I spent about 20 hours on this project.
