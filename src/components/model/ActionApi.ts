import { Api, ApiListResponse } from '../base/api';
import { ICard } from '../../types/index';

export interface ICoursesAPI {
  cdn: string;
  getLotList: () => Promise<ICard[]>;
}

export class CoursesAPI extends Api implements ICoursesAPI{
  readonly cdn;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }
  
  getLotList(): Promise<ICard[]> {
    return this.get('/product/').then((data: ApiListResponse<ICard>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
  }
}