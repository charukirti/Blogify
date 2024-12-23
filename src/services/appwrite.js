import { Account, Avatars, Client, Databases, Storage, Query } from "appwrite";
import conf from "../conf/conf";

const client = new Client();

client
    .setEndpoint(conf.appEndpoint)
    .setProject(conf.appProjectID);

export const account = new Account(client);
export const avatar = new Avatars(client)
export const databases = new Databases(client);
export const bucket = new Storage(client);

export { ID } from 'appwrite';