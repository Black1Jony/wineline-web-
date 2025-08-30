import { Button, Modal } from "antd";
import api from "../../utils/api";
import { useState, useEffect } from "react";
 const ModalBuying = ({show, setShow}) => {
    const user = localStorage.getItem('user')
    const [visible, setVisible] = useState(show);
    const [user, userData] = useState(null)
    useEffect(()=>{
        const getUser = async ()=>{
            const responce = await api.get(`/users/${user}`);

        }
    }, [show])
   return (
     <div>
       
     </div>
   )
 }
 
 export default ModalBuying
 