import express from 'express'

const router = express.Router()

router.get('ALL/', (req, res) => {
    async function asyncStuff(){
        try{
            const uniqueSubreddits = await PostMessage.aggregate([
                {
                    $group: {
                        _id: "$subreddit",
                        uniqueSubreddits: { $addToSet: "$subreddit" }
                    }
                }
            ]);
            res.json(uniqueSubreddits);
        } catch(error){
            res.status(500).json({message: error.message})
        }
    }
    asyncStuff();
});

// router.post('/:subredditName', (req, res) => {
// })

// router.get('/', (req, res) => {
//     res.send('<h1>Hello from subs</h1>')
// })

// function findSubreddit(name){
//     let filteredData = data.filter(element => Object.keys(element)[0] === name)
//     console.log(filteredData)
//     //trying to actually work with json to manage
//     //unstrucred data is a nightmare, I see
//     //the necessity of mongodb now
//     if(filteredData.length === 1){
//         return Object.values(filteredData[0])[0]
//     }
//     return []
// }


export default router