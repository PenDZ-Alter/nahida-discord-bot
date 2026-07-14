import { Client, Collection } from "discord.js";
import { Kazagumo } from "kazagumo";

export type BotClient = Client & {
  commands: Collection<string, any>;
  buttons: Collection<string, any>;
  selectMenus: Collection<string, any>;
  commandsData: any[];
  debug: string | null;
  config: {
    nodes: any[];
    [key: string]: any;
  };
  kazagumo: Kazagumo;

  handleCommands: () => Promise<void>;
  handleComponents: () => Promise<void>;
  handleEvents: () => Promise<void>;
};

export interface BotEvent {
  name: string;
  once: boolean;
  execute: (client: BotClient, ...args: any[]) => Promise<void> | void;
}

export interface GeneralEvent {
  name: string;

  execute: (client: BotClient, ...args: any[]) => Promise<void> | void;
}