db.revision.find().forEach(function (doc) {
    doc.timestamp = new ISODate(doc.timestamp);
    db.revision.save(doc)
});
db.revision.aggregate([{
        $lookup: {
            from: "userType",
            localField: "user",
            foreignField: "user",
            as: "userType"
        }
    },{
        $project: {
            user: 1,
            timestamp: 1,
            title: 1,
            anon: 1,
            userType: 1
        }
    }
]).forEach(element => {
    if (element.userType.length > 1) {
        element.type = "admin";
        element.userType = null;
    }
    else if (element.userType.length>0){
        element.type = element.userType[0].type;
        element.userType = null;
    }
    else if (element.anon!=null) {
        element.type = "anon";
    }
    else {
        element.type = "regular";
    }
    db.revisions.save(element);
})