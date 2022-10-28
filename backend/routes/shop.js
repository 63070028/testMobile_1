const express = require('express');
const firebase = require('../config');
const multer = require('multer');
const uuid = require('uuid');

const router = express.Router();

// const storage = multer.diskStorage({
//     destination(req, file, callback) {
//       callback(null, './images');
//     },
//     filename(req, file, callback) {
//       callback(null, `${file.fieldname}_${Date.now()}_${file.originalname}.jpg`);
//     },
//   });
//   const upload = multer({ storage r});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

router.post("/addFood", upload.single('myImage'), async(req, res)=>{
    console.log(req.body);
    console.log(req.file);

    const storage = firebase.storage();
    const bucket = storage.bucket();


    const folder = 'profile'
    const token = uuid.v1();
    const name = uuid.v1();
    const fileName = `${folder}/${name}`
    const fileUpload = bucket.file(fileName);
    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        metadata: {
          firebaseStorageDownloadTokens: token
        }
      }
    })

    blobStream.on('error', (err) => {
      res.status(405).json(err);
    });

    blobStream.on('finish', () => {
        res.status(200).send('Upload complete!');
    });
    blobStream.end(req.file.buffer); 
    
    const data = {"shop_id":req.body.shop_id, "name":req.body.name, "price":req.body.price, "category":req.body.category, url:"https://firebasestorage.googleapis.com/v0/b/" + bucket.name +"/o/"+ folder + "%2F"  + name + "?alt=media&token=" + token }    
    await firebase.firestore().collection("Foods").doc().set(data);



});

router.get("/getFoodDelicatessens", upload.single('myImage'), async(req, res)=>{
  console.log("getFoodDelicatessens Shop: "+ req.query.shop_id);
  

  // เรียกวิธีการเพื่อรับข้อมูล
  const snapshot = await firebase.firestore().collection('Foods').where("shop_id", "==", req.query.shop_id).where("category", "==", "delicatessen").get()
  console.log(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))

  res.send(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))

  // ตั้งค่าผู้ฟังให้รับเหตุการณ์การเปลี่ยนแปลงข้อมูล
  //  firebase.firestore().collection('Foods').onSnapshot((snapshot)=>{
  //   console.log(snapshot.docs.map(doc => doc.data()))
  // });

});

router.get("/getFoodCookeOrder", upload.single('myImage'), async(req, res)=>{
  console.log("getFoodCookeOrder Shop: "+ req.query.shop_id);
  

  // เรียกวิธีการเพื่อรับข้อมูล
  const snapshot = await firebase.firestore().collection('Foods').where("shop_id", "==", req.query.shop_id).where("category", "==", "cookeorder").get()
  console.log(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))

  res.send(snapshot.docs.map((doc) => ({id: doc.id, ...doc.data()})))

  // ตั้งค่าผู้ฟังให้รับเหตุการณ์การเปลี่ยนแปลงข้อมูล
  //  firebase.firestore().collection('Foods').onSnapshot((snapshot)=>{
  //   console.log(snapshot.docs.map(doc => doc.data()))
  // });

});

exports.router = router;