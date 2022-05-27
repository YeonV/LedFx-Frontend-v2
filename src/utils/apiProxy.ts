/* eslint-disable no-param-reassign */
import axios from 'axios';
import produce from 'immer';
import isElectron from 'is-electron';
// import { useStore } from '@/store/useStore';
// eslint-disable-next-line import/no-cycle
import useStore from './apiStore';

// eslint-disable-next-line prettier/prettier
const baseURL = isElectron() ? 'http://localhost:8888' : window.localStorage.getItem('ledfx-newbase') ? 'http://localhost:8080' : window.location.href.split('/#')[0] || 'http://localhost:8888';
const storedURL = window.localStorage.getItem('ledfx-host');

const api = axios.create({
  baseURL: storedURL || baseURL,
});

// eslint-disable-next-line import/prefer-default-export
export const Ledfx = async (
  path: string,
  method?: 'GET' | 'PUT' | 'POST' | 'DELETE',
  body?: any
) => {
  const { setState } = useStore;
  try {
    let response = null as any;
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
    console.log('1:', response);
    if (response.data && response.data.payload) {
      setState(
        produce((state: any) => {
          state.ui.snackbar = {
            isOpen: true,
            messageType: response.data.payload.type || 'error',
            message:
              response.data.payload.reason ||
              response.data.payload.message ||
              JSON.stringify(response.data.payload),
          };
        })
      );
      console.log('2:', response);
      if (response.data.status) {
        return response.data.status;
      }
    }
    console.log('3:', response);
    if (response.payload) {
      setState(
        produce((state: any) => {
          state.ui.snackbar = {
            isOpen: true,
            messageType: response.payload.type || 'error',
            message:
              response.payload.reason ||
              response.payload.message ||
              JSON.stringify(response.payload),
          };
        })
      );
    }
    console.log('4:', response);
    if (response.status === 200) {
      console.log('4eyyy:', response);
      setState(
        produce((state: any) => {
          state.disconnected = false;
        })
      );
      return response.data || response;
    }
    console.log('5:', response);
    return setState(
      produce((state: any) => {
        state.ui.snackbar = {
          isOpen: true,
          messageType: 'error',
          message: response.error || JSON.stringify(response),
        };
      })
    );
  } catch (error: any) {
    if (error.message) {
      return setState(
        produce((state: any) => {
          state.ui.snackbar = {
            isOpen: true,
            messageType: 'error',
            message: JSON.stringify(error.message),
          };
        })
      );
    }
    setState(
      produce((state: any) => {
        state.ui.snackbar = {
          isOpen: true,
          messageType: 'error',
          message: JSON.stringify(error, null, 2),
        };
      })
    );
  }
  return true;
};
