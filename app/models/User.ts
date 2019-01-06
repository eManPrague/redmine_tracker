import { observable } from 'mobx';
import BaseModel from './BaseModel';

export default class User extends BaseModel {
	@observable firstname: string;
	@observable lastname: string;
	@observable email: string;
}
