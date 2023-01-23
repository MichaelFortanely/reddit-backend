import express from 'express'
import UserModel from './UserSchema.js'
const UserRouter = express.Router()

UserRouter.get('/', async (req, res) => {
    //retrieve comments
        try{
            const user = await UserModel.find()
            res.json(user)
        } catch(error){
            res.status(500).json({message: error.message})
        }
})

// UserRouter.delete('/', async (req, res) => {
//     //retrieve comments
//         try{
//             const users = await UserModel.deleteMany()
//             res.json(users)
//         } catch(error){
//             res.status(500).json({message: error.message})
//         }
// })

UserRouter.get('/get_votes/:name', async (req, res) => {
    console.log(req.params)
    //retrieve comments
        try{
            // console.log('in special get')
            const user = await UserModel.find({user: req.params.name})
            // console.log('found user: ')
            // console.log(user)
            res.status(200).json(user)
        } catch(error){
            res.status(500).json({message: error.message})
        }
})

// UserRouter.patch('/add_view/:postID', async (req, res) => {
//     const {postID} = req.params
//     const {user} = req.body
//     console.log(req.body, req.params)
//     console.log('INSIDE USERROUTER GET postID: ' + postID + " user: " + user)
//     try{
//         const newUser = await UserModel.findOne({user: user})
//         console.log('newUser: ' + newUser)
//         let newPost = false
//         console.log(newUser.viewed_posts, typeof newUser.viewed_posts)
//         if(Array.from(newUser.viewed_posts).indexOf(postID) === -1){
//             newUser.viewed_posts.push(postID)
//             newPost = true
//             await newUser.save()
//         }
//         res.status(203).json({justAdded: newPost, updated_array: newUser.viewed_posts})
//         console.log('status sent')
//     } catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

// UserRouter.patch('/ask_if_viewed/:postID', async (req, res) => {
//     //check if user has postID in their viewed posts
//     const {postID} = req.params
//     const {user} = req.body
//     try{
//         const newUser = await UserModel.findOne({user: user})
//         console.log('newUser: ' + newUser)
//         res.status(203).json({viewed_status: Array.from(newUser.viewed_posts).filter(post => post === postID).length === 1})
//         console.log('status sent')
//     } catch(error){
//         res.status(500).json({message: error.message})
//     }
// })

UserRouter.post('/', async (req, res) => {
    const {user, password} = req.body
    //either create new user  and authorize loginorr just authorize login, or deny because password is incorrect

    //---> any new username will be assumed to be a new account creation
    console.log(user, password)
    console.log('here')
    try{
        const loggedInUser = await UserModel.findOne({user: user})
        if(loggedInUser){
            if(loggedInUser.password === password){
                //update status to logged in
                console.log('success')
                res.status(200).json({message: "User " + user + " successfully logged in :)", status: 200})
            } else{
                console.log('bad password')
                res.status(500).json({message: "Wrong password for user " + user , status: 300})
            }
        } else{
            const aUser = new UserModel({
            user: user,
            password: password,
            })
            //need to do a check that the user is unique
            try{
                const newUser = await aUser.save()
                console.log('new user')
                res.status(200).json({newAccount: newUser, status: 200, message: "Successfully created new user"})
            } catch(error){
                res.status(500).json({message: "Server error creating new user user " + user , status: 500})
            }

        }
    } catch(error){
        res.status(500).json({message: error.message})
    }

})


export default UserRouter