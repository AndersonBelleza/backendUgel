
// import * as device from 'device';

// export class IPAdreessUtil {
//   static getInfoIP(req: any){
//     const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
//     const userAgent = req.headers['user-agent'];
//     const parsedDevice = device(userAgent);
//     const dispositivo = parsedDevice.type;
//     return {IP:  ipAddress, userAgent, dispositivo}
//   }
// }