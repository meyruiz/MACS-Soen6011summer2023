import axios from "axios";

const baseURL = "https://7140-66-22-167-208.ngrok-free.app"
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