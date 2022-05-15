import { FileType } from "@kyle/common";
import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { User } from "../user/UserEntity";

@ObjectType()
@Entity()
export class Post extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column()
    creatorId: number;

    @Field()
    @ManyToOne(() => User, (user) => user.posts) //will create a foreign key to user's table so store in creatorId
    creator: User;

    @Field()
    @Column()
    text!: string;

    @Field({ nullable: true })
    @Column({ nullable: true, default: null })
    fileType?: FileType;

    @Field({ nullable: true })
    @Column({ nullable: true, default: null })
    fileUrl?: string;

    @Field(() => String) //make sure explicitly defining type for every field
    @CreateDateColumn()
    createdAt: Date;

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt: Date;
}
