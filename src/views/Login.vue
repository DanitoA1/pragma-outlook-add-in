<template>
  <div class="bg-light-pink h-full">
    <div class="flex flex-col justify-center" style="height: 100vh">
      <img class="self-center" height="39" width="47" src="@/assets/svg/logo.svg" alt="logo">
      <div class="self-center flex mt-1">
        <h1 class="text-xl mt-10">
          Welcome to Pragma
        </h1>
        <img class="-ml-4" height="30" width="49" src="@/assets/svg/spark.svg" alt="">
      </div>
      <div v-if="isLoading" class="self-center mt-4">
        <img class="animate-spin" height="60" width="60" src="@/assets/svg/spinner.svg" alt="spinner">
      </div>
      <div v-else class="self-center mt-4">
        <p v-if="!isLoggedIn" class="font-semibold self-center">Please <span class="text-primary">login</span> to continue</p>
        <div class="self-center flex mt-8" v-if="this.authorizationUrl">
          <button @click="openLoginPopup()" class="bg-primary ml-8 text-white w-113px rounded-md py-2">
            Log In
          </button>
          <img class="ml-4 -mt-6" src="@/assets/svg/arrow.svg" alt="">
        </div>
        <div v-if="!this.authorizationUrl && !isLoggedIn">
          We are sorry, login is unavailable at the moment, please try again later.
        </div>
        <div v-if="isLoggedIn">
          Logged in, Redirecting..
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'Home',
  components: {
    //
  },
  data: () => ({
    isLoading: false,
    isLoggedIn: false,
    userId: '',
    authorizationUrl: '',
    windowRef: '',
    intervalRef: ''
  }),
  mounted () {
    this.checkUserLoggedIn()
  },
  computed: {
    apiBaseUrl () {
      return this.$store.state.apiBaseUrl
    }
  },
  methods: {
    handleRedirection () {
      this.$router.push({ name: 'Main' })
    },
    checkUserLoggedIn () {
      this.isLoading = true
      var email = ""
      if(window.Office){
        email = window.Office.context.mailbox.userProfile.emailAddress
      }
      fetch(`${this.apiBaseUrl}/checkUserLoggedIn?email=${email}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok') {
            this.isLoggedIn = true
            this.userId = data.id
            this.$store.commit('SET_USER_ID', data.id)
            this.isLoading = false
            clearInterval(this.intervalRef)
            if (this.windowRef && !this.windowRef.closed) {
              this.windowRef.close()
            }
            this.handleRedirection()
          } else if (data.status === 'failed') {
            this.isLoggedIn = false
            this.authorizationUrl = data.authorization_url
            this.isLoading = false
          }
        })
        .catch(error => {
          console.log(error)
          this.isLoading = false
        })
    },
    openLoginPopup () {
      this.windowRef = window.open(this.authorizationUrl, 'Auth Pragma', 'width=500, height=400')
      if (!this.intervalRef) {
        this.intervalRef = setInterval(() => {
          this.checkUserLoggedIn()
        }, 10000)
      }
    },

    getSelectedText () {
      if (window.Office) {
        const item = window.Office.context.mailbox.item
        item.getSelectedDataAsync(window.Office.CoercionType.Text, function (asyncResult) {
          localStorage.setItem('selectedText', '')
          // Put blank value in localstrage for selected Text
          if (asyncResult.status !== window.Office.AsyncResultStatus.Succeeded) {
          } else {
            localStorage.setItem('selectedText', asyncResult.value.data)
          }
        })
      }
    }
  }
}
</script>
