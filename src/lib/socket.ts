import { io } from 'socket.io-client';

const socket = io('https://api.deverse.com'); // 백엔드 URL로 수정

export default socket;
