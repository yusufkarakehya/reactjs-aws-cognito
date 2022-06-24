ReactJS + Aws Cognito + Amazon Amplify Framework
===================================================

### Author: Yusuf Karakehya
* [Website](https://karakehya.com/)
* [LinkedIn](https://www.linkedin.com/in/yusuf-karakehya/)

You can use this project to quickly get started with ReactJS + Amazon Cognito + Amazon Amplify Framework.

### Update the Cognito configuration
First, create a Cognito User Pool. Then open 'src/configs/aws-configs.js' and update the `aws_user_pools_id` and the `aws_user_pools_web_client_id` properties.
 
```json
const awsConfig = {
    aws_user_pools_id: '_YOUR_USER_POOL_ID_',
    aws_user_pools_web_client_id: '_YOUR_USER_POOL_WEB_CLIENT_ID_',
};

export default awsConfig
```

### Build the project and run it locally (the default url is 'http://localhost:3000')

```yarn install && yarn start```

### Build for PRD

```yarn build```