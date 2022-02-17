const { offers, validateOffer } = require('../models/offer.model')
const { courses } = require('../models/course.model')


class OfferDomain{

    // get all offers
    async getOffers(req,res){
        const offer = await offers.find();
        if(offer.length == 0){
            return res.send('no offer available')
        }
        res.send(offer);
    }

    // get offers by id
    async getOfferById(req,res){
        const offer = await offers.findOne({_id: req.params.id});
        if(!offer){
            return res.status(404).send('no offer found for this id')
        }
        res.send(offer);
    }

    // delete offer by id
    async deleteOffer(req,res){
        const offer = await offers.findOne({_id: req.params.id});
        if(!offer){
            return res.status(404).send('no offer found for this id')
        }
        try{
            const result = await offers.findByIdAndDelete({_id: req.params.id})
            console.log(result)
            res.send('offer deleted')
        }catch(err){
            res.status(500).send(err)
        }
    }

    // get live offers only
    async getLiveOffers(req,res){
        const offer = await offers.find({isLive: true});
        if(offer.length == 0){
            return res.send('no live offers available')
        }
        res.send(offer);
    }

    // add offers
    async addOffer(req,res){
        const allOffers = await offers.find().sort('-_id');
        let id;
        if(allOffers.length == 0){
            id = 1;
        }else{
            id = allOffers[0]._id + 1;
        }

        let {error} = validateOffer(req.body);
        if(error){
            return res.status(500).send(error.details[0].message)
        }

        // check that course is not inactive nor free
        let courseIds = [];
        const Courses = req.body.courses;
        for(let course of Courses){
            courseIds.push(course.id);
        }
        
        for(let courseId of courseIds){
            let courseData = await courses.findById(courseId).select('isPaid isActive');
            if(courseData.isPaid == false || courseData.isActive == false){
                let crs = {};
                for(let course of Courses){
                    if(course.id == courseId){
                        crs = course
                    }
                }
                return res.status(500).send( `cannot apply offer on free or inactive course with id - ${crs.id} and name - ${crs.name}`);
            }
        }

        const offer = new offers({
            _id: id,
            offerName: req.body.offerName,
            courses: req.body.courses,
            discount: req.body.discount
        })

        try{
            const result = await offer.save();
            res.send(result);
        }catch(err){
            console.log(err.message);
        }
    }

    // update offer details
    async updateOffer(req,res){
        console.log(req.body)

        const ofr = await offers.findById(req.params.id);
        if(!ofr){
            return res.status(404).send('offer not found')
        }
        
        let courseIds = [];
        const Courses = req.body.courses;
        for(let course of Courses){
            courseIds.push(course.id);
        }

        for(let courseId of courseIds){
            let courseData = await courses.findById(courseId).select('isPaid isActive');
            if(courseData.isPaid == false || courseData.isActive == false){
                return res.status(500).send( `cannot apply offer on free or inactive course with id ${courseId}`);
            }
        }

        try{
            const offer = await offers.findOneAndUpdate({_id: req.params.id},{
                $set: {
                    offerName: req.body.offerName,
                    courses: req.body.courses,
                    discount: req.body.discount
                }
            },{new: true})
            res.send(offer);
        }catch(Err){
            res.status(500).send(Err);
        }
    }

    // make offer live
    async makeOfferLive(req,res){
        const offer = await offers.findOneAndUpdate({_id: req.params.id},{
            $set: {isLive: true}
        },{new: true})
        if(!offer){
            return res.status(404).send('offer not found')
        }
        let courseIds = [];
        const Courses = offer.courses;
        for(let course of Courses){
            courseIds.push(course.id);
        }
        console.log(req.body)
        try{
            for(let courseId of courseIds){
                const course = await courses.findById(courseId);
                console.log(course)
                if(course.isPaid == 'false'){
                    return res.status(500).send('offer cannot be applied on free courses')
                }
                const Price = parseInt(course.price)
                await courses.findOneAndUpdate({_id: courseId},{
                    $set: {
                        offerPrice: (Price - Price*offer.discount/100)
                    }
                })
            }
            res.send("offer is live")
        }catch(err){
            res.status(500).send(err);
        }
    }

    // remove offer
    async removeOffer(req,res){
        console.log(req.body)
        const offer = await offers.findOneAndUpdate({_id: req.params.id},{
            $set: {isLive: false}
        },{new: true})
        if(!offer){
            return res.status(404).send('offer not found')
        }
        let courseIds = [];
        const Courses = offer.courses;
        for(let course of Courses){
            courseIds.push(course.id);
        }
        try{
            for(let courseId of courseIds){
                await courses.findOneAndUpdate({_id: courseId},{
                    $unset: { offerPrice: '' }
                })
            }
            res.send("offer removed successfully")
        }catch(err){
            res.status(500).send(err.message);
        }
    }

}

module.exports = OfferDomain;