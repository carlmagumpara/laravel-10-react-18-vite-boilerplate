import { useEffect } from 'react';
import LaravelEcho from 'laravel-echo'
import { WEB_SOCKET_AUTH, BASE_URL } from './config';
import * as Pusher from 'pusher-js';

let Echo;

function Socket(token) {
  Echo = new LaravelEcho({
    broadcaster: 'pusher',
    key: 'wzQK8vsdwMlyogC8AJN19tSI52gDDNcJ091mb9SnN7ip8wWPkd',
    wsHost: BASE_URL,
    wsPort: 6001,
    wssPort: 443,
    enabledTransports: ['ws', 'wss'],
    disableStats: true,
    cluster: 'eu',
  });

  Echo.connector.pusher.config.authEndpoint = WEB_SOCKET_AUTH;
  Echo.connector.pusher.config.auth.headers['Authorization'] = `Bearer ${token}`;

  return Echo;
}

export default Socket;