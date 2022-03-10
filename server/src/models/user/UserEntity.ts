import { PermissionLevel } from "@kyle/common";
import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from "typeorm";
import { Post } from "../post/PostEntity";

@ObjectType()
@Entity()
export class User extends BaseEntity {
    @Field()
    @PrimaryGeneratedColumn()
    id!: number;

    @Field()
    @Column({ unique: true })
    username!: string;

    @Field()
    @Column({ unique: true })
    email?: string;

    @Field()
    @Column()
    password?: string;

    @Field()
    @Column()
    imageUrl!: string;

    @Column({ type: "int", default: PermissionLevel.User })
    permissionLevel!: PermissionLevel;

    //one user can have multiple posts, an "array" of them wowoowowwo!!!!
    @OneToMany(() => Post, (post) => post.creator)
    posts: Post[];

    @Field(() => String)
    @CreateDateColumn()
    createdAt = new Date();

    @Field(() => String)
    @UpdateDateColumn()
    updatedAt = new Date();
}
