/**
 *
 * N3rdP1um23
 * October 31, 2020
 * The following file is used to handle representing the config entity
 *
 */

// Import the required items
import { Entity, Unique, Column, PrimaryGeneratedColumn } from 'typeorm';

// Define and export the Config Class
@Entity()
@Unique(['key'])
export class Config {
	@PrimaryGeneratedColumn()
	id: number;

	@Column('varchar', { length: 250 })
	key: string;

	@Column('varchar', { length: 500 })
	value: string;
}