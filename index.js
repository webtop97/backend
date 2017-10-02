/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////CORE
var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser')

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////Ecommerce
//var stripe = require('stripe')('sk_test_Ox1PdVkCNtAlBaQi4CTGLzR1');
var stripe = require('stripe')('sk_live_qmbUYHirlLA6B7nxeQJYBDD3');



var passport = require('passport');
var formidable = require('formidable');
var fs = require('fs');


    //Create APP
    var app = express();

    //SET CORS
    app.use(cors());
    app.use(bodyParser.json());

    //Static Files
    app.use(express.static('public'));



    var request = require("request");
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var mongo = require('mongodb');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/noi-beta";
var legacy = "mongodb://13.210.31.113:27017/noisqldev";

//////////////////// List Products //////////////////////////////////////////////////
    app.post('/getProduct', function (req, res) {
                    res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                     console.log(req.body.id);

                    stripe.products.retrieve(
                          req.body.id,
                          function(err, product) {
                            // asynchronously called
                            res.send(JSON.stringify({ result: 'success', data: product }));
                          }
                        );
    });

 //////////////////// List Products //////////////////////////////////////////////////
    app.post('/getProducts', function (req, res) {
                    res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                     console.log(req.body);

                     stripe.products.list(
                          { limit: 100 },
                          function(err, products) {
                              console.log(products);
                            // asynchronously called
                            res.send(JSON.stringify({ result: 'success', data: products }));
                          }
                        );
    });


////////////////////////////////////////////////////////////////////////////////
        // Edit Product

                app.post('/products/edit', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        product = req.body.product;
                        var o_id = new mongo.ObjectID(product._id);
                        delete product._id;

                 MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var myquery = {'_id': o_id};
                      var newvalues = product;

                      db.collection("ProductComponent").updateOne(myquery, newvalues, function(err, resp) {
                        if (err) res.send(JSON.stringify({ result: 'fail', data: err }));
                            res.send(JSON.stringify({ result: 'success' }));
                        db.close();
                      });


                    });

                });





//////////////////// List Courses //////////////////////////////////////////////////

    app.post('/courses/list', function (req, res) {


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;

                      db.collection("Course").find({
                           "StartDate" : {"$gte": new Date()}

                            }).sort( { StartDate: 1 }).limit(10).toArray(function(err, result) {

                                //Report Results
                                if(result.length){
                                    res.send(JSON.stringify({ result: 'success', data: result }));
                                }else{
                                    res.send(JSON.stringify({ result: 'fail', data: req.body }));
                                }


                                db.close();
                            });
                    });



    });


//////////////////// List Resource //////////////////////////////////////////////////

    app.post('/resources/list', function (req, res) {


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;

                      db.collection("Resource").find().toArray(function(err, result) {

                                //Report Results
                                if(result.length){
                                    res.send(JSON.stringify({ result: 'success', data: result }));
                                }else{
                                    res.send(JSON.stringify({ result: 'fail', data: req.body }));
                                }


                                db.close();
                            });
                    });



    });


//////////////////// List Users //////////////////////////////////////////////////

    app.post('/users/list', function (req, res) {
                          res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                     page = req.body.page;
                     pageSize = req.body.pageSize;

                        console.log(req.body);

                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;


                      //Get Count
                      db.collection("UserContact").count(function(err, count) {

                            //Query
                            db.collection("UserContact").find().skip((page-1) * pageSize).limit(pageSize).toArray(function(err, result) {


                                    res.send(JSON.stringify({ result: 'success', data: result, total: count }));



                                db.close();
                            });
                    });



                      });





    });


    //////////////////// Search Users //////////////////////////////////////////////////

    app.post('/users/search', function (req, res) {
                          res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                     page = req.body.page;
                     pageSize = req.body.pageSize;
                     query = req.body.query;



                        console.log(req.body);

                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;


                      //Get Count
                      db.collection("UserContact").find({ $or: [ { FirstName: {'$regex': query} }, { LastName: {'$regex': query} }, { Email: {'$regex': query} } ] }).count(function(err, count) {


                            //Query
                            db.collection("UserContact").find({ $or: [ { FirstName: {'$regex': query} }, { LastName: {'$regex': query} }, { Email: {'$regex': query} } ] }).skip((page-1) * pageSize).limit(pageSize).toArray(function(err, result) {


                                    res.send(JSON.stringify({ result: 'success', data: result, total: count }));



                                db.close();
                            });
                    });



                      });





    });




 ////////////////////////////////////////////////////////////////////////////////
        // Get USER

                app.post('/users/detail', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        id = req.body.id;

                        var o_id = new mongo.ObjectID(id);


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { id: id };
                      db.collection("UserContact").find({'_id': o_id}).toArray(function(err, result) {

                        //Report Results
                        if(result.length){
                            res.send(JSON.stringify({ result: 'success', data: result }));
                        }else{
                            res.send(JSON.stringify({ result: 'fail', data: req.body }));
                        }


                        db.close();
                      });
                    });

                });


 ////////////////////////////////////////////////////////////////////////////////
        // Edit USER

                app.post('/users/edit', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        user = req.body.user;
                        var o_id = new mongo.ObjectID(user._id);
                        delete user._id;

                 MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var myquery = {'_id': o_id};
                      var newvalues = user;

                      db.collection("UserContact").updateOne(myquery, newvalues, function(err, resp) {
                        if (err) res.send(JSON.stringify({ result: 'fail', data: err }));
                            res.send(JSON.stringify({ result: 'success' }));
                        db.close();
                      });


                    });

                });




     ////////////////////////////////////////////////////////////////////////////////
        // Create USER
            app.post('/users/create', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                       console.log(req.body.user);

                       MongoClient.connect(legacy, function(err, db) {
                          if (err) throw err;

                          db.collection("UserContact").insertOne(req.body.user, function(err, resp) {
                            if (err) res.send(JSON.stringify({ result: 'fail', message: err }));
                            res.send(JSON.stringify({ result: 'success', data: req.body }));
                            db.close();
                          });
                        });
                });



//////////////////// Search //////////////////////////////////////////////////
app.post('/search', function (req, res) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');

        page = req.body.page;
        pageSize = req.body.pageSize;
        query = req.body.query;
            if(query._id) query._id = new mongo.ObjectID(query._id);
        table = req.body.table;

        sort = {};
        if(req.body.sort) sort = req.body.sort;
        console.log(req.body);
        //Check Database
        MongoClient.connect(legacy, function(err, db) {
            if (err) throw err;
            //Get Count
            db.collection(table).find(query).count(function(err, count) {
                //Query
                db.collection(table).find(query).sort(sort).skip((page-1) * pageSize).limit(pageSize).toArray(function(err, result) {
                    return res.send(JSON.stringify({ result: 'success', data: result, total: count }));
                    db.close();
                });
            });
        });
});

////////////////////////////////////////////////////////////////////////////////
// FileUpload
    app.post('/upload', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log('running upload!');


             var formidable = require('formidable');
             var form = new formidable.IncomingForm();
                form.parse(req, function (err, fields, files) {

                   console.log(files.file);

                    var oldpath = files.file.path;
                    var newpath = '/var/www/html/uploads/' + files.file.name;

                      fs.rename(oldpath, newpath, function (err) {
                        if (err) throw err;
                         res.send(JSON.stringify({ result: 'success', data: files.file.name}));

                      });




                });

            //


    });




////////////////////////////////////////////////////////////////////////////////
// Save
    app.post('/save', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log(req.body);

               query = {};
               table = req.body.table;
               obj = req.body.obj;
                if(obj._id) {
                    o_id = new mongo.ObjectID(obj._id);
                    delete obj._id;
                }else{
                    o_id = new mongo.ObjectID();
                }

                query = {'_id': o_id};

                console.log(query);

               MongoClient.connect(legacy, function(err, db) {
                  if (err) throw err;

                  db.collection(table).updateOne(query, obj, {upsert: true}, function(err, resp) {
                    if (err) res.send(JSON.stringify({ result: 'fail', data: err }));
                        res.send(JSON.stringify({ result: 'success', data: resp }));
                    db.close();
                  });
                });
        });


        ////////////////////////////////////////////////////////////////////////////////
// Save
    app.post('/dropComment', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log(req.body);



                //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { Email: req.body.user.email, Password: req.body.user.password };
                      db.collection("UserContact").find(query).toArray(function(err, result) {

                        //Report Results
                        if(result.length){
                            user = result[0];

                        }else{
                           user = {
                               FirstName: 'Anonymous'
                           }
                        }

                        var isodate = new Date().toISOString()
                        comment = {
                            comment_author: user.FirstName + ' ' + user.LastName,
                            comment_date: isodate,
                            comment_content: req.body.reply
                        }







                        db.collection("posts").update(
                            { "slug":  req.body.id },
                            { "$push": {"comments": comment } },
                            function(err, res) {

                                console.log(res);

                            });






                        return res.send(JSON.stringify({ result: 'success', user: user }));

                             db.close();
                      });
                    });





        });


       function getUserDetails(user){



       }


   ////////////////////////////////////////////////////////////////////////////////
// Save
    app.post('/delete', function (req, res) {
             res.header('Access-Control-Allow-Origin', '*');
             res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
             res.header('Access-Control-Allow-Headers', 'Content-Type');
             res.setHeader('Content-Type', 'application/json');
             console.log(req.body);


               table = req.body.table;
               id = req.body.id;
               o_id = new mongo.ObjectID(id);

               MongoClient.connect(legacy, function(err, db) {
                  if (err) throw err;

                 db.collection(table).deleteOne({ '_id': o_id }, function(err, results) {
                     if (err) return res.send(JSON.stringify({ result: 'fail', data: err }));
                     return res.send(JSON.stringify({ result: 'success', data: results }));
                 });


                });
        });





        ////////////////////////////////////////////////////////////////////////////////
        // Login USER

                app.post('/login', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');

                        email = req.body.email;
                        password = req.body.password;

                        if(!email || !password){
                             res.send(JSON.stringify({ result: 'fail', data: 'No Data' }));
                              return false;
                             }


                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { Email: email, Password: password };
                      db.collection("UserContact").find(query).toArray(function(err, result) {

                        //Report Results
                        if(result.length){

                            response = {
                                email: email,
                                password: password,
                                IsStaff: result[0].IsStaff,
                                IsCourseHost: result[0].IsCourseHost,
                                IsFaculty: result[0].IsFaculty
                            }

                            res.send(JSON.stringify({ result: 'success', data: result[0] }));
                        }else{
                            res.send(JSON.stringify({ result: 'fail', data: req.body }));
                        }


                        db.close();
                      });
                    });

                });



     ////////////////////////////////////////////////////////////////////////////////
        // Order

                app.post('/order', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');




                     //Create New Order
                        stripe.orders.create({
                          currency: 'aud',
                          items: req.body.cart,
                          shipping: {
                            name: req.body.shipping.recipient,
                            address: {
                              line1: req.body.shipping.line1,
                              city: req.body.shipping.city,
                              state: req.body.shipping.state,
                              country: req.body.shipping.country,
                              postal_code: req.body.shipping.postalCode
                            }
                          },
                          email: req.body.user.email
                        }, function(err, order) {
                             if(err) return res.send(JSON.stringify({ fail: true, error: err.message }));
                             var order_id = order.id;
                             if(req.body.charge){
                                 //Create Charge Token
                                 stripe.tokens.create({
                                      card: {
                                        "number": req.body.payment.cc,
                                        "exp_month": req.body.payment.expMonth,
                                        "exp_year": req.body.payment.expYear,
                                        "cvc": req.body.payment.cvc
                                      }
                                    }, function(err, token) {
                                        if(err)return res.send(JSON.stringify({ fail: true, error: err.message }));
                                        var token_id = token.id;

                                        //Charge
                                           stripe.orders.pay(order_id, {
                                              source: token_id // obtained with Stripe.js
                                            }, function(err, order) {
                                               if(err)return res.send(JSON.stringify({ fail: true, error: err.message }));
                                               //allocateDownloads(req.body.order);
                                               return res.send(JSON.stringify({ success: true, data: order }));
                                            });
                                 });
                            }else{
                                 //Return Totals
                                  return res.send(JSON.stringify({ success: true, data: order }));
                             }


                        });



                            //Return Totals






               });


             function allocateDownloads(order){
                 for (var i = 0, len = order.cart.length; i < len; i++) {
                        if(order.cart[i].download) createDownload(order.user, order.cart[i].download);
                 }

             }

             function createDownload(user, download){
                        var download = {
                            user: user,
                            download: download
                        }

                        MongoClient.connect(legacy, function(err, db) {
                          if (err) throw err;

                          db.collection("downloads").insertOne(download, function(err, resp) {
                            if (err){
                                 console.log(err);
                                 }else{
                                     console.log('Download Created!');
                                 }

                            db.close();
                          });
                        });

             }


        ////////////////////////////////////////////////////////////////////////////////
        // Download

                app.get('/download/:id', function (req, res) {
                    var id = req.params.id;
                    var o_id = new mongo.ObjectID(id);

                    var filename = null;

                    //Check Database
                    MongoClient.connect(legacy, function(err, db) {
                      if (err) throw err;
                      var query = { id: id };
                      db.collection("downloads").find({'_id': o_id}).toArray(function(err, result) {
                        console.log(result[0].download);
                            filename = result[0].download;
                            var file = '/var/www/html/uploads/' + filename;
                            res.download(file); // Set disposition and send it.

                        db.close();
                      });
                    });


                });



        ////////////////////////////////////////////////////////////////////////////////
        // SignUP USER

                app.post('/signup', function (req, res) {
                     res.header('Access-Control-Allow-Origin', '*');
                     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
                     res.header('Access-Control-Allow-Headers', 'Content-Type');
                     res.setHeader('Content-Type', 'application/json');


                       console.log(req.body.signup);
                       let q = { Email: req.body.signup.email, Password: req.body.signup.password}
                       MongoClient.connect(legacy, function(err, db) {
                          if (err) throw err;

                          db.collection("UserContact").insertOne(q, function(err, resp) {
                            if (err) res.send(JSON.stringify({ result: 'fail', message: err }));
                            res.send(JSON.stringify({ result: 'success', data: req.body }));
                            db.close();
                          });
                        });
                });



        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        //////////////////////////////// //SETUP SERVER     ////////////////////////////////////////////////////////////////////////////////
           var server = app.listen(8080, function () {
           var host = server.address().address
           var port = server.address().port

           console.log("Example app listening at http://%s:%s", host, port)
        })
