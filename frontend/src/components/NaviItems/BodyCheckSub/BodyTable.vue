<template>
	<div id='BodyTable'>
  	<b-table
			:items="result_data"
			:fields="table_fields"
			bordered hover small head-variant="dark"
			size="md"
			sortable="false"
			stacked="sm"
		>
		<template v-slot:cell(kneAsy)="row">
			{{  row.item.pelAsy == true ? 'O' : 'X' }}
		</template>

		<template v-slot:cell(pelAsy)="row">
			{{ row.item.pelAsy == true ? 'O' : 'X' }}
		</template>

		<template v-slot:cell(shoAsy)="row">
			{{ row.item.shoAsy == true ? 'O' : 'X' }}
		</template>

		<template v-slot:cell(angDef)="row">
			{{ row.item.angDef == true ? 'O' : 'X' }}
		</template>

		<template v-slot:cell(curBack)="row">
			{{ row.item.curBack == true ? 'O' : 'X' }}
		</template>

		<template v-slot:cell(turNeck)="row">
			{{ row.item.turNeck == true ? 'O' : 'X' }}
		</template>

  	</b-table>
	</div>
</template>

<script>
export default {
    props: ['result'],
		watch: {
			result: {
				immediate: true,
				handler(result) {
					fetch(`/${result}`).then(() => {
						this.result_data = [result];
					});	
				}
			}
		},

		computed: {
			cahgeValue(c) {
				if(c == '')
					return '?'
				else if(c == true)
					return 'O'
				else
					return 'X'
			}
		},

		data() {
			return {
				result_data: [],
				table_fields: [
					{ key: 'kneAsy', label: '무릎 비대칭', sortable: false },
					{ key: 'pelAsy', label: '골반 비대칭', sortable: false },
					{ key: 'shoAsy', label: '어깨 비대칭', sortable: false },
					{ key: 'angDef', label: '휜다리', sortable: false },
					{ key: 'curBack', label: '굽은 등', sortable: false },
					{ key: 'turNeck', label: '거북목', sortable: false },
				],
			}
		},

		methods: {
			
		},
		
}
</script>

<style scoped>

#BodyTable{
	background-color: peru;
	text-align: center;
}


</style>
