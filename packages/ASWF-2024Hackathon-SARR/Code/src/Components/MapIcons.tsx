import L from 'leaflet';
import { PlusIcon, HomeIcon, PersonIcon } from '@radix-ui/react-icons';
import ReactDOMServer from 'react-dom/server';

const createCustomIcon = (iconElement: JSX.Element, color: string, size: number = 32) => {
  return L.divIcon({
    html: ReactDOMServer.renderToString(
        <div style={{ color, fontSize: `${size}px`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {iconElement}
        </div>
    ),
    className: 'custom-icon',
    iconSize: [size, size],
    iconAnchor: [size / 4, size],
  });
};

export const HospitalMapIcon = createCustomIcon(<PlusIcon />, 'pink');
export const BaseMapIcon = createCustomIcon(<HomeIcon />, 'gold');
export const EmergencyMapIcon = createCustomIcon(<PersonIcon />, 'red');
