import axios from "axios";

const baseURL = "https://75d8-204-197-177-29.ngrok-free.app/"
// const baseURL = ""

class ApiFun {
    static postApi(url,data){
        return axios.post(baseURL + url, data);   
    }

    static getApi(url){
        return axios.get(baseURL + url);   
    }
}

export default ApiFun