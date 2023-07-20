import axios from "axios";

const baseURL = "https://7bed-132-205-229-146.ngrok-free.app"
// paul
//const baseURL = "https://75d8-204-197-177-29.ngrok-free.app/"
// const baseURL = "https://7bed-132-205-229-146.ngrok-free.app"

class ApiFun {
    static postApi(url,data){
        return axios.post(baseURL + url, data);   
    }

    static getApi(url){
        return axios.get(baseURL + url);   
    }

    static putApi(url){
        return axios.put(baseURL + url);   
    }
}

export default ApiFun