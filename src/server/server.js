const express = require('express');
const app = express();

// Middleware
const cors = require('cors');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
var session = require('express-session');
const path = require('path');
const multer = require('multer')

// Vimeo Middleware
const Vimeo = require('vimeo').Vimeo;
let client = new Vimeo(
    "b411a1d05735161f6718803310de6df46fb9276d",
    "jyKGnpSQ9Nc70GbWIQIwoXH2xiZLCTILenWO5Uaii8uKcjekr4FPJV7r/ulQpdq46qAwch0kJ2k3P/Wa3tTCBJ36DqPQs39vzFdcm9eb1qS5UOnIIbOUHQe4fzqYmKmj",
    "ccacce370109c328e26739098d92f14e"
);

app.use(bodyParser.json());

app.use(cors({
    credentials: true,
    origin: ['http://localhost:8080']
}));

// Session Config
app.set('trust proxy', 1)
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60000 * 60 * 24
    }
}));


//Image upload start


// Set Storage Engine
const storage = multer.diskStorage({
    destination: '../assets/uploads',
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})

// Init Upload
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
})

// Validate Image Type
function checkFileType(file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb(new Error("Images only!"));
    }

}
//Image upload end

// const errArray = [];
// const getErrorResponse = (req,res, next) => {
//     res.json({
//         errArray
//     })
// }


// DB Config
const sequelize = new Sequelize('onPointAccademy', 'root', 'root', {
    host: 'localhost',
    dialect: 'mysql'
});
const Model = Sequelize.Model;
sequelize
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

// DB Models
class User extends Model { }
User.init({
    user_name: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Please enter a username'
            },
            len: {
                args: [3, 30],
                msg: 'Username must be at least 3 characters'
            },
            isAlphanumeric: {
                args: true,
                msg: 'Username must be only contain letters and numbers'
            },
            isUnique: function (value, next) {
                User.findAll({ where: { user_name: value } })
                    .then(function (user) {
                        // reject if a different user wants to use the same email
                        if (user[0]) {
                            return next('Username already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                    })
            }
        }
    },
    first_name: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Please enter your first name'
            },
            len: {
                args: [2, 25],
                msg: 'First name must be at least 2 characters'
            },
            isAlpha: {
                args: true,
                msg: 'First name must only contain letters'
            }
        }
    },
    last_name: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Please enter your last name'
            },
            len: {
                args: [2, 30],
                msg: 'Last name must be at least 2 characters'
            },
            isAlpha: {
                args: true,
                msg: 'Last name must only contain letters'
            }
        }
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Please enter your email'
            },
            isEmail: {
                args: true,
                msg: 'Email must be a valid format. Example: email@email.com'
            },
            isUnique: function (value, next) {
                User.findAll({ where: { email: value } })
                    .then((user) => {
                        // reject if a different user wants to use the same email
                        if (user[0]) {
                            console.log(`FDFSDFSDFSDF`, user);
                            return next('Email already in use!');
                        }
                        return next();
                    })
                    .catch(function (err) {
                        return next(err);
                    })
            }
        }
    },
    image: {
        type: Sequelize.STRING,
        defaultValue: "../assets/large-profile-icon.jpg"
    }
    ,
    password: {
        type: Sequelize.STRING,
        validate: {
            notEmpty: {
                args: true,
                msg: 'Please create a password'
            },
            len: {
                args: [8, 100],
                msg: 'Password must be 8 or more characters'
            }
        }
    }
}, { sequelize, modelName: 'users' });

User.addHook('afterValidate', (user, options) => {
    user.password = bcrypt.hashSync(user.password, 12);
});

class PersonalChapter extends Model { }
PersonalChapter.init({
    title: {
        type: Sequelize.STRING,
        validate: {
            allowNull: {
                args: false,
                msg: 'Field cannot be blank'
            },
            notEmpty: {
                args: true,
                msg: 'Field cannot be blank'
            }
        }
    }
}, { sequelize, modelName: 'personal_chapter' });

class PersonalCourse extends Model { }
PersonalCourse.init({
    title: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.TEXT
    },
    content: {
        type: Sequelize.TEXT
    },
    video_url: {
        type: Sequelize.TEXT
    }
},
    { sequelize, modelName: 'personal_course' });

class Group extends Model { }
Group.init({
    title: {
        type: Sequelize.STRING
    }
},
    { sequelize, modelName: 'groups' });

class GroupChapter extends Model { }
GroupChapter.init({
    title: {
        type: Sequelize.STRING
    }
},
    { sequelize, modelName: 'group_chapters' })

class GroupCourse extends Model { }
GroupCourse.init({
    title: {
        type: Sequelize.STRING,
    },
    description: {
        type: Sequelize.TEXT
    },
    content: {
        type: Sequelize.TEXT
    },
    video_url: {
        type: Sequelize.TEXT
    }
},
    { sequelize, modelName: 'group_course' })

class PersonalCourseQuestion extends Model { }
PersonalCourseQuestion.init({
    question_content: {
        type: Sequelize.TEXT
    }
},
    { sequelize, modelName: 'personal_course_questions' });

class GroupCourseQuestion extends Model { }
GroupCourseQuestion.init({
    question_content: {
        type: Sequelize.TEXT
    }
},
    { sequelize, modelName: 'group_course_questions' });

class PersonalAnswer extends Model { }
PersonalAnswer.init({
    answer_content: {
        type: Sequelize.TEXT
    },
},
    { sequelize, modelName: 'personal_course_answers' })

class GroupCourseAnswer extends Model { }
GroupCourseAnswer.init({
    answer_content: {
        type: Sequelize.TEXT
    }
},
    { sequelize, modelName: 'group_course_answers' })

//////////////////////// -- One - to - Many --///////////////////////////////////////////////

PersonalChapter.hasMany(PersonalCourse, { foreignKey: 'personal_chaptersId' });

GroupChapter.hasMany(GroupCourse, { foreignKey: 'group_chaptersId' })

GroupCourse.hasMany(GroupCourseQuestion, { foreignKey: 'group_courseId' })
PersonalCourse.hasMany(PersonalCourseQuestion, { foreignKey: 'personal_courseId' })

//////////////////////// -- Many - to - Many -- ////////////////////////////////////////////

// Tracks which personal chapters a user has completed
User.belongsToMany(PersonalChapter, { through: 'personal_chapter_completes' })
PersonalChapter.belongsToMany(User, { through: 'personal_chapter_completes' })

// Tracks which personal courses a user has completed
User.belongsToMany(PersonalCourse, { through: 'personal_course_completes' })
PersonalCourse.belongsToMany(User, { through: 'personal_course_completes' })

// Tracks which user belongs to which group
User.belongsToMany(Group, { through: 'users_in_groups' })
Group.belongsToMany(User, { through: 'users_in_groups' })

// Tracks the GROUP COURSES that a USER completes
User.belongsToMany(GroupCourse, { through: 'group_course_completes' })
GroupCourse.belongsToMany(User, { through: 'group_course_completes' })

// Tracks the group CHAPTERS that a GROUP completes
Group.belongsToMany(GroupChapter, { through: 'group_chapter_completes' })
GroupChapter.belongsToMany(Group, { through: 'group_chapter_completes' })

// Tracks which answers belong to which user/personal course question
User.belongsToMany(PersonalCourseQuestion, { through: 'personal_course_answers' })
PersonalCourseQuestion.belongsToMany(User, { through: 'personal_course_answers' })

// Tracks which answer belongs to which user/group course question
User.belongsToMany(GroupCourseQuestion, { through: 'group_course_answers' })
GroupCourseQuestion.belongsToMany(User, { through: 'group_course_answers' })


sequelize.sync({
    // force: true 
});


// Routes
const Op = Sequelize.Op;

// Register user
app.post('/api/user', (req, res) => {
    if (req.body.password != req.body.confirmPassword) {
        res.json({
            status: false,
            msg: 'Passwords must match!'
        })
    } else {
        User.create({
            user_name: req.body.username,
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
        }).then((user) => {
            console.log("POST METHOD DATA-------- ", user.dataValues);
            res.json({
                user,
            });
        }).catch((error) => {
            console.log('CATCHING ERROR on create---- ', error);
            res.json({
                error,
            });
        });
    }
})

// Login User
app.post('/api/user/login', (req, res) => {
    User.findOne({
        where: {
            user_name: req.body.username
        }
    }).then((user) => {
        if (!user) {
            res.json({
                status: false,
                msg: 'Username does not exist'
            });
        } else {
            bcrypt.compare(req.body.password, user.dataValues.password, (err, result) => {
                console.log("DFSDFSDFS", user);
                if (err) {
                    console.log('ERROR at bcrpt compare', err);
                    res.json({
                        err
                    });
                } else if (result === false) {
                    res.json({
                        status: false,
                        msg: 'Invalid username or password'
                    });
                } else {
                    res.json({
                        user
                    })
                }
            })
        }
    })
})

// Get User for Profile
app.get('/api/user/:id', (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    }).then((user) => {
        if (!user) {
            console.log("NO USER");
        } else {
            res.json({
                user
            })
        }
    })
})

//Get Personal Chapters
app.get('/api/chapters', (req, res) => {
    PersonalChapter.findAll({
        include: [
            {
                model: PersonalCourse,
                include: [
                    { model: User }
                ]
            }
        ]
    }).then((data) => {
        if (!data[0]) {
            console.log("NO DATA/api/groups/chapters")
        } else {
            res.json({
                data
            })
        }
    })
})

// Get Users Groups
app.get('/api/groups/:id', (req, res) => {
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

// Get Group Chapters
app.get('/api/chapters/groups', (req, res) => {
    GroupChapter.findAll({
        include: [{
            model: GroupCourse
        }]
    })
        .then((data) => {
            if (!data[0]) {
                console.log("NO DATA")
            } else {
                res.json({
                    data
                })
            }
        })
})

// Get Group title
app.get('/api/group/:group', (req, res) => {
    Group.findOne({
        where: {
            title: req.params.group
        }
    }).then((group) => {
        res.json({
            group
        })
    });
});

// Get list of other groups that user is in
app.get('/api/othergroups/:id/:group', (req, res) => {
    User.findOne({
        include: [{
            model: Group,
            where: {
                title: {
                    [Op.ne]: req.params.group
                }
            }
        }],
        where: {
            id: req.params.id,
        }
    }).then((usersGroups) => {
        if (!usersGroups) {
            console.log("NO DAT");
        } else {
            console.log("GROUPS!", usersGroups);
            res.json({
                usersGroups
            })
        }
    })
})

// Get Course Content
app.get('/api/course/:id', (req, res) => {
    PersonalCourse.findOne({
        include: [{
            model: PersonalCourseQuestion,
        }],
        where: {
            id: req.params.id
        }
    }).then((course) => {
        client.request({
            method: 'GET',
            path: '/videos/335717725'
        }, function (error, body, status_code, headers) {
            if (error) {
                console.log("dFSDFSDFSDFSDF", error);
            }
            // console.log("BODY!!!!!!!", body);
            res.json({
                course,
            })
        })
    })
})

//Submit Course answers
app.post('/api/answers/:userId', (req, res) => {
    // const errArray = [];
    // const dataArray = [];
    // const getResponseData = (req, res, next) => {
    //     res.json({
    //         dataArray
    //     })
    // }
    console.log(req.params)
    console.log(req.body)
    PersonalAnswer.findOne({
        where: {
            [Op.and]: [
                { personalCourseQuestionId: req.body.questionId },
                { userId: req.params.userId }
            ]
        }
    }).then((answer) => {
        if (!answer) {
            console.log("NO ANSWER!")
            PersonalAnswer.create({
                answer_content: req.body.answer,
                personalCourseQuestionId: req.body.questionId,
                userId: req.params.userId,
            }).then((newAnswerSub) => {
                res.json({
                    newAnswerSub
                })
            }).catch((err) => {
                res.json({
                    err
                })
            })
        } else {
            answer.update({
                answer_content: req.body.answer
            }).then((newAnswer) => {
                res.json({
                    newAnswer
                })
            }).catch((err) => {
                res.json({
                    err
                })
            })
        }
    }).catch((err) => {
        res.json({
            err
        })
    })

})
app.post('/api/submit-complete/:userId/:courseId', (req, res) => {
    sequelize.query('SELECT * FROM personal_course_completes WHERE userId = ? And personalCourseId = ? LIMIT 1',
        {
            replacements:
                [
                    req.params.userId,
                    req.params.courseId
                ], type: sequelize.QueryTypes.SELECT
        }
    ).then((courseCompletes) => {
        if (!courseCompletes[0]) {
            PersonalCourse.findOne({
                where: {
                    id: req.params.courseId
                }
            }).then((pCourse) => {
                pCourse.setUsers(
                    req.params.userId
                ).then((completion) => {
                    res.json({
                        completion
                    })
                }).catch((err) => {
                    res.json({
                        err
                    })
                })
            }).catch((err) => {
                res.json({
                    err
                })
            })
        } else {
            res.json({
                courseCompletes
            })
        }
    })
})
app.put('/api/image/:id', upload.single('image'), (req, res) => {
    User.findOne({
        where: {
            id: req.params.id
        }
    }).then((user) => {
        let file = req.file.path.replace("..","@");
        console.log(file)
        user.update({
            image: file
        }).then((user) => {
            console.log(user);
        })
    })
})

app.get('/api/completes/:id/:chId', (req, res) => {
    PersonalChapter.findAndCountAll({
        include: [{
            model: PersonalCourse,
            where: {
                personal_chaptersId: req.params.chId
            },
            include: [{
                model: User,
                where: {
                    id: req.params.id
                }
            }]
        }]
    }).then((user) => {
        PersonalChapter.findAndCountAll({
            include: [{
                model: PersonalCourse,
                where: {
                    personal_chaptersId: req.params.chId
                }
            }]
        }).then((courses) => {
            res.json({
                user,
                courses
            })
        })
    })
});

app.get('/api/get-answers/:id/:courseId', (req, res) => {
    sequelize.query('SELECT * FROM personal_courses JOIN personal_course_questions ON personal_courses.id = personal_courseId JOIN personal_course_answers ON personal_course_answers.personalCourseQuestionId = personal_course_questions.id WHERE personal_courses.personal_chaptersId = ? AND personal_course_answers.userId = ?',
        {
            replacements: [req.params.courseId, req.params.id],
            type: sequelize.QueryTypes.SELECT
        }).then((answers) => {
            // console.log("efewfewrfefwfewfwf", answers[i].dataValues)

            res.json({
                answers
            })
        })
})
// Port 
const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`)
});