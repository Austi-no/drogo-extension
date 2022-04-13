export class AuthService{
  private token: any;
  constructor() {}

  fetchToken(){
    return apiWorker.getFromStorageSync('token')
      .then((result: any) => {
        const token = result.token
        if (token != null) {
          console.log('Passing stone1')
          this.token = token
          return token
        }else {
          return null
        }
      }).catch(err => console.error(err))
  }
}
