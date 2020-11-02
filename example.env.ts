/**
 *
 * TimmyRB
 * November 1, 2020
 * The following file is used to handle storing local environment variables
 *
 * Updates
 * -------
 * November 1, 2020 -- N3rdP1um23 -- Added Role interface and also localRoles templating
 *
 */

// Define a the Role interface
export interface Role {
	rid: string;
	name: string;
	full_name?: string;
};

// Define the Prof interface
export interface Prof {
	id: number,
	name: string,
	role: string,
	score?: number,
	retake?: string,
	level?: number,
	highlightReview?: string
};

// Define the following env varibales
export const botToken: string = '';
export const dbFile: string = 'database.db';
export const generalChannel: string = '';
export const introductionChannel: string = '';
export const editChannel: string = '';
export const deletedChannel: string = '';
export const yearChannels: Array<string> = ['', '', ''];
export const commandPrefix: string = '!';
export const localRoles = [
	{
		rid: '',
		name: '📗',
		full_name: '1st Year',
	},
	{
		rid: '',
		name: '📘',
		full_name: '2nd Year',
	},
	{
		rid: '',
		name: '📙',
		full_name: '3rd Year',
	},
	{
		rid: '',
		name: '🧾',
		full_name: 'Alumni',
	},
	{
		rid: '',
		name: '1️⃣',
		full_name: 'Trafalgar',
	},
	{
		rid: '',
		name: '2️⃣',
		full_name: 'Davis',
	},
	{
		rid: '',
		name: '👻',
		full_name: 'Unassigned',
	}
];