import {cloneElement, useContext, useEffect, useRef, useState} from 'react';
import {CarouselContext} from './context';
import React, {useReducer} from 'react';
import carouselReducer, {EVENT_TYPES, Reducer, State, Action} from './reducer';
import {calculateTranslate, getCurrentPosition} from './utils';

import './Carousel.css';

type Control = 'prev' | 'next';

interface ICarouselControlProps extends React.HTMLAttributes<HTMLElement> {
    control: Control;
    trigger: React.ReactElement;
}

const CarouselControl: React.FC<ICarouselControlProps> = ({control, trigger}) => {
    const [{position, total}, dispatch] = useContext(CarouselContext);

    return cloneElement(trigger, {
        className: `${trigger.props.className} react-simple-carousel__controls--${control}`,
        onClick: () => dispatch({
            type: EVENT_TYPES.UPDATE_POSITION,
            payload: getCurrentPosition({control, position, total})
        }),
    })
}

interface ICarouselControlsProps extends React.HTMLAttributes<HTMLElement> {
    prevTrigger: React.ReactElement;
    nextTrigger: React.ReactElement;
}

const CarouselControls: React.FC<ICarouselControlsProps> = ({prevTrigger, nextTrigger}) => {
    return (
        <div className="react-simple-carousel__controls">
            <CarouselControl control="prev" trigger={prevTrigger} />
            <CarouselControl control="next" trigger={nextTrigger} />
        </div>
    );
}

const CarouselItem: React.FC<React.HTMLAttributes<HTMLElement>> = ({className, children}) => {
    const [{width, height}] = useContext(CarouselContext);

    return (
        <div className={`react-simple-carousel__item ${className}`} style={{width, height}}>
            {children}
        </div>
    );
}

interface ICarouselItemsProps extends React.HTMLAttributes<HTMLElement> {
    children: JSX.Element[];
}

const CarouselItems: React.FC<ICarouselItemsProps> = ({children}) => {
    const [{position, width, height}, dispatch] = useContext(CarouselContext);

    useEffect(() => {
        dispatch({
            payload: children?.length,
            type: EVENT_TYPES.TOTAL_ITEMS
        })
    }, [children?.length, dispatch]);

    return (
        <div
            className="react-simple-carousel__items"
            style={{width, height, transform: `translateX(${calculateTranslate(position, width)}px)`}}
        >
            {children}
        </div>
    );
}

const CarouselIndicators: React.FC<React.HTMLAttributes<HTMLElement>> = () => {
    const [{position, total}, dispatch] = useContext(CarouselContext);
    let indicators = [];

    for (let index = 0; index < total; index++) {
        indicators.push(
            <div
                key={index}
                className={`
                    react-simple-carousel__indicator
                    react-simple-carousel__indicator-${index + 1}
                    ${index === position ? 'react-simple-carousel__indicator--active' : ''}
                `}
                onClick={() => {
                    if (index === position) {
                        return;
                    }

                    dispatch({
                        payload: index,
                        type: EVENT_TYPES.UPDATE_POSITION
                    })
                }}
            />
        )
    }

    return (
        <div className="react-simple-carousel__indicators">
            {indicators}
        </div>
    );
}

const CarouselContent: React.FC<React.HTMLAttributes<HTMLElement>> = ({children}) => {
    const [{config, width, height, position, total}, dispatch] = useContext(CarouselContext);
    const {autoPlaySpeed, enableAutoPlay, enableIndicators, enableKeyDown} = config;
    const [play, setPlay] = useState(enableAutoPlay);
    
    const interval: any = useRef(null);

    useEffect(() => {
        if (play) {
            interval.current = setInterval(() => {
                dispatch({
                    payload: getCurrentPosition({control: 'next', position, total}),
                    type: EVENT_TYPES.UPDATE_POSITION
                });
            }, autoPlaySpeed);
        }
        
        return () => clearInterval(interval.current);
    }, [dispatch, position, play, total, autoPlaySpeed]);

    type Control = {
        [key: string]: string;
    };

    type Props = {
        className: string;
        onKeyDown?: (event: {code: keyof Control}) => void;
        onMouseLeave: () => void;
        onMouseOver: () => void;
        tabIndex?: number;
        style: {
            width: number;
            height: number;
        }
    }

    const props: Props = {
        ...(enableKeyDown && {
            tabIndex: 1,
            onKeyDown: (event) => {
                const {code} = event;

                const control: Control = {
                    ArrowLeft: 'prev',
                    ArrowRight: 'next'
                };
        
                if (control[code]) {
                    dispatch({
                        payload: getCurrentPosition({control: control[code], position, total}),
                        type: EVENT_TYPES.UPDATE_POSITION
                    });
                }
            },
            onMouseOver: () => setPlay(false),
            onMouseLeave: () => setPlay(true)
        }),
        className: 'react-simple-carousel',
        style: {width, height}
    }

    return (
        <div {...props}>
            <div className="react-simple-carousel__content">
                {children}

                {enableIndicators && <CarouselIndicators />}
            </div>
        </div>
    );
}

const initialState = {
    config: {
        autoPlaySpeed: 3000,
        enableAutoPlay: false,
        enableIndicators: true,
        enableKeyDown: true,
    },
    height: 0,
    position: 0,
    total: 0,
    width: 0,
}

interface ICarouselProps extends React.HTMLAttributes<HTMLElement> {
    config?: {
        autoPlaySpeed?: number;
        enableAutoPlay?: boolean;
        enableIndicators?: boolean;
        enableKeyDown?: boolean;
    }
    height: number;
    width: number;
}

const Carousel: React.FC<ICarouselProps> & {
    Controls: React.FC<ICarouselControlsProps>;
    Item: React.FC<React.HTMLAttributes<HTMLElement>>;
    Items: React.FC<ICarouselItemsProps>;
} = ({config, children, height, width}) => {
    const [state, dispatch] = useReducer<Reducer<State, Action>>(carouselReducer, {
        ...initialState,
        config,
        height,
        width,
    });

    return (
        <CarouselContext.Provider value={[state, dispatch]}>
            <CarouselContent>
                {children}
            </CarouselContent>
        </CarouselContext.Provider>
    );
}

Carousel.Controls = CarouselControls;
Carousel.Item = CarouselItem;
Carousel.Items = CarouselItems;

export default Carousel;