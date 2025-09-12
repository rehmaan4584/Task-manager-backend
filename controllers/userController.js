const getAllUsers = (req,res) => {
    try {
        return res.json("hy how are you my user");
    } catch (error) {
        return error
    }
};

export default {getAllUsers}
