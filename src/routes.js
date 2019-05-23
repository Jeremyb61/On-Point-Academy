import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import GroupDashboard from './components/GroupDashboard'
import GroupCourse from './components/GroupCourse'
import PersonalCourse from './components/PersonalCourse'
import UploadImage from './components/UploadImage'
import AnswerSummary from './components/AnswerSummary'

export default [
    { 
        path: '/', 
        component: Login 
    },
    { 
        path: '/register', 
        component: Register 
    },
    { 
        path: '/dashboard/:id', 
        component: Dashboard
    },
    {
        path:'/dashboard/:id/upload',
        component: UploadImage
    },
    {
        path:'/dashboard/:id/summary/:courseId',
        component: AnswerSummary
    },
    { 
        path: '/dashboard/:id/:courseId', 
        component: PersonalCourse 
    },
    { 
        path: '/:id/:group', 
        component: GroupDashboard 
    },
    { 
        path: '/dashboard/:id/:group/:courseId', 
        component: GroupCourse 
    },
]