<template>
  <div class="h-screen">
    <div class="w-11/12 mx-auto p-3 mt-3 rounded-sm border-l-4 border-primary bg-light-pink">
      <p v-if="highlightedText" class="text-14px font-medium">
        {{ highlightedText }}
      </p>
      <p v-else class="text-14px font-medium">
        No text Selected!!!
      </p>
    </div>
    <div v-if="isLoading" class="mt-10">
      <img class="animate-spin mx-auto" height="60" width="60" src="@/assets/svg/spinner.svg" alt="spinner">
    </div>
    <ul v-else class="overflow-auto h-full">
      <li v-for="(rephrase, index) in allRephrase.data" :key="index" class="mt-2 cursor-pointer">
        <div @click="expandSnippet(index)" class="w-11/12 hover:text-black hover:bg-light-pink mx-auto p-3 border-b border-light-grey">
          <p class="text-primary text-14px">
            {{ rephrase.sentence }}
          </p>
        </div>
        <div v-if="index === expandIndex" class="border-b-2 border-light-grey">
          <div class="w-11/12 mx-auto p-3 mt-2">
            <div class="flex justify-between">
              <div class="flex content-center">
                <img src="@/assets/svg/edit.svg" alt="">
                <span class="text-primary pt-0.5 text-14px ml-2">Edit</span>
              </div>
              <button @click="insertSnippet(rephrase.sentence)" class="w-94px text-primary rounded-md border border-primary bg-light-pink">
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
    }
  },
  data: () => ({
    expandIndex: null
  }),
  methods: {
    expandSnippet (index) {
      this.expandIndex = index
    },
    insertSnippet (text) {
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
