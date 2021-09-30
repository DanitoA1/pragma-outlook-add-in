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
        <div class="self-center flex mt-8">
          <button v-if="isLoggedIn" @click="gotoDashboard()" class="bg-primary ml-8 text-white w-113px rounded-md py-2">
            Get Snippet
          </button>
          <button v-else @click="openLoginPopup()" class="bg-primary ml-8 text-white w-113px rounded-md py-2">
            Log In
          </button>
          <img class="ml-4 -mt-6" src="@/assets/svg/arrow.svg" alt="">
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
    windowRef: ''
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
    gotoDashboard () {
      this.$router.push({ name: 'Dashboard' })
    },
    async checkUserLoggedIn () {
      this.isLoading = true
      const email = window.Office.context.mailbox.userProfile.emailAddress
      await fetch(`${this.apiBaseUrl}/checkUserLoggedIn?email=${email}`)
        .then(res => res.json())
        .then(data => {
          if (data.status === 'ok') {
            this.isLoggedIn = true
            this.userId = data.id
            this.$store.commit('SET_USER_ID', data.id)
            this.isLoading = false
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
    }
  },
  watch: {
    windowRef (val) {
      this.checkUserLoggedIn()
      console.log(val)
    }
  }
}
</script>
