import { computed, observable } from 'mobx';

export default class BaseModel {
	@observable id?: number;

	@computed get newRecord(): boolean {
		return this.id === undefined;
	}
}
