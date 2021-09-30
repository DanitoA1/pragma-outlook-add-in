<template>
  <div class="h-screen">
    <div class="w-11/12 mx-auto p-3 mt-3 rounded-sm border-l-4 border-primary bg-light-pink">
      <p class="text-14px font-medium">
        A software service called Pragma helps you improve your communication and sales skills.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddSnippet',
  computed: {
    userId () {
      return this.$store.state.loggedInUserId
    },
    apiBaseUrl () {
      return this.$store.state.apiBaseUrl
    }
  }
}
</script>
