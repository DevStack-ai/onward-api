const express = require("express")
const router = express.Router()

const auth = require("../../firebase/auth")
const users = require('../../controllers/users')

router.get("/:uid", async (req, res) => {


    const uid = req.params.uid
    const document = await users.get(uid)

    if (!document.uid) {
        res.status(404).send({ message: "User not found" })
        return
    }

    res.status(200).send(document)

})
router.post("/", async (req, res) => {
    try {


        const password = req.body.password
        const email = req.body.email
        const role = req.body.role

        if (!email || !role || !password) {
            res.status(400).message({ message: "Missing required fields" })
            return;
        }

        const user = await auth.createUser({
            email: email,
            password: password,
        })

        const newUser = {
            uid: user.uid,
            email: email,
            role: role,
        }

        const uid = await users.create(newUser)
        res.status(201).send(uid)

    } catch (err) {
        console.log(err);
        if (err.toString() === "Error: The email address is already in use by another account.") {
            res.status(400).send({ message: "email taken" })
            return;
        }
        res.status(400).send({ message: "server error" })
        return;
    }
})
module.exports = router