import ReactDOMServer from "react-dom/server";
import L from "leaflet";
import {
  MdOutlinePowerOff,
  MdOutlineWater,
  MdMedicalServices,
  MdAirplanemodeActive,
  MdOutlineWaterDrop,
  MdLocalGasStation,
  MdArrowDropDown,
} from "react-icons/md";
import { GiFallingRocks, GiBarracksTent } from "react-icons/gi";
import { FaPersonShelter } from "react-icons/fa6";

const iconSize = 28;

export const powerIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdOutlinePowerOff
      size={iconSize}
      color="yellow"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const floodIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdOutlineWater
      size={iconSize}
      color="blue"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const waterIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdOutlineWaterDrop
      size={iconSize}
      color="blue"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const environmentalIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <GiFallingRocks
      size={iconSize}
      color="brown"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const taskForceIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <GiBarracksTent
      size={50}
      color="lightblue"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const medicalIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdMedicalServices
      size={iconSize}
      color="red"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const fuelIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdLocalGasStation
      size={iconSize}
      color="green"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const airplaneIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdAirplanemodeActive
      size={iconSize}
      color="black"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const shelterIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <FaPersonShelter
      size={iconSize}
      color="black"
      className={"drop-shadow-[0_0_2px_black]"}
    />
  ),
  iconAnchor: [18, 18], // Center point
});

export const markerIcon = L.divIcon({
  className: "custom-div-icon",
  html: ReactDOMServer.renderToString(
    <MdArrowDropDown size={iconSize} color="black" />
  ),
  iconAnchor: [18, 18], // Center point
});
