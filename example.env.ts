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
}

// Define the following env varibales
export const botToken: string = '';
export const dbFile: string = 'database.db';
export const generalChannel: string = '772259249966809121';
export const introductionChannel: string = '772578649765052416';
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