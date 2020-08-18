const { poolPromise, sql } = require('../models/db');
// method to get already existing users
exports.getUsers = async (req, res) => {
    try {
        const pool = await poolPromise
        let queryStr = 'select *from [CEH].INTEGRATION_USERS';

        const result = await pool.request()
            .query(queryStr, function (err, data) {
                if (err) {
                    console.log('error while fetching data' + err)
                }
                else {
                    var send_data = data.recordset;
                    res.json(send_data);
                }
            })
    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}

// method to create new user
exports.createUser = async (req, res) => {
    if(req.body){
    try {
        const pool = await poolPromise
        let request = await pool.request();
        request.input('USER_NAME', sql.VarChar(200), req.body.userName);
        request.input('ROLE_NAME', sql.VarChar(200), req.body.role);
        request.input('ACTIVE_FLAG', sql.VarChar(1), req.body.activeFlag);
        request.input('EMAIL', sql.VarChar(200), req.body.email);
        request.output('returnStatus', sql.VarChar(200));
        request.output('errorMessage', sql.VarChar(4000));
        request.input('processMode', sql.VarChar(200), req.body.mode);
        request.execute('CEH.CreateUpdateUser', function (err, results) {
            if (err) {
            res.json( {"errorMessge ": 'error while creating a user' + err});
            } else {
                res.send(results);
            }
           
        })

    } catch (err) {
        res.status(500)
        res.send(err.message)
    }
}
}
// method to update a existing user
exports.updateUser = async (req, res) => {
    if(req.body){
        try {
            const pool = await poolPromise
            let request = await pool.request();
            
            request.input('USER_NAME', sql.VarChar(200), req.body.userName);
            request.input('ROLE_NAME', sql.VarChar(200), req.body.role);
            request.input('ACTIVE_FLAG', sql.VarChar(1), req.body.activeFlag);
            request.input('EMAIL', sql.VarChar(200), req.body.email);
            request.output('returnStatus',sql.VarChar(200))
            request.output('errorMessage',sql.VarChar(4000))
            request.input('processMode', sql.VarChar(200), req.body.mode);
            request.execute('CEH.CreateUpdateUser', function (err, results) {
                if (err) {
                    res.json( {"errorMessge ": 'error while updating a user' + err});
                } else {                  
                    res.send(results);
                }
            })
        } catch (err) {
            res.status(500)
            res.send(err.message)
        }
    }
}