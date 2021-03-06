import React, {useReducer, useCallback, useEffect} from 'react';
import Table from './table';

const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
        ['','',''],
        ['','',''],
        ['','','']
    ],
    recentCell: [-1, -1],
};
//모듈로 생성해야 자식 컴포넌트에서 사용 가능
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

const reducer = (state, action) => {
    switch(action.type){
        case SET_WINNER:
            return {
                ...state,
                winner: action.winner,
            };
        case CLICK_CELL:{
            //immer 라이브러리로 가독성 문제 해결
            const tableData = [...state.tableData] 
            tableData[action.row] = [...tableData[action.row]];
            tableData[action.row][action.cell] = state.turn;
            return{
                ...state,
                tableData,
                recentCell: [action.row, action.cell],
            };
        };
        case CHANGE_TURN: {
            return{
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O',
            };
        };
        case RESET_GAME:{
            return{
                ...state,
                turn: 'O',
                tableData: [
                    ['','',''],
                    ['','',''],
                    ['','','']
                ],
                recentCell: [-1, -1],
            };
        }
        default:
            return state;
    }
};

const TicTacToe = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const {tableData, turn, winner, recentCell} = state;
    
    const onClickTable = useCallback(() => {
        dispatch({type: SET_WINNER, winner: 'O'})
    }, []);

    //클릭한 셀이 바뀔때마다 승자검사
    useEffect(() => {
        let win = false;
        const [row, cell] = recentCell;
        if(row < 0) return;
        if(tableData[row][0] === turn && tableData[row][1] === turn && tableData[row][2] === turn) win=true;
        if(tableData[0][cell] === turn && tableData[1][cell] === turn && tableData[2][cell] === turn) win=true;
        if(tableData[0][0] === turn && tableData[1][1] === turn && tableData[2][2] === turn) win=true;
        if(tableData[0][2] === turn && tableData[1][1] === turn && tableData[2][0] === turn) win=true;
        if(win){
            dispatch({type:SET_WINNER, winner: turn});
            dispatch({type:RESET_GAME, winner: turn});
        } else{ //무승부 검사, 턴 넘기기
            let all = true;
            tableData.forEach((row) => {
                row.forEach((cell) => { if(!cell) all = false })
            })
            if(all){
                dispatch({type:RESET_GAME, winner: turn});
            }else{
                dispatch({type:CHANGE_TURN});
            }
        }
    }, [recentCell])

    return(
        <>
        <Table onClick={onClickTable} tableData={tableData} dispatch={dispatch}/>
        {winner && <div>{winner}님의 승리</div>}
        </>
    );
};

export default TicTacToe;