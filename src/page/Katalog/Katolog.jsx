import { useParams } from "react-router-dom"
import Header from "../../components/Header/Header";
const Katolog = () => {
  const { type } = useParams()
  console.log(type);
  
  return <>
  <Header/>
  </>
}

export default Katolog
