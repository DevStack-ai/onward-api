const express = require("express")
const router = express.Router()

const auth = require("../../firebase/auth")
const { Users } = require("../../db/sequelize")
const { toWhere } = require('../helpers')


router.post("/table", async (req, res) => {
    try {
        const itemsPerPage = req.body.itemsPerPage
        const filters = req.body.filters || {}

        const hasFilters = Object.keys(filters).length
        const where = hasFilters ? toWhere(filters) : {}

        const page = req.body.page ? parseInt(req.body.page) : 1;
        const skip = itemsPerPage * page - itemsPerPage
        const order = [["createdAt", "DESC"]]
        const attributes = { exclude: ['password'] }

        const query = hasFilters ?
            Users.findAll({ where, order, offset: skip, limit: itemsPerPage, attributes }) :
            Users.findAll({ order, offset: skip, limit: itemsPerPage, attributes });

        const queryCount = hasFilters ?
            Users.count({ where }) :
            Users.count();

        const count = await queryCount
        const items = await query


        res.status(200).send({


            total: count,
            documents: items,
            pages: Math.ceil(count / itemsPerPage)
        })
    } catch (err) {
        console.log('err', err)
        res.status(500).send({ error: err.toString() })
    }
})
router.get("/:uid", async (req, res) => {
    const { uid } = req.params;
    try {
        const document = await Users.findOne({ where: { uid } });
        if (!document) {
            res.status(404).json("user not found");
            return;
        }

        res.json(document);

    } catch (err) {
        console.error(err);
        res.status(500).send({ error: err.toString() })

    }

})
router.post("/", async (req, res) => {
    try {
        const password = req.body.password
        const email = req.body.email
        const role = req.body.role
        try {
            const oldItem = await Users.findOne({ where: { email } });
            console.log("oldItem", oldItem)
            if (!oldItem) {

                const firebase_auth = await auth.createUser({
                    email: email,
                    password: password,
                })

                const newUser = {
                    uid: firebase_auth.uid,
                    email: email,
                    password: password,
                    role: role,
                }
                const document = new Users({ ...newUser })

                await document.save();
                res.status(200)
                res.json({ id: firebase_auth.uid })

            } else {
                res.status(400).json({
                    message: `Ya existe el usuario`
                });
            }
        } catch (err) {
            console.error(err);
            res.json({
                success: false,
                message: err
            });
        }
    } catch (err) {
        console.log('err', err)
        res.status(500).send({ error: err.toString() })
    }
})
router.post("/available/:field", async (req, res) => {

    const field = req.params.field
    const value = req.body[field] || ""
    const id = req.body.id

    const current = await Users.findOne({ _id: id })

    const exist = await Users.findOne({ [field]: value })

    res.send({ exist: !!exist && current?.email !== exist?.email })
})
router.put("/:uid", async (req, res) => {
    try {
        const uid = req.params.uid
        const fields = req.body

        const document = await Users.findOne({ where: { uid } });
        console.log(id, document)
        if (!document) {
            res.status(404).json("user not found");
            return;
        }

        if (fields.email) document.email = fields.email
        if (fields.name) document.name = fields.name

        await document.save()

        res.status(200).send(document)
    } catch (err) {
        console.log('err', err)
        res.status(500).send({ error: err.toString() })
    }
})
router.delete("/:uid", async (req, res) => {
    try {

        const uid = req.params.uid

        const user = await Users.findOne({ uid });
        await user.destroy()
        await auth.deleteUser(uid)

        res.status(201).send({ message: "deprecated successfully" })

    } catch (err) {
        console.log(err);

        res.status(400).send({ message: "server error" })
        return;
    }
})
module.exports = router