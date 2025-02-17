import { Api } from '../base/api';
import { ICard, ICoursesAPI, ApiListResponse, ITotalData, IOrderResult } from '../../types/index';


export class CoursesAPI extends Api implements ICoursesAPI {
  readonly cdn: string;

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

  postTotalOrder(order: ITotalData): Promise<IOrderResult> {
    return this.post('/order', order).then(
      (data) => data as IOrderResult
    );
  }
}