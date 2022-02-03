const express = require('express');
const roles = require('../../../config/roles')
const CategoryDomain = require('../../../domains/category.domain');
const router = express.Router();
const {auth,permit} = require('../../../middleware/auth.middleware')
const subcategoryController = require('./subcategory/subcategory.controller')

class categoryController{

    static async get(req,res){
        const categoryDomain = new CategoryDomain();
        categoryDomain.getCategories(req,res);
    }

    static async getCategoryId(req,res){
        const categoryDomain = new CategoryDomain();
        categoryDomain.getCategoryIdFromName(req,res); 
    }

    static async getById(req,res){
        const categoryDomain = new CategoryDomain();
        categoryDomain.getCategory(req,res);
    }

    static async add(req,res){
        const categoryDomain = new CategoryDomain();
        categoryDomain.addCategory(req,res);
    }

    static async edit(req,res){
        const categoryDomain = new CategoryDomain();
        categoryDomain.editCategory(req,res);
    }   

    static async delete(req,res){
        const categoryDomain = new CategoryDomain();
        categoryDomain.deleteCategory(req,res);
    }

}

router.use('/:cId/subcategory',subcategoryController);

// get all categories
router.get('/',categoryController.get);

// get category id by name
router.get('/name/:cname',categoryController.getCategoryId);

router.use([auth,permit(roles.admin)])

// add category
router.post('/',categoryController.add);

// update category name
router.put('/:id',categoryController.edit);

// remove category
router.delete('/:id',categoryController.delete);

// get specific category
router.get('/:id',categoryController.getById);

module.exports = router