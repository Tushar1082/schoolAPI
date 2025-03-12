const express = require('express');
const geolib = require('geolib');
const conn = require('./database/sqlDB');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

//Endpoint to find and return a school details from a list according to user details.
app.get('/listSchools',(req,res)=>{
    const {latitude, longitude} = req.query; // user location details

    if(!latitude || !longitude)
        return res.status(400).json({error: "All fields are required"});
    
    const userData = { latitude: parseFloat(latitude), longitude: parseFloat(longitude)};
    
    if(isNaN(userData.latitude) || isNaN(userData.longitude)){
        return res.status(400).json({error: "Provided data has not valid datatypes"});
    }
    
    conn.query("SELECT * FROM school", (err, result)=>{
        if(err) return res.status(500).json({msg: "Database error", err:err});
        
        //Calculate and sort schools by distance
        const sortedSchools = result.map((school)=>({
            ...school,
            distance: geolib.getDistance(userData, { latitude: school.latitude, longitude: school.longitude})  
        })).sort((a,b)=> a.distance - b.distance);

        return res.json(sortedSchools);
    });

});

// Endpoint to add data of new school
app.post('/addSchool',(req,res)=>{    
    try {
        const {name, address, latitude, longitude} = req.body;

        if(!name || !address || latitude === undefined|| longitude === undefined)
            return res.status(400).json({error: "All fields are required"});

        else if(typeof name != "string" || typeof address != "string" || typeof latitude != "number" || typeof longitude != "number")
            return res.status(400).json({error: "Provided data has not valid datatypes"});

        const sql = `INSERT INTO school (name, address, latitude, longitude) VALUES (?,?,?,?)`;
        
        conn.query(sql,[name, address, latitude, longitude], (err)=>{
            if(err){ 
                console.log("Error while inserting data: ", err);
                return res.status(500).json({error: "Database error"});
            }else{
                return res.json({message: "School added successfully"});
            }
        });
    } catch (error) {
        console.log(error);
        return res.json(error);
    }
});

app.listen(PORT,()=>{
    console.log('Server is listening...');
});
