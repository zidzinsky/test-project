import { RestVerbEnum } from './rest-verb.enum';

export interface RequestParams {
  url: string;
  restVerb?: RestVerbEnum;
  queueName: string;
  data: any;
  headers?: any;
}
