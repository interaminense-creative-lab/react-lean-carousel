export enum EVENT_TYPES {
    UPDATE_POSITION = 'update_position',
    TOTAL_ITEMS = 'total_items',
}

export type Action = {
    type: EVENT_TYPES,
    payload: number;
}

export type State = {
    config?: {
        autoPlaySpeed?: number;
        enableAutoPlay?: boolean;
        enableIndicators?: boolean;
        enableKeyDown?: boolean;
    };
    height: number;
    position: number;
    total: number;
    width: number;
}

export type Reducer<State, Action> = (state: State, action: Action) => State;

export default function carouselReducer(state: State, action: Action) {
    switch (action.type) {
        case EVENT_TYPES.UPDATE_POSITION:
            return {
                ...state,
                position: action.payload  
            };
        case EVENT_TYPES.TOTAL_ITEMS: {
            return {
                ...state,
                total: action.payload
            }
        }
        default:
            throw new Error();
    }
}