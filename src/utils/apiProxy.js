import axios from 'axios';

const baseURL = 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');

const api = axios.create({
  baseURL: storedURL || baseURL,
});

export const Ledfx = async (path, set, method = 'GET', body) => {
  try {
    let response = null;
    switch (method) {
      case 'PUT':
        response = await api.put(path, body);
        break;
      case 'DELETE':
        response = await api.delete(path, body);
        break;
      case 'POST':
        response = await api.post(path, body);
        break;

      default:
        response = await api.get(path);
        break;
    }
    
    if (response.data && response.data.payload){
      // console.log("YZ1", response)
      set({
        ui: {
          snackbar: {
            isOpen: true,
            messageType: response.data.payload.type || 'error',
            message:
              response.data.payload.reason || response.data.payload.message || JSON.stringify(response.data.payload),
          },
        },
      });
      if (response.data.status) {
        return response.data.status
      }
    }
    if (response.payload) {
      // console.log("YZ2", response)
      set({
        ui: {
          snackbar: {
            isOpen: true,
            messageType: response.payload.type || 'error',
            message:
              response.payload.reason || response.payload.message || JSON.stringify(response.payload),
          },
        },
      });
    }
    if (response.status === 200) {
      // console.log("YZ3", response)
      return response.data || response;
    }

    set({
      ui: {
        snackbar: {
          isOpen: true,
          messageType: 'error',
          message: response.error || JSON.stringify(response),
        },
      },
    });
  } catch (error) {
   
    // console.log("YZ4", JSON.parse(JSON.stringify(error)))
    if (error.message) {
      return set({
        ui: {
          snackbar: {
            isOpen: true,
            messageType: 'error',
            message: JSON.stringify(error.message),
          },
        },
      });
    }
    set({
      ui: {
        snackbar: {
          isOpen: true,
          messageType: 'error',
          message: JSON.stringify(error, null, 2),
        },
      },
    });
    // console.log(error);
  }
};
