const express = require('express');
const CourseDomain = require('../../../domains/course.domain')
const router = express.Router({ mergeParams: true });
const {auth,permit} = require('../../../middleware/auth.middleware')
const role = require('../../../config/roles')

class courseController{

    static async get(req,res){
        const courseDomain = new CourseDomain();
        courseDomain.getEnrolledCourses(req,res);
    }

    static async getById(req,res){
        const courseDomain = new CourseDomain();
        courseDomain.getEnrolledCourseById(req,res);
    }

    static async rate(req,res){
        const courseDomain = new CourseDomain();
        courseDomain.rateCourse(req,res);
    }
}

router.use([auth,permit(role.user)])

// get enrolled courses
router.get('/',courseController.get);

// get course by id
router.get('/:id',courseController.getById);

// rate course
router.post('/:id/review',courseController.rate);

module.exports = router