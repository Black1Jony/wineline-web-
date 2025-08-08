import axios from "axios";
const getFiltersFromServer = async (type)=>{
  const responce = await axios.get(`http://localhost:3000/allfilter/${type}`);
  return responce.data;
}
export default getFiltersFromServer;