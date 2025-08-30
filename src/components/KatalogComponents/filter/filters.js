import api from "../../../utils/api";
const getFiltersFromServer = async (type)=>{
  const responce = await api.get(`/allfilter/${type}`);
  return responce.data;
}
export default getFiltersFromServer;