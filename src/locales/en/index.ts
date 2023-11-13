import message from './message.json';
import local from './local.json';
import popupDelete from './popupDelete.json';

const data = {
  ...message,
  ...local,
  ...popupDelete,
};

export { data };
