import http from '../http-common'
import store from '../store/index.js';

class courseService{

    // get enrolled courses
    getEnrolledCourses(){
        return http.get("api/user/courses",{
            headers:{
                'x-access-token': store.state.user.token
            }
        });
    }

    // get all courses
    getAllCourses(){
        return http.get('api/courses')
    }

    // get categorywise courses
    getCategoryWiseCourses(id){
        return http.get(`api/courses/category/${id}`)
    }

    // get subcategorywise courses
    getSubCategoryWiseCourses(cId,sId){
        return http.get(`api/courses/category/${cId}/subcategory/${sId}`)
    }

    // get course by id
    getCourseById(id){
        return http.get(`api/courses/${id}`)
    }

    // add course to wishlist
    addCourseToWishlist(id){
        console.log(store)
        console.log(store.state.user)
        return http.post(`api/courses/${id}/addtowishlist`,{
            Headers:{
                'x-access-token': store.state.user.token
            }
        })
    }
    
    // add course to cart
    addCourseToCart(id){
        console.log(store.state.user)
        return http.post(`api/courses/${id}/addtocart`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // get courses uploaded by instructor
    getInstructorCourses(){
        return http.get('api/courses/inst-courses',{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // get instructor course by id
    getInstructorCourseById(id){
        return http.get(`api/courses/inst-courses/${id}`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // see reviews given by users
    courseReview(id){
        return http.get(`api/courses/inst-courses/${id}/reviews`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // list of users who purchased specific course
    courseBuyers(id){
        return http.get(`api/courses/inst-courses/${id}/summary`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // upload course
    uplodadCourse(course){
        return http.post(`api/courses/inst-courses`,course,{
            headers:{
                'x-access-token': store.state.user.token,
            }
        })
    }

    // update course
    updateInstCourse(id,course){
        return http.put(`api/courses/inst-courses/${id}`,course,{
            headers:{
                'x-access-token': store.state.user.token,
            }
        })
    }

    // update course image
    updateCourseImage(id, file){
        return http.put(`api/courses/inst-courses/${id}/update-image`,file,{
            headers:{
                'x-access-token': store.state.user.token,
            }
        })
    }

    // get all courses for admin
    getCoursesByAdmin(){
        return http.get(`api/admin/courses`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // see summary of course
    showCourseSummary(id){
        return http.get(`api/admin/courses/summary/${id}`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // list of users for admin who purchased course
    showCourseBuyers(id){
        return http.get(`api/admin/courses/summary/${id}/buyers`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // deactivate course
    deactivateCourse(id){
        return http.delete(`api/admin/courses/${id}`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })
    }

    // make course active
    activateCourse(id){
        return http.put(`api/admin/courses/${id}/restore`,{
            headers:{
                'x-access-token': store.state.user.token
            }
        })   
    }
}

export default new courseService();