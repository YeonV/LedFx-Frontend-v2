import axios from 'axios';

const baseURL = 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');

const api = axios.create({
  baseURL: storedURL || baseURL,
});

interface apiProxy {
  path: string,
  set: (state:Record<string, unknown>) => void,
  method: 'GET'|'POST'|'PUT'|'DELETE',
  body: Record<string, unknown> | undefined
}

interface resp {
  payload: {
    message: string,
    type: string,
  },
  status: number,
  data: Record<string, unknown>,
  error:Record<string, unknown>,
}

const Ledfx = async (proxy:apiProxy): Promise<unknown> => {
  try {
    let response:resp = {
      payload: {
        message: 'no message',
        type: 'error',
      },
      status: 403,
      data: {},
      error: {},
    };

    switch (proxy.method) {
      case 'PUT':
        response = await api.put(proxy.path, proxy.body);
        break;
      case 'DELETE':
        response = await api.delete(proxy.path, proxy.body);
        break;
      case 'POST':
        response = await api.post(proxy.path, proxy.body);
        break;

      default:
        response = await api.get(proxy.path);
        break;
    }

    if (response?.payload) {
      proxy.set({
        ui: {
          snackbar: {
            isOpen: true,
            messageType: response.payload.type || 'error',
            message:
              response.payload.message || JSON.stringify(response.payload),
          },
        },
      });
    }
    if (response.status === 200) {
      return response.data || response;
    }
    proxy.set({
      ui: {
        snackbar: {
          isOpen: true,
          messageType: 'error',
          message: response.error || JSON.stringify(response),
        },
      },
    });
  } catch (error) {
    proxy.set({
      ui: {
        snackbar: {
          isOpen: true,
          type: 'error',
          message: JSON.stringify(error),
        },
      },
    });
    // eslint-disable-next-line no-console
    console.warn(error);
  }
  return {};
};

export default Ledfx;
