import axios from "axios";

const baseURL = "https://7bed-132-205-229-146.ngrok-free.app"
// const baseURL = ""

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