<template>
  <div>
    <span v-for="sub_item in menu_item" :key="sub_item.id">
      {{sub_item.text}}
    </span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      menu_item: [
	  		{text: '메뉴 1'},
        {text: '메뉴 2'},
        {text: '메뉴 3'},
        {text: '메뉴 4'}
	  	]
    }
  }
}
</script>

<style>

</style>
