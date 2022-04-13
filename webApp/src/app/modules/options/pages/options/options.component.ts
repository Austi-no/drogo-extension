import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppService } from '../../../../providers/app.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-proxies-screen',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {

  countries: any;
  accountDetails: {
    username: 'null',
    creditsAvailable: 0
  }
  myIp: any;
  p: number = 1;

  residentialProxyList: any = [];
  dataCenterProxyList: any = [];
  private filterForm: any; // { zip: string; country: undefined; city: string; state: string };

  filterObj = {
    country: {
      code: undefined,
      name: ''
    },
    state: '',
    city: '',
    zip: '',
    isp: ''

  }
  loginToken: any;


  constructor(private service: AppService,private toastr:ToastrService, private fb: FormBuilder, private spinner: NgxSpinnerService) { }

  ngOnInit() {

    this.countries = this.service.getCountries()
    // console.log(this.countries)
    this.getAccount()
    this.getMyIP()
    this.getResidentialProxies()
    this.getDataCenterProxies()
  }

  updateProxyHistory (proxyData) {
    apiWorker.getFromStorage(['proxyList'], (result) => {
      let proxyList
      if (!result.proxyList) {
        proxyList = []
      }else {
        proxyList = result.proxyList
      }
      proxyList.push(proxyData)
      apiWorker.saveStorage('proxyList', proxyList, () => {
        console.log(`added proxy ${proxyData} to list of proxy history `)

      })
    })
  }

  handleProxyUpdate(proxyObj, chosenProxy, proxyType="RESIDENTIAL") {
    const proxyData = {
      expireTime: proxyObj.expireTime,
      ip: proxyObj.ip,
      location: `${chosenProxy.country}|${chosenProxy.state}|${chosenProxy.city}`,
      proxyType: proxyType
    }
    apiWorker.setProxyByIp(proxyData.ip, {}, () => {
      this.updateProxyHistory(proxyData)
    })

  }

  updateCredits(res) {
    apiWorker.saveStorage('creditsAvailable', this.accountDetails.creditsAvailable, () => {
      this.accountDetails.creditsAvailable = res.remainingCredit
    })
  }

  filterSearchOptions(proxyType) {
    this.filterForm = {
      country: this.filterObj.country?.code,
      state: this.filterObj.state,
      city: this.filterObj.city,
      zip: this.filterObj.zip
    }

    let filterService
    if (proxyType === 'RESIDENTIAL') {
      filterService = this.service.filterResidentialData(this.filterForm)
    } else if (proxyType === 'DATACENTER') {
      filterService = this.service.filterDataCenterData(this.filterForm)
    }else {
      console.error('Failed to find filter service')
    }

    filterService.subscribe((res: any) => {
        if (proxyType === 'RESIDENTIAL') {
          this.residentialProxyList = res.proxyList
        } else if (proxyType === 'DATACENTER') {
          this.residentialProxyList = res.proxyList
        }
        this.filterForm={}
        // this.filterObj.country={code: undefined, name: ''}
        // this.filterObj.state=''
        // this.filterObj.city=''
        // this.filterObj.zip=''
      },
      (error: any) => {
        console.log(error);
      }
    )

  }


  executeProxy(chosenProxy: any, proxyType: string) {
    const data = {
      id: chosenProxy.id,
      proxyType: proxyType
    };
    let execService
    if (proxyType === 'RESIDENTIAL') {
      execService = this.service.executeResidentialProxy(data)
    } else if (proxyType === 'DATACENTER') {
      execService = this.service.executeDatacenterProxy(data)
    }else {
      console.error('Failed to find filter service')
    }

    execService.subscribe((res: any) => {
      if (res) {
        this.toastr.success(`Proxying to IP ${res.ip} Cost: ${res.creditCost}`,"Connected!")
        this.handleProxyUpdate(res, chosenProxy, proxyType)
      }else {
        this.toastr.error("Failed to Connect to proxy","Error!")

      }

    }, (error: any) => {
      console.log(error)
      this.toastr.error("Failed to Connect to proxy","Error!")
    })

  }

  getAccount() {
    const proxyData = ['username', 'creditsAvailable', 'is_active']
    apiWorker.getFromStorage(proxyData, (result) => {
      console.log(JSON.stringify(result.username))
      this.spinner.hide()
      if (!result) {
        console.log('paso')
        return
      } else {
        this.accountDetails = result
      }
    })

  }

  getMyIP() {
    this.spinner.show()
    this.service.getMyIp().subscribe((res: any) => {
      this.myIp = res
      this.spinner.hide()
    })
  }

  getResidentialProxies() {
    this.spinner.show()
    this.service.getResidentialProxies().subscribe((res: any) => {
      this.residentialProxyList = res.proxyList
      this.spinner.hide()
    })
  }

  getDataCenterProxies() {
    this.spinner.show()
    this.service.getDataCenterProxies().subscribe((res: any) => {
      this.dataCenterProxyList = res.proxyList
      this.spinner.hide()
    })
  }

  logout() {
    const appData = ['token', 'username', 'creditsAvailable', 'is_active', 'appSettings']
    apiWorker.removeFromStorage(appData, (result) => {
      this.loginToken = null
    })
  }
}
