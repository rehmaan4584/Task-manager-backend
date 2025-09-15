import User from '../models/user.js'
const getAllUsers = async (req,res) => {
    try {
        const allUsers = await User.find();
        console.log(allUsers,'all users'); 
        return res
        .status(200)
        .json({
            success: true,
            message: "All users fetched successfully",
            data: allUsers
        });
    } catch (error) {
        console.error(error);
        return res
        .status(400)
        .json({
            success: false,
            message: error
        });
    }
};

export default {getAllUsers}
