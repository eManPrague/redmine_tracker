import { observable } from 'mobx';
import BaseModel from './BaseModel';

export default class Project extends BaseModel {
	@observable favourite: boolean = false;
	@observable identifier: string;
	@observable name: string;
}
