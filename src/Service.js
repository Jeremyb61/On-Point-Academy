import axios from 'axios';

const url = 'http://localhost:8000'

class Service {
    // Login User
    static login (loginInfo) {
            return axios.post(`${url}/api/user/login`, loginInfo);
    }
    // Register new user
    static register (newUser) {
        return axios.post(`${url}/api/user`, newUser);
    }
    //Get User for Profile
    static getUserProfile (userId) {
        return axios.get(`${url}/api/user/${userId}`);
    }
    //Get Perosnal Chapters
    static getPersonalChapters () {
        return axios.get(`${url}/api/chapters`);
    }
    // Get Group Chapters
    static getGroupChapters() {
        return axios.get(`${url}/api/chapters/groups`);
    }
    //Get Perosnal Courses
    // static getPersonalCourses (id) {
    //     return axios.get(`${url}/api/courses/${id}`);
    // }

    // Get groups that user belongs
    static getGroups (id) {
        return axios.get(`${url}/api/groups/${id}`);
    }
    static getOtherGroups (id, group) {
        return axios.get(`${url}/api/othergroups/${id}/${group}`)
    }
    static getCurrentGroup(group) {
        return axios.get(`${url}/api/group/${group}`);
    }
    static getPersonalCourseContent(courseId) {
        return axios.get(`${url}/api/course/${courseId}`);
    }
    static submitPersonalAnswers(answers,userId) {
        return axios.post(`${url}/api/answers/${userId}`,answers);
    }
    static submitCourseCompletion(userId, courseid) {
        return axios.post(`${url}/api/submit-complete/${userId}/${courseid}`)
    }
    static uploadNewImage(userid,file) {
        return axios.put(`${url}/api/image/${userid}`,file);
    }
    static getCompletes(id,chId) {
        return axios.get(`${url}/api/completes/${id}/${chId}`);
    }
    static getAnswers(params) {
        return axios.get(`${url}/api/get-answers/${params.id}/${params.courseId}`);
    }
}


export default Service;