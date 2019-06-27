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
    // Get groups that user belongs
    static getGroups (id) {
        return axios.get(`${url}/api/groups/${id}`);
    }
    static getOtherGroups (id, group) {
        console.log("DSFSDFSDDFDSSDFS")
        return axios.get(`${url}/api/othergroups/${id}/${group}`)
    }
    static getCurrentGroup(group) {
        return axios.get(`${url}/api/group/${group}`);
    }
    static getPersonalCourseContent(params) {
        return axios.get(`${url}/api/course/${params.courseId}`);
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
        return axios.get(`${url}/api/completes-count/${id}/${chId}`);
    }
    static getAnswers(params) {
        return axios.get(`${url}/api/get-answers/${params.id}/${params.courseId}`);
    }
    static getSubmittedAnswers(params) {
        return axios.get(`${url}/api/answers-submitted/${params.id}/${params.courseId}`);
    }
    static getSubmittedGroupAnswers(params) {
        return axios.get(`${url}/api/group-answers-submitted/${params.id}/${params.courseId}/${params.group}`);
    }
    static getGroupCourseContent(params) {
        return axios.get(`${url}/api/group-course/${params.courseId}`);
    }
    static submitGroupAnswers(body,params) {
        return axios.post(`${url}/api/group-answers/${params.id}/${params.group}/${params.courseId}`, body);
    }
    static getGroupQuestionsAnswers(params) {
        return axios.get(`${url}/api/get-group-answers/${params.groupId}/${params.id}`);
    }
    static submitGroupCourseCompletion(params) {
        return axios.get(`${url}/api/group-complete/${params.id}/${params.courseId}/${params.group}`);
    }
    static signOutUser() {
        return axios.get(`${url}/api/user/sign-out`);
    }
    static getGroupCourseCompletes(params) {
        return axios.get(`${url}/api/group/get-complete/${params.id}/${params.group}`);
    }
    static checkForComplete(params) {
        return axios.get(`${url}/api/group/get-one-complete/${params.id}/${params.group}/${params.courseId}`);
    }
    static checkPersonalComplete(params) {
        return axios.get(`${url}/api/user/get-personal-complete/${params.id}/${params.courseId}`);
    }
    static deleteGroupCourseCompletion(params) {
        return axios.delete(`${url}/api/group/delete-complete/${params.id}/${params.group}/${params.courseId}`);
    }
    static deleteCourseCompletion(params) {
        return axios.delete(`${url}/api/user/delete-complete/${params.id}/${params.courseId}`);
    }
    static getOneGroupChapters(params) {
        return axios.get(`${url}/api/user/group-chapters/${params.id}`);
    }
 
}

export default Service;