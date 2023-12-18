//1.Find all the topics and tasks which are thought in the month of October

db.tasks.aggregate( [
    {
       $lookup: {
          from: "topics",
          localField: "id",
          foreignField: "task_id", 
          let: { date: "$date" },  
          pipeline: [ {
            $match: {
               $expr: { $gt: [ "$$date", "$30/09/2023" ] }
            }
         } ],      
          as: "matches"
       }
    }
 ] )

 //2. Find all the company drives which appeared between 15 oct-2020 and 31-oct-2020

 db.companydrive.find(
    { "$and":[
        {conducted_at:{"$gt":"14/10/2023"}},

    {conducted_at:{"$lt": "01/11/2023"}}
    
    ]}).pretty()

//3. Find all the company drives and students who are appeared for the placement.
db.companydrive.find({status:{"$eq":"Attended"}})    

//4.Find the number of problems solved by the user in codekata
db.users.aggregate( [
    {
       $lookup:
          {
            from: "codekata",
            localField: "id",
            foreignField: "user_id", 
            as: "Problems_solved",
            pipeline: [
                {
                    $match:{status :"Completed"}
                  },
              
                  //stage2
                  {
                    $group:{_id:"$name"}
                  }
            ]
            
          }
     }
 ] )

 //5. Find all the mentors with who has the mentee's count more than 15
 db.mentors.aggregate( [
    {
       $lookup:
          {
            from: "users",
            localField: "mentee_name",
            foreignField: "name", 
            pipeline: [
                  //stage2
                  {
                    $group:{_id:"$id"}
                  }
            ],
            as: "Mentors"
            
          }
     }
 ] )

 //6. Find the number of users who are absent and task is not submitted  between 15 oct-2020 and 31-oct-2020
db.attendance.aggregate([
    { $match: { status: "Absent" }},
    { $lookup: {
        from: "tasks",
        localField: "user_id",
        foreignField: "user_id",
        as: "Absentees"
    } },
    {
        $count: "Absentees"
    }

])