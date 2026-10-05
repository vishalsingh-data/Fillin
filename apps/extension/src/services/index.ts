import { SnippetService } from './SnippetService';
import { ChromeStorageRepository } from '../storage/ChromeStorageRepository';
import { WebStorageRepository } from '../storage/WebStorageRepository';

const isChromeExtension = typeof chrome !== 'undefined' && chrome.storage;
const repository = isChromeExtension ? new ChromeStorageRepository() : new WebStorageRepository();

export const snippetService = new SnippetService(repository);
