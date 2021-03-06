<template>
  <div class="h-screen">
    <div @click="isRewriteEdit = true" class="w-11/12 mx-auto p-3 mt-3 rounded-sm border-l-4 border-primary bg-light-pink">
      <p v-if="highlightedText && !isRewriteEdit" class="text-14px font-medium">
        {{ highlightedText }}
      </p>
      <textarea v-if="!highlightedText || isRewriteEdit" name="rewrite" cols="30" rows="2" placeholder="Rewrite a sentence" v-model="highlightedText"></textarea>
    </div>
    <div class="flex justify-center">
      <button @click="$emit('getRephrase', highlightedText), $emit('setHighlightedText', highlightedText)" class="bg-primary mt-4 text-white w-113px rounded-md py-2">
        Rewrite
      </button>
    </div>
    <div v-if="isLoading" class="mt-10">
      <img class="animate-spin mx-auto" height="60" width="60" src="@/assets/svg/spinner.svg" alt="spinner">
    </div>
    <ul v-else class="overflow-auto h-full">
      <li v-for="(rephrase, index) in allRephrase.data" :key="index" class="mt-2 cursor-pointer">
        <div @click="expandSnippet(index)" class="w-11/12 hover:text-black hover:bg-light-pink mx-auto p-3 border-b border-light-grey">
          <vue-editor v-if="index === editIndex" class="w-full" v-model="rephrase.sentence" />

          <text-highlight v-else class="oldText text-14px" :highlightStyle="{'color': '#6759FF','font-weight': 'bold', 'background': 'transparent !important'}" :caseSensitive="false" :wholeWordMatch="true" :queries="rephrase.sentence.replace(/[\p{P}$+<=>^`|~]/gu, '').split(' ').filter(x => !highlightedText.replace(/[\p{P}$+<=>^`|~]/gu, '').split(' ').filter(item => item.toLowerCase()).includes(x.toLowerCase())).filter(word => word.length > 3)">{{ rephrase.sentence }}</text-highlight>

          <!-- <p v-else class="text-primary text-14px" v-html="rephrase.sentence"></p> -->
        </div>
        <div v-if="index === expandIndex" class="border-b-2 border-light-grey">
          <div class="w-11/12 mx-auto p-3 mt-2">
            <div class="flex justify-between">
              <div v-if="index !== editIndex" @click="editSnippet(index)" class="flex content-center">
                <img src="@/assets/svg/edit.svg" alt="">
                <span class="text-primary pt-0.5 text-14px ml-2">Edit</span>
              </div>
              <div v-else></div>
              <button @click="insertSnippet(rephrase.sentence)" class="w-94px text-primary rounded-md border border-primary bg-light-pink">
                Replace
              </button>
            </div>
          </div>
        </div>
      </li>
    </ul>
    <p v-if="apiError"  class="text-14px font-medium">
      Some error occured while fetching data. Please try again.
    </p>
  </div>
</template>

<style scoped>
.newText {
  color: #6759FF;font-weight: bold;  background: transparent !important;
}
.oldText {
  color: #828493;font-weight: bold;
  background: transparent !important;
}
</style>

<script>
import { VueEditor } from 'vue2-editor'
import TextHighlight from 'vue-text-highlight'

export default {
  name: 'Rewrite',
  props: {
    highlightedText: {
      type: String
    },
    allRephrase: {
      type: Object
    },
    isLoading: {
      type: Boolean
    },
    apiError: {
      type: Boolean
    }
  },
  components: { VueEditor, TextHighlight },
  data: () => ({
    expandIndex: null,
    editIndex: null,
    isRewriteEdit: true
  }),
  mounted () {
    // this.highlightedText = this.highlightedText
  },
  methods: {
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
