import { Button, Modal } from "antd";
import axios from "axios";
import { useState, useEffect } from "react";
 const ModalBuying = ({show, setShow}) => {
    const user = localStorage.getItem('user')
    const [visible, setVisible] = useState(show);
    const [user, userData] = useState(null)
    useEffect(()=>{
        const getUser = async ()=>{
            const responce = await axios.get(`http://localhost:3000/users/${user}`);

        }
    }, [show])
   return (
     <div>
       
     </div>
   )
 }
 
 export default ModalBuying
 