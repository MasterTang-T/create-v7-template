import { defineStore } from 'pinia'
export const useStore = defineStore('demo', {
	state: () => {
		return {
			name: 'demo',
		}
	}
})