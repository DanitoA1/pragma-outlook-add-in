<template>
  <div>
    <div class="pb-3 border-b border-light-grey">
      <div class="flex w-11/12 mt-2 mx-auto">
        <div @click="changeTab('get-snippet')" :class="tabs === 'get-snippet' ? 'rounded-full bg-primary px-3 py-1 text-white' : ''" class="flex cursor-pointer">
          <img v-if="tabs === 'get-snippet'" src="@/assets/svg/add-snippet.svg" alt="">
          <img v-else :class="{ 'pt-1': tabs === 'get-snippet'}" src="@/assets/svg/add-snippet-2.svg" alt="">
          <span v-if="tabs === 'get-snippet'" class="ml-2 text-14px">Snippets</span>
        </div>
        <div @click="changeTab('rewrite')" :class="tabs === 'rewrite' ? 'rounded-full bg-primary px-3 py-1 text-white' : ''" class="flex cursor-pointer mx-5">
          <img v-if="tabs === 'rewrite'" src="@/assets/svg/rewrite.svg" alt="">
          <img v-else src="@/assets/svg/rewrite-2.svg" alt="">
          <span v-if="tabs === 'rewrite'" class="ml-2 text-14px">Rewrite</span>
        </div>

        <!-- <div @click="changeTab('shorten')" :class="tabs === 'shorten' ? 'rounded-full bg-primary px-3 py-1 text-white mx-5' : ''" class="flex cursor-pointer px-5">
          <img v-if="tabs === 'shorten'" src="@/assets/svg/shorten.svg" alt="">
          <img v-else :class="{ 'pt-2.5': tabs === 'shorten'}" src="@/assets/svg/shorten-2.svg" alt="">
          <span v-if="tabs === 'shorten'" class="ml-2 text-14px">Shorten</span>
        </div> -->
        <!-- <div @click="changeTab('add-snippet')" :class="tabs === 'add-snippet' ? 'rounded-full bg-primary px-3 py-1 text-white' : ''" class="flex cursor-pointer">
          <img v-if="tabs === 'add-snippet'" src="@/assets/svg/add-snippet.svg" alt="">
          <img v-else :class="{ 'pt-1': tabs === 'add-snippet'}" src="@/assets/svg/add-snippet-2.svg" alt="">
          <span v-if="tabs === 'add-snippet'" class="ml-2 text-14px">Add to My Snippets</span>
        </div> -->
      </div>
    </div>
    <snippets v-if="tabs === 'get-snippet'" :snippets="snippets" />
    <rewrite v-if="tabs === 'rewrite'" @setHighlightedText="setHighlightedText" @getRephrase="getRephrase" :highlightedText="highlightedText" :allRephrase="allRephrase" :isLoading="isLoading" :apiError="apiError" />
    <!-- <shorten v-if="tabs === 'shorten'" /> -->
    <add-snippet v-if="tabs === 'add-snippet'" />
  </div>
</template>

<script>
import Rewrite from '@/components/Rewrite.vue'
// import Shorten from '@/components/Shorten.vue'
// import AddSnippet from '@/components/AddSnippet.vue'
import Snippets from '@/components/Snippets.vue'

export default {
  name: 'TextFormat',
  data: () => ({
    tabs: 'get-snippet',
    isLoading: false,
    apiError: null,
    allRephrase: {},
    snippets: [],
    highlightedText: ''
  }),
  computed: {
    userId () {
      return this.$store.state.loggedInUserId
    },
    apiBaseUrl () {
      return this.$store.state.apiBaseUrl
    }
  },
  components: {
    Rewrite,
    // Shorten,
    // AddSnippet,
    Snippets
  },
  methods: {
    setHighlightedText (highlightedText) {
      this.highlightedText = highlightedText
    },
    getHighlightedText () {
      const selectedText = localStorage.getItem('selectedText')
      localStorage.removeItem('selectedText')
      return selectedText
    },
    async changeTab (val) {
      this.tabs = val
      switch (this.tabs) {
        case 'get-snippet':
          this.getSnippets()
          break
        case 'rewrite':
          this.highlightedText = await this.getSelectedText()
          break
        default:
          break
      }
    },
    async getSnippets () {
      // This is to ensure we don't call the endpoint each time tab changes, if we already have snippets
      if (this.snippets && this.snippets.length) {
        return
      }
      // Proceed if no snippets yet
      this.isLoading = true
      await fetch(`${this.apiBaseUrl}/getSnippets?id=${this.userId}`)
        .then(res => res.json())
        .then(data => {
          this.isLoading = false
          if (data && data.data && data.data.length > 0) {
            this.snippets = data.data
          }
        })
    },
    async getSelectedText () {
      const item = window.Office.context.mailbox.item
      return new Promise((resolve, reject) => {
        item.getSelectedDataAsync(window.Office.CoercionType.Text, function (asyncResult) {
          // Put blank value in localstrage for selected Text
          if (asyncResult.status !== window.Office.AsyncResultStatus.Succeeded) {
            resolve('')
          } else {
            resolve(asyncResult.value.data)
          }
        })
      })
    },
    async getRephrase (text) {
      this.isLoading = true
      this.apiError = null
      await fetch(`${this.apiBaseUrl}/rephraseSentence?` + new URLSearchParams({
        id: this.userId,
        sentence: text
      }))
        .then(res => res.json())
        .then(data => {
          this.allRephrase = data
          this.isLoading = false
        })
        .catch((error) => {
          this.apiError = error
          this.isLoading = false
        })
    }
  },
  mounted () {
    this.highlightedText = this.getHighlightedText()
    if (this.highlightedText) {
      this.tabs = 'rewrite'
    }
    switch (this.tabs) {
      case 'rewrite':
        // this.getRephrase(this.highlightedText)
        break
      default:
        this.getSnippets()
        break
    }

    setInterval(async () => {
      if (this.tabs === 'rewrite' && !this.highlightedText) {
        // Check if any text is selected
        this.highlightedText = await this.getSelectedText()
      }
    }, 2000)
  }
}
</script>
