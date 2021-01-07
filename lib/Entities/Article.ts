/**
 *
 * andresfm8
 * January 4, 2021
 *
 */

// Import the required items
import {Entity, PrimaryGeneratedColumn, Column} from "typeorm";

@Entity()
export class Article {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    url: string;

    @Column()
    title: string;
}