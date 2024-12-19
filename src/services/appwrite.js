import { Account, Avatars, Client } from "appwrite";
import conf from "../conf/conf";

const client = new Client();

client
    .setEndpoint(conf.appEndpoint)
    .setProject(conf.appProjectID);

export const account = new Account(client);
export const avatar = new Avatars(client)

export { ID } from 'appwrite';