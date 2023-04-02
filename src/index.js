import "coughdrop/coughdrop.less";
import './app.less';
import App from './components/app';
export default App;

export const Server = {
    async get(url)
    {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        });

        return response.json();
    },
    async post(action, data)
    {
        data.action = action;
        
        const response = await fetch("/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data)
        });

        return response.json();
    }
}
