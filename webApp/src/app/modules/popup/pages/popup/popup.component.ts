import {AppService} from '../../../../providers/app.service';
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {NgxSpinnerService} from 'ngx-spinner';
import {Observable} from "rxjs";

@Component({
  selector: 'app-popup-screen',
  templateUrl: './popup.component.html',
  styleUrls: ['./popup.component.scss']
})
export class PopupComponent implements OnInit {
  background = 'Dark'
  loginToken: any;
  loginForm!: FormGroup;

  currentProxy = { ip: '0.0.0.0', location: 'NO LOCATION' }

  isConnected = false

  accountInformation = {
    username: 'NULL',
    creditsAvailable: -1,
    is_active: false
  }
  proxyHistory = []

  appSettings = {
    // TODO: add here
    setGeoByIP: false,
    setTimeByIP: false,
    // END TODO
    disableWebRtc: true,
    disableFingerprint: true,
    disableServerDNS: true,
    customUserAgent: false,
    chosenUserAgent: '', // TODO
    autoProxyOnBoot: true,
    autoProxyConfig: {
      changeInterval: '60',
      country: 'US'
    }
  }
  p: number = 1
  connectionTime = '00:00:00'
  pricingList: any=[];

  constructor(private service: AppService, private ref: ChangeDetectorRef,
              private spinner: NgxSpinnerService, private fb: FormBuilder, private toastr: ToastrService) {

  }

  ngOnInit(): void {
    this.loadAppData()

    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    })
  }

  loadAppData() {
    this.spinner.show()
    const appData = ['token', 'username', 'creditsAvailable', 'is_active']
    apiWorker.getFromStorage(appData, (result) => {
      console.log(JSON.stringify(result))
      this.spinner.hide()
      if (!result) {
        console.log('paso')
        this.loginToken = undefined
        this.logout()
      } else {
        this.loginToken = result.token
        this.accountInformation.username = result.username
        this.accountInformation.creditsAvailable = result.creditsAvailable
        this.loadHistory()
        this.loadSettings()
        // this.myIp()
      }
    })
  }

  loadHistory() {
    apiWorker.getFromStorage(['proxyList'], (result) => {
      if (!result.proxyList) {
        return
      }
      const oldProxyList = result.proxyList
      const nowDate = Date.now()
      // noinspection ES6ConvertVarToLetConst
      for (var proxyData of oldProxyList) {
        console.log(JSON.stringify(proxyData))
        const proxyDate = new Date(proxyData.expireTime)
        // @ts-ignore
        const hrDiff = Math.abs(proxyDate - nowDate) / 36e5
        if (hrDiff > 24) {
          console.log(`Proxy ${proxyData.ip} Expired by ${hrDiff}`)
        }else {
          this.proxyHistory.push(proxyData)
        }
      }
      apiWorker.saveStorage('proxyList', this.proxyHistory, () => {
        console.log(`added proxy ${proxyData} to list of proxy history `)

      })
    })

  }

  loadSettings() {
    apiWorker.getFromStorage('appSettings', (result) => {
      this.appSettings = JSON.parse(result.appSettings)
      this.ref.detectChanges()
    })
  }
  setupAccount(respInformation) {
    this.accountInformation.username = respInformation.username
    this.accountInformation.creditsAvailable = respInformation.creditsAvailable
    this.accountInformation.is_active = respInformation.is_active

    apiWorker.saveObjToStorage(this.accountInformation, () => {
      console.log('User information saved')
      this.saveSettings()
    })
  }

  saveSettings() {
    const appDict = {'appSettings': JSON.stringify(this.appSettings)}
    apiWorker.saveObjToStorage(appDict, () => {
      console.log('User Settings saved')
      // if (cBack !== null) {
      //   cBack()
      // }
    })
  }


  // LOGIN
  login() {
    this.spinner.show()
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      this.spinner.hide()
      return;
    }

    this.service.login(this.loginForm.value).subscribe((res: any) => {
        console.log(res);
        this.spinner.hide()
        if (res.access_token) {
          apiWorker.saveStorage('token', res.access_token, () => {
            this.toastr.success("", "Login Successful")
            this.getAccount();
            // this.getMyIP()
            apiWorker.getFromStorage('token', (token) => this.loginToken = token)
          })
        } else {
          this.toastr.error("", "Login Failed, Server Error")
        }
      },
      (error: any) => {
        this.spinner.hide()
        this.toastr.error("Try Again", error.error.detail)
        console.log(error);
      }
    )

  }

  logout() {
    const appData = ['token', 'username', 'creditsAvailable', 'is_active', 'appSettings']
    apiWorker.removeFromStorage(appData, (result) => {
      this.loginToken = null
    })
  }

  getAccount() {
    this.service.getAccount().subscribe((accountResp: any) => {
      if (accountResp.is_active !== true) {
        this.toastr.error("Account not active, please login on the web")
        return this.logout()
      }
      this.setupAccount(accountResp)
    })
  }

  // execHistoryProxy
  execHistoryProxy() {
    this.toastr.success("", "You clicked execHistoryProxy")
  }

  onConnectionChange(event: boolean) {
    console.log(event)
    if (event === true) {
      this.isConnected = true
    }else {
      this.isConnected = true
    }
    console.log(this.isConnected)
  }

  onBeforeConnect: Observable<boolean> = new Observable((observer) => {
    const timeout = setTimeout(() => {
      if (this.isConnected) {
        //TODO: disconnect the proxy here

        this.toastr.info('Proxy DisConnected')
        this.isConnected = false
      }else {
        //TODO: connect the proxy here

        this.toastr.success('Proxy Connected')
        this.isConnected = true
      }
      observer.next(true);
    }, 1000);
    return () => clearTimeout(timeout);
  });

  connectionHandler() {

  }

  onAppSettingsChange(appKey: string, event: boolean) {
    if (!(appKey in this.appSettings)) {
      console.error('Cannot find settings for ' + appKey )
      return
    }
    this.appSettings[appKey] = event
    const settingsOpt = {}
    apiWorker.executeSettingsUpdate(appKey,event, settingsOpt, () => {
      this.saveSettings()
      this.toastr.success(`Settings ${appKey} Updated Successfully`)
    })
  }

  getPricing(){
    this.spinner.show()
    this.service.getPricing().subscribe((res:any)=>{
      console.log(res);
      this.pricingList=res.plans
      this.spinner.hide()
    },
    (error: any) => {
      this.spinner.hide()
      this.toastr.error("Try Again", error.error.detail)
      console.log(error);
    })
  }
}
