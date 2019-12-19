const server = require('./server.js');

const PORT = process.env.PORT || 4000;

const db = require('./data/dbConfig');

server.get("/", async (req, res, next) => {
	try {
		res.json(await db("accounts").select())
	} catch (err) {
		next(err)
	}
})

server.get("/:id", validateAccountId, async (req, res, next) => {
	try {
		res.json(await db("accounts").where("id", req.params.id).first())
	} catch (err) {
		next(err)
	}
})

server.post("/", async (req, res, next) => {
	try {
		const payload = {
			name: req.body.name,
			budget: req.body.budget,
		}
		const [id] = await db("accounts").insert(payload)
		res.json(await db("accounts").where("id", id).first())
	} catch (err) {
		next(err)
	}
})

server.put("/:id", validateAccountId, async (req, res, next) => {
	try {
		const payload = {
			name: req.body.name,
			budget: req.body.budget,
		}

		await db("accounts").where("id", req.params.id).update(payload)
		res.json(await db("accounts").where("id", req.params.id).first())
	} catch (err) {
		next(err)
	}
})

server.delete("/:id", validateAccountId, async (req, res, next) => {
	try {
		await db("accounts").where("id", req.params.id).del()
		res.status(204).send({success: "Account Deleted"})
	} catch (err) {
		next(err)
	}
})

async function validateAccountId(req, res, next) {
	try {
		const account = await db("accounts").where("id", req.params.id).first()
		if (account) {
			next()
		} else {
			res.status(404).json({ message: "Account not found" })
		}
	} catch (err) {
		next(err)
	}
}

module.exports = server

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});