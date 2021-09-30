<template>
  <div class="h-screen">
    <div class="w-11/12 mx-auto p-3 mt-3 rounded-sm border-l-4 border-primary bg-light-pink">
      <p class="text-14px font-medium">
        A software service called Pragma helps you improve your communication and sales skills.
      </p>
    </div>
    <ul class="overflow-auto h-full">
      <li v-for="n in 10" :key="n" class="mt-2 cursor-pointer">
        <div class="w-11/12 mx-auto p-3 border-b border-light-grey">
          <p class="text-primary text-14px">
            In Pragma, you learn to communicate better and sell more effectively.
          </p>
        </div>
      </li>
    </ul>
  </div>
</template>
