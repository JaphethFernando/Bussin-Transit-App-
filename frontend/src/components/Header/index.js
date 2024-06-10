import React , { useState, useEffect } from "react";
import axios from 'axios';
import "./styles.css";

const Header = () => {

    // var response = await axios.get("127.0.0.1:5000/test");
    // console.log(response);
    const [apiData, setApiData] = useState({})

    useEffect(() => {
        const newData = getApiData();
        console.log("newData", newData);
    }, [])

    const getApiData = async () => {
        try{
            const response = await axios.get("http://127.0.0.1:5000/test");
            console.log("response", response.data);
            setApiData(response.data);
            console.log("apiData", apiData)
        }
        catch(err){
            console.log("error", err);
        }
    };

    return(
        <div>
            <nav>
                <input type="checkbox" id="check"></input>
                <label for="check" className="checkbtn">
                    <i className="fas fa-bars"></i>
                </label>
                <label className="logo">Bussin</label>
                <ul>
                    <li><a className="active" href="#">Home</a></li>
                    <li><a href="#">About</a></li>
                    <li><a href="#">Services</a></li>
                    <li><a href="#">Contact</a></li>
                </ul>
            </nav>
            {JSON.stringify(apiData)}
        </div>
        
    )

};


export default Header;