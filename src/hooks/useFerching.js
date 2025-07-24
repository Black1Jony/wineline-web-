import axios from "axios";

export const useFetching = async(arg)=>{
    try{
        const response = await axios.get(arg);
        return response.data;
    }
    catch(error){
        console.error(error);
        return 'bad'
    }
}