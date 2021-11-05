<template>
  <div class="h-full">
    <div class="flex justify-center" style="height: 100vh">
      <div v-if="isLoading" class="self-center mt-4">
          <img class="animate-spin" height="60" width="60" src="@/assets/svg/spinner.svg" alt="spinner">
        </div>
      <div v-else class="self-center mt-4">
        <div v-if="!isSnippets()" class="flex flex-col justify-center" style="height: 100vh">
          <img class="self-center" height="58" width="58" src="@/assets/svg/boster.svg" alt="boost">
          <div class="self-center mt-8">
            <h1 class="font-semibold text-xl text-primary">
              No snippets found
            </h1>
          </div>
          <p class="self-center mt-6 text-12px text-secondary">Start now and create snippets</p>
          <div class="self-center flex mt-8">
            <a href="https://pragma-dashboard.web.app/dashboard/snippets/add" target="_blank" class="bg-primary ml-10 text-white w-162px rounded-md py-2">
              Create Snippet
            </a>
            <img class="ml-2 -mt-12" src="@/assets/svg/arrow-2.svg" alt="">
          </div>
        </div>
        <snippets :snippets="snippets" v-else />
      </div>
    </div>
  </div>
</template>

<script>
import Snippets from '@/components/Snippets.vue'

export default {
  name: 'Snippets',
  components: {
    Snippets
  },
  data: () => ({
    isLoading: false,
    snippets: []
  }),
  computed: {
    userId () {
      return this.$store.state.loggedInUserId
    },
    apiBaseUrl () {
      return this.$store.state.apiBaseUrl
    }
  },
  mounted () {
    this.getSnippets()
  },
  methods: {
    gotoDashboard () {
      this.$router.push({ name: 'Main' })
    },
    async getSnippets () {
      this.isLoading = true
      await window.fetch(`${this.apiBaseUrl}/getSnippets?id=${this.userId}`)
        .then(res => res.json())
        .then(data => {
          this.isLoading = false
          if (data && data.data.length > 0) {
            this.snippets = data.data
          }
        })
    },
    isSnippets () {
      if (this.snippets && this.snippets.length > 0) return true
      else return false
    }
  }
}
</script>
