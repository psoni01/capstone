const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
require('dotenv').config;
const User = require("./model/Users");
const UserDetails = require("./model/UserDetails");
const AWS = require("aws-sdk");
// const s3 = new AWS.S3({
//   accessKeyId: `${process.env.AWS_S3_ACCESS_KEY_ID}`,
//   secretAccessKey: `${process.env.AWS_S3_SECRET_ACCESS_KEY}`
// });
const checkAuth = require("./validateJwt");
const s3 = new AWS.S3({
  accessKeyId: "AKIA37VNZNEMMRXAIFNX",
  secretAccessKey: "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"
});

const bodyParser = require('body-parser');

app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(checkAuth);
// Express 3.0
// app.use(express.json({ limit: '10mb' }));
// app.use(express.urlencoded({ limit: '10mb' }));
// app.use("cors");
// app.use(express.urlencoded({ extended: true }))
// app.use(express.json())


// app.use(bodyParser.urlencoded({limit: '5mb'}));

// app.use(bodyParser.json({limit: '5mb'}));

const connection = require("./db/connection.js");
const Post = require("./model/Posts");
const Notification = require("./model/Notifications");


connection.once("open", () => {
  const server = app.listen(process.env.PORT || 8080, () => {

    console.log(`Connected and listening on port ${process.env.PORT || 8080}`);
  })

})

app.post("/getUser", async (req, res) => {
  let useremail = req.body.email;

  console.log(req.body.email);
  UserDetails.findOne({ email: useremail })
    .then(results => {
      // console.log(results);
      res.status(200).json(results);
    })
    .catch(error => res.status(500).send(error));

})

app.get("/getUserByID/:id", async (req, res) => {
  let userid = req.params.id;

  // console.log(req.body.email);
  UserDetails.findOne({ _id: userid })
    .then(results => {
      // console.log(results);
      res.status(200).json(results);
    })
    .catch(error => res.status(500).send(error));

})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/postImage", async (req, res) => {
  // console.log(req)
  const uploadedImage = await s3
    .upload({
      Bucket: "capstone-jigglypuff",
      Key: req.body.key,
      Body: Buffer.from(req.body.data, "base64"),
      ContentType: req.body.contentType
    })
    .promise();
  console.log(uploadedImage);
  res.json({ data: uploadedImage });
  console.log("done");
  // res.send("Uploaded to S3!");
});


app.post("/savePost", async (req, res) => {

  console.log(req.body)

  let post = new Post({

    email: req.body.email,
    text: req.body.text,
    images: req.body.images

  });


  post
    .save()
    .then(result => {
      res.status(201).json({
        email: req.body.email,
        text: req.body.text,
        images: req.body.images
      });
    })
    .catch(error => {
      res.status(409).json({ error });
    });

});


app.get("/posts", async (req, res) => {

  Post.find({})
    .then(results => {

      // console.log(`posts : ${results}`);
      res.status(200).json(results);
    })
    .catch(error => res.status(500).send(error));

});

app.get("/posts/:id", async (req, res) => {

  Post.find({ _id: req.params.id })
    .then(results => {
      res.status(200).json(results);
    })
    .catch(error => res.status(500).send(error));

});

app.delete("/post/:id", async (req, res) => {
  Post.deleteOne({ _id: req.params.id }).then(
    result => {
      res.status(204).send();
    }
  ).catch(error => res.status(500).send(error));
})


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/postUser", async (req, res) => {

  // console.log(req.body)

  let user = new User({

    email: req.body.email,
    password: req.body.password,


  });


  user
    .save()
    .then(result => {
      res.status(201).json({
        email: req.body.email,
        password: req.body.password
      });
    })
    .catch(error => {
      res.status(409).json({ error });
    });

});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/postNotification", async (req, res) => {

  // console.log(req.body)

  const notification = new Notification({

    email: req.body.email,
    text: req.body.text,
    type: req.body.type,
    objectURI: req.body.objectURI

  });


  notification
    .save()
    .then(result => {
      res.status(201).send();
    })
    .catch(error => {
      res.status(409).json({ error });
    });

});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.patch("/expoToken", async (req, res) => {
  UserDetails.updateOne(
    { email: req.body.email },
    { expoToken: req.body.token }
  ).then(() => {
    console.log("expo token updated");
    res.status(201).send();
  }).catch(error => console.log(error));
});


app.get("/getExpoTokenByEmail/:email", async (req, res) => {

  const useremail = decodeURIComponent(req.params.email);

  // console.log(req.body.email);
  UserDetails.findOne({ email: useremail })
    .then(results => {
      // console.log(results);
      res.status(200).json(results.expoToken);
    })
    .catch(error => res.status(500).send(error));

})

app.get("/getExpoTokenByID/:id", async (req, res) => {

  // console.log(req.body.email);
  UserDetails.findOne({ _id: req.params.id })
    .then(results => {
      // console.log(results);
      res.status(200).json(results.expoToken);
    })
    .catch(error => res.status(500).send(error));

});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 

app.get("/getSuggestions/:email", async (req, res) => {
  const useremail = decodeURIComponent(req.params.email);
  // console.log(useremail);
  UserDetails.find({})
  .then((results) => {
    const resultArray = [];
    const resultID = [];
    for (i = 0; i < 4; i++) {
      let rand = Math.floor(Math.random() * results.length);
      const user = results.find(ele => {
        if(ele.email == useremail) {
          return ele;
        }
      });
      // console.log(user.age);
      while (results[rand].email == useremail || user.connections.includes(results[rand]._id) || resultID.includes(results[rand]._id)) {
        rand = Math.floor(Math.random() * results.length);
      }
      resultArray.push(results[rand]);
      resultID.push(results[rand]._id);
    }
    console.log("sending request")
    res.status(200).json(resultArray);
  })
  .catch((error) => res.status(500).send(error));

});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/postNotificationsByID", async (req, res) => {

  // console.log(req.body.email);

  // const useremail = decodeURIComponent(req.params.email);
  // let userid = req.params.id;

  // console.log(req.body.email);
  UserDetails.findOne({ _id: req.body.id })
    .then(results => {
      // console.log(results);
      // res.status(200).json(results);
      const notification = new Notification({

        email: results.email,
        text: req.body.text,
        type: req.body.type,
        objectURI: req.body.objectURI

      });


      notification
        .save()
        .then(result => {
          res.status(201).send();
        })
        .catch(error => {
          res.status(409).json({ error });
        });

    })
    .catch(error => res.status(500).send(error));

});

app.get("/getNotifications/:email", async (req, res) => {

  // console.log(req.body.email);

  const useremail = decodeURIComponent(req.params.email);
  Notification.find({ email: useremail }).sort({ createdAt: -1 })
    .then(results => {
      // console.log(results);
      res.status(200).json(results);
    })
    .catch(error => res.status(500).send(error));

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.post("/postUserDetails", async (req, res, next) => {

  // console.log(req.body.email, req.body.name, req.body.age, req.body.skills);

  let user = new UserDetails({
    name: req.body.name,
    skills: req.body.skills,
    email: req.body.email,
    gender: req.body.gender,
    age: req.body.age,
    image: req.body.image,
    interest: req.body.interest,
    education: req.body.education,
    job_title: req.body.jobtitle,
    bio: req.body.bio,
    location: req.body.location
    //  image:{
    //    data:fs.readFileSync(req.file.path),
    //    contentType:req.file.mimetype
    //  },

  });


  user
    .save()
    .then(result => {
      res.status(201).json({

      });
    })
    .catch(error => {
      res.status(409).json({ error });
    });

});

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/getConnections/:useremail", async (req, res) => {


  const useremail = decodeURIComponent(req.params.useremail);
  // console.log(useremail);
  UserDetails.findOne({ email: useremail }, { connections: 1 })
    .then(result => {
      // console.log(
      //   `Current Subscriptions of ${useremail} are ${result.library.toString()}`
      // );
      if (result != null) {
        res.status(200).json({ data: result.connections });
      } else {
        res.send([]);
      }
    })
    .catch(error => console.log(error));
  // res.send("failure");
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//  63519786034b5793ccaff24f
app.patch("/addConnectionToUser", async (req, res) => {
  let boolean = false;
  const connectionObjectID = req.body.connectionObjectID;
  const useremail = req.body.useremail;

  // console.log(connectionObjectID);
  // console.log(useremail);
  let user = await UserDetails.findOne({ email: useremail }, { connections: 1 })
    .then(result => {
      if (result.connections != null) {
        result.connections.map((id) => {
          if (id == connectionObjectID) {
            boolean = true;

          }
        });
      }

      if (!boolean) {

        UserDetails.updateOne(
          { email: useremail },
          { connections: [...result.connections, connectionObjectID] }
        )
          .then(() => {
            console.log("sending response");
            res.status(201).json({ data: [...result.connections, connectionObjectID] })
          })

          .catch(error => console.log(error));
      }
      else {
        res.json("Connection already added");
      }

    })
    .catch(error => console.log(error));
});


// below endpoint updates the connection array on user database to delete connection id from its connection.
// it takes connectionObjectID and useremail as request body parameters.
// it returns the updated library array in json format.
app.patch("/removeFromConnection", async (req, res) => {
  const connectionObjectID = req.body.connectionObjectID;
  const useremail = req.body.useremail;
  // console.log(plantObjectID);
  // console.log(useremail);
  UserDetails.findOne({ email: useremail }, { connections: 1 })
    .then(result => {
      // console.log(result.library);
      UserDetails.updateOne(
        { email: useremail },
        {
          connections: result.connections.filter(element => {
            if (element != connectionObjectID) {
              return element;
            }
          })
        }
      )
        .then(result2 => {
          // console.log(result2);
          // res.send()
          const updatedConnections = result.connections.filter(element => {
            if (element != connectionObjectID) {
              return element;
            }
          });
          res.send(updatedConnections);
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));

  // res.send("success");
});


//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


app.get("/getPinnedPosts/:useremail", async (req, res) => {


  const useremail = decodeURIComponent(req.params.useremail);
  // console.log(useremail);
  UserDetails.findOne({ email: useremail }, { pinned: 1 })
    .then(result => {
      // console.log(
      //   `Current Subscriptions of ${useremail} are ${result.library.toString()}`
      // );
      if (result != null) {
        console.log(`pinned : ${result.pinned}`);
        res.status(200).json({ data: result.pinned });
      } else {
        res.status(200).json({data:[]});
      }
    })
    .catch(error => console.log(error));
  // res.send("failure");
});


app.patch("/pinPostToUser", async (req, res) => {
  let boolean = false;
  const postObjectID = req.body.postObjectID;
  const useremail = req.body.useremail;

  // console.log(connectionObjectID);
  // console.log(useremail);
  let user = await UserDetails.findOne({ email: useremail }, { pinned: 1 })
    .then(result => {
      if (result.pinned != null) {
        result.pinned.map((id) => {
          if (id == postObjectID) {
            boolean = true;

          }
        });
      }

      if (!boolean) {

        UserDetails.updateOne(
          { email: useremail },
          { pinned: [...result.pinned, postObjectID] }
        )
          .then(() => {
            // console.log("sending response");
            res.status(201).json({ data: [...result.pinned, postObjectID] })
          })

          .catch(error => console.log(error));
      }
      else {
        res.json("Connection already added");
      }

    })
    .catch(error => console.log(error));
});


// below endpoint updates the connection array on user database to delete connection id from its connection.
// it takes connectionObjectID and useremail as request body parameters.
// it returns the updated library array in json format.
app.patch("/removePinPost", async (req, res) => {
  const postObjectID = req.body.postObjectID;
  const useremail = req.body.useremail;
  // console.log(plantObjectID);
  // console.log(useremail);
  UserDetails.findOne({ email: useremail }, { pinned: 1 })
    .then(result => {
      // console.log(result.library);
      UserDetails.updateOne(
        { email: useremail },
        {
          pinned: result.pinned.filter(element => {
            if (element != postObjectID) {
              return element;
            }
          })
        }
      )
        .then(result2 => {
          // console.log(result2);
          // res.send()
          const updatedConnections = result.pinned.filter(element => {
            if (element != postObjectID) {
              return element;
            }
          });
          res.send(updatedConnections);
        })
        .catch(error => console.log(error));
    })
    .catch(error => console.log(error));

  // res.send("success");
});
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* 
 API to get filtered search results

 Request Body example:
{
    "searchText" : "",
    "searchType": ["Herbaceous perennial", "Ground Cover", "Fern-Weed"],
    "searchForm" : ["Mounded","Compound, Fern-like"],
    "searchColor" : ["White", "Yellow"],
    "searchSeason" : [],
    "searchLocation" : ["Burnaby", "Vancouver"],
    "searchTexture" : []

}

Returns userDetails data in json format

*/
app.post("/searchResults", (req, res) => {
  // console.log("req.body");
  // console.log(req.body);
  let sendResults = [];
  const re = new RegExp(`.*${req.body.searchText}.*`, "i");
  console.log(re);
  // console.log(req.body.searchOptions.searchText);
  UserDetails.find({})
    .then(result => {
      // console.log(result);

      // Search Text Filter
      result.forEach(element => {
        if (
          req.body.searchText == "" ||
          re.test(element.name)
        ) {
          sendResults.push(element);
        }
      });

      // Gender Filter
      if (req.body.genderValue != null && req.body.genderValue.length >= 1) {
        // console.log("here");
        sendResults = sendResults.filter(element => {
          // console.log(req.body.plantType);
          // console.log(element.type);

          if (req.body.genderValue.includes(element.gender)) {
            return element;
          }
        });
      }

      // Age Filter
      if (req.body.ageValue != null && req.body.ageValue != "") {
        sendResults = sendResults.filter(element => {
          // console.log("***************************************************************");
          // console.log(element.season);
          if (req.body.ageValue == "Above18" && Number(element.age) > 18) {
            return element;
          }

          if (req.body.ageValue == "Above25" && Number(element.age) > 25) {
            return element;
          }

          if (req.body.ageValue == "Above40" && Number(element.age) > 40) {
            return element;
          }
        });
      }

      //City  Filter
      if (req.body.cityValue != null && req.body.cityValue != "") {
        const reCity = new RegExp(`.*${req.body.cityValue}.*`, "i");
        sendResults = sendResults.filter(element => {
          if (
            reCity.test(element.location)
          ) {
            return element;
          }
        });
      }

      // Country Filter
      if (req.body.countryValue != null && req.body.countryValue != "") {
        const reCountry = new RegExp(`.*${req.body.countryValue}.*`, "i");
        sendResults = sendResults.filter(element => {
          if (
            reCountry.test(element.location)
          ) {
            return element;
          }
        });
      }

      // Education Filter
      if (req.body.educationValue != null && req.body.educationValue.length >= 1) {
        // console.log("here");
        sendResults = sendResults.filter(element => {
          if (req.body.educationValue.includes(element.education)) {
            return element;
          }
        });
      }


      // job Filter
      if (req.body.jobValue != null && req.body.jobValue != "") {
        const reJob = new RegExp(`.*${req.body.jobValue}.*`, "i");
        sendResults = sendResults.filter(element => {
          if (
            reJob.test(element.job_title)
          ) {
            return element;
          }
        });
      }

      // Category Filter
      if (req.body.categoryValue != null && req.body.categoryValue != "") {
        sendResults = sendResults.filter(element => {
          if (element.skills == req.body.categoryValue) {
            return element;
          }
        });
      }

      res.send(sendResults);
    })
    .catch(error => console.log(error));
});



