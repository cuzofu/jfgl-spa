import RenderAuthorized from '../components/Authorized';
import { getAuthority } from './store';

const getRole = () => {
  let max = 'ROLE_LABOR';
  if (getAuthority()) {
    let obj = JSON.parse(getAuthority());

    for (var i = 0; i < obj.length; i++) {
      if (obj[i] === 'ROLE_ADMIN') {
        max = obj[i];
        break;
      }
      if (obj[i] === 'ROLE_USER') {
        max = obj[i];
      }
    }
    return max;
  }
};

let Authorized = RenderAuthorized(getRole);

const reloadAuthorized = () => {
  Authorized = RenderAuthorized(getRole);
};

export { reloadAuthorized };
export default Authorized;
