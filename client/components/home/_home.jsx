import { useContext, useEffect, useState } from 'react';
import { ApiContext } from '../../utils/api_context';
import { Button } from '../common/button';
import { Link } from 'react-router-dom';


export const Home = () => {
  const api = useContext(ApiContext);
  // const navigate = useNavigate();

  const [name, setName] = useState('');
  const [chatRooms, setChatRooms] = useState([]);
  const [lng, setlng] = useState([]);
  const [lat, setlat] = useState([]);
  const [roomsInRange, setRoomsInRange] = useState([]);

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);


  function getDistanceFromLatLonInKm(lat1,lon1,lat2,lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(lat2-lat1);  // deg2rad below
    var dLon = deg2rad(lon2-lon1); 
    var a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
      ; 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    var d = R * c; // Distance in km
    return d;
  }
  
  function deg2rad(deg) {
    return deg * (Math.PI/180)
  }


  useEffect(async () => {
    const res = await api.get('/users/me');
    const { chatRooms } = await api.get('/chat_rooms');
    //console.log(chatRooms);
    //setChatRooms(chatRooms);

    //get current pos geo

    navigator.geolocation.getCurrentPosition((userLocation) => {
      setlng(userLocation.coords.longitude);
      setlat(userLocation.coords.latitude);

      const availableRooms = chatRooms.filter(room => {
        return getDistanceFromLatLonInKm(room.lat, room.lng, userLocation.coords.latitude, userLocation.coords.longitude) <= 5;
      });
    
      setRoomsInRange(availableRooms)

    });


    const watch = navigator.geolocation.watchPosition((userLocation)=>{
      setlat(userLocation.coords.latitude);
      setlng(userLocation.coords.longitude);

      const availableRooms = chatRooms.filter(room => {
        return getDistanceFromLatLonInKm(room.lat, room.lng, userLocation.coords.latitude, userLocation.coords.longitude) <= 5;
      });
    
      setRoomsInRange(availableRooms);
    });

  setUser(res.user);
    setLoading(false);

  console.log("use effect called");
    return () => navigator.geolocation.clearWatch(watch);
  }, []);

  if (loading) {
    return <div>Loading..</div>;
  }

  const createRoom = async () => {
    const { chatRoom } = await api.post('/chat_rooms', { name, lat, lng });
    setRoomsInRange([...roomsInRange, chatRoom]);
    setName('');
  };


  return (
    <div className="p-4">
      <h1>Welcome {user.firstName}</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      <Button onClick={createRoom}>Create Room</Button>
      <div>
        {roomsInRange.map((room) => (
          <div key={room.id}>
            <Link to={`/chat_rooms/${room.id}`}>{room.name}</Link>
          </div>
        ))}
      </div>
    </div>
  );
};
