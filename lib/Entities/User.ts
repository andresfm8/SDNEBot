/**
 *
 * N3rdP1um23
 * October 31, 2020
 * The following file is used to handle representing the users entity
 *
 */

// Import the required items
import { Entity, Unique, Column, PrimaryGeneratedColumn } from 'typeorm';

// Define and export the user Class
@Entity()
@Unique(['uid', 'name'])
export class User {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 250 })
	uid: string;

	@Column('varchar', { length: 500 })
	name: string;

	@Column('varchar')
	lastUpdated: string;

	@Column('int')
	warns: number;

	@Column('int')
	kicks: number;

	@Column('boolean')
	muted: boolean;

	@Column('int')
	cbp: number;
}