<template>
  <div>
    <div class="pb-3 border-b border-light-grey">
      <div class="flex w-11/12 mt-2 mx-auto">
        <div @click="changeTab('get-snippet')" :class="tabs === 'get-snippet' ? 'rounded-full bg-primary px-3 py-1 text-white' : ''" class="flex cursor-pointer">
          <img v-if="tabs === 'get-snippet'" src="@/assets/svg/add-snippet.svg" alt="">
          <img v-else :class="{ 'pt-1': tabs === 'get-snippet'}" src="@/assets/svg/add-snippet-2.svg" alt="">
          <span v-if="tabs === 'get-snippet'" class="ml-2 text-14px">Snippets</span>
        </div>
        <div @click="changeTab('rewrite')" :class="tabs === 'rewrite' ? 'rounded-full bg-primary px-3 py-1 text-white' : ''" class="flex cursor-pointer">
          <img v-if="tabs === 'rewrite'" src="@/assets/svg/rewrite.svg" alt="">
          <img v-else src="@/assets/svg/rewrite-2.svg" alt="">
          <span v-if="tabs === 'rewrite'" class="ml-2 text-14px">Rewrite</span>
        </div>

        <!-- <div @click="changeTab('shorten')" :class="tabs === 'shorten' ? 'rounded-full bg-primary px-3 py-1 text-white mx-5' : ''" class="flex cursor-pointer px-5">
          <img v-if="tabs === 'shorten'" src="@/assets/svg/shorten.svg" alt="">
          <img v-else :class="{ 'pt-2.5': tabs === 'shorten'}" src="@/assets/svg/shorten-2.svg" alt="">
          <span v-if="tabs === 'shorten'" class="ml-2 text-14px">Shorten</span>
        </div> -->
        <div @click="changeTab('add-snippet')" :class="tabs === 'add-snippet' ? 'rounded-full bg-primary px-3 py-1 text-white' : ''" class="flex cursor-pointer">
          <img v-if="tabs === 'add-snippet'" src="@/assets/svg/add-snippet.svg" alt="">
          <img v-else :class="{ 'pt-1': tabs === 'add-snippet'}" src="@/assets/svg/add-snippet-2.svg" alt="">
          <span v-if="tabs === 'add-snippet'" class="ml-2 text-14px">Add to My Snippets</span>
        </div>
      </div>
    </div>
    <snippets v-if="tabs === 'get-snippet'" />
    <rewrite v-if="tabs === 'rewrite'" :highlightedText="highlightedText" />
    <shorten v-if="tabs === 'shorten'" />
    <add-snippet v-if="tabs === 'add-snippet'" />
  </div>
</template>

<script>
import Rewrite from '@/components/Rewrite.vue'
import Shorten from '@/components/Shorten.vue'
import AddSnippet from '@/components/AddSnippet.vue'
import Snippets from '@/components/Snippets.vue'

export default {
  name: 'TextFormat',
  data: () => ({
    tabs: 'get-snippet'
  }),
  computed: {
    userId () {
      return this.$store.state.loggedInUserId
    },
    apiBaseUrl () {
      return this.$store.state.apiBaseUrl
    },
    highlightedText () {
      return this.getSelectedText()
    }
  },
  components: {
    Rewrite,
    Shorten,
    AddSnippet,
    Snippets
  },
  methods: {
    changeTab (val) {
      this.tabs = val
    },
    async getSelectedText () {
      const item = window.Office.context.mailbox.item
      item.getSelectedDataAsync(window.Office.CoercionType.Text, function (asyncResult) {
        if (asyncResult.status !== window.Office.AsyncResultStatus.Succeeded) {
          console.log('error')
        } else {
          console.log(asyncResult.value.data)
          return asyncResult.value.data
        }
      })
    }
  },
  watch: {
    highlightedText () {
      this.$router.push({ name: 'Home' })
    }
  }
}
</script>
