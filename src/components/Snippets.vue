<template>
  <div class="h-screen">
    <div class="relative text-gray-600 mt-5 w-11/12 mx-auto">
      <input v-model="search" type="search" name="serch" placeholder="//snptname" class="bg-white w-full h-10 px-5 border border-light-grey rounded-md text-sm focus:outline-none">
      <!-- <button @click="gotoDashboard" type="submit" class="absolute right-0 top-0 mt-3 mr-4">
        <img src="@/assets/svg/search.svg" alt="">
      </button> -->
    </div>
    <ul class="overflow-auto">
      <li v-for="(snippet, index) in filteredSnippets" :key="index" @click="expandSnippet(index)" class="cursor-pointer mt-2">
        <div :class="index === expandIndex ? 'border-l-4 border-primary bg-light-pink' : ''" class="w-11/12 mx-auto p-3 rounded-sm list-item">
          <p class="montserrat font-semibold text-primary text-12px">//{{ snippet.shortcode }}</p>
          <h1 class="text-14px mb-2">{{ snippet.name }}</h1>
          <!-- <span class="text-primary border text-12px border-primary rounded-xl px-2">sales</span> -->
        </div>
        <div v-if="index === expandIndex" class="border-b-2 border-light-grey">
          <div class="w-11/12 mx-auto p-3 mt-2">
            <vue-editor v-if="index === editIndex" class="w-full" v-model="snippet.body" />
            <p v-else v-html="snippet.body"></p>
            <div class="flex justify-between mt-2">
              <div v-if="index !== editIndex" @click="editSnippet(index)" class="flex content-center">
                <img src="@/assets/svg/edit.svg" alt="">
                <span class="text-primary pt-0.5 text-14px ml-2">Edit</span>
              </div>
              <div v-else></div>
              <button @click="insertSnippet(snippet.body)" class="w-94px text-primary rounded-md border border-primary bg-light-pink">
                Insert
              </button>
            </div>
          </div>
        </div>
      </li>
   </ul>
  </div>
</template>

<script>
import { VueEditor } from 'vue2-editor'

export default {
  name: 'Snippets',
  props: {
    snippets: {
      type: Array
    }
  },
  computed: {
    userId () {
      return this.$store.state.loggedInUserId
    },
    apiBaseUrl () {
      return this.$store.state.apiBaseUrl
    },
    filteredSnippets () {
      return this.snippets.filter(snippet => {
        return snippet.name.toLowerCase().includes(this.search.toLowerCase()) || snippet.title.toLowerCase().includes(this.search.toLowerCase()) || snippet.body.toLowerCase().includes(this.search.toLowerCase())
      })
    }
  },
  data: () => ({
    expandIndex: null,
    editIndex: null,
    isLoading: false,
    search: ''
  }),
  components: { VueEditor },
  mounted () {
    // this.getSnippets()
  },
  methods: {
    async getSnippets () {
      this.isLoading = true
      await fetch(`${this.apiBaseUrl}/getSnippets?id=${this.userId}`)
        .then(res => res.json())
        .then(data => {
          this.isLoading = false
          if (data && data.data.length > 0) {
            this.snippets = data.data
            console.log(data)
          }
        })
    },
    isSnippets () {
      if (this.snippets && this.snippets.length > 0) return true
      else return false
    },
    expandSnippet (index) {
      if (this.editIndex !== index) {
        this.editIndex = null
      }
      if (this.expandIndex === index) {
        this.expandIndex = null
      } else {
        this.expandIndex = index
      }
    },
    editSnippet (index) {
      if (this.editIndex !== index) {
        this.editIndex = null
      }
      this.editIndex = index
    },
    insertSnippet (text) {
      this.editIndex = null
      const item = window.Office.context.mailbox.item
      item.body.getTypeAsync(
        function (result) {
          if (result.status === window.Office.AsyncResultStatus.Failed) {
            window.write(result.error.message)
          } else {
            // Successfully got the type of item body.
            // Set data of the appropriate type in body.
            if (result.value === window.Office.MailboxEnums.BodyType.Html) {
              // Body is of HTML type.
              // Specify HTML in the coercionType parameter
              // of setSelectedDataAsync.
              item.body.setSelectedDataAsync(
                text,
                {
                  coercionType: window.Office.CoercionType.Html,
                  asyncContext: { var3: 1, var4: 2 }
                },
                function (asyncResult) {
                  if (asyncResult.status === window.Office.AsyncResultStatus.Failed) {
                    window.write(asyncResult.error.message)
                  } else {
                    // Successfully set data in item body.
                    // Do whatever appropriate for your scenario,
                    // using the arguments var3 and var4 as applicable.
                  }
                })
            } else {
              // Body is of text type.
              item.body.setSelectedDataAsync(
                text,
                {
                  coercionType: window.Office.CoercionType.Text,
                  asyncContext: { var3: 1, var4: 2 }
                },
                function (asyncResult) {
                  if (asyncResult.status === window.Office.AsyncResultStatus.Failed) {
                    window.write(asyncResult.error.message)
                  } else {
                    // Successfully set data in item body.
                    // Do whatever appropriate for your scenario,
                    // using the arguments var3 and var4 as applicable.
                  }
                }
              )
            }
          }
        })
    }
  }
}
</script>

<style scoped>
  .list-item {
    border-bottom: 1px solid #F1F1F1;
  }
  .list-item:hover {
    border-left: 4px solid #6759FF;
    background: #FAF9FF;
  }
</style>
