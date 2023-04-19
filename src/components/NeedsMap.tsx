import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { GoogleMap, InfoWindow, Marker } from "@react-google-maps/api";
import { ReactElement, useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AddressContext } from "../shared/context";
import { Need } from "../shared/interfaces/misc.interfaces";

export default function NeedsMap({ isLoaded, needs }: { isLoaded: boolean, needs: Need[] }): ReactElement {
  const latLng = useContext(AddressContext).address.lat_lng;

  const [infoWindow, setInfoWindow] = useState<Need>();

  const containerStyle = {
    width: '750px',
    height: '500px'
  };

  return isLoaded ? (
    <GoogleMap
      center={latLng}
      mapContainerStyle={containerStyle}
      zoom={16}
    >
      {needs.map((need): any => {
        if (need.address && !need.is_fulfilled) {
          return (
            <Marker
              key={`marker-${need.id}`}
              title={need.title}
              position={need.address.lat_lng}
              icon={{
                path: faMapMarkerAlt.icon[4] as string,
                fillColor: need.is_one_time ? "red" : "blue",
                fillOpacity: 1,
                anchor: new google.maps.Point(faMapMarkerAlt.icon[0] / 2, faMapMarkerAlt.icon[1]),
                strokeWeight: 1,
                strokeColor: "#ffffff",
                scale: 0.075,
              }}
              clickable={true} onClick={(_) => { setInfoWindow(need) }}
            >
            </Marker>
          )
        } else { return null }
      })}
      {
        infoWindow?.address.lat_lng &&
        <InfoWindow position={infoWindow.address.lat_lng} onCloseClick={() => setInfoWindow(undefined)} >
          <div>
            <h3>{infoWindow.title}</h3>
            <p>{infoWindow.description}</p>
            <p>Is one time ? {infoWindow.is_one_time ? "Yes" : "No"}</p>
            <p>Created by: <Link to={`/user/${infoWindow.creator_id}`}>{infoWindow.creator.first_name} {infoWindow.creator.last_name}</Link></p>
            <p>Located at: {infoWindow.address.address}</p>
            <Link to={`/needs/${infoWindow.id}`}><button type="button" className="btn-prim mt-2">See this need</button></Link>
          </div>
        </InfoWindow>
      }
    </GoogleMap >
  ) : <p>Error while loading the Needs map !</p>
}