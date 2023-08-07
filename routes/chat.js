const express = require("express");
const app = express();
const router = express.Router();
const ChatObject = require("../models/chatSchema");
const SERVER_ERROR = "SERVER_ERROR";

// route for get all chat
router.get("/all", async (req, res) => {
  try {
    const data = await ChatObject.find({ organisation: req.body.organisation });
    return res.status(200).send({ ok: true, data });
  } catch (error) {
    console.log(error);
    res.status(500).send({ ok: false, code: SERVER_ERROR, error });
  }
});

// route for create new message in chat collection
router.post("/new", async (req, res) => {
  try {
    const data = await ChatObject.create({
      content: req.body.content,
      organisation: req.body.organisation,
      name: req.body.name,
      
    });
    return res.status(200).send({ data, ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ ok: false, code: SERVER_ERROR });
  }
});

module.exports = router;