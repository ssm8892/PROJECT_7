/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the project6 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");
const fs = require("fs");

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

// const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
//const models = require("./modelData/photoApp.js").models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));
app.use(session({ secret: "secretKey", resave: false, saveUninitialized: false }));
app.use(bodyParser.json());

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", async function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    try {

      const info = await SchemaInfo.find({});
      if (info.length === 0) {
        // No SchemaInfo found - return 500 error
        return response.status(500).send("Missing SchemaInfo");
      }
      console.log("SchemaInfo", info[0]);
      return response.json(info[0]); // Use `json()` to send JSON responses
    } catch (err) {
      // Handle any errors that occurred during the query
      console.error("Error in /test/info:", err);
      return response.status(500).json(err); // Send the error as JSON
    }

  } else if (param === "counts") {
    // If the request parameter is "counts", we need to return the counts of all collections.
    // To achieve this, we perform asynchronous calls to each collection using `Promise.all`.
    // We store the collections in an array and use `Promise.all` to execute each `.countDocuments()` query concurrently.


    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];

    try {
      await Promise.all(
        collections.map(async (col) => {
          col.count = await col.collection.countDocuments({});
          return col;
        })
      );

      const obj = {};
      for (let i = 0; i < collections.length; i++) {
        obj[collections[i].name] = collections[i].count;
      }
      return response.end(JSON.stringify(obj));
    } catch (err) {
      return response.status(500).send(JSON.stringify(err));
    }
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    return response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", async function (request, response) {
  if (!request.session.user) {
    return response.status(401).send('Unauthorized Access');
  } 
  try {
    const users = await User.find({}, '_id first_name last_name');
    return response.status(200).json(users);
  } catch (err) {
    console.error("Error fetching user list:", err);
    return response.status(400).json({ message: "Error fetching user list" });
  }
});


/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", async function (request, response) {
  const id = request.params.id;
  if (!request.session.user) {
    return response.status(401).send('Unauthorized Access');
  } 

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return response.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const user = await User.findById(new mongoose.Types.ObjectId(id)).select('-__v');
    if (!user) {
      console.log("User with _id:" + id + " not found.");
      return response.status(404).send("Not found");
    }
    return response.status(200).json(user);
  } catch (err) {
    console.error("Error fetching user:", err);
    return response.status(400).json({ message: "Error fetching user" });
  }
});



/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", async function (request, response) {
  const userId = request.params.id;
  if (!request.session.user) {
    return response.status(401).send('Unauthorized Access');
  } 

  // Check if userId is a valid ObjectId
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return response.status(400).send("Invalid user ID format");
  }

  try {
    const photos = await Photo.find({ user_id: new mongoose.Types.ObjectId(userId) }).select('-__v');

    if (!photos || photos.length === 0) {
      console.log("Photos for user with _id:" + userId + " not found.");
      return response.status(404).send("Not found");
    }

    const photosWithUserDetails = await Promise.all(
      photos.map(async (photo) => {
        const commentsWithUserDetails = await Promise.all(
          photo.comments.map(async (comment) => {
            const user = await User.findById(comment.user_id, '_id first_name last_name');

            const commentObject = comment.toObject({ versionKey: false });
            delete commentObject.user_id;

            return {
              ...commentObject,
              user: user ? user.toObject({ versionKey: false }) : null
            };
          })
        );

        return {
          ...photo.toObject({ versionKey: false }),
          comments: commentsWithUserDetails
        };
      })
    );

    return response.status(200).json(photosWithUserDetails);
  } catch (err) {
    console.error("Error fetching photos:", err);
    return response.status(400).json({ message: "Error fetching photos" });
  }
});






/**
 * URL /user/counts/:userId - Returns the count of photos and comments for a specific user.
 */
app.get("/user/counts/:userId", async function (request, response) {
  if (!request.session.user) {
    return response.status(401).send('Unauthorized Access');
  } 
  const userId = request.params.userId;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return response.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const photoCount = await Photo.countDocuments({ user_id: new mongoose.Types.ObjectId(userId) });
    const commentCount = await Photo.aggregate([
      { $unwind: "$comments" },
      { $match: { "comments.user_id": new mongoose.Types.ObjectId(userId) } },
      { $count: "count" }
    ]);

    return response.status(200).json({
      photoCount,
      commentCount: commentCount[0] ? commentCount[0].count : 0
    });
  } catch (err) {
    console.error("Error fetching user counts:", err);
    return response.status(500).json({ message: "Error fetching user counts" });
  }
});


/**
 * URL /commentsOfUser/:userId - Returns the comments for a specific user.
 */
app.get("/commentsOfUser/:userId", async function (request, response) {
  const userId = request.params.userId;
  if (!request.session.user) {
    return response.status(401).send('Unauthorized Access');
  } 

  try {

    const user = await User.findById(userId).select("first_name last_name");
    if (!user) {
      return response.status(404).json({ message: "User not found" });
    }


    const photos = await Photo.find({ "comments.user_id": userId }).select("comments file_name");


    const userComments = [];

    photos.forEach((photo) => {
      photo.comments.forEach((comment) => {
        if (comment.user_id.toString() === userId) {
          userComments.push({
            _id: comment._id,
            comment: comment.comment,
            photo_id: photo._id,
            photo_file_name: photo.file_name,
            user: { first_name: user.first_name, last_name: user.last_name }
          });
        }
      });
    });

    return response.status(200).json(userComments);
  } catch (err) {
    console.error("Error fetching comments with photos:", err);
    return response.status(500).json({ message: "Error fetching comments" });
  }
});


/**
 * URL /photo/:photoId - Returns the owner of the specific photo
 */
app.get("/photo/:photoId", async function (request, response) {
  const photoId = request.params.photoId;
  if (!request.session.user) {
    return response.status(401).send('Unauthorized Access');
  } 

  try {
    // Find the photo by its ID and return the user_id (owner)
    const photo = await Photo.findById(photoId).select("user_id");
    if (!photo) {
      return response.status(404).json({ message: "Photo not found" });
    }
    return response.status(200).json(photo);
  } catch (err) {
    console.error("Error fetching photo owner:", err);
    return response.status(500).json({ message: "Error fetching photo owner" });
  }
});



app.post('/admin/login', async (request, response) => {
  const loginName = request.body.login_name;
  const user = await User.findOne({ login_name: loginName });
  console.log("User: ", user);
  if (!user) {
    return response.status(400).send('Login failed');
  }

  request.session.user = user;
  response.send({ _id: user._id, first_name: user.first_name });
});

app.post('/admin/logout', (request, response) => {
  if (!request.session.user) {
    return response.status(400).send('Not logged in');
  }
  request.session.destroy();
  response.sendStatus(200);
});

app.post('/admin/currentUser', (request, response) => {
  if (!request.session.user) {
    return response.status(400).send('Not logged in');
  } 
  if (!request.session.user) {
    return response.status(400).send('Not logged in');
  }
  const user = request.session.user;
  response.send({ _id: user._id, first_name: user.first_name });
})

app.post("/commentsOfPhoto/:photo_id", async (request, response) => {
  const { photo_id } = request.params;
  const { comment } = request.body;

  if (!comment) {
    return response.status(400).send("Comment cannot be empty");
  }

  try {
    const photo = await Photo.findById(photo_id);
    if (!photo) {
      return response.status(404).send("Photo not found");
    }

    photo.comments.push({
      comment,
      user_id: request.session.user._id,
      date_time: new Date(),
    });
    await photo.save();

    console.log("Comment Added");
    return response.status(200).send("Comment added");
  } catch (err) {
    console.error("Error adding comment:", err);
    return response.status(500).json({ message: "Error adding comment" });
  }
});


app.post("/photos/new", upload.single("uploadedphoto"), async (req, res) => {
  // Check if the user is logged in
  if (!req.session.user) {
    return res.status(401).send("Unauthorized: Please log in to upload photos");
  }

  // Check if a file was uploaded
  if (!req.file) {
    return res.status(400).send("No file uploaded");
  }

  // Generate a unique filename
  const timestamp = Date.now();
  const filename = "U" + timestamp + req.file.originalname;

  try {
    // Save the file to the server
    fs.writeFileSync(`./images/${filename}`, req.file.buffer);

    // Create a new photo document
    const newPhoto = new Photo({
      file_name: filename,
      date_time: new Date(),
      user_id: req.session.user._id,
    });

    // Save the photo metadata in MongoDB
    await newPhoto.save();
    res.status(200).json(newPhoto); // Return the saved photo document as the response
  } catch (error) {
    console.error("Error uploading photo:", error);
    res.status(500).send("Error uploading photo");
  }
});




const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
    port +
    " exporting the directory " +
    __dirname
  );
});
