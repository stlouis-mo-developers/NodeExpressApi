const router = require('express').Router();
const configs = require('../../config_functions'); //require('../../config');
const gallery = require('./gallery_functions');
const LoginFunctions = require('../login/login_functions');

const GalleryFactory = {
    Fields: {
        Name: '', Description: '', Slug: '',  Title  :'',
        Category: '', Tags:'', ITCC_WebsiteID: -1,  ITCC_ImageID: 0,
        CreateDate: new Date(), ModifyDate: new Date(), CreateUserID:-1, ModifyUserID: -1,
        FileGroup  : '', FilePath  :'', SourceUrl  :'', PublishUrl  :'', SourceImageUrl  :'',
        UpdateDate : new Date(), UpdateUserID  : -1, IsActive :0,
        CreateAccountID  :-1
    }
    , Set: function (value) {
        this.Fields = Object.assign(this.Fields, value);
    }
    , Get: function () {
        return this.Fields;
    }
};


//  http://localhost:3010/api/gallery/FEA91F56-CBE3-4138-8BB6-62F9A5808D57/1
//  http://localhost:3010/api/users/1DC52158-0175-479F-8D7F-D93FC7B1CAA4/page/1
//  https://nodeapi.launchfeatures.com/api/gallery/88B8B45E-2BE7-44CB-BBEA-547BB9A8C7D5/2
// get a paginated list of users
router.get("/:siteid/page/:pagenum?", async function (request, response) {
    const siteid = request.params.siteid;
    const authToken = LoginFunctions.getAuthenticationToken(request);
    const authID = authToken || (request.headers.authid);
    const pageNum = (request.params.pagenum) ? request.params.pagenum : 1;
    const pageSize = 20; 
    const offset = (pageNum - 1) * pageSize;

    const config = configs.find(siteid); //(c => c.privateKeyID === siteid);
    const authUser = await LoginFunctions.getUserByAuthToken(config, siteid, authID);

    if (authUser.RoleNames.indexOf('admin') > -1) {
        const itemsResult = await gallery.getItems(config, siteid, offset, pageSize);
        const result = itemsResult.recordset;
        return response.status(200).send(result);
    }
    else {
        return response.status(403).send({
            message: 'you do not have permission to access this / POST',
          });
    }

});

// get one gallery
router.get("/:siteid/:id", async function (request, response) {
    const siteid = request.params.siteid;
    const authToken = LoginFunctions.getAuthenticationToken(request);
    const authID = authToken || (request.headers.authid);
    const id = request.params.id;

    const config = configs.find(siteid); //(c => c.privateKeyID === siteid);
    const authUser = await LoginFunctions.getUserByAuthToken(config, siteid, authID);

    if (authUser.RoleNames.indexOf('admin') > -1) {
        const authResult = await gallery.getItem(config, siteid, id);
        const result =  (authResult.recordset && (authResult.recordset.length > 0))
        ? authResult.recordset[0] : null;
        return response.send(result);
    }
    else {
        return response.status(403).send({
            message: 'you do not have permission to access this / POST',
          });
    }
});

// create a new gallery along with some basic roles needed to access the system
router.post("/:siteid", async function (request, response) {
    const siteid = request.params.siteid;
    const authToken = LoginFunctions.getAuthenticationToken(request);
    const authID = authToken || (request.headers.authid);
    const id = request.params.id;

    console.log({
        'post gallery': {
            params: request.params, body: request.body
        }
    })

    const config = configs.find(siteid); 
    const authUser = await LoginFunctions.getUserByAuthToken(config, siteid, authID);

    if (authUser.RoleNames.indexOf('admin') > -1) {
        GalleryFactory.Set(request.body);
        const dataValues = GalleryFactory.Get();
        console.log({authUser: authUser, dataValues: dataValues, body: request.body});

        return response.send(dataValues);
        //const authResult = await blogs.updateItem(config, siteid, authUser, dataValues);
        /*
        const authResult = await gallery.createItem(config, siteid, 
            username, username, username, emailaddress, 1, 1, 0,
            emailaddress, 1, 1, 1);
        const result =  authResult.recordset;
        return response.send(result);
        */
    }
    else {
        return response.status(403).send({
            message: 'you do not have permission to access this / POST',
          });
    }
});

// delete a gallery
router.delete("/:siteid/:id", async function (request, response) {
    const siteid = request.params.siteid;
    const authToken = LoginFunctions.getAuthenticationToken(request);
    const authID = authToken || (request.headers.authid);
    const id = request.params.id;

    const config = configs.find(siteid); 
    const authUser = await LoginFunctions.getUserByAuthToken(config, siteid, authID);

    if (authUser.RoleNames.indexOf('admin') > -1) {
        GalleryFactory.Set(request.body);
        const dataValues = GalleryFactory.Get();
        console.log({authUser: authUser, dataValues: dataValues, body: request.body});

        return response.send('ok');
        /*
        const authResult = await gallery.deleteItem(config, siteid, id);
        const result =  authResult.recordset;
        return response.send(result);
        */
    }
    else {
        return response.status(403).send({
            message: 'you do not have permission to access this / POST',
          });
    }
});

// update a gallery
router.put("/:siteid/:id", async function (request, response) {
    const siteid = request.params.siteid;
    const authToken = LoginFunctions.getAuthenticationToken(request);
    const authID = authToken || (request.headers.authid);
    const id = request.body.id;

    const config = configs.find(siteid); //(c => c.privateKeyID === siteid);
    const roleNames = await LoginFunctions.getUserRolesByAuthToken(config, siteid, authID);

    if (roleNames.indexOf('admin') > -1) {
        return response.send('ok');
        /*
        const authResult = await gallery.updateItem(config, siteid, id, username, emailaddress);
        const result =  authResult.recordset;
        return response.send(result);
        */
    }
    else {
        return response.status(403).send({
            message: 'you do not have permission to access this / POST',
          });
    }
});

module.exports = router;