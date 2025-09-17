// const awsconfig = {
//   Auth: {
//     region: "us-east-1",
//     userPoolId: "us-east-1_A4QsSxYpL",
//     userPoolWebClientId: "3bvkin4l11ot3ib9j2kpnk4pt4",
//     oauth: {
//       domain: 'https://us-east-1a4qssxypl.auth.us-east-1.amazoncognito.com',
//       scope: ["email", "openid", "profile"],
//       redirectSignIn: "http://localhost:4200/",
//       redirectSignOut: "http://localhost:4200/",
//       responseType: "token"
//     }
//   }
// };
import { ResourcesConfig } from 'aws-amplify';

const awsconfig: ResourcesConfig = {
  Auth: {
    Cognito: {
    //   region: "us-east-1",
      userPoolId: "us-east-1_A4QsSxYpL",
      userPoolClientId: "3bvkin4l11ot3ib9j2kpnk4pt4",
      loginWith: {
        oauth: {
            domain: 'https://us-east-1a4qssxypl.auth.us-east-1.amazoncognito.com',
            scopes: ["email", "openid", "profile"],
            redirectSignIn: ["http://localhost:4200/","https://staging.ddchhi2dw4mfd.amplifyapp.com"],
            redirectSignOut: ["http://localhost:4200/","https://staging.ddchhi2dw4mfd.amplifyapp.com"],
            responseType: "code"
        }
      }
    }

  }
};

export default awsconfig;