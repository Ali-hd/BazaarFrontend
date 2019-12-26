import jwt from 'jsonwebtoken'
import axios from 'axios'


 const fetchData = async () => {
     try{
        var decoded = await jwt.verify(localStorage.usertoken, 'secret')
        return await axios.get(`https://sei-bazaar-backend.herokuapp.com/users/${decoded.id}`, { headers: { Authorization: `Bearer ${localStorage.usertoken}` } })
                        .then((res) => {
                                const userdata = res.data.result
                                return userdata;
                        }).catch(err => console.log(err))

     }catch(e){
         console.log(e)
     }

  };

export default fetchData