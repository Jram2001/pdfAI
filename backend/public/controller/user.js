const createNewUser = (req, res) => {
    try {
        const { username, email, password } = req.body();
        if (!username || !email || !password) {
            res.status(400).json({ "messaeg": "Missing required feilds" })
        }
        

    } catch (error) {
        res.status(500).json({ "messaeg": "Error creating user", "error": error })
    }
} 