import { useEffect, useState } from "react";

export default function useLocation() {
    const [location, setLocation] = useState(null);

    useEffect(()=>{
        if(navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(success, error);
        }

        function success(position) {
            setLocation({
                latitude:position.coords.latitude,
                longitude:position.coords.longitude
            });
        }

        function error() {
            setLocation({
                latitude: 37.483034,
                longitude: 126.902435,
            });
            console.log("위치 받기 실패")
        }
    },[]);

    return location;
}
