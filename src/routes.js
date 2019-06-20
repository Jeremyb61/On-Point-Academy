import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import GroupDashboard from './components/GroupDashboard'
import GroupCourse from './components/GroupCourse'
import PersonalCourse from './components/PersonalCourse'
import UploadImage from './components/UploadImage'
import AnswerSummary from './components/AnswerSummary'
import LandingPage from './components/LandingPage'

export default [
    { 
        path: '/', 
        component: LandingPage 
    },
    { 
        path: '/login', 
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
        path: '/group-dashboard/:id/:groupId/:group', 
        component: GroupDashboard 
    },
    { 
        path: '/dashboard/:id/:group/:groupId/:courseId', 
        component: GroupCourse 
    },
]