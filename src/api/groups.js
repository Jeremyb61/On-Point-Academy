import { Router } from 'express';

var router = Router()

router.get('/api/groups/:id', (req, res) => {
    User.findOne({
        include: [{
            model: Group
        }],
        where: {
            id: req.params.id
        }
    }).then((usersGroups) => {
        if (!usersGroups) {
            console.log("NO DAT");
        } else {
            console.log("GROUPS!");
            res.json({
                usersGroups
            })
        }
    })
})

module.exports = router; 