import { observable } from 'mobx';
import BaseModel from './BaseModel';

export default class TimeEntry extends BaseModel {
	@observable project_id: number;
	@observable issue_id: number;
	@observable time_from: string;
	@observable time_to: string;
	@observable description: string;
}
