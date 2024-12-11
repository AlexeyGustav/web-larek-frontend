import { ICard, ApiListResponse, ICoursesApi, TDataOrder, TBingo } from "../../types/index";

export class CoursesApi {
    protected baseUrl: ICoursesApi;

    constructor(baseApi: ICoursesApi) {
        this.baseUrl = baseApi;
    }


    // Массив карточек с сервера
    getListCards(): Promise<ICard[]> {
        return this.baseUrl.get(`/product/`)
            .then((data: ApiListResponse) =>
                data.items.map(item => ({
                    ...item
                })));
    }
    

}