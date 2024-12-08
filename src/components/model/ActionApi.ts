import { Api, ApiListResponse } from '../base/api';
import { ICard } from '../../types/index';

export interface IAuctionAPI {
  cdn: string;
  getLotList: () => Promise<ICard[]>;
  // getLotItem: (id: string) => Promise<ILotItem>;
  // getLotUpdate: (id: string) => Promise<LotUpdate>;
  // placeBid(id: string, bid: IBid): Promise<LotUpdate>;
  // orderLots: (order: IOrder) => Promise<IOrderResult>;
}

export class AuctionAPI extends Api implements IAuctionAPI{
  readonly cdn;

  constructor(cdn: string, baseUrl: string, options?: RequestInit) {
      super(baseUrl, options);
      this.cdn = cdn;
  }

  // getLotList(): Promise<Idata> {
  //   return this.get('/product').then((data: apiData) => {
  //     console.log(data)
  //     return data;

  //   });
  // }

  
  getLotList(): Promise<ICard[]> {
    return this.get('/product/').then((data: ApiListResponse<ICard>) =>
        data.items.map((item) => ({
            ...item,
            image: this.cdn + item.image
        }))
    );
  }
}



// теперь переведи это на русский язык